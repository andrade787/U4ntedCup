// controllers/tournaments/getTournamentRules.ts
import { firestore } from '@/firebase/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

export const getTournamentRules = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  try {
    const rulesCollection = await firestore.collection('tournaments').doc(tournamentId as string).collection('rules').get();
    if (rulesCollection.empty) {
      return res.status(404).json({ message: 'No rules found for this tournament' });
    }

    const rulesData = rulesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(rulesData);
  } catch (error) {
    console.error('Error fetching tournament rules:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
