import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

export const removeTeamFromTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId, teamId } = req.query;

  if (!tournamentId || !teamId) {
    return res.status(400).json({ message: 'Tournament ID and Team ID are required' });
  }

  try {
    const verifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = verifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // Check if the user is the owner of the team
    const teamDoc = await firestore.collection('teams').doc(teamId as string).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ message: 'Equipe não encontrada.' });
    }

    const teamData = teamDoc.data();
    if (teamData?.owner !== uid) {
      return res.status(403).json({ message: 'Você não tem permissão para remover esta equipe.' });
    }

    // Remove the team from the tournament_teams collection
    await firestore.collection('tournament_teams').doc(tournamentId as string).collection('teams').doc(teamId as string).delete();

    return res.status(200).json({ message: 'Equipe removida do torneio com sucesso.' });
  } catch (error) {
    console.error('Error removing team from tournament:', error);
    return res.status(500).json({ message: 'Erro ao remover equipe do torneio.' });
  }
};
