import { TeamInfos, TeamPlayers, User } from "@/lib/types";
import { AddPlayerTime } from "../Players/AddPlayer/AddPlayer";
import CardPlayerInvite from "../Players/CardPlayerInvite";
import CardPlayers from "../Players/CardPlayers";

interface PlayersDoTimeProps {
  team_players: TeamPlayers[];
  user: User;
  team: TeamInfos;
}

export default function PlayersDoTime({ team_players, user, team }: PlayersDoTimeProps) {
  let IsOwner = null;
  if (user && team.owner === user.uid) {
    IsOwner = user.uid;
  }
  if (!Array.isArray(team_players)) {
    return <p className='text-center text-zinc-300'>Nenhum jogador encontrado.</p>;
  }

  // Filtrar os jogadores que não são o dono nem o usuário logado
  const remainingPlayers = team_players.filter(player => player.playerId !== team.owner && player.playerId !== user?.uid);

  // Ordenar os jogadores restantes pela data de criação (mais antigos primeiro)
  remainingPlayers.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

  // Inserir o dono do time na primeira posição
  const orderedPlayers = [];
  const ownerPlayer = team_players.find(player => player.playerId === team.owner);
  if (ownerPlayer) {
    orderedPlayers.push(ownerPlayer);
  }

  // Inserir o usuário logado na segunda posição
  if (user) {
    const loggedInPlayer = team_players.find(player => player.playerId === user.uid);
    if (loggedInPlayer && loggedInPlayer.playerId !== team.owner) {
      orderedPlayers.push(loggedInPlayer);
    }
  }

  // Adicionar os jogadores restantes ordenados
  orderedPlayers.push(...remainingPlayers);

  return (
    <div className="flex bg-zinc-800/20 backdrop-blur-xl rounded-xl p-4 gap-5 mt-5 flex-col animate-in fade-in">
      <div className='flex justify-between items-center flex-1 bg-zinc-900/50 rounded-xl border p-2 transition-colors animate-in zoom-in-90'>
        <div>
          <h2 className='text-2xl font-semibold'>Players do time</h2>
          <p className='text-sm text-zinc-300'>Confira todos os jogadores do time</p>
        </div>
        {IsOwner && <AddPlayerTime team_players={team_players} user={user} team={team} />}
      </div>
      <div className="space-y-4 animate-in zoom-in">
        {IsOwner && team.privacy == 'public' && <CardPlayerInvite />}
        <div className='space-y-5'>
          {orderedPlayers.length > 0 ? (
            orderedPlayers.map((player) => (
              <CardPlayers key={player.playerId} player={player} team={team} isOwner={IsOwner} user={user} />
            ))
          ) : (
            <p className='text-center text-zinc-300'>Nenhum jogador encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
