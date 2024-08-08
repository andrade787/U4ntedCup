import { NextApiRequest, NextApiResponse } from 'next';
import { getTeamPlayers } from '@/controllers/teams';

const handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    const { teamId, type } = req.query;

    if (!teamId || typeof teamId !== 'string') {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    try {
      const players = await getTeamPlayers(teamId, type as string);
      res.status(200).json(players);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const methodHandler = handlers[req.method as keyof typeof handlers];

  if (methodHandler) {
    try {
      await methodHandler(req, res);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', Object.keys(handlers));
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
