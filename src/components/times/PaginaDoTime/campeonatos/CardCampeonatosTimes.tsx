import { ValorantIcon } from '@/components/icons';
import { CalendarCheck, Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LoadingCampeonatosdoTime from './Loading';

export default function CardCampeonatosTimes() {
  return (
    <>
      <LoadingCampeonatosdoTime />
      <Link href="#" className='flex-1 flex bg-zinc-900/50 rounded-xl border transition-colors animate-in zoom-in hover:bg-zinc-900 relative'>
        <div className='w-full absolute -z-10 inset-0 opacity-20 bg-loser-gradient rounded-xl'></div>
        <Image
          className='rounded-xl h-auto w-auto object-cover rounded-r-none'
          src='/assets/images/VALORANT.png'
          alt='VALORANT logo'
          width={100}
          height={100}
        />
        <div className='flex justify-between items-center w-full'>
          <div className='flex flex-col w-full'>
            <div className='flex items-center justify-between p-2 mb-2 border-b'>
              <div className='flex items-center'>
                <h1 className='text-xl font-semibold'>Nome do Campeonato</h1>
                <Dot />
                <p className='flex items-center text-sm text-zinc-300'><CalendarCheck className='mr-1' size={16} />15/05/2024</p>
              </div>
              <p className='font-semibold text-LoserColor'>Derrota</p>
            </div>
            <div className='flex items-center pb-2 w-full'>
              <div className='grid grid-cols-3 gap-2 flex-1'>

                <div className='pr-2'>
                  <p className='text-zinc-300 mb-0 font-semibold text-center'>PARTIDAS</p>
                  <p className='text-zinc-300 text-center'>3</p>
                </div>

                <div className='pr-2'>
                  <p className='text-zinc-300 mb-0 font-semibold text-center'>FASE DE GRUPOS</p>
                  <p className='text-zinc-300 text-center'>1° Colocado</p>
                </div>

                <div className='pr-2'>
                  <p className='text-zinc-300 mb-0 font-semibold text-center'>PLAYOFFS</p>
                  <p className='text-zinc-300 text-center'>SEMI FINAL</p>
                </div>

              </div>

              <ValorantIcon size={60} />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};


