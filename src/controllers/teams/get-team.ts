import { firestore } from '@/firebase/firebaseAdmin';
import { TeamInfos } from '@/lib/types';

export const getTeam = async (teamId: string, type?: string): Promise<TeamInfos> => {
  try {
    if (!teamId) {
      throw new Error('Identifier (teamId or url) is required');
    }

    // Verifica se o tipo de busca é pela URL ou pelo ID
    let teamDoc;

    if (type === 'url') {
      // Busca pela URL do time
      const teamsQuery = await firestore.collection('teams').where('url', '==', teamId).get();
      if (teamsQuery.empty) {
        throw new Error('Team not found');
      }
      teamDoc = teamsQuery.docs[0];
    } else {
      // Busca pelo ID do time
      teamDoc = await firestore.collection('teams').doc(teamId).get();
      if (!teamDoc.exists) {
        throw new Error('Team not found');
      }
    }

    const teamData = teamDoc.data();
    if (!teamData) {
      throw new Error('Team data not found');
    }

    // Cria a estrutura de dados do time
    const teamInfo: TeamInfos = {
      id: teamDoc.id,
      name: teamData.name,
      logo: teamData.logo,
      url: teamData.url,
      privacy: teamData.privacy,
      createdAt: teamData.createdAt.toDate().toISOString(),
      owner: teamData.owner,
    };

    return teamInfo;
  } catch (error) {
    console.error('Error fetching team info:', error);
    throw new Error('Error fetching team info.');
  }
};
