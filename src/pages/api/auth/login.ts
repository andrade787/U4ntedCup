// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import cookie from "cookie";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const firebaseErrors: { [key: string]: string } = {
  "auth/invalid-email": "Email inválido.",
  "auth/user-disabled": "Usuário desabilitado.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/email-already-in-use": "Email já está em uso.",
  "auth/operation-not-allowed": "Operação não permitida.",
  "auth/weak-password": "Senha fraca.",
  "auth/network-request-failed": "Falha na solicitação de rede.",
  "auth/invalid-credential": "Email ou senha inválidos"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessages });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;

    const userDocRef = doc(firestore, "players", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return res.status(404).json({ error: "Dados do usuário não encontrados" });
    }

    const userData = userDocSnap.data();

    res.setHeader("Set-Cookie", [
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 15,
        sameSite: "strict",
        path: "/",
      }),
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 15,
        sameSite: "strict",
        path: "/",
      })
    ]);

    res.status(200).json({
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        nickname: userData.nickname,
        url: userData.url,
      },
    });
  } catch (error: any) { // Adicionando tipagem explícita para 'error'
    const errorMessage = firebaseErrors[error.code] || "Erro desconhecido";
    res.status(401).json({ error: errorMessage });
  }
}
