import React from 'react';
import Match from './Match';
import Link from 'next/link';

interface PlayoffBracketProps { }

export default function PlayoffBracket({ }: PlayoffBracketProps) {
  return (
    <div className="bg-zinc-800 rounded-b-xl p-4 overflow-x-auto">
      <div className="flex items-center space-x-10">
        <div className='flex flex-col relative justify-center gap-20'>
          <div className='flex relative items-center'>
            <Match
              title="Semi 1"
              date="Aguardando"
              teams={[{ name: "Primeiro do Grupo A" }, { name: "Segundo do Grupo B" }]}
            />
            <div className='h-1 w-10 right-0 top-[17px] relative bg-zinc-600' />
            <div className='h-[105px] w-1 right-0 top-[67px] relative bg-zinc-600' />
          </div>
          <div className='flex relative items-center'>
            <Match
              title="Semi 2"
              date="Aguardando"
              teams={[{ name: "Primeiro do Grupo B" }, { name: "Segundo do Grupo A" }]}
            />
            <div className='h-1 w-10 right-0 top-[18px] relative bg-zinc-600' />
            <div className='h-[105px] w-1 right-0 bottom-[33px] relative bg-zinc-600' />
          </div>
          <div className='h-1 w-11 absolute right-[-40px] bottom-[147px] bg-zinc-600' />
        </div>

        <div className='flex flex-col mt-4'>
          <Match
            title="Final"
            date="Aguardando"
            teams={[{ name: "Vencedor Semi 1" }, { name: "Vencedor Semi 2" }]}
          />
        </div>

        <div className='flex flex-col mt-7'>
          <div className="flex flex-col w-64 mb-4">
            <div className="flex justify-center items-center bg-zinc-700 p-2 rounded-t-lg">
              <span className="text-zinc-100">VENCEDOR</span>
            </div>
            <div className="flex flex-col border-l-4 border-b-4 rounded-b-xl border-zinc-700 bg-zinc-800">
              <div className='p-2 border-b border-zinc-700 bg-gradient-to-l rounded-br-xl from-MvpColor'>
                <div className='flex items-center justify-between text-base'>
                  <Link className='flex items-center hover:brightness-75 transition-all' href='#'>
                    {/*  <img className='w-5 h-5 object-cover rounded-full mr-2' src='https://storage.googleapis.com/uanted.appspot.com/PhotoUser/7abb23cd-324c-4818-a1e1-efdfe0e33f47.webp' />
                    Nome do Time */}
                    Vencedor Final
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
