// pages/api/requests/[requestId].ts
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

      const senderId = notification.senderId;
      const additionalInfo = notification.additionalInfo;

      const playerRequestRef = firestore
        .collection('players')
        .doc(senderId)
        .collection('requests')
        .doc(requestId as string);
      const playerRequestDoc = await playerRequestRef.get();

      // VALIDA SE O REQUEST EXISTE 
      if (!playerRequestDoc.exists || additionalInfo[2] !== requestId) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Busca o nickname do player
      const playerDoc = await firestore.collection('players').doc(senderId).get();
      if (!playerDoc.exists) {
        return res.status(404).json({ message: 'Player not found' });
      }
      const playerData = playerDoc.data();
      const playerNick = playerData?.nickname;

      let message;
      let teamPlayer: TeamPlayers | null = null;

      if (status === 'accepted') {
        const role = additionalInfo[0]; // PEGO A ROLE DO USUARIO QUE VAI SER SEMPRE O 0 do additionalInfo
        // ATUALIZA O REQUEST DO PLAYER 
        await playerRequestRef.update({
          status: 'accepted',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        const teamId = notification.teamId;
        // ADICIONA O TIME DO PLAYER QUE PEDIU PARA ENTRAR
        const playerTeamRef = firestore.collection('players').doc(senderId).collection('teams').doc(teamId);
        await playerTeamRef.set({
          teamId,
          status: 'active',
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
          leaveDate: null,
        });

        // ADICIONA O PLAYER NO TIME
        const teamPlayerRef = firestore.collection('teams').doc(teamId).collection('players').doc(senderId);
        await teamPlayerRef.set({
          playerId: senderId,
          roles: [role],
          status: 'active',
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
          leaveDate: null,
        });

        // envio os dados do player aceito
        teamPlayer = {
          signaturePlayer: playerData?.signaturePlayer,
          playerId: senderId,
          capaUrl: playerData?.capaUrl,
          email: playerData?.email,
          firstName: playerData?.firstName,
          nickname: playerData?.nickname,
          photoURL: playerData?.photoURL,
          roles: [role],
          url: playerData?.url,
          joinedAt: new Date().toISOString(),
          leaveDate: null,
        };

        message = `${playerNick} agora faz parte do seu time!`;
      }

      if (status === 'rejected') {
        // ATUALIZA O REQUEST DO PLAYER 
        await playerRequestRef.update({
          status: 'rejected',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        message = `Você recusou o pedido de ${playerNick} para entrar no seu time.`;
      }


      await markNotificationAsRead(notificationId, uid); // MARCA COMO VISTA A NOTIFICAO DE QUEM RECEBEU

      res.status(200).json({ message, player: teamPlayer });
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
