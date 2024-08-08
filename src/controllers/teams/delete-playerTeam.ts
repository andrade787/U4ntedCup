import { firestore } from '@/firebase/firebaseAdmin';
import admin from 'firebase-admin';

interface DeletePlayerParams {
  teamId: string;
  playerId: string;
  userId: string; // ID do usuário autenticado (uid)
}

export const deletePlayerFromTeam = async ({ teamId, playerId, userId }: DeletePlayerParams): Promise<{ message: string; error?: string }> => {
  try {
    const teamRef = firestore.collection('teams').doc(teamId);
    const playerRef = firestore.collection('players').doc(playerId);
    const teamPlayerRef = teamRef.collection('players').doc(playerId);
    const playerTeamRef = playerRef.collection('teams').doc(teamId);

    await firestore.runTransaction(async (transaction) => {
      const teamSnapshot = await transaction.get(teamRef);
      const teamData = teamSnapshot.data();

      if (!teamData) {
        throw new Error('Não conseguimos localizar o time solicitado. Se você acredita que o time existe e o problema persiste, por favor, entre em contato conosco para obter assistência.');
      }

      if (teamData.owner === playerId) {
        throw new Error('Você não pode deletar o dono do time.');
      }

      if (teamData.owner !== userId) {
        throw new Error('Não autorizado');
      }

      // Atualiza o status do jogador na subcoleção de players dentro do time
      transaction.update(teamPlayerRef, {
        status: "removed",
        leaveDate: admin.firestore.FieldValue.serverTimestamp()
      });

      // Atualiza o status do time na subcoleção de teams dentro do jogador
      transaction.update(playerTeamRef, {
        status: "inactive",
        leaveDate: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return { message: 'Player Deletado Com Sucesso!' };
  } catch (error) {
    return { message: 'Ocorreu um erro ao deletar o player. Tente novamente mais tarde', error: (error as Error).message };
  }
};
