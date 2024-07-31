import { GetServerSidePropsContext } from 'next';
import { firestore, admin } from '@/firebase/firebaseAdmin';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

export const withUser = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  try {
    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return null;
    }

    const user = await admin.auth().getUser(uid);

    const userDocRef = firestore.collection('players').doc(user.uid);
    const userDocSnap = await userDocRef.get();
    const userData = userDocSnap.exists ? userDocSnap.data() : {};

    // Verificar a sub-coleção teams para o status active
    const teamsCollectionRef = userDocRef.collection('teams');
    const activeTeamsQuerySnap = await teamsCollectionRef.where('status', '==', 'active').limit(1).get();

    let activeTeamId = null;
    if (!activeTeamsQuerySnap.empty) {
      const activeTeamDoc = activeTeamsQuerySnap.docs[0];
      activeTeamId = activeTeamDoc.data().teamId;
    }

    const customToken = await admin.auth().createCustomToken(uid);

    return {
      uid: user.uid,
      email: user.email,
      name: userData?.firstName || 'Anonymous',
      photoURL: userData?.photoURL || null,
      nickname: userData?.nickname || null,
      url: userData?.url || null,
      token: customToken,
      activeTeamId: activeTeamId,
    };
  } catch (error) {
    console.log('Error verifying or refreshing token: ', error);
    return null;
  }
};
