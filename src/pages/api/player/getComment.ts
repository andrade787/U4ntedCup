import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';
import { z } from 'zod';

type Comment = {
  id: string;
  UserComment: string;
  Comment: string;
  Created_at: FirebaseFirestore.Timestamp;
};

type User = {
  nickname: string;
  photoURL: string;
  url: string;
};

type Data = { comments: (Comment & User)[] };

// Defina o schema de validação do Zod
const requestSchema = z.object({
  playerId: z.string().trim().min(1, "Player ID é obrigatório"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string; details?: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Valide o corpo da requisição usando o schema Zod
  const validation = requestSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Validation error', details: validation.error.errors[0].message });
  }

  const { playerId } = validation.data;

  try {
    const commentsSnapshot = await firestore.collection('comentarios').doc(playerId).collection('comments').orderBy('Created_at', 'desc').get();
    if (commentsSnapshot.empty) {
      return res.status(200).json({ comments: [] }); // Retorna um array vazio quando não há comentários
    }
    const comments = await Promise.all(commentsSnapshot.docs.map(async (doc) => {
      const commentData = doc.data() as Comment;
      const userDoc = await firestore.collection('users').doc(commentData.UserComment).get();
      const userData = userDoc.data() as User;

      // Construct the combined object ensuring no 'id' overwriting
      return {
        ...commentData,
        id: doc.id,
        nickname: userData.nickname,
        photoURL: userData.photoURL,
        url: userData.url

      };
    }));

    res.status(200).json({ comments });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error fetching comments', details: error.message });
    } else {
      res.status(500).json({ error: 'Error fetching comments', details: 'Unknown error occurred' });
    }
  }
}
