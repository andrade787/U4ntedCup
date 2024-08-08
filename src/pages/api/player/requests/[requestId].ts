import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { firestore, realtimeDB, admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { markNotificationAsRead } from '@/utils/markNotification';
import { TeamPlayers } from '@/lib/types';

const requestSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  notificationId: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request method:', req.method);
  if (req.method === 'PATCH') {
    const { requestId } = req.query;

    try {
      const verifyToken = await verifyAndRefreshToken(req as any, res as any);
      const uid = verifyToken?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const parsedData = requestSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: 'Invalid request data', errors: parsedData.error.errors });
      }

      const { notificationId, status } = parsedData.data;

      const notificationRef = realtimeDB.ref(`notifications/${uid}/${notificationId}`);
      const notificationSnapshot = await notificationRef.get();

      // VALIDA SE A NOTIFICAO EXISTE 
      if (!notificationSnapshot.exists()) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      // VALIDA SE QUEM RECEBEU É O MESMO USUARIO LOGADO 
      const notification = notificationSnapshot.val();
      if (notification.receiverId !== uid) {
        return res.status(403).json({ message: 'Unauthorized access to notification' });
      }

      const receiverId = notification.receiverId;
      const additionalInfo = notification.additionalInfo;
      const teamId = notification.teamId;

      const playerRequestRef = firestore
        .collection('players')
        .doc(receiverId)
        .collection('requests')
        .doc(requestId as string);
      const playerRequestDoc = await playerRequestRef.get();

      // VALIDA SE O REQUEST EXISTE 
      if (!playerRequestDoc.exists || additionalInfo[0] !== requestId) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Busca o nickname do player
      const teamDoc = await firestore.collection('teams').doc(teamId).get();
      if (!teamDoc.exists) {
        return res.status(404).json({ message: 'Team not found' });
      }
      const teamData = teamDoc.data();
      const teamName = teamData?.name;

      let message;

      if (status === 'accepted') {
        const role = 'Controlador'; // DEFINO CONTROLADOR POR PADRAO POR ENQUANTO

        // ATUALIZA O REQUEST DO PLAYER 
        await playerRequestRef.update({
          status: 'accepted',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // ADICIONA O TIME DO PLAYER QUE ACEITOU
        const playerTeamRef = firestore.collection('players').doc(receiverId).collection('teams').doc(teamId);
        await playerTeamRef.set({
          teamId,
          status: 'active',
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
          leaveDate: null,
        });

        // ADICIONA O PLAYER NO TIME
        const teamPlayerRef = firestore.collection('teams').doc(teamId).collection('players').doc(receiverId);
        await teamPlayerRef.set({
          playerId: receiverId,
          roles: [role],
          status: 'active',
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
          leaveDate: null,
        });

        message = `Você agora faz parte do time ${teamName}.`;
      }

      if (status === 'rejected') {
        // ATUALIZA O REQUEST DO PLAYER 
        await playerRequestRef.update({
          status: 'rejected',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        message = `Você recusou o pedido para entrar no time ${teamName}.`;
      }

      await markNotificationAsRead(notificationId, uid); // MARCA COMO VISTA A NOTIFICAO DE QUEM RECEBEU

      res.status(200).json({ message });
    } catch (error) {
      console.error('Error processing request:', error);
      let errorMessage = 'Internal server error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  } else {
    console.log('Invalid request method');
    res.status(405).json({ message: 'Method not allowed' });
  }
}
