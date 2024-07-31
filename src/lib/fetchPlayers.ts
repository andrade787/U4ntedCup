// fetchPlayers.ts
import { TeamPlayers, User } from "@/lib/types";

interface PlayerState {
  players: TeamPlayers[];
  loading: boolean;
  userTeam: boolean;
}

export const fetchPlayers = async (
  teamId: string,
  user: User | null,
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>,
  teamOwner: string,
  teamPrivacy: string
) => {
  setPlayerState((prevState: PlayerState) => ({ ...prevState, loading: true }));
  try {
    const response = await fetch(`/api/teams/${teamId}/players`);
    const data = await response.json();
    const playersData: TeamPlayers[] = data.players.map((player: any) => ({
      playerId: player.playerId,
      PlayerOwner: player.playerId === teamOwner,
      owner: teamOwner,
      nickname: player.nickname,
      createdAt: player.createdAt,
      photoURL: player.photoURL || "/assets/images/default-avatar.png",
      roles: player.roles,
      privacy: teamPrivacy,
      url: player.url,
    }));

    let userTeam = false;
    if (user && user.uid) {
      userTeam = playersData.some((player) => player.playerId === user.uid);
    }

    setPlayerState({ players: playersData, loading: false, userTeam });
  } catch (error) {
    console.error('Erro ao carregar jogadores:', error);
    setPlayerState({ players: [], loading: false, userTeam: false });
  }
};
