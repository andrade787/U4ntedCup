import { BookUser, Settings2, Signature } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { AddConta } from '../edit/AddConta';
import ContasDeJogos from '../ContasdeJogos';
import ComentariosPerfil from '../Comentarios';
import { usePlayer } from '@/context/PlayerContext';
import CriarTime from '../edit/CriarTime';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Team from '../Team';
import Link from 'next/link';
interface InformacoesProps {
  user: User | null;
}
export default function Informacoes({ user }: InformacoesProps) {
  const { playerData, isOwner } = usePlayer();

  return (
    <>
      <div className='flex-1 flex gap-5'>
        <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-90'>
          <div className='flex max-md:flex-col items-center justify-between mb-1'>
            <h3 className='font-semibold text-lg flex items-center gap-2'><BookUser size={20} /> Time</h3>
            {isOwner && user?.activeTeamId && <div> <Link href={'/times/' + user?.urlTeam || '#'}><Button className='flex items-center gap-1'><Settings2 size={18} />Ver Meu Time</Button></Link></div>}
            {isOwner && !user?.activeTeamId && <CriarTime />}
          </div>
          {user?.activeTeamId ? (<Team user={user} />) : (<div><h3>Não possui time no momento</h3></div>)}
        </div>

        <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-75'>
          <h3 className='font-semibold text-lg flex items-center gap-2 mb-3'><Signature size={20} /> Assinatura do Player</h3>
          <h3 className='font-base italic'>&quot;{playerData?.assinaturaPlayer}&quot;</h3>
        </div>
      </div>
      <div className='flex flex-col mt-8 animate-in slide-in-from-bottom'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-bold'>Contas de Jogos</h1>
          {isOwner && <AddConta gameAccounts={playerData?.gameAccounts} />}
        </div>
        <hr className='w-full my-2' />
        <ContasDeJogos />
        <ComentariosPerfil />
      </div>
    </>
  );
};

