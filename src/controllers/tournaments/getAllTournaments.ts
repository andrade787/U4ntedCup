// controllers/tournaments/getAllTournaments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';

export const getAllTournaments = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tournamentsSnapshot = await firestore.collection('tournaments').get();
    const tournaments = tournamentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
