import { BookUser, Settings2, Signature } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AddConta } from '../edit/AddConta';
import ContasDeJogos from '../ContasdeJogos';
import ComentariosPerfil from '../Comentarios';
import { usePlayer } from '@/context/PlayerContext';
import CriarTime from '../edit/CriarTime';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import TeamPlayer from '../Team';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Skeleton } from '@/components/ui/skeleton';
import { GameAccountLoading } from '../Loading';
interface InformacoesProps {
  user: User | null;
}
export default function Informacoes({ user }: InformacoesProps) {
  const { playerTeam } = useUser();
  const { playerData, Team, TeamLoading, gameAccount, gameAccountLoading, fetchGameAccounts, isOwner } = usePlayer();
  const [displayInfos, setDisplayInfos] = useState(false);
  const [displayGameAccount, setDisplayGameAccount] = useState(false);


  useEffect(() => {
    if (gameAccountLoading) {
      fetchGameAccounts(playerData.uid);
    } else {
      setDisplayGameAccount(true);
    }
  }, [gameAccount, gameAccountLoading, fetchGameAccounts, displayGameAccount, playerData.uid]);

  useEffect(() => {
    if (!TeamLoading) {
      setDisplayInfos(true);
    }
  }, [TeamLoading]);


  return (
    <>
      {TeamLoading && <div className='flex-1 flex gap-5'>
        <Skeleton className='flex-1 rounded-xl border p-2'>
          <div className='flex max-md:flex-col items-center justify-between mb-1'>
            <h3 className='font-semibold text-lg flex items-center gap-2'><Skeleton className='w-5 h-5 bg-zinc-700' /> <Skeleton className='w-12 h-5 bg-zinc-700' /></h3>
            <Skeleton className='w-36 h-9 bg-zinc-700' />
          </div>
          <Skeleton className='w-1/3 h-7 bg-zinc-700' />
        </Skeleton>

        <Skeleton className='flex-1 rounded-xl border p-2'>
          <div className='flex max-md:flex-col items-center justify-between mb-2'>
            <h3 className='font-semibold text-lg flex items-center gap-2'><Skeleton className='w-5 h-5 bg-zinc-700' /> <Skeleton className='w-40 h-5 bg-zinc-700' /></h3>
            <Skeleton className='w-36 h-9 bg-zinc-700' />
          </div>
          <Skeleton className='w-1/2 h-5 bg-zinc-700' />
        </Skeleton>
      </div>}

      {displayInfos &&
        <>
          <div className='flex-1 flex gap-5'>
            <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-90'>
              <div className='flex items-center justify-between mb-1'>
                <h3 className='font-semibold text-lg flex items-center gap-2'><BookUser size={20} /> Time</h3>
                {user && Team && playerTeam?.id == Team.id && user.uid == playerData.uid && <div> <Link href={`/times/${Team.url}`}><Button className='flex items-center gap-1 animate-in zoom-in'><Settings2 size={18} /><span className='max-sm:hidden'>Ver Meu Time</span></Button></Link></div>}
                {user && isOwner && !Team && <CriarTime />}
              </div>
              {Team ? (<TeamPlayer Team={Team} />) : (<div><h3>Não possui time no momento</h3></div>)}
            </div>

            <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-75'>
              <h3 className='font-semibold text-lg flex items-center gap-2 mb-3'><Signature size={20} /> Assinatura do Player</h3>
              <h3 className='font-base italic'>&quot;{playerData?.assinaturaPlayer}&quot;</h3>
            </div>
          </div>
        </>
      }


      {!displayGameAccount && <GameAccountLoading />}
      {displayGameAccount &&
        <>
          <div className='flex flex-col mt-8 animate-in slide-in-from-bottom'>
            <div className='flex justify-between items-center'>
              <h1 className='text-xl font-bold'>Contas de Jogos</h1>
              {isOwner && <AddConta />}
            </div>

            <hr className='w-full my-2' />
            <ContasDeJogos />
            <ComentariosPerfil />

          </div>
        </>
      }


    </>

  );
};

