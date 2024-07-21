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
    // Token não fornecido, retorne null indicando que o usuário não está logado
    return null;
  }

  try {
    // Verifique o token e obtenha o UID do usuário
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (err) {
    const error = err as FirebaseError;
    if (error.code === 'auth/id-token-expired' && refreshToken) {
      // O token expirou, tente atualizar o token com o refresh token
      try {
        const newIdToken = await refreshIdToken(refreshToken);
        const decodedToken = await admin.auth().verifyIdToken(newIdToken);

        // Defina o novo token no cookie
        res.setHeader('Set-Cookie', cookie.serialize('token', newIdToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: '/',
        }));

        return decodedToken.uid;
      } catch (refreshError) {
        return null; // Retorne null se não for possível atualizar o token
      }
    } else {
      return null; // Retorne null se o token não for válido
    }
  }
}

async function refreshIdToken(refreshToken: string) {
  try {
    const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`, {
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
      return null;
    } else {
      return null; // Retorne null se não for possível atualizar o token
    }
    throw new Error('Erro ao atualizar o token');
  }
}
