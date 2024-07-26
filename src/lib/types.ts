import { ReactNode } from "react";

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  nickname: string | null;
  url: string | null;
}

export interface PlayerData {
  id: string;
  name: string;
  photoURL: string;
  nickname: string;
  url: string;
  cs2: boolean;
  valorant: boolean;
  capaUrl: string;
  assinaturaPlayer: string;
  gameAccounts: { [key: string]: any } | null;
}

export interface PlayerProps {
  playerData: PlayerData;
  user: User | null;
  gameData?: any;
  isOwner?: boolean | null;
}



export interface TeamInfos {
  owner: string;
  name: string;
  logo: string;
  privacy: string;
  url: string;
  players: [
    playerId: string,
    roles: string[]
  ];
}

export interface TeamProviderProps {
  team: TeamInfos;
  user: any | null;
  children: ReactNode;
}

export interface TeamContextProps {
  team: TeamInfos;
  user?: any | null;
  updateTeam: (updates: Partial<TeamInfos>) => void;
}

export interface TeamProps {
  user: User;
  ValueUrl: string | null;
  team: TeamInfos;
  isOwner: boolean;
}
