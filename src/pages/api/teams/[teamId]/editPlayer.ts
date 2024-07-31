import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { z } from 'zod';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

const schema = z.object({
  playerId: z.string(),
  roles: z.array(z.string())
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId } = req.query;

  if (req.method === 'POST') {
    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
      const { playerId, roles } = schema.parse(req.body);

      const teamRef = firestore.collection('teams').doc(teamId as string);
      const teamSnapshot = await teamRef.get();
      const teamData = teamSnapshot.data();

      if (!teamData) {
        return res.status(401).json({ error: 'Não conseguimos localizar o time solicitado. Se você acredita que o time existe e o problema persiste, por favor, entre em contato conosco para obter assistência.' });
      }

      if (teamData.owner != uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const playersSnapshot = await teamRef.collection('players').get();
      const isSixPlayerAlreadyExists = playersSnapshot.docs.some(doc => {
        const data = doc.data();
        return data.roles.includes('6 Player') && data.playerId !== playerId;
      });

      if (isSixPlayerAlreadyExists && roles.includes('6 Player')) {
        return res.status(400).json({ message: 'Já existe um jogador selecionado como 6º Jogador! Para trocar o 6º Jogador, deselecione primeiro o jogador atual.' });
      }

      await teamRef.collection('players').doc(playerId).update({ roles });

      res.status(200).json({ message: 'Player updated successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Error updating player', error: (error as Error).message });
      }
    }
  } else if (req.method === 'DELETE') {
    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
      const { playerId } = req.body;
      const teamRef = firestore.collection('teams').doc(teamId as string);
      const teamSnapshot = await teamRef.get();
      const teamData = teamSnapshot.data();

      if (!teamData) {
        return res.status(401).json({ error: 'Não conseguimos localizar o time solicitado. Se você acredita que o time existe e o problema persiste, por favor, entre em contato conosco para obter assistência.' });
      }

      if (teamData.owner == playerId) {
        return res.status(400).json({ error: 'Você não pode deletar o dono do time.' });
      }

      if (teamData.owner != uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      await teamRef.collection('players').doc(playerId).update({
        status: "removed",
        leaveDate: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).json({ message: 'Player Deletado Com Sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Ocorreu um erro ao deletar o player. Tente novamente mais tarde', error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
