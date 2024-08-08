import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { PlayerProps, PlayerData, TeamInfos, GameAccount } from '@/lib/types';
import { useRouter } from 'next/router';

interface Comment {
  id: string;
  UserComment: string | null;
  Comment: string;
  Created_at: { _seconds: number; _nanoseconds: number };
  nickname: string | null;
  photoURL: string;
}

interface PlayerContextProps {
  isOwner: boolean;
  playerData: PlayerData;
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  loading: boolean;
  handleTabClick: (tab: string) => void;
  tabRef: React.RefObject<HTMLDivElement>;
  Team: TeamInfos | null;
  TeamLoading: boolean;
  fetchGameAccounts: (playerId: string, fields?: string) => Promise<void>;
  gameAccount: GameAccount | null;
  gameAccountLoading: boolean;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

interface PlayerProviderProps {
  playerData: PlayerData;
  user: any;
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, playerData, user }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [Team, setTeam] = useState<TeamInfos | null>(null);
  const [hasTriedFetching, setHasTriedFetching] = useState(false);
  const [TeamLoading, setTeamLoading] = useState(false);
  const [gameAccount, setGameAccount] = useState<GameAccount | null>(null);
  const [gameAccountLoading, setGameAccountLoading] = useState(true);

  const router = useRouter();
  const tabRef = useRef<HTMLDivElement>(null);
  const isOwner = user && user.uid === playerData.uid;

  const fetchGameAccounts = useCallback(async (playerId: string) => {
    try {
      setGameAccountLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game_accounts/${playerId}`);
      if (!response.ok) {
        setGameAccountLoading(false);
      }
      const gameAccountsData = await response.json();
      setGameAccount(gameAccountsData['Valorant'])
      setGameAccountLoading(false);
    } catch (error) {
      console.error(error);
      setGameAccountLoading(false);
    }
  }, []);




  useEffect(() => {
    if (playerData) {
      const fetchPlayerTeam = async (playerData: PlayerData) => {
        try {
          setTeamLoading(true);
          const response = await fetch(`/api/player/${playerData.uid}/teams?status=active`);
          const TeamData = await response.json();
          if (response.ok && Array.isArray(TeamData) && TeamData.length > 0) {
            setTeam(TeamData[0]);
          } else {
            setTeam(null);
          }
        } catch (error) {
          setTeam(null);
        } finally {
          setTeamLoading(false);
          setHasTriedFetching(true);
        }
      };

      fetchPlayerTeam(playerData);

    }
  }, [playerData]);

  const handleTabClick = useCallback((tab: string) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, tab },
    }, undefined, { shallow: true });
    setTimeout(() => {
      if (tabRef.current) {
        tabRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [router]);

  return (
    <PlayerContext.Provider value={{ isOwner, playerData, Team, TeamLoading, comments, setComments, loading, handleTabClick, tabRef, fetchGameAccounts, gameAccount, gameAccountLoading }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
