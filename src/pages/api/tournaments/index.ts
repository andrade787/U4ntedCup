import { NextApiRequest, NextApiResponse } from 'next';
import { getAllTournaments } from '@/controllers/tournaments';

const handlers = {
  GET: getAllTournaments,
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
