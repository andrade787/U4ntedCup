import { NextApiRequest, NextApiResponse } from "next";
import { admin } from "@/firebase/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Token não encontrado" });
    }

    // Verifique o token e obtenha o UID do usuário
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // (Opcional) Revogue tokens de atualização se você quiser deslogar o usuário de todos os dispositivos
    await admin.auth().revokeRefreshTokens(uid);

    // Limpar cookies de autenticação para efetuar logout
    res.setHeader("Set-Cookie", [
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1,
        sameSite: "strict",
        path: "/",
      }),
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1,
        sameSite: "strict",
        path: "/",
      }),
    ]);

    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
