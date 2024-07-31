// utils/auth.ts
import { admin } from '@/firebase/firebaseAdmin';
import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

interface FirebaseError extends Error {
  code: string;
}

export async function verifyAndRefreshToken(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;
  const refreshToken = cookies.refreshToken;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Retorna o uid e o token atual sem mudanças
    return { uid: decodedToken.uid, token: token };
  } catch (err) {
    const error = err as FirebaseError;
    if (error.code === 'auth/id-token-expired' && refreshToken) {
      try {
        const newIdToken = await refreshIdToken(refreshToken);
        const decodedToken = await admin.auth().verifyIdToken(newIdToken);

        res.setHeader('Set-Cookie', cookie.serialize('token', newIdToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: '/',
        }));

        return { uid: decodedToken.uid, token: newIdToken };
      } catch (refreshError) {
        return null;
      }
    } else {
      return null;
    }
  }
}

async function refreshIdToken(refreshToken: string) {
  try {
    const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    if (response.data && response.data.id_token) {
      return response.data.id_token;
    } else {
      throw new Error('Resposta inválida ao atualizar o token');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error('Erro ao atualizar o token');
    } else {
      throw err;  // Alterado para lançar o erro capturado
    }
  }
}
