import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogOverlay, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Settings, Sparkle, UsersRound } from "lucide-react";
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TeamInfos, TeamPlayers, User } from "@/lib/types";

interface MyTeamPlayerProps {
  user: User;
  team: TeamInfos;
  players: TeamPlayers[];
}

export default function MyTeamPlayer({ user, team, players }: MyTeamPlayerProps) {
  const playerCount = Object.keys(players).length;
  const user_player = Object.values(players).find(player => player.playerId === user.uid);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' className="flex items-center gap-1 w-full animate-in zoom-in"><Settings size={20} /> Meu Time</Button>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seu Time</DialogTitle>
            <DialogDescription>
              Detalhes sobre o seu time
            </DialogDescription>
          </DialogHeader>

          <h3 className="flex items-center gap-1 mt-2 text-lg font-semibold"><Sparkle size={15} />Informações do time</h3>

          <div className="grid grid-cols-3">
            <h3 className="flex col-span-1 text-sm">Nome do time</h3>
            <p className="col-span-2 text-zinc-400 text-sm">{team.name}</p>
          </div>

          <div className="grid grid-cols-3">
            <h3 className="flex col-span-1 text-sm">Players</h3>
            <p className="col-span-2 text-zinc-400 text-sm">{playerCount}</p>
          </div>

          <div className="grid grid-cols-3">
            <h3 className="flex col-span-1 text-sm">Criado em</h3>
            <p className="col-span-2 text-zinc-400 text-sm">{format(new Date(team.createdAt), "dd/MM/yyyy 'às' HH:mm'H'", { locale: ptBR })}</p>
          </div>

          <hr />

          <h3 className="flex items-center gap-1 mt-2 text-lg font-semibold"><UsersRound size={15} />Suas Informações</h3>
          <div className="grid grid-cols-3">
            <h3 className="flex col-span-1 text-sm">Função</h3>
            <p className="col-span-2 text-zinc-400 text-sm">{user_player?.roles.join(', ')}</p>
          </div>
          <div className="grid grid-cols-3">
            <h3 className="flex col-span-1 text-sm">Ingressou em</h3>
            {user_player?.createdAt && <p className="col-span-2 text-zinc-400 text-sm">{format(new Date(user_player.createdAt), "dd/MM/yyyy 'às' HH:mm'H'", { locale: ptBR })}</p>}
          </div>

        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}