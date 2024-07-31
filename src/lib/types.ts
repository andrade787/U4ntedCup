import { ReactNode } from "react";

export interface activeTeam {
  id: string;
  teamId: string;
  joinedAt: string;
  status: string;
  leftAt?: string | null;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  senderId: string;
  receiverId: string;
  teamId?: string;
  additionalInfo?: string;
  isRead: boolean;
  createdAt: number;
}

export interface UserContextProps {
  user: User | null;
  notifications: Notification[];
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  nickname: string | null;
  url: string | null;
  token: string;
  activeTeamId: string | null;
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
  id: string;
  owner: string;
  name: string;
  createdAt: string;
  logo: string;
  privacy: string;
  url: string;
}

export interface TeamPlayers {
  signaturePlayer: string;
  playerId: string;
  capaUrl: string | null;
  createdAt: string;
  email: string;
  firstName: string;
  nickname: string;
  photoURL: string | null;
  roles: string[];
  url: string;
  leaveDate: string | null;
}

export interface TeamProviderProps {
  team: TeamInfos;
  user: User;
  team_players: TeamPlayers[];
  children: ReactNode;
}

export interface TeamContextProps {
  team: TeamInfos;
  user: User;
  team_players: TeamPlayers[];
  setTeamPlayers: React.Dispatch<React.SetStateAction<TeamPlayers[]>>;
}

export interface TeamProps {
  user: User;
  ValueUrl: string | null;
  team: TeamInfos;
  team_players: TeamPlayers[];
}
