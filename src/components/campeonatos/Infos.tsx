import { Users, Trophy, Twitch, Calendar, DollarSign, BarChart2, MessageCircle, Server, Monitor, Award, ThumbsUp, ThumbsDown, Mic } from "lucide-react";

export default function Infos() {
  return (
    <div className="bg-zinc-800 rounded-xl">
      <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl">Informações do Campeonato</h2>
      <div className="grid grid-cols-2 gap-5 p-4">
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Users size={18} /> Times</h3>
          <p className="text-zinc-300">10 Times</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Calendar size={18} /> Datas</h3>
          <p className="text-zinc-300">De 19/08 até 25/08</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Trophy size={18} /> Premiação</h3>
          <p className="text-zinc-300">R$ 430</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Twitch size={18} /> Transmissão</h3>
          <p className="text-zinc-300">Partidas da fase de grupos e playoffs transmitidas ao vivo pela Twitch</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><DollarSign size={18} /> Inscrição</h3>
          <p className="text-zinc-300">R$ 17 por pessoa (R$ 85 por time)</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><BarChart2 size={18} /> Estatísticas</h3>
          <p className="text-zinc-300">Estatísticas detalhadas de cada jogador de todas as partidas no site</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><MessageCircle size={18} /> Moderadores</h3>
          <p className="text-zinc-300">Acesso direto com os moderadores</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Server size={18} /> Discord</h3>
          <p className="text-zinc-300">Discord personalizado para o campeonato</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Monitor size={18} /> Pickban</h3>
          <p className="text-zinc-300">Sistema de pickban personalizado</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Award size={18} /> Melhor Jogador</h3>
          <p className="text-zinc-300">Premiação para o melhor jogador do campeonato</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><ThumbsUp size={18} /> Votação MVP</h3>
          <p className="text-zinc-300">Votação de MVP da partida durante a live</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><ThumbsDown size={18} /> MVP Inverso</h3>
          <p className="text-zinc-300">Votação do pior jogador da partida durante a live</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Mic size={18} /> Entrevistas</h3>
          <p className="text-zinc-300">Entrevista com jogadores pós partidas</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          <h3 className="font-semibold flex items-center gap-1"><Monitor size={18} /> Melhores Momentos</h3>
          <p className="text-zinc-300">Melhores Momentos nas redes sociais de todos os jogos</p>
        </div>
      </div>
    </div>
  );
}