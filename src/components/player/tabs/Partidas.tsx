import ScoreCard from '@/components/player/ScoreCard';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface MatchData {
  id: number;
  result: string;
  time: string;
  score: string;
  map: string;
  kda: string;
  kpr: string;
  hs: string;
  agentImage: string;
  status: string;
  mvp: boolean;
}

const getClassNames = (status: string, mvp: boolean) => {
  const baseClasses = {
    gradient: 'bg-zinc-200',
    border: 'border-zinc-200',
    text: 'text-zinc-400',
  };

  if (mvp) {
    return {
      gradient: 'bg-mvp-gradient',
      border: 'border-MvpColor',
      text: 'text-MvpColor',
    };
  }

  const statusClasses: { [key: string]: { gradient: string; border: string; text: string } } = {
    win: {
      gradient: 'bg-win-gradient',
      border: 'border-WinColor',
      text: 'text-WinColor',
    },
    lose: {
      gradient: 'bg-loser-gradient',
      border: 'border-LoserColor',
      text: 'text-LoserColor',
    },
  };

  return statusClasses[status] || baseClasses;
};


const Partidas: React.FC = () => {
  const [data, setData] = useState<MatchData[]>([]);

  useEffect(() => {
    // Simulando uma chamada de API
    const fetchData = async () => {
      const response: MatchData[] = [
        {
          id: 1,
          result: 'Vitória',
          time: 'Há 14 Horas',
          score: '13 - 9',
          map: 'Bind',
          kda: '1.5',
          kpr: '1.50',
          hs: '25%',
          agentImage: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
          status: 'win',
          mvp: true,
        },
        {
          id: 2,
          result: 'Derrota',
          time: 'Há 14 Horas',
          score: '9 - 13',
          map: 'Bind',
          kda: '1.5',
          kpr: '1.50',
          hs: '25%',
          agentImage: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
          status: 'lose',
          mvp: false,
        },
        {
          id: 3,
          result: 'Vitória',
          time: 'Há 14 Horas',
          score: '13 - 9',
          map: 'Bind',
          kda: '1.5',
          kpr: '1.50',
          hs: '25%',
          agentImage: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
          status: 'win',
          mvp: false,
        },
      ];
      setData(response);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col'>
      <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 transition-colors animate-in zoom-in-90 mb-5'>
        <h2 className='text-2xl font-semibold'>Partidas</h2>
        <p className='text-sm text-zinc-300'>Partidas detalhadas de todos os campeonatos disputados pelo jogador</p>
      </div>
      <p>O player não jogou nenhuma partida no campeonato até o momento.</p>
      {/*   <div className='flex w-full p-4 bg-zinc-900/50 rounded-xl border transition-colors hover:bg-zinc-900 mb-5'>
        <div className='w-full flex flex-col'>
          <div className='w-full flex gap-6 mb-2'>
            <div className='flex flex-col animate-in zoom-in-50'>
              <h3>14W 6L</h3>
              <p className='text-sm text-zinc-400'>Últimos 20</p>
            </div>
            <div className='flex flex-col animate-in zoom-in-75'>
              <h3 className='text-WinColor'>70%</h3>
              <p className='text-sm text-zinc-400'>Winrate</p>
            </div>
            <div className='flex flex-col animate-in zoom-in-90'>
              <h3>1.22</h3>
              <p className='text-sm text-zinc-400'>KD</p>
            </div>
            <div className='flex flex-col animate-in zoom-in-95'>
              <h3>259.4</h3>
              <p className='text-sm text-zinc-400'>Avg. Score</p>
            </div>
          </div>

          <div className='flex w-full max-w-lg animate-in slide-in-from-bottom-6'>
            <div className='h-1 w-[80%] bg-WinColor rounded-l-xl'></div>
            <div className='h-1 w-[20%] bg-red-400 rounded-l-xl'></div>
          </div>
        </div>

        <div className='w-2/3 flex justify-end items-center gap-5'>
          <div className='flex flex-col items-center gap-1 animate-in slide-in-from-bottom-6'>
            <Image className='rounded-xl bg-zinc-200 object-cover' width='43' height='43' alt='Nome Agente' src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" />
            <h3 className='text-WinColor text-sm font-semibold'>75%</h3>
          </div>
          <div className='flex flex-col items-center gap-1 animate-in slide-in-from-bottom-9'>
            <Image className='rounded-xl bg-zinc-200 object-cover' width='43' height='43' alt='Nome Agente' src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" />
            <h3 className='text-WinColor text-sm font-semibold'>75%</h3>
          </div>
          <div className='flex flex-col items-center gap-1 animate-in slide-in-from-bottom-12'>
            <Image className='rounded-xl bg-zinc-200 object-cover' width='43' height='43' alt='Nome Agente' src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" />
            <h3 className='text-WinColor text-sm font-semibold'>75%</h3>
          </div>
        </div>
      </div> */}

      {/*   <div className='rounded-xl border bg-zinc-900/50'>
        {data.map((item, index) => {
          const classes = getClassNames(item.status, item.mvp);

          return (
            <a key={item.id} className={`flex w-full p-4 cursor-pointer transition-colors hover:bg-zinc-800/50 relative`}>
              <div className={`w-full absolute -z-10 inset-0 opacity-20 ${classes.gradient} ${index === 0 ? 'rounded-t-xl' : index === data.length - 1 ? 'rounded-b-xl' : ''}`}></div>
              <div className="flex gap-4 w-full relative z-10">
                <div className="flex flex-col">
                  <Image
                    className={`rounded-xl border-3 ${classes.border} bg-zinc-200 object-cover w-12 h-12`}
                    width="100"
                    height="100"
                    alt="Nome Agente"
                    src={item.agentImage}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-semibold ${classes.text}`}>{item.result}</h3> •{' '}
                    <h3 className="text-sm text-zinc-400">{item.time}</h3>
                  </div>
                  <div className="flex justify-between max-w-xl">
                    <ScoreCard score={item.score} label={item.map} />
                    <ScoreCard score={item.kda} label="KDA" />
                    <ScoreCard score={item.kpr} label="KPR" />
                    <ScoreCard score={item.hs} label="% HS" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div> */}
    </div>
  );
};

export default Partidas;
