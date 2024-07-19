import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import * as z from 'zod';
import { firestore } from '@/firebase/firebaseAdmin'; // Certifique-se de ajustar o caminho conforme necessário
import * as admin from 'firebase-admin';

// Definindo o esquema de validação com zod
const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  tag: z.string().min(1, 'TAG é obrigatória'),
  role: z.string().min(1, 'Função é obrigatória'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const uid = await verifyAndRefreshToken(req, res);
      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      // Validando o corpo da requisição
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Dados inválidos', details: result.error.errors });
      }

      const { name, tag, role } = result.data;
      const apiUrl = `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${process.env.VALORANT_API_TOKEN}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          return res.status(response.status).json({ error: 'A API do Valorant está instável no momento. Por favor, tente novamente mais tarde!' });
        }

        const error = errorData.errors ? errorData.errors[0] : null;
        switch (error ? error.status : response.status) {
          case 400:
            return res.status(400).json({ error: 'Solicitação inválida' });
          case 403:
            return res.status(403).json({ error: 'Acesso negado' });
          case 404:
            return res.status(404).json({ error: 'Esse nick e tag não foram encontrados. Por favor, verifique e tente novamente!' });
          case 408:
            return res.status(408).json({ error: 'Tempo de solicitação esgotado. Por favor, tente novamente mais tarde!' });
          case 429:
            return res.status(429).json({ error: 'Muitas solicitações. Por favor, tente novamente mais tarde!' });
          case 500:
            return res.status(500).json({ error: 'Erro interno do servidor. Por favor, tente novamente mais tarde!' });
          case 501:
            return res.status(501).json({ error: 'Não implementado. Por favor, tente novamente mais tarde!' });
          case 503:
            return res.status(503).json({ error: 'API do valorant indisponível. Por favor, tente novamente mais tarde!' });
          default:
            return res.status(response.status).json({ error: error ? error.message : 'Erro desconhecido' });
        }
      }

      const data = await response.json();

      // Extraindo os dados necessários da resposta
      const { puuid, name: accountName, tag: accountTag } = data.data;

      // Salvar dados no Firestore
      await firestore
        .collection('users')
        .doc(uid)
        .collection('game_account')
        .doc('Valorant')
        .set({
          puuid,
          nick: accountName,
          tag: accountTag,
          role,
        });

      return res.status(200).json(data);
    } catch (error) {
      // Verificar se o erro é uma instância de Error
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        // Caso contrário, enviar uma mensagem genérica
        return res.status(500).json({ error: 'Ocorreu um erro desconhecido' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
