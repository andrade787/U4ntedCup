import { firestore } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';

const allowedFields = ['uid', 'firstName', 'nickname', 'email', 'capaUrl', 'photoURL', 'number', 'signaturePlayer', 'url', 'createdAt', 'teams', 'requests', 'game_account', 'last_update'];

interface GetAccountsPlayerParams {
  playerId: string;
  fields?: string | string[];
}

interface GameAccountData {
  [key: string]: any;
}

export const NewgetAccountsPlayer = async ({ playerId, fields }: GetAccountsPlayerParams): Promise<GameAccountData> => {
  if (typeof playerId !== 'string') {
    throw new Error('Invalid playerId');
  }

  let selectedFields: string[] = [];
  if (fields) {
    if (typeof fields === 'string') {
      selectedFields = fields.split(',').filter(field => allowedFields.includes(field));
    } else if (Array.isArray(fields)) {
      selectedFields = fields.filter(field => allowedFields.includes(field));
    }
  }

  try {
    // Verifica se o campo 'game_account' está nos campos solicitados
    if (selectedFields.includes('game_account') || selectedFields.length === 0) {
      const gameAccountsSnapshot = await firestore.collection('players').doc(playerId).collection('game_account').get();
      const gameAccounts: GameAccountData = {};

      gameAccountsSnapshot.forEach(doc => {
        const data = doc.data();

        // Converte o campo 'last_update' para string, se existir
        if (data.last_update) {
          data.last_update = convertFirestoreTimestampToString(data.last_update);
        }

        gameAccounts[doc.id] = data;
      });

      // Filtra os dados de 'game_account' com base nos campos selecionados
      let filteredGameAccounts: GameAccountData = {};
      if (selectedFields.length > 0) {
        Object.keys(gameAccounts).forEach(accountId => {
          filteredGameAccounts[accountId] = {};
          selectedFields.forEach(field => {
            if (gameAccounts[accountId][field] !== undefined) {
              filteredGameAccounts[accountId][field] = gameAccounts[accountId][field];
            }
          });
        });
      } else {
        filteredGameAccounts = gameAccounts; // Retornar todos os campos se nenhum campo específico for solicitado
      }
      return filteredGameAccounts;
    } else {
      throw new Error('No valid fields requested.');
    }
  } catch (error) {
    console.error('Error fetching game accounts:', error);
    throw new Error('Error fetching game accounts.');
  }
};
