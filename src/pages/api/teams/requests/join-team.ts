import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { firestore } from '@/firebase/firebaseAdmin';
import { sendNotification } from '@/utils/sendNotification';
import admin from 'firebase-admin';

const schema = z.object({
  playerNick: z.string(),
  playerId: z.string(),
  teamId: z.string(),
  role: z.string(),
  playerUrl: z.string()
});

async function getTeamData(teamId: string) {
  const teamDoc = await firestore.collection('teams').doc(teamId).get();
  return teamDoc.exists ? teamDoc.data() : null;
}

async function getPlayerData(playerId: string) {
  const playerDoc = await firestore.collection('players').doc(playerId).get();
  return playerDoc.exists ? playerDoc.data() : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const parsedData = schema.parse(req.body);

    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { playerNick, playerId, teamId, role, playerUrl } = parsedData;

    const teamData = await getTeamData(teamId);
    if (!teamData) {
      return res.status(404).json({ error: 'Time não encontrado' });
    }

    if (teamData.privacy !== 'public') {
      return res.status(403).json({ error: 'O time não é público' });
    }

    const playerData = await getPlayerData(playerId); // valido se o jogador existe
    if (!playerData) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    const playerTeamsSnapshot = await firestore.collection('players').doc(playerId).collection('teams').get();
    const isPlayerInAnyTeam = playerTeamsSnapshot.docs.some(doc => doc.data().status === 'active');
    if (isPlayerInAnyTeam) {
      return res.status(400).json({ error: 'Você já está em um time' });
    }

    const teamPlayersSnapshot = await firestore.collection('teams').doc(teamId).collection('players').get();
    const activePlayersCount = teamPlayersSnapshot.docs.filter(doc => doc.data().status === 'active').length;
    if (activePlayersCount >= 6) {
      return res.status(400).json({ error: 'O time já possui 6 jogadores' });
    }

    const ownerId = teamData.owner;

    const playerRef = admin.firestore().collection('players').doc(playerId);
    const newRequestRef = playerRef.collection('requests').doc();

    await newRequestRef.set({
      requestId: newRequestRef.id,
      status: 'pending',
      teamId,
      type: 'join_request',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    /// passo a role, a url do player e o id do request para a notificação
    const additionalInfos = [role, playerUrl, newRequestRef.id];
    await sendNotification({
      type: 'join_request',
      message: `${playerNick} pediu para entrar no seu time.`,
      senderId: playerId,
      receiverId: ownerId,
      teamId: teamId,
      additionalInfo: additionalInfos,
    });

    res.status(200).json({ success: 'Pedido para entrar no time efetuado com sucesso!' });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
