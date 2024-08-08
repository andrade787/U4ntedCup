import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TeamInfos, Tournament, User, TournamentContextProps, TournamentProviderProps, TeamPlayers } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from './UserContext';

const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children, tournament, notFound, campUrl, user }) => {
  const { setUser } = useUser();
  const [tournamentTeams, setTournamentTeams] = useState<TeamInfos[] | null>(null);
  const [teamsWithPlayers, setTeamsWithPlayers] = useState<(TeamInfos & { players: TeamPlayers[] })[] | null>(null);
  const [rules, setRules] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  let SoldOut = false;
  let teamsRemaining = 0;

  if (tournament && tournamentTeams) {
    SoldOut = tournamentTeams.length >= tournament.teamsCount;
    teamsRemaining = tournament.teamsCount - tournamentTeams.length;
  }

  useEffect(() => {
    const fetchTournamentTeams = async (tournament: Tournament) => {
      try {
        const response = await fetch(`/api/tournament_teams/${tournament.id}`);
        const tournament_teams = await response.json();
        setTournamentTeams(tournament_teams);
      } catch (error) {
        toast({
          title: "Ocorreu um erro",
          description: "Não foi possível obter os times do campeonato. Algumas informações não estarão disponíveis!"
        });
      }
    };

    if (tournament) {
      fetchTournamentTeams(tournament);
    }
  }, [tournament, toast]);

  const fetchPlayersForTeams = useCallback(async () => {
    if (!tournamentTeams) return;

    setLoading(true);

    const fetchPlayersByTeamId = async (teamId: string) => {
      try {
        const response = await fetch(`/api/teams/${teamId}/players?type=active`);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        return await response.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const teamsWithPlayersData = await Promise.all(
      tournamentTeams.map(async (team) => {
        const players = await fetchPlayersByTeamId(team.id);
        return { ...team, players };
      })
    );

    setTeamsWithPlayers(teamsWithPlayersData);
    setLoading(false);
  }, [tournamentTeams]);

  const fetchRules = useCallback(async (tournamentId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/rules`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar as regras. Por favor, tente novamente mais tarde.`);
      }
      const data = await response.json();
      if (data.length > 0 && data[0].rulesHtml) {
        setRules(data[0].rulesHtml);
      } else {
        setRules('<p>Não há regras disponíveis para este torneio.</p>');
      }
    } catch (error) {
      setRules('Erro ao carregar as regras. Por favor, tente novamente mais tarde.');
    }
  }, []);

  return (
    <TournamentContext.Provider value={{
      tournament,
      notFound,
      campUrl,
      user,
      rules,
      fetchRules,
      tournamentTeams,
      SoldOut,
      teamsRemaining,
      teamsWithPlayers,
      fetchPlayersForTeams,
      loading
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
