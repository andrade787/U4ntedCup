import { firestore } from '@/firebase/firebaseAdmin';
import { TeamPlayers } from '@/lib/types';

export const getTeamPlayers = async (teamId: string, type?: string): Promise<TeamPlayers[]> => {
  if (!teamId) {
    throw new Error('Team ID is required');
  }

  if (type && type !== 'active' && type !== 'inactive') {
    throw new Error('Invalid type parameter');
  }

  try {
    const playersRef = firestore.collection('teams').doc(teamId).collection('players');
    let query = playersRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (type) {
      query = query.where('status', '==', type);
    }

    const playersSnapshot = await query.get();

    if (playersSnapshot.empty) {
      throw new Error('No players found for this team.');
    }

    const players: TeamPlayers[] = await Promise.all(playersSnapshot.docs.map(async doc => {
      const teamPlayerData = doc.data();
      const playerId = doc.id;
      const playerDoc = await firestore.collection('players').doc(playerId).get();

      if (!playerDoc.exists) {
        throw new Error(`Player with ID ${playerId} not found`);
      }

      const playerData = playerDoc.data();

      return {
        playerId,
        firstName: playerData?.firstName || '',
        photoURL: playerData?.photoURL || null,
        nickname: playerData?.nickname || '',
        url: playerData?.url || '',
        capaUrl: playerData?.capaUrl || null,
        signaturePlayer: playerData?.signaturePlayer || '',
        roles: teamPlayerData.roles || [],
        joinedAt: teamPlayerData.joinedAt ? teamPlayerData.joinedAt.toDate().toISOString() : null,
        leaveDate: teamPlayerData.leaveDate ? teamPlayerData.leaveDate.toDate().toISOString() : null,
      };
    }));

    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw new Error('Error fetching players.');
  }
};