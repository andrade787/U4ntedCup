import React from "react";
import { AlertCircle, Award, Frown, Gamepad2 } from "lucide-react";
import { EditContasdeJogos } from "./edit/EditContasdeJogos";
import { AddConta } from "./edit/AddConta";
import { ValorantIcon } from "../icons";
import { usePlayer } from '@/context/PlayerContext';
import Image from "next/image";
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'


const ContasDeJogos = () => {
  const { playerData, isOwner } = usePlayer();
  const valorantAccount = playerData?.gameAccounts?.Valorant;

  return (
    <>
      {playerData?.gameAccounts ? (
        <div className='flex justify-between bg-zinc-900/50 items-center border rounded-xl mt-2 hover:bg-zinc-900 transition-colors animate-in slide-in-from-top-5'>
          <div className='flex items-center gap-4'>
            <Image
              className="rounded-l-xl w-40 h-40 max-md:h-56 object-cover object-top animate-in fade-in"
              src={valorantAccount.card || ''}
              alt="Player Card"
              width={160}
              height={160} />
            <div className='flex flex-col p-3'>
              <h2 className='font-semibold text-2xl mb-1 animate-in fade-in-20'>
                {valorantAccount.nick || ''} #{valorantAccount.tag || ''}
              </h2>
              <div className="flex flex-col space-y-1 animate-in fade-in-40">
                <p className='font-normal text-base flex items-center gap-2'>
                  <Image
                    className="w-6 h-6"
                    src={valorantAccount.current_tier_image}
                    alt="Tier Icon"
                    width={24}
                    height={24}
                  />
                  {valorantAccount.current_tier || 'N/A'}
                </p>
                <p className='font-normal text-base flex items-center gap-2'>
                  <Gamepad2 /> {valorantAccount.recent_season_number_of_games || 0} Partidas
                </p>
                <p className='font-normal text-base flex items-center gap-2'>
                  <Award /> {valorantAccount.recent_season_wins || 0} Vitórias
                </p>
                <p className='font-normal text-xs text-zinc-300'>
                  Season {valorantAccount.recent_season || 'N/A'} | Última Atualização: {format(new Date(valorantAccount.last_update), "dd/MM/yyyy 'às' HH:mm'H'", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mr-4 animate-in fade-in-50">
            <ValorantIcon size={90} />
            {isOwner && (
              <EditContasdeJogos nick={valorantAccount?.nick || ''} tag={valorantAccount?.tag || ''} role={valorantAccount?.role || ''} />
            )}
          </div>
        </div>
      ) : (
        <>
          {isOwner ? (
            <div className='flex justify-center items-center bg-red-600 rounded-xl  p-5'>
              <div className="flex flex-col items-center">
                <AlertCircle className='text-zinc-100 mb-2' size={50} />
                <p className='text-zinc-100 font-semi text-lg'>
                  Nenhuma conta de Valorant ou CS2 foi cadastrada ainda.
                </p>
                <p className='text-zinc-300 text-base mb-2'>
                  Para participar de um time e competir no campeonato, é obrigatório cadastrar a conta do jogo que você joga.
                </p>
                <AddConta gameAccounts={playerData?.gameAccounts} />
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-2 justify-center items-center bg-zinc-800 rounded-xl p-5'>
              <Frown size={50} />
              <p className='text-zinc-200 text-lg'>{playerData.nickname} não possui nenhuma conta de <span className="font-semibold">Valorant</span> ou <span className="font-semibold">CS2</span> cadastrada.</p>
            </div>
          )}
        </>
      )}

    </>
  );
};

export default ContasDeJogos;
