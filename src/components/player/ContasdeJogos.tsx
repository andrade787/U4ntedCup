import React from "react";
import { AlertCircle, Award, Frown, Gamepad2 } from "lucide-react";
import { EditContasdeJogos } from "./edit/EditContasdeJogos";
import { Skeleton } from "@/components/ui/skeleton";
import { AddConta } from "./edit/AddConta";
import { ValorantIcon } from "../icons";
import { usePlayer } from '@/context/PlayerContext';

const ContasDeJogos = () => {
  const { playerData, gameData, isOwner, loading } = usePlayer();
  const valorantAccount = playerData?.gameAccounts?.Valorant;

  if (loading) {
    return (
      <Skeleton className="h-40 w-full flex gap-4 rounded-xl">
        <Skeleton className="rounded-l-xl rounded-r-none w-40 h-40 bg-zinc-700" />
        <div className="flex flex-col p-3">
          <Skeleton className="rounded-l-xl w-48 h-8 mb-2 bg-zinc-700" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="rounded-l-xl w-40 h-5 bg-zinc-700" />
            <Skeleton className="rounded-l-xl w-40 h-5 bg-zinc-700" />
            <Skeleton className="rounded-l-xl w-40 h-5 bg-zinc-700" />
            <Skeleton className="rounded-l-xl w-20 h-3 bg-zinc-700" />
          </div>
        </div>
      </Skeleton>
    );
  }

  return (
    <>
      {playerData?.gameAccounts ? (
        <div className='flex justify-between bg-zinc-900/50 items-center border rounded-xl mt-2 hover:bg-zinc-900 transition-colors animate-in slide-in-from-top-5'>
          <div className='flex items-center gap-4'>
            <img
              className="rounded-l-xl w-40 h-40 object-cover object-top animate-in fade-in"
              src={gameData?.card?.large || ''}
              alt="Player Card"
            />
            <div className='flex flex-col p-3'>
              <h2 className='font-semibold text-2xl mb-1 animate-in fade-in-20'>
                {valorantAccount?.nick || ''} #{valorantAccount?.tag || ''}
              </h2>
              <div className="flex flex-col space-y-1 animate-in fade-in-40">
                <p className='font-normal text-base flex items-center gap-2'>
                  <img className="w-6 h-6" src="https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/smallicon.png" alt="Tier Icon" />
                  {gameData?.currenttier_patched || 'N/A'}
                </p>
                <p className='font-normal text-base flex items-center gap-2'>
                  <Gamepad2 /> {gameData?.season?.number_of_games || 0} Partidas
                </p>
                <p className='font-normal text-base flex items-center gap-2'>
                  <Award /> {gameData?.season?.wins || 0} Vitórias
                </p>
                <p className='font-normal text-xs text-zinc-300'>
                  Season {gameData?.season?.season_name || 'N/A'}
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