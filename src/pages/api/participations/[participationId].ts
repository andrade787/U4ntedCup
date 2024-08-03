import { NextApiRequest, NextApiResponse } from 'next';
import { getParticipation, updateParticipation, deleteParticipation } from '@/controllers/participationController';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

const handlers = {
  GET: getParticipation,
  PUT: updateParticipation,
  DELETE: deleteParticipation,
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const handler = handlers[req.method as keyof typeof handlers];

  const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
  const uid = VerifyToken?.uid;

  if (!uid) {
    return res.status(401).end((`Não autorizado`));
  }


  if (handler) {
    await handler(req, res);
  } else {
    res.setHeader('Allow', Object.keys(handlers));
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
