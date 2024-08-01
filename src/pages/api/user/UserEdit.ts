import { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { z } from 'zod';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // ajustar o tamanho máximo do upload conforme necessário
    },
  },
};

// Define o schema de validação com Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  nickname: z.string().min(1, { message: "Nick é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  assinaturaPlayer: z.string()
    .min(1, { message: "Assinatura do Player é obrigatória" })
    .max(32, { message: "Assinatura do Player não pode ter mais de 32 caracteres" }),
  photoURL: z.string().nullable().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    // Validar os dados usando o schema do Zod
    const parseResult = formSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.format();
      const errorMessages = Object.values(errors).flatMap((err) => {
        if (Array.isArray(err)) {
          return err;
        } else if (err && typeof err === 'object' && '_errors' in err) {
          return (err as { _errors: string[] })._errors;
        }
        return [];
      });
      return res.status(400).json({ error: errorMessages.join(', ') });
    }

    const { name, nickname, photoURL, email, assinaturaPlayer } = parseResult.data;

    const userRef = firestore.collection('players').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData: any = userDoc.data();
    const updateData: any = {};

    if (name && name !== userData.firstName) {
      updateData.firstName = name;
    }

    if (nickname && nickname !== userData.nickname) {
      // Verificar se o novo nickname já está em uso por outro usuário
      const nicknameSnapshot = await firestore.collection('players')
        .where('nickname', '==', nickname)
        .get();

      if (!nicknameSnapshot.empty) {
        return res.status(400).json({ error: 'Nickname já está em uso por outro usuário' });
      }

      updateData.nickname = nickname;
      updateData.url = nickname.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_-]/g, '');
    }

    if (email && email !== userData.email) {
      // Verificar se o novo email já está em uso por outro usuário
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        if (userRecord.uid !== uid) {
          return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
        }
      } catch (err) {
        const error = err as { code: string };
        if (error.code === 'auth/email-already-exists') {
          return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
        } else if (error.code !== 'auth/user-not-found') {
          return res.status(500).json({ error: 'Erro ao verificar email' });
        }
      }

      await admin.auth().updateUser(uid, { email: email });
      updateData.email = email;
    }

    if (assinaturaPlayer && assinaturaPlayer !== userData.assinaturaPlayer) {
      updateData.assinaturaPlayer = assinaturaPlayer;
    }

    let newPhotoURL = userData.photoURL;

    // Se photoURL for uma nova imagem (base64), faça o upload para o Firebase Storage
    if (photoURL && photoURL.startsWith('data:image/')) {
      const base64EncodedImageString = photoURL.split(';base64,').pop();
      if (base64EncodedImageString) {
        const bucket = admin.storage().bucket();
        const fileName = `PhotoUser/${uuidv4()}.webp`;
        const file = bucket.file(fileName);

        const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

        // Converta a imagem para WebP e comprima-a
        const compressedImageBuffer = await sharp(imageBuffer)
          .resize({ width: 800 })
          .webp({ quality: 80 })
          .toBuffer();

        await file.save(compressedImageBuffer, {
          metadata: {
            contentType: 'image/webp',
          },
        });

        // Torne o arquivo publicamente acessível
        await file.makePublic();

        newPhotoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Se o usuário já tinha uma foto, remova a foto antiga do Storage
        if (userData.photoURL) {
          // Extraia o nome do arquivo da URL antiga
          const oldFileNameMatch = userData.photoURL.match(/PhotoUser\/([^?]+)/);
          if (oldFileNameMatch && oldFileNameMatch[1]) {
            const oldFileName = oldFileNameMatch[1];
            try {
              const oldFile = bucket.file(`PhotoUser/${oldFileName}`);
              await oldFile.delete();
            } catch (err) {
              const deleteError = err as Error;
              console.error('Erro ao deletar a foto antiga:', deleteError.message);
            }
          }
        }
      } else {
        return res.status(400).json({ error: 'Imagem em base64 inválida' });
      }
    }

    if (newPhotoURL !== userData.photoURL) {
      updateData.photoURL = newPhotoURL;
    }

    if (Object.keys(updateData).length > 0) {
      await userRef.update(updateData);
    }

    return res.status(200).json({ message: 'Dados atualizados com sucesso', url: `/player/${updateData.url || userData.url}` });
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
