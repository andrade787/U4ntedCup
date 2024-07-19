import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';

type User = {
  capaUrl: string;
  firstName: string;
  nickname: string;
  photoURL: string;
  url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const snapshot = await firestore.collection('users').get();
      const users: User[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          capaUrl: data.capaUrl || '',
          firstName: data.firstName || '',
          nickname: data.nickname || '',
          photoURL: data.photoURL || '',
          url: data.url || '',
        };
      });

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
