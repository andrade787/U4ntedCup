import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import { firestore } from '@/firebase/firebaseAdmin';

// Schema for request validation
const schema = z.object({
  id: z.string(),
  name: z.string()
    .min(2, { message: "O Nome do Time é obrigatório" })
    .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Nome do Time deve conter apenas letras, números, espaços, underscores ou hifens" }),
  privacy: z.enum(['public', 'private'])
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Parse and validate request data
    const parsedData = schema.parse(req.body);

    const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
    const uid = VerifyToken?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const teamRef = firestore.collection('teams').doc(parsedData.id);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Time não encontrado' });
    }

    const team = teamDoc.data();
    if (!team) {
      return res.status(404).json({ error: 'Time não encontrado' });
    }

    if (team.owner !== uid) {
      return res.status(403).json({ error: 'Usuário não autorizado a modificar este time' });
    }

    // Verificar se os dados realmente mudaram
    const isNameChanged = team.name !== parsedData.name;
    const isPrivacyChanged = team.privacy !== parsedData.privacy;

    if (!isNameChanged && !isPrivacyChanged) {
      return res.status(400).json({ error: 'Nenhuma alteração detectada' });
    }

    if (isNameChanged) {
      const existingTeamSnapshot = await firestore.collection('teams').where('name', '==', parsedData.name).get();
      if (!existingTeamSnapshot.empty) {
        return res.status(400).json({ error: 'Já existe um time com este nome.' });
      }
    }

    const teamUrl = parsedData.name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/\s/g, "_");

    // Update team in Firestore
    await teamRef.update({
      name: parsedData.name,
      url: teamUrl,
      privacy: parsedData.privacy
    });

    res.status(200).json({ message: 'Alterações salvas com sucesso', url: teamUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao atualizar o time:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

