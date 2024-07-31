// pages/api/requests/[requestId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { markNotificationAsRead } from '@/utils/markNotification';

const requestSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  playerId: z.string(),
  playerNick: z.string(),
  teamId: z.string(),
  receiverId: z.string(),
  notificationId: z.string(),
  Role: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { requestId } = req.query;

    try {
      const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
      const uid = VerifyToken?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const parsedData = requestSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: 'Invalid request data', errors: parsedData.error.errors });
      }

      const { status, playerId, playerNick, teamId, receiverId, notificationId, Role } = parsedData.data;

      if (uid !== receiverId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      let messageRef = '';

      const requestRef = admin.firestore().collection('players').doc(playerId).collection('requests').doc(requestId as string);

      await requestRef.update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (status === 'accepted') {
        const teamRef = admin.firestore().collection('teams').doc(teamId).collection('players').doc(playerId);
        await teamRef.set({
          playerId,
          roles: Role ? [Role] : [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'active',
          leaveDate: null,
        });
        const playerRef = admin.firestore().collection('players').doc(playerId).collection('teams').doc(teamId);
        await playerRef.set({
          teamId,
          status: 'active',
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
          leftAt: null,
        });
        messageRef = `${playerNick} agora faz parte do seu time.`;
      } else if (status === 'rejected') {
        messageRef = `Você recusou o pedido de ${playerNick} para entrar no seu time.`;
      }

      const notificationResponse = await markNotificationAsRead(notificationId, receiverId);
      if (notificationResponse.status !== 'success') {
        return res.status(500).json({ message: notificationResponse.message });
      }

      res.status(200).json({ message: messageRef });
    } catch (error) {
      let errorMessage = 'Internal server error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
