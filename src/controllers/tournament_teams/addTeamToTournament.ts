import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

export const addTeamToTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;
  const { teamId } = req.body;

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
    const teamDoc = await firestore.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ message: 'Equipe não encontrada.' });
    }

    const teamData = teamDoc.data();
    if (teamData?.owner !== uid) {
      return res.status(403).json({ message: 'Você não tem permissão para inscrever esta equipe.' });
    }

    // Check if the team has at least 5 players
    const teamPlayersSnapshot = await firestore.collection('teams').doc(teamId).collection('players').get();

    if (teamPlayersSnapshot.size < 5) {
      return res.status(400).json({ message: 'A equipe precisa ter pelo menos 5 jogadores.' });
    }

    // Add the team to the tournament_teams collection
    const joinedAt = Timestamp.now();
    const teamTournamentData = {
      tournamentId,
      teamId,
      status_payment: 'waiting', // Default status
      joinedAt,
    };

    await firestore.collection('tournament_teams').doc(tournamentId as string).collection('teams').doc(teamId).set(teamTournamentData);

    return res.status(200).json({ message: 'Equipe adicionada ao torneio com sucesso.' });
  } catch (error) {
    console.error('Error adding team to tournament:', error);
    return res.status(500).json({ message: 'Erro ao adicionar equipe ao torneio.' });
  }
};
