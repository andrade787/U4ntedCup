import { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { z } from 'zod';

type Data = {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
}

// Defina o schema de validação do Zod
const commentSchema = z.object({
  playerId: z.string().trim().min(1, "Player ID é obrigatório"),
  userId: z.string().trim().min(1, "User ID é obrigatório"),
  comment: z.string().trim().min(1, "O comentário deve ter no máximo 700 caracteres").max(700, { message: "O comentário deve ter no máximo 700 caracteres." })
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
  const uid = VerifyToken?.uid;


  if (!uid) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Valide o corpo da requisição usando o schema Zod
  const validation = commentSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Erro de validação', details: validation.error.errors[0].message });
  }

  const { playerId, userId, comment } = validation.data;

  try {
    // Verifique se o usuário já comentou 2 vezes no perfil do player em menos de 1 hora
    const oneHourAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));

    const commentsSnapshot = await firestore.collection('comentarios')
      .doc(playerId)
      .collection('comments')
      .where('UserComment', '==', userId)
      .where('Created_at', '>=', oneHourAgo)
      .get();

    if (commentsSnapshot.size >= 2) {
      return res.status(429).json({ error: 'Comentários excessivos', details: 'Você já comentou duas vezes neste perfil na última hora.' });
    }

    const newComment = {
      UserComment: userId,
      Comment: comment,
      Created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await firestore.collection('comentarios').doc(playerId).collection('comments').add(newComment);

    res.status(200).json({ success: true, message: 'Comentário adicionado com sucesso' });
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Erro ao adicionar comentário', details: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao adicionar comentário', details: 'Erro desconhecido' });
    }
  }
}
