import React, { useEffect, useState, useRef } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { LoadingRules } from './Loading';
import { Tournament } from '@/lib/types';
import { useSmoothScrollOnView } from '@/lib/SmoothScroll';

interface RulesProps {
  tournament: Tournament | null;
}

export default function Rules({ tournament }: RulesProps) {
  const { fetchRules, rules } = useTournament();
  const [error, setError] = useState<string | null>(null);
  const containerRef = useSmoothScrollOnView('.smooth');

  useEffect(() => {
    async function loadRules() {
      if (!tournament?.id) {
        return;
      }

      try {
        await fetchRules(tournament.id);
      } catch (error) {
        setError('Erro ao carregar as regras. Por favor, tente novamente mais tarde.');
      }
    }

    if (!rules) {
      loadRules();
    }
  }, [tournament?.id, fetchRules, rules]);


  return (
    <div ref={containerRef} className="bg-zinc-800 rounded-xl">
      <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl smooth">
        Regulamento do Campeonato
      </h2>
      <div className="p-4 space-y-4 text-zinc-300">
        {!rules && <LoadingRules />}
        {error && <div className="text-red-500">{error}</div>}
        {rules && (
          <div className='animate-in zoom-in' dangerouslySetInnerHTML={{ __html: rules }} />
        )}
      </div>
    </div>
  );
}
