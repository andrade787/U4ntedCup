import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { PlayerProps, PlayerData } from '@/lib/types';
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
  const router = useRouter();
  const tabRef = useRef<HTMLDivElement>(null);
  const isOwner = user && playerData && user.uid === playerData.id;

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
    <PlayerContext.Provider value={{ isOwner, playerData, comments, setComments, loading, handleTabClick, tabRef }}>
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
