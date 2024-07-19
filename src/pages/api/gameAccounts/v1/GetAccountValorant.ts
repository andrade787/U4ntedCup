import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Schema para validar os parâmetros da requisição
const RequestBodySchema = z.object({
  region: z.string(),
  name: z.string(),
  tag: z.string(),
});

// Schema para validar a resposta da API de conta
const AccountResponseSchema = z.object({
  data: z.object({
    card: z.object({
      small: z.string().url(),
      large: z.string().url(),
    }),
  }),
});

// Schema para validar a resposta da API de MMR
const MMRResponseSchema = z.object({
  data: z.object({
    current_data: z.object({
      currenttierpatched: z.string(),
    }),
    by_season: z.record(z.object({
      wins: z.number().optional(),
      number_of_games: z.number().optional(),
      error: z.string().optional(),
    })),
  }),
});

type AccountResponse = z.infer<typeof AccountResponseSchema>;
type MMRResponse = z.infer<typeof MMRResponseSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validação dos parâmetros da requisição
  const parseResult = RequestBodySchema.safeParse(req.body);

  if (!parseResult.success) {
    console.log(parseResult);
    return res.status(400).json({ error: 'Invalid request body', details: parseResult.error.errors });
  }

  const { region, name, tag } = parseResult.data;

  try {
    const headers = {
      'Authorization': `${process.env.VALORANT_API_TOKEN}`,
    };

    // Fetch account data
    const accountResponse = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
      method: 'GET',
      headers: headers,
    });
    const accountData: AccountResponse = await accountResponse.json();
    console.log('Account Data:', accountData);

    // Validate account data
    AccountResponseSchema.parse(accountData);

    // Fetch MMR data
    const mmrResponse = await fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${name}/${tag}`, {
      method: 'GET',
      headers: headers,
    });
    const mmrData: MMRResponse = await mmrResponse.json();
    console.log('MMR Data:', mmrData);

    // Validate MMR data
    MMRResponseSchema.parse(mmrData);

    if (accountData.data && mmrData.data) {
      const seasons = Object.keys(mmrData.data.by_season);
      const validSeason = seasons.reverse().find(season => !mmrData.data.by_season[season].error);

      if (validSeason) {
        const latestSeasonData = mmrData.data.by_season[validSeason];

        const result = {
          card: {
            large: accountData.data.card.large,
            small: accountData.data.card.small,
          },
          currenttier_patched: mmrData.data.current_data.currenttierpatched,
          season: {
            wins: latestSeasonData.wins,
            number_of_games: latestSeasonData.number_of_games,
            season_name: validSeason,
          },
        };

        // Set cache headers for client-side caching
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // 1 day cache

        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'No valid season data found' });
      }
    } else {
      return res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return res.status(400).json({ error: 'Invalid data format', details: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
