import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAndRefreshToken } from '@/utils/verifytoken';
import * as z from 'zod';
import { admin, firestore } from '@/firebase/firebaseAdmin'; // Certifique-se de ajustar o caminho conforme necessário

// Definindo o esquema de validação com zod
const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  tag: z.string().min(1, 'TAG é obrigatória'),
  role: z.string().min(1, 'Função é obrigatória'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const VerifyToken = await verifyAndRefreshToken(req as any, res as any);
      const uid = VerifyToken?.uid;

      if (!uid) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      // Validando o corpo da requisição
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Dados inválidos', details: result.error.errors });
      }

      const { name, tag, role } = result.data;
      const accountApiUrl = `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`;
      const accountResponse = await fetch(accountApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${process.env.VALORANT_API_TOKEN}`
        },
      });

      if (!accountResponse.ok) {
        const errorText = await accountResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          return res.status(accountResponse.status).json({ error: 'A API OFICIAL do Valorant está instável no momento. Por favor, tente novamente mais tarde!' });
        }

        const error = errorData.errors ? errorData.errors[0] : null;
        if (error && error.status === 404 && error.message === "Error while fetching needed match data to get players account level and more data") {
          return res.status(404).json({ error: 'Para adicionar sua conta, é necessário ter jogado pelo menos uma partida nos últimos 1-2 meses.' });
        }

        switch (error ? error.status : accountResponse.status) {
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
            return res.status(accountResponse.status).json({ error: error ? error.message : 'A API OFICIAL do Valorant está instável no momento. Por favor, tente novamente mais tarde!' });
        }
      }

      const accountData = await accountResponse.json();
      const { puuid, region, name: accountName, tag: accountTag, card } = accountData.data;

      const mmrApiUrl = `https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/${region}/${puuid}`;
      const mmrResponse = await fetch(mmrApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${process.env.VALORANT_API_TOKEN}`
        },
      });

      if (!mmrResponse.ok) {
        return res.status(mmrResponse.status).json({ error: 'Erro ao obter os dados de MMR. Por favor, tente novamente mais tarde!' });
      }

      const mmrData = await mmrResponse.json();
      const { current_data, highest_rank, by_season } = mmrData.data;
      const { images, currenttierpatched: current_tier } = current_data;

      // Encontrar a season mais recente em que o usuário jogou
      let recentSeasonData = null;
      let recentSeason = null;
      const seasons = Object.keys(by_season).sort().reverse(); // Ordena as seasons de forma decrescente
      for (const season of seasons) {
        const seasonData = by_season[season];
        if (seasonData.wins > 0 && seasonData.number_of_games > 0) {
          recentSeason = season;
          recentSeasonData = {
            wins: seasonData.wins,
            number_of_games: seasonData.number_of_games
          };
          break;
        }
      }

      // Salvar dados no Firestore
      await firestore
        .collection('players')
        .doc(uid)
        .collection('game_account')
        .doc('Valorant')
        .set({
          puuid,
          region,
          nick: accountName,
          tag: accountTag,
          role,
          card: card.large,
          current_tier,
          current_tier_image: images.large,
          current_tier_triangle_up: images.triangle_up,
          highest_rank_tier: highest_rank.tier,
          highest_rank_patched_tier: highest_rank.patched_tier,
          highest_rank_season: highest_rank.season,
          recent_season: recentSeason,
          recent_season_wins: recentSeasonData?.wins || null,
          recent_season_number_of_games: recentSeasonData?.number_of_games || null,
          last_update: admin.firestore.FieldValue.serverTimestamp(),
        });

      return res.status(200).json({ accountData, mmrData });
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
