// pages/api/teams/add-request.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore, realtimeDB } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { sendNotification } from '@/utils/sendNotification';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const VerifyToken = await verifyAndRefreshToken(req, res);
      const uid = VerifyToken?.uid;

      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { playerId, teamId, type } = req.body;

      // ve se o time existe
      const teamDoc = await firestore.collection('teams').doc(teamId).get();
      if (!teamDoc.exists) {
        return res.status(404).json({ error: 'Time não encontrado' });
      }
      const teamData = teamDoc.data();

      const request = {
        status: 'pending',
        teamId,
        type: type || 'team_invite',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      // adicione nos requests do player 
      const requestRef = await firestore.collection('players').doc(playerId).collection('requests').add(request);
      const requestId = requestRef.id;

      // envio a notificao
      const notificationData = {
        type: 'team_invite',
        message: `Você recebeu um convite para entrar no ${teamData?.name}`,
        senderId: uid,
        receiverId: playerId,
        teamId,
        additionalInfo: [requestId],
      };

      await sendNotification(notificationData);

      res.status(200).json({ message: 'Convite enviado com sucesso' });
    } catch (error) {
      console.error('Error sending invite:', error);
      res.status(500).json({ error: 'Failed to send invite' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
