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

    const customToken = await admin.auth().createCustomToken(uid);

    return {
      uid: user.uid,
      email: user.email,
      name: userData?.firstName || 'Anonymous',
      photoURL: userData?.photoURL || null,
      nickname: userData?.nickname || null,
      url: userData?.url || null,
      token: customToken,
    };
  } catch (error) {
    console.error('Error verifying or refreshing token: ', error);
    return null;
  }
};
