import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import * as z from 'zod';
import { firestore } from '@/firebase/firebaseAdmin'; // Certifique-se de ajustar o caminho conforme necessário

// Definindo o esquema de validação com zod
const schema = z.object({
  role: z.string().min(1, 'Função é obrigatória'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uid = await verifyAndRefreshToken(req, res);
    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    switch (req.method) {
      case 'DELETE':
        return handleDelete(req, res, uid);
      case 'PUT':
        return handlePut(req, res, uid);
      default:
        res.setHeader('Allow', ['DELETE', 'PUT']);
        return res.status(405).end(`Método ${req.method} não permitido`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Ocorreu um erro desconhecido' });
    }
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, uid: string) {
  const { name, tag } = req.body;

  // Validando os parâmetros necessários
  if (!name || !tag) {
    return res.status(400).json({ error: 'Nome e TAG são obrigatórios para deletar a conta' });
  }

  await firestore
    .collection('users')
    .doc(uid)
    .collection('game_account')
    .doc('Valorant')
    .delete();

  return res.status(200).json({ message: 'Conta deletada com sucesso' });
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, uid: string) {
  // Validando o corpo da requisição
  const result = schema.pick({ role: true }).safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Dados inválidos', details: result.error.errors });
  }

  const { role } = result.data;

  // Atualizar apenas o campo role no Firestore
  await firestore
    .collection('users')
    .doc(uid)
    .collection('game_account')
    .doc('Valorant')
    .update({
      role,
    });

  return res.status(200).json({ message: 'Função atualizada com sucesso' });
}
