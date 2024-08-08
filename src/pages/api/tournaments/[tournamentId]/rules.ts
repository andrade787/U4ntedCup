import { NextApiRequest, NextApiResponse } from 'next';
import { getTournamentRules } from '@/controllers/tournaments/getTournamentRules';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getTournamentRules(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
