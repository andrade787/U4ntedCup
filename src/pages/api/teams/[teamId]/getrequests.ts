import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
  const uid = VerifyToken?.uid;

  if (!uid) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const userDocRef = firestore.collection('players').doc(uid);
    const requestsCollectionRef = userDocRef.collection('requests');
    const requestQuerySnap = await requestsCollectionRef
      .where('teamId', '==', teamId as string)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!requestQuerySnap.empty) {
      const requestDoc = requestQuerySnap.docs[0];
      const { status, type } = requestDoc.data();

      return res.status(200).json({ status, type });
    } else {
      return res.status(200).json({ status: null, type: null });
    }
  } catch (error) {
    console.error('Error fetching invitation status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
