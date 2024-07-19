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
