import { BookUser, Signature } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { AddConta } from '../edit/AddConta';
import ContasDeJogos from '../ContasdeJogos';
import ComentariosPerfil from '../Comentarios';
import { usePlayer } from '@/context/PlayerContext';

const Informacoes: React.FC = () => {
  const { playerData, isOwner } = usePlayer();

  return (
    <>
      <div className='flex-1 flex gap-5'>
        <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-90'>
          <h3 className='font-semibold text-lg flex items-center gap-2 mb-3'><BookUser size={20} /> Time</h3>
          <h3 className='font-base flex items-center gap-2'>
            <Image
              className='rounded-2xl object-cover w-10 h-10'
              src='/assets/images/VALORANT.png'
              alt='VALORANT logo'
              width={40}
              height={40}
            />
            Nome do Time
          </h3>
        </div>

        <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 hover:bg-zinc-900 transition-colors animate-in zoom-in-75'>
          <h3 className='font-semibold text-lg flex items-center gap-2 mb-3'><Signature size={20} /> Assinatura do Player</h3>
          <h3 className='font-base italic'>&quot;{playerData?.assinaturaPlayer}&quot;</h3>
        </div>
      </div>
      <div className='flex flex-col mt-8 animate-in slide-in-from-bottom'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Contas de Jogos</h1>
          {isOwner && <AddConta gameAccounts={playerData?.gameAccounts} />}
        </div>
        <hr className='w-full my-2' />
        <ContasDeJogos />
        <ComentariosPerfil />
      </div>
    </>
  );
};

export default Informacoes;
