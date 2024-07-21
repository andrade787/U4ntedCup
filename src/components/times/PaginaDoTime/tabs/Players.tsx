import CardPlayers from "../Players/CardPlayers";
import LoadingCardPlayers from "../Players/LoadingCardPlayers";

export default function PlayersDoTime() {
  return (
    <div className="flex bg-zinc-800/20 backdrop-blur-xl rounded-xl p-4 mt-5 flex-col animate-in fade-in">
      <div className="mb-3">
        <h4>5 Players</h4>
      </div>
      <div className="space-y-4 animate-in fade-in-80">
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