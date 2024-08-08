import { firestore } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';

// Function to get player by ID or URL
export const NewgetPlayerByIdOrUrl = async (playerId: string, type: 'id' | 'url') => {
  if (!playerId) {
    throw new Error('Player ID or URL is required');
  }

  try {
    let playerDoc;

    if (type === 'url') {
      const playersSnapshot = await firestore.collection('players').where('url', '==', playerId).limit(1).get();
      if (playersSnapshot.empty) {
        throw new Error('Player not found');
      }
      playerDoc = playersSnapshot.docs[0];
    } else {
      playerDoc = await firestore.collection('players').doc(playerId as string).get();
      if (!playerDoc.exists) {
        throw new Error('Player not found');
      }
    }

    const playerData = playerDoc.data();

    // Convert Firestore timestamp to string
    if (playerData?.createdAt) {
      playerData.createdAt = convertFirestoreTimestampToString(playerData.createdAt);
    }

    return playerData;
  } catch (error) {
    console.error('Error fetching player:', (error as Error).message);
    throw new Error('Internal Server Error');
  }
};
