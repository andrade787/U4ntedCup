import React from 'react';
import { Tournament } from "@/lib/types";
import { Users, Trophy, Twitch, Calendar, DollarSign, BarChart2, MessageCircle, Server, Monitor, Award, ThumbsUp, ThumbsDown, Mic } from "lucide-react";
import InfoCard from './cards/InfoCard';

export default function Infos({ tournament }: { tournament: Tournament | null }) {
  if (tournament) {
    return (
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl">Informações do Campeonato</h2>
        <div className="grid grid-cols-2 gap-5 p-4">
          {tournament.teamsCount !== undefined && (
            <InfoCard icon={<Users size={18} />} title="Times" content={`${tournament.teamsCount} Times`} />
          )}
          {tournament.startDate && tournament.endDate && (
            <InfoCard
              icon={<Calendar size={18} />}
              title="Datas"
              content={`De ${new Date(tournament.startDate).toLocaleDateString()} até ${new Date(tournament.endDate).toLocaleDateString()}`}
            />
          )}
          {tournament.prize !== undefined && (
            <InfoCard icon={<Trophy size={18} />} title="Premiação" content={`R$ ${tournament.prize}`} />
          )}
          {tournament.broadcast && (
            <InfoCard icon={<Twitch size={18} />} title="Transmissão" content={tournament.broadcast} />
          )}
          {tournament.registrationPrice && (
            <InfoCard
              icon={<DollarSign size={18} />}
              title="Inscrição"
              content={`R$ ${tournament.registrationPrice / 5} por pessoa (R$ ${tournament.registrationPrice} por time)`}
            />
          )}
          {tournament.statistics && (
            <InfoCard icon={<BarChart2 size={18} />} title="Estatísticas" content={tournament.statistics} />
          )}
          {tournament.moderators && (
            <InfoCard icon={<MessageCircle size={18} />} title="Moderadores" content={tournament.moderators} />
          )}
          {tournament.discord && (
            <InfoCard icon={<Server size={18} />} title="Discord" content={tournament.discord} />
          )}
          {tournament.pickbanSystem && (
            <InfoCard icon={<Monitor size={18} />} title="Pickban" content={tournament.pickbanSystem} />
          )}
          {tournament.bestPlayerPrize && (
            <InfoCard icon={<Award size={18} />} title="Melhor Jogador" content={tournament.bestPlayerPrize} />
          )}
          {tournament.mvpVoting && (
            <InfoCard icon={<ThumbsUp size={18} />} title="Votação MVP" content={tournament.mvpVoting} />
          )}
          {tournament.inverseMvpVoting && (
            <InfoCard icon={<ThumbsDown size={18} />} title="MVP Inverso" content={tournament.inverseMvpVoting} />
          )}
          {tournament.interviews && (
            <InfoCard icon={<Mic size={18} />} title="Entrevistas" content={tournament.interviews} />
          )}
          {tournament.highlights && (
            <InfoCard icon={<Monitor size={18} />} title="Melhores Momentos" content={tournament.highlights} />
          )}
        </div>
      </div>
    );
  }
}
