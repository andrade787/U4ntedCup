import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';

// Função para obter todos os torneios
export const getTournaments = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tournamentsSnapshot = await firestore.collection('tournaments').get();
    const tournaments = tournamentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tournaments', error });
  }
};

// Função para obter um torneio específico
export const getTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  try {
    const tournamentDoc = await firestore.collection('tournaments').doc(tournamentId as string).get();
    if (!tournamentDoc.exists) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(200).json({ id: tournamentDoc.id, ...tournamentDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tournament', error });
  }
};


// Função para criar um novo torneio
export const createTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const tournamentData = req.body;

  try {
    const newTournamentRef = await firestore.collection('tournaments').add(tournamentData);
    const newTournamentDoc = await newTournamentRef.get();
    res.status(201).json({ id: newTournamentDoc.id, ...newTournamentDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tournament', error });
  }
};

// Função para atualizar um torneio específico
export const updateTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;
  const tournamentData = req.body;

  try {
    const tournamentDoc = firestore.collection('tournaments').doc(tournamentId as string);
    await tournamentDoc.update(tournamentData);
    const updatedTournamentDoc = await tournamentDoc.get();
    res.status(200).json({ message: 'Tournament updated successfully', id: updatedTournamentDoc.id, ...updatedTournamentDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tournament', error });
  }
};

// Função para deletar um torneio específico
export const deleteTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  try {
    await firestore.collection('tournaments').doc(tournamentId as string).delete();
    res.status(204).send(null);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete tournament', error });
  }
};

