import { firestore } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to get player by ID or URL
export const getPlayerByIdOrUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playerId, type } = req.query;

  if (!playerId) {
    return res.status(400).json({ message: 'Player ID or URL is required' });
  }

  try {
    let playerDoc;

    if (type === 'url') {
      const playersSnapshot = await firestore.collection('players').where('url', '==', playerId).limit(1).get();
      if (playersSnapshot.empty) {
        return res.status(404).json({ message: 'Player not found' });
      }
      playerDoc = playersSnapshot.docs[0];
    } else {
      playerDoc = await firestore.collection('players').doc(playerId as string).get();
      if (!playerDoc.exists) {
        return res.status(404).json({ message: 'Player not found' });
      }
    }

    const playerData = playerDoc.data();

    // Convert Firestore timestamp to string
    if (playerData?.createdAt) {
      playerData.createdAt = convertFirestoreTimestampToString(playerData.createdAt);
    }

    return res.status(200).json(playerData);
  } catch (error) {
    console.error('Error fetching player:', (error as Error).message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};