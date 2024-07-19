import { GetServerSidePropsContext } from "next";
import { firestore, admin } from "@/firebase/firebaseAdmin";
import { verifyAndRefreshToken } from "@/utils/verifytoken";

export const withUser = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  try {
    const uid = await verifyAndRefreshToken(req as any, res as any);

    if (!uid) {
      return null;
    }

    const user = await admin.auth().getUser(uid);

    // Fetch additional user data from Firestore
    const userDocRef = firestore.collection('users').doc(user.uid);
    const userDocSnap = await userDocRef.get();
    const userData = userDocSnap.exists ? userDocSnap.data() : {};

    return {
      uid: user.uid,
      email: user.email,
      name: userData?.firstName || "Anonymous",
      photoURL: userData?.photoURL || null,
      nickname: userData?.nickname || null,
      url: userData?.url || null,
    };
  } catch (error) {
    console.log("Error verifying or refreshing token: ", error);
    return null;
  }
};
