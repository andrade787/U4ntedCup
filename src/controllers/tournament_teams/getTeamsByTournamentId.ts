import { firestore } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';
import { NextApiRequest, NextApiResponse } from 'next';




// Function to get teams by tournament ID
export const getTeamsByTournamentId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  if (!tournamentId) {
    return res.status(400).json({ message: 'Tournament ID is required' });
  }

  try {
    // Retrieve the IDs and joinedAt timestamps of the teams associated with the tournament
    const tournamentTeamsSnapshot = await firestore.collection('tournament_teams').doc(tournamentId as string).collection('teams').get();

    // Extract team data, including joinedAt
    const teamDataPromises = tournamentTeamsSnapshot.docs.map(async (doc) => {
      const teamId = doc.id;
      const joinedAt = convertFirestoreTimestampToString(doc.data().joinedAt); // Get the joinedAt field from the document
      const status_payment = doc.data().status_payment; // Get the status payment team from the document

      // Retrieve detailed team information
      const teamSnapshot = await firestore.collection('teams').doc(teamId).get();
      const teamData = teamSnapshot.data();

      // Convert dates to strings if they exist
      if (teamData) {
        if (teamData.startDate) {
          teamData.startDate = convertFirestoreTimestampToString(teamData.startDate);
        }
        if (teamData.endDate) {
          teamData.endDate = convertFirestoreTimestampToString(teamData.endDate);
        }
        if (teamData.createdAt) {
          teamData.createdAt = convertFirestoreTimestampToString(teamData.createdAt);
        }
      }

      return {
        ...teamData,
        joinedAt,
        status_payment
      };
    });

    const teams = await Promise.all(teamDataPromises);
    return res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Function to add a team to a tournament
export const addTeamToTournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;
  const { teamId, joinedAt } = req.body;

  if (!tournamentId || !teamId || !joinedAt) {
    return res.status(400).json({ message: 'Tournament ID, Team ID, and joinedAt are required' });
  }

  try {
    const teamRef = firestore.collection('tournament_teams').doc(tournamentId as string).collection('teams').doc(teamId);
    await teamRef.set({ tournamentId, teamId, joinedAt });

    return res.status(200).json({ message: 'Team added to tournament successfully' });
  } catch (error) {
    console.error('Error adding team to tournament:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
