import { NextApiRequest, NextApiResponse } from 'next';
import { getTournaments, createTournament } from '@/controllers/tournamentController';

const handlers = {
  GET: getTournaments,
  POST: createTournament,
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const handler = handlers[req.method as keyof typeof handlers];

  if (handler) {
    await handler(req, res);
  } else {
    res.setHeader('Allow', Object.keys(handlers));
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
