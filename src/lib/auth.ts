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

    const [user, userDocSnap] = await Promise.all([
      admin.auth().getUser(uid),
      firestore.collection('players').doc(uid).get()
    ]);

    const userData = userDocSnap.exists ? userDocSnap.data() : {};

    // vejo se o usuario tem um time ou nao e crio um token personalizado
    const [activeTeamsQuerySnap, customToken] = await Promise.all([
      firestore.collection('players').doc(uid).collection('teams').where('status', '==', 'active').limit(1).get(),
      admin.auth().createCustomToken(uid)
    ]);


    let activeTeamData = null;
    if (!activeTeamsQuerySnap.empty) {
      const activeTeamDoc = activeTeamsQuerySnap.docs[0];
      const teamId = activeTeamDoc.id;

      const teamDocSnap = await firestore.collection('teams').doc(teamId).get();

      if (teamDocSnap.exists) {
        activeTeamData = teamDocSnap.data();
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      name: userData?.firstName || 'Anonymous',
      photoURL: userData?.photoURL || null,
      nickname: userData?.nickname || null,
      url: userData?.url || null,
      token: customToken,
      activeTeamId: activeTeamData?.id || null,
      urlTeam: activeTeamData?.url || null,
      nameTeam: activeTeamData?.name || null,
      logoTeam: activeTeamData?.logo || null,
    };
  } catch (error) {
    console.error('Error verifying or refreshing token: ', error);
    return null;
  }
};
