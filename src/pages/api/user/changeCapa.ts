import { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { v4 as uuidv4 } from 'uuid';
import formidable, { File as FormidableFile, IncomingForm } from 'formidable';
import fs from 'fs';
import { z } from 'zod';

// Desabilitar o bodyParser do Next.js para permitir o uso do formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const form = new IncomingForm({ multiples: false });

const imageSchema = z.object({
  file: z.custom<FormidableFile>((file) => {
    if (!(file instanceof Object)) return false;
    const sizeValid = file.size <= 1024 * 1024;
    const typeValid = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype);
    return sizeValid && typeValid;
  }, {
    message: 'A imagem deve ter no máximo 1MB e ser do tipo jpeg, jpg, png ou webp'
  })
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    if (req.method === 'POST') {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Erro ao fazer upload da imagem:', err);
          return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
        }

        const fileArray = files.file as FormidableFile[];
        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

        if (!file) {
          return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
        }

        // Validação do arquivo com Zod
        try {
          imageSchema.parse({ file });
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            return res.status(400).json({ error: validationError.errors });
          }
          return res.status(400).json({ error: 'Erro de validação desconhecido' });
        }

        const fileName = `CapaPlayer/${uuidv4()}.webp`;
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(fileName);

        fs.readFile(file.filepath, async (err, buffer) => {
          if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
          }

          await fileUpload.save(buffer, {
            metadata: { contentType: 'image/webp' },
          });

          await fileUpload.makePublic();

          const newCapaUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

          const userRef = firestore.collection('players').doc(uid);
          const userDoc = await userRef.get();

          if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }

          const userData: any = userDoc.data();
          if (userData.capaUrl) {
            const oldFileNameMatch = userData.capaUrl.match(/CapaPlayer\/([^?]+)/);
            if (oldFileNameMatch && oldFileNameMatch[1]) {
              const oldFileName = oldFileNameMatch[1];
              try {
                const oldFile = bucket.file(`CapaPlayer/${oldFileName}`);
                await oldFile.delete();
              } catch (err) {
                console.error('Erro ao deletar a capa antiga:', err);
              }
            }
          }

          await userRef.update({ capaUrl: newCapaUrl });

          return res.status(200).json({ capaUrl: newCapaUrl });
        });
      });
    } else if (req.method === 'DELETE') {
      const userRef = firestore.collection('players').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const userData: any = userDoc.data();
      if (userData.capaUrl) {
        const oldFileNameMatch = userData.capaUrl.match(/CapaPlayer\/([^?]+)/);
        if (oldFileNameMatch && oldFileNameMatch[1]) {
          const oldFileName = oldFileNameMatch[1];
          try {
            const oldFile = admin.storage().bucket().file(`CapaPlayer/${oldFileName}`);
            await oldFile.delete();
          } catch (err) {
            console.error('Erro ao deletar a capa antiga:', err);
            return res.status(500).json({ error: 'Erro ao deletar a capa antiga' });
          }
        }
      }

      await userRef.update({ capaUrl: null });

      return res.status(200).json({ message: 'Capa removida com sucesso' });
    } else {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro ao alterar a capa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
