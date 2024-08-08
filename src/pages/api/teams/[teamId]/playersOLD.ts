import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const teamDoc = await firestore.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Time não encontrado' });
    }

    const playersSnapshot = await firestore.collection('teams').doc(teamId).collection('players').get();
    const players = await Promise.all(playersSnapshot.docs.map(async (doc) => {
      const playerData = doc.data();
      const playerDoc = await firestore.collection('players').doc(playerData.playerId).get();
      if (!playerDoc.exists) {
        return null;
      }
      const playerInfo = playerDoc.data();
      return {
        playerId: playerData.playerId,
        roles: playerData.roles,
        status: playerData.status,
        createdAt: playerData.createdAt.toDate().toISOString(),
        nickname: playerInfo?.nickname || '',
        photoURL: playerInfo?.photoURL || '',
        url: playerInfo?.url || ''
      };
    }));

    // Filter out any null results (players that don't exist)
    const validPlayers = players.filter(player => player !== null);
    return res.status(200).json({ players: validPlayers });
  } catch (error) {
    console.error('Erro ao carregar jogadores:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
