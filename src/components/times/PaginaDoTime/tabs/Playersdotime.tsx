import { AddPlayerTime } from "../Players/AddPlayer/AddPlayer";
import CardPlayerInvite from "../Players/CardPlayerInvite";
import CardPlayers from "../Players/CardPlayers";
import LoadingCardPlayers from "../Players/LoadingCardPlayers";

export default function PlayersDoTime() {
  return (
    <div className="flex bg-zinc-800/20 backdrop-blur-xl rounded-xl p-4 gap-5 mt-5 flex-col animate-in fade-in">
      <div className='flex justify-between items-center flex-1 bg-zinc-900/50 rounded-xl border p-2 transition-colors animate-in zoom-in-90'>
        <div>
          <h2 className='text-2xl font-semibold'>Players do time</h2>
          <p className='text-sm text-zinc-300'>Confira todos os jogadores do time</p>
        </div>
        <AddPlayerTime />
      </div>
      <div className="space-y-4 animate-in zoom-in">
        <CardPlayerInvite />
        <CardPlayerInvite />

        <LoadingCardPlayers />
        <CardPlayers
          imageSrc="/assets/images/tag_novo_tapa_buraco.jpg"
          imageHref="#"
          playerName="Nome do Player"
          role="Controlador"
          isOwner={true}
        />
        <CardPlayers
          imageSrc="/assets/images/tag_novo_tapa_buraco.jpg"
          imageHref="#"
          playerName="Nome do Player"
          role="Controlador"
        />


      </div>
    </div>
  );
}