// api/teams/search-players.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { firestore } from '@/firebase/firebaseAdmin';
import { z } from 'zod';

// Define the Zod schema for the request body
const requestBodySchema = z.object({
  teamId: z.string().nonempty("Team ID is required"),
  teamPlayers: z.array(z.object({
    playerId: z.string().nonempty("Player ID is required")
  })).nonempty("Team players array is required")
});

interface Player {
  id: string;
  nickname: string;
  photoURL?: string;
  url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Validate the request body
    const parsedBody = requestBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.errors });
    }

    const { teamId, teamPlayers } = parsedBody.data;
    const teamPlayersIds = teamPlayers.map((player) => player.playerId);

    try {
      const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
      const uid = VerifyToken?.uid;

      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      // Fetch players who are not already part of the team
      const playersSnapshot = await firestore.collection('players').get();
      const players: Player[] = playersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Player))
        .filter(player => !teamPlayersIds.includes(player.id));

      const filteredPlayers: any[] = [];

      const teamPromises = players.map(player =>
        firestore.collection('players').doc(player.id).collection('teams').where('status', '==', 'active').get()
      );

      const requestPromises = players.map(player =>
        firestore.collection('players').doc(player.id).collection('requests').where('teamId', '==', teamId).get()
      );

      const teamsSnapshots = await Promise.all(teamPromises);
      const requestsSnapshots = await Promise.all(requestPromises);

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const teamsSnapshot = teamsSnapshots[i];
        const requestsSnapshot = requestsSnapshots[i];

        if (!teamsSnapshot.empty) {
          // Skip players who are active members of any team
          continue;
        }

        let requestStatus = null;
        let requestType = null;

        if (!requestsSnapshot.empty) {
          const request = requestsSnapshot.docs[0].data();
          requestStatus = request.status;
          requestType = request.type;
        }

        filteredPlayers.push({
          playerId: player.id,
          nickname: player.nickname,
          photoURL: player.photoURL || null,
          url: player.url,
          requestStatus,
          type: requestType
        });
      }

      // Return the filtered players
      res.status(200).json(filteredPlayers);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
