// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import { admin, firestore } from "@/firebase/firebaseAdmin";
import { z, ZodError } from "zod";
import { Timestamp } from "firebase-admin/firestore";

const registerSchema = z.object({
  firstname: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
  assinaturaPlayer: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }).max(32, { message: "A assinatura não pode ter mais de 32 caracteres" }),
  email: z.string().email(),
  nick: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
  senha: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
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
    const { firstname, assinaturaPlayer, email, nick, senha } = data;
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
      firstName: firstname,
      assinaturaPlayer,
      email,
      nickname: nick,
      url: formattedNick,
      createdAt: Timestamp.now(), // Adiciona o campo createdAt
    };

    await firestore.collection('players').doc(userRecord.uid).set(userData);

    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({ token: customToken });

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

    // Para qualquer outro tipo de erro
    return res.status(500).json({ error: (error as Error).message });
  }
}
