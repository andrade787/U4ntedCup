// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import { admin, firestore } from "@/firebase/firebaseAdmin";
import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { z, ZodError } from "zod";
import cookie from "cookie";

const registerSchema = z.object({
  firstname: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
  email: z.string().email(),
  nick: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
  senha: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  number: z.string().min(10, { message: "Deve conter no mínimo 10 caracteres" }),
  confirmsenha: z.string(),
}).refine(data => data.senha === data.confirmsenha, {
  message: "As senhas não coincidem!",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const data = registerSchema.parse(req.body);
    const { firstname, email, number, nick, senha } = data;
    const formattedNick = nick.replace(/[^a-zA-Z0-9_]/g, "_").replace(/\s/g, "_");

    const userQuerySnapshot = await firestore.collection('players').where('nick', '==', nick).get();

    if (!userQuerySnapshot.empty) {
      return res.status(400).json({ error: "Já existe um usuário com esse nick" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password: senha,
      displayName: firstname,
    });

    const userData = {
      uid: userRecord.uid,
      firstName: firstname,
      nickname: nick,
      email,
      capaUrl: null,
      photoURL: null,
      number,
      assinaturaPlayer: 'eu sou o milhor',
      url: formattedNick,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await firestore.collection('players').doc(userRecord.uid).set(userData);


    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;

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



    res.status(200).json(userData);

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors.map(err => err.message).join(", ") });
    }

    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/email-already-exists':
          return res.status(400).json({ error: "O e-mail já está em uso" });
        case 'auth/invalid-email':
          return res.status(400).json({ error: "E-mail inválido" });
        case 'auth/weak-password':
          return res.status(400).json({ error: "A senha é muito fraca" });
        default:
          return res.status(500).json({ error: "Erro no servidor, tente novamente mais tarde" });
      }
    }

    return res.status(500).json({ error: (error as Error).message });
  }
}
