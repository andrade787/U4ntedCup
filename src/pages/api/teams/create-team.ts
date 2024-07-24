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
  console.log('Iniciando upload do logo');
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
  console.log('Logo carregado com sucesso:', logoUrl);
  return logoUrl;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Recebendo requisição', req.method, req.url);

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar o formulário:', err);
      return res.status(500).json({ message: 'Erro ao processar o formulário' });
    }

    console.log('Formulário processado com sucesso', { fields, files });

    const teamName = Array.isArray(fields.teamName) ? fields.teamName[0] : fields.teamName;
    const role = Array.isArray(fields.role) ? fields.role[0] : fields.role;

    if (!teamName) {
      console.error('Nome do time inválido:', teamName);
      return res.status(400).json({ message: 'Nome do time inválido.' });
    }
    if (!role) {
      console.error('Função inválida:', role);
      return res.status(400).json({ message: 'Função inválida.' });
    }

    const logoFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;
    if (!logoFile) {
      console.error('Logo do time é obrigatório');
      return res.status(400).json({ message: 'Logo do time é obrigatório.' });
    }

    const parsedData = schema.safeParse({ teamName, logo: logoFile, role });
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map((error) => error.message);
      console.error('Erro de validação:', errors);
      return res.status(400).json({ message: errors[0] });
    }

    try {
      console.log('Verificando token do usuário');
      const uid = await verifyAndRefreshToken(req, res);
      if (!uid) {
        console.error('Usuário não autorizado');
        return res.status(401).json({ error: 'Não autorizado' });
      }

      console.log('Verificando se o usuário já possui um time');
      const userTeamsSnapshot = await firestore.collection('Teams').where('owner', '==', uid).get();
      if (!userTeamsSnapshot.empty) {
        console.error('Usuário já possui um time criado');
        return res.status(400).json({ message: 'Você já possui um time criado.' });
      }

      console.log('Verificando se já existe um time com este nome');
      const existingTeamSnapshot = await firestore.collection('Teams').where('name', '==', teamName).get();
      if (!existingTeamSnapshot.empty) {
        console.error('Já existe um time com este nome');
        return res.status(400).json({ message: 'Já existe um time com este nome.' });
      }

      console.log('Carregando logo do time');
      const logoUrl = await uploadLogo(logoFile);

      const teamId = nanoid();
      const teamUrl = teamName.replace(/[^a-zA-Z0-9_]/g, "_").replace(/\s/g, "_");
      console.log('Criando time no Firestore:', { teamId, teamName, logoUrl, teamUrl, uid, role });

      await firestore.collection('teams').doc(teamId).set({
        owner: uid,
        name: teamName,
        logo: logoUrl,
        privacy: 'private',
        url: teamUrl,
        players: [
          {
            playerId: uid,
            roles: [role],
          },
        ],
      });

      console.log('Time criado com sucesso:', teamUrl);
      return res.status(200).json({ url: teamUrl });
    } catch (error) {
      console.error('Erro ao criar time:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
}
