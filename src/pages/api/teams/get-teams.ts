// pages/api/teams/get-teams.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from "@/firebase/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers } = req;

  if (method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const teamsRef = firestore.collection("teams");

  try {
    const querySnapshot = await teamsRef.get();
    const allTeams = querySnapshot.docs.map(doc => {
      const { name, logo, url, privacy, createdAt } = doc.data();
      return { name, logo, url, privacy, createdAt };
    });

    res.status(200).json(allTeams);
  } catch (error) {
    console.error("Error fetching teams: ", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
}
