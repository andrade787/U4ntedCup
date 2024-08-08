import { firestore } from '@/firebase/firebaseAdmin';
import { convertFirestoreTimestampToString } from '@/utils/FirestoreTimestampToString';
import { NextApiRequest, NextApiResponse } from 'next';

const allowedFields = ['uid', 'firstName', 'nickname', 'email', 'capaUrl', 'photoURL', 'number', 'signaturePlayer', 'url', 'createdAt', 'teams', 'requests', 'game_account', 'last_update'];

export const getAccountsPlayer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playerId, fields } = req.query;

  if (typeof playerId !== 'string') {
    return res.status(400).json({ message: 'Invalid playerId' });
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
      const gameAccounts: any = {};

      gameAccountsSnapshot.forEach(doc => {
        const data = doc.data();

        // Converte o campo 'last_update' para string, se existir
        if (data.last_update) {
          data.last_update = convertFirestoreTimestampToString(data.last_update);
        }

        gameAccounts[doc.id] = data;
      });

      // Filtra os dados de 'game_account' com base nos campos selecionados
      let filteredGameAccounts: any = {};
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
      return res.status(200).json(filteredGameAccounts);
    } else {
      return res.status(400).json({ message: 'No valid fields requested.' });
    }
  } catch (error) {
    console.error('Error fetching game accounts:', error);
    return res.status(500).json({ message: 'Error fetching game accounts.' });
  }
};
