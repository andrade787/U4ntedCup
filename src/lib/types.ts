import { ReactNode } from "react";

export interface activeTeam {
  id: string;
  teamId: string;
  joinedAt: string;
  status: string;
  leftAt?: string | null;
}

export interface Notification {
  notificationId: string;
  type: string;
  message: string;
  senderId: string;
  receiverId: string;
  teamId?: string;
  additionalInfo?: string[];
  isRead: boolean;
  createdAt: number;
}

export interface UserContextProps {
  user: User | null;
  notifications: Notification[];
  playerTeam: TeamInfos | null;
  playerTeamLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export interface User {
  uid: string;
  name: string;
  nickname: string;
  email: string;
  capaUrl: string;
  photoURL: string;
  number: string;
  signaturePlayer: string;
  url: string;
  createdAt: string;
  token: string;
}

export interface PlayerData {
  uid: string;
  firstName: string;
  photoURL: string;
  nickname: string;
  url: string;
  capaUrl: string;
  assinaturaPlayer: string;
}

export interface GameAccount {
  card: string;
  current_tier: string;
  current_tier_image: string;
  current_tier_triangle_up: string;
  highest_rank_patched_tier: string;
  highest_rank_season: string;
  highest_rank_tier: number;
  last_update: string;
  nick: string;
  puuid: string;
  recent_season: string;
  recent_season_number_of_games: number;
  recent_season_wins: number;
  region: string;
  role: string;
  tag: string;
}

export interface PlayerProps {
  playerData: PlayerData;
  user: User | null;
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
  email?: string;
  firstName: string;
  nickname: string;
  photoURL: string | null;
  roles: string[];
  url: string;
  joinedAt?: string;
  leaveDate?: string | null;
}

export interface TeamProviderProps {
  team: TeamInfos;
  user: User;
  players: TeamPlayers[];
  children: ReactNode;
}

export interface TeamContextProps {
  team: TeamInfos;
  user: User;
  players: TeamPlayers[];
  setTeamPlayers: React.Dispatch<React.SetStateAction<TeamPlayers[]>>;
}

export interface TeamProps {
  user: User;
  team: TeamInfos;
  players: TeamPlayers[];
}


export interface Tournament {
  id?: string;
  name: string;
  game: string;
  startDate: string;
  endDate: string;
  imageCamp: string;
  createdAt: string;
  status: 'upcoming' | 'finished' | 'ongoing';
  campUrl: string;
  teamsCount: number;
  prize?: number;
  broadcast?: string;
  registrationPrice?: number;
  statistics?: string;
  moderators?: string;
  discord?: string;
  pickbanSystem?: string;
  bestPlayerPrize?: string;
  mvpVoting?: string;
  inverseMvpVoting?: string;
  interviews?: string;
  highlights?: string;
}

export interface TournamentContextProps {
  tournament: Tournament | null;
  notFound: boolean;
  campUrl: string;
  user: User;
  tournamentTeams: TeamInfos[] | null;
  SoldOut: boolean;
  teamsRemaining: number;
  teamsWithPlayers: (TeamInfos & { players: TeamPlayers[] })[] | null;
  fetchPlayersForTeams: () => Promise<void>;
  loading: boolean;
  rules: string | null;
  fetchRules: (tournamentId: string) => Promise<void>;
}

export interface TournamentProviderProps {
  children: ReactNode;
  tournament: Tournament | null;
  notFound: boolean;
  campUrl: string;
  user: User;
}