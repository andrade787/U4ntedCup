import { firestore } from '@/firebase/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to get teams by player ID
export const getTeamsByPlayerId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playerId, status } = req.query;

  if (!playerId) {
    return res.status(400).json({ message: 'Player ID is required' });
  }

  try {
    // Iniciar a referência à coleção de times do jogador
    let teamsQuery = firestore.collection('players').doc(playerId as string).collection('teams') as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    // Adicionar filtro se o status estiver presente
    if (status) {
      teamsQuery = teamsQuery.where('status', '==', status);
    }

    // Executar a consulta
    const teamsSnapshot = await teamsQuery.get();

    // Se não houver times, retornar uma resposta vazia
    if (teamsSnapshot.empty) {
      return res.status(200).json([]);
    }

    // Obter os IDs dos times e o campo joinedAt
    const teamDataPromises = teamsSnapshot.docs.map(async (doc) => {
      const teamId = doc.id;
      const joinedAt = doc.data().joinedAt; // Pegar o campo joinedAt do documento

      // Recuperar as informações detalhadas do time
      const teamSnapshot = await firestore.collection('teams').doc(teamId).get();
      const teamData = teamSnapshot.data();

      // Retornar os dados do time combinados com joinedAt
      return {
        ...teamData,
        joinedAt,
      };
    });

    const teams = await Promise.all(teamDataPromises);

    return res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Function to add a team to a player
export const addTeamToPlayer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playerId } = req.query;
  const { teamId, status, joinedAt } = req.body;

  if (!playerId || !teamId || !status || !joinedAt) {
    return res.status(400).json({ message: 'Player ID, Team ID, status, and joinedAt are required' });
  }

  try {
    const teamRef = firestore.collection('players').doc(playerId as string).collection('teams').doc(teamId);
    await teamRef.set({ teamId, status, joinedAt });
    return res.status(200).json({ message: 'Team added to player successfully' });
  } catch (error) {
    console.error('Error adding team to player:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
