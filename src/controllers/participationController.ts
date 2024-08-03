import { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

// Função para obter todas as participações de um torneio específico
export const getParticipations = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  if (typeof tournamentId !== 'string') {
    res.status(400).json({ message: 'Invalid tournamentId' });
    return;
  }

  try {
    const participationsSnapshot = await firestore.collection('tournament_teams')
      .doc(tournamentId)
      .collection('teams')
      .get();

    const participations = participationsSnapshot.docs.map(doc => doc.data());

    const teamPromises = participations.map(async (participation) => {
      const teamDoc = await firestore.collection('teams').doc(participation.teamId).get();
      if (teamDoc.exists) {
        const teamData = teamDoc.data();
        const playersSnapshot = await teamDoc.ref.collection('players').get();
        const players = playersSnapshot.docs.map(playerDoc => {
          const playerData = playerDoc.data();
          return {
            id: playerDoc.id,
            nickname: playerData.nickname,
            photoURL: playerData.photoURL,
            url: playerData.url,
          };
        });
        return { ...teamData, players };
      }
      return null;
    });

    const teams = await Promise.all(teamPromises);
    const validTeams = teams.filter(team => team !== null);
    res.status(200).json(validTeams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch participations', error });
  }
};
// Função para obter uma participação específica
export const getParticipation = async (req: NextApiRequest, res: NextApiResponse) => {
  const { participationId } = req.query;

  try {
    const participationDoc = await firestore.collection('tournamentParticipations').doc(participationId as string).get();
    if (!participationDoc.exists) {
      return res.status(404).json({ message: 'Participation not found' });
    }
    res.status(200).json({ id: participationDoc.id, ...participationDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch participation', error });
  }
};

// Função para criar uma nova participação
export const createParticipation = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId, teamId } = req.body;

  try {
    const newParticipationRef = firestore.collection('tournament_teams').doc(tournamentId).collection('teams').doc(teamId);
    await newParticipationRef.set({
      tournamentId,
      teamId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newParticipationDoc = await newParticipationRef.get();
    res.status(201).json({ id: newParticipationDoc.id, ...newParticipationDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create participation', error });
  }
};


// Função para atualizar uma participação específica
export const updateParticipation = async (req: NextApiRequest, res: NextApiResponse) => {
  const { participationId } = req.query;
  const participationData = req.body;

  try {
    const participationDoc = firestore.collection('tournamentParticipations').doc(participationId as string);
    await participationDoc.update(participationData);
    const updatedParticipationDoc = await participationDoc.get();
    res.status(200).json({ message: 'Participation updated successfully', id: updatedParticipationDoc.id, ...updatedParticipationDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update participation', error });
  }
};

// Função para deletar uma participação específica
export const deleteParticipation = async (req: NextApiRequest, res: NextApiResponse) => {
  const { participationId } = req.query;

  try {
    await firestore.collection('tournamentParticipations').doc(participationId as string).delete();
    res.status(204).send(null);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete participation', error });
  }
};
