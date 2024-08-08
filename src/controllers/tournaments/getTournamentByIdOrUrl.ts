import { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';


export const getTournamentByIdOrUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId, type } = req.query;

  if (!tournamentId) {
    return res.status(400).json({ message: 'Tournament ID or URL is required' });
  }

  try {
    const tournament = type === 'url'
      ? await getTournamentByUrl(tournamentId as string)
      : await getTournamentById(tournamentId as string);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    return res.status(200).json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTournamentById = async (tournamentId: string) => {
  const doc = await firestore.collection('tournaments').doc(tournamentId).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  if (data) {
    data.startDate = convertFirestoreTimestampToString(data.startDate);
    data.endDate = convertFirestoreTimestampToString(data.endDate);
    data.createdAt = convertFirestoreTimestampToString(data.createdAt);
  }
  return data;
};

const getTournamentByUrl = async (url: string) => {
  const query = await firestore.collection('tournaments').where('campUrl', '==', url).get();
  if (query.empty) {
    return null;
  }
  const data = query.docs[0].data();
  if (data) {
    data.startDate = convertFirestoreTimestampToString(data.startDate);
    data.endDate = convertFirestoreTimestampToString(data.endDate);
    data.createdAt = convertFirestoreTimestampToString(data.createdAt);
  }
  return data;
};
