import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { firestore, storage } from '@/firebase/firebaseAdmin';
import formidable from 'formidable';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { verifyAndRefreshToken } from '@/utils/verifytoken';

const schema = z.object({
  teamName: z.string()
    .min(2, { message: "O Nome do Time é obrigatório" })
    .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Nome do Time deve conter apenas letras, números, espaços, underscores ou hifens" }),
  logo: z.custom<formidable.File>((file) => file instanceof Object && 'filepath' in file, {
    message: "O logo do time é obrigatório"
  }).refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "A logo deve ter no máximo 2MB"
  }).refine((file) => typeof file.mimetype === 'string' && ["image/webp", "image/png", "image/jpg", "image/jpeg"].includes(file.mimetype), {
    message: "Formato de arquivo não suportado. Use webp, png, jpg ou jpeg"
  }),
  role: z.string().min(1, { message: "A função é obrigatória" })
});

const uploadLogo = async (file: formidable.File): Promise<string> => {
  const buffer = await sharp(file.filepath ?? '')
    .resize(200, 200)
    .webp()
    .toBuffer();

  const fileName = `LogoTeam/${nanoid()}.webp`;
  const fileRef = storage.file(fileName);

  await fileRef.save(buffer, {
    contentType: 'image/webp',
    public: true,
  });

  const logoUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;
  return logoUrl;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
  const uid = VerifyToken?.uid;

  if (!uid) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao processar o formulário' });
    }

    const teamName = Array.isArray(fields.teamName) ? fields.teamName[0] : fields.teamName;
    const role = Array.isArray(fields.role) ? fields.role[0] : fields.role;

    if (!teamName) {
      return res.status(400).json({ message: 'Nome do time inválido.' });
    }
    if (!role) {
      return res.status(400).json({ message: 'Função inválida.' });
    }

    const logoFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;
    if (!logoFile) {
      return res.status(400).json({ message: 'Logo do time é obrigatório.' });
    }

    const parsedData = schema.safeParse({ teamName, logo: logoFile, role });
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map((error) => error.message);
      return res.status(400).json({ message: errors[0] });
    }

    try {
      const userTeamsSnapshot = await firestore.collection('teams').where('owner', '==', uid).get();
      if (!userTeamsSnapshot.empty) {
        return res.status(400).json({ message: 'Você já possui um time criado.' });
      }

      const existingTeamSnapshot = await firestore.collection('teams').where('name', '==', teamName).get();
      if (!existingTeamSnapshot.empty) {
        return res.status(400).json({ message: 'Já existe um time com este nome.' });
      }

      const logoUrl = await uploadLogo(logoFile);

      const teamId = nanoid();
      const teamUrl = teamName.replace(/[^a-zA-Z0-9_]/g, "_").replace(/\s/g, "_");

      // Create the team document
      await firestore.collection('teams').doc(teamId).set({
        id: teamId,
        name: teamName,
        logo: logoUrl,
        url: teamUrl,
        privacy: 'private',
        owner: uid,
      });

      // Add player to the team's players subcollection
      await firestore.collection('teams').doc(teamId).collection('players').doc(uid).set({
        playerId: uid,
        roles: [role],
        createdAt: new Date(),
        status: 'active',
        leaveDate: null,
      });

      // Ensure the player document exists in the players collection
      const playerDocRef = firestore.collection('players').doc(uid);
      await playerDocRef.collection('teams').doc(teamId).set({
        teamId: teamId,
        joinedAt: new Date(),
        status: 'active',
        leftAt: null,
      });

      return res.status(200).json({ url: teamUrl });
    } catch (error) {
      console.error('Erro ao criar time:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
}
