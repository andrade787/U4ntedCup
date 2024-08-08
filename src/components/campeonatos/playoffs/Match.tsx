import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Team {
  name: string;
  score?: number;
  imgSrc?: string;
  winner?: boolean;
}

interface MatchProps {
  title: string;
  date: string;
  teams: Team[];
}

const Match: React.FC<MatchProps> = ({ title, date, teams }) => {
  return (
    <div className="flex flex-col relative w-64">
      <div className="flex justify-between items-center bg-zinc-700 p-2 rounded-t-lg">
        <span className="text-zinc-100">{title}</span>
        <span className="text-zinc-400 text-sm">{date}</span>
      </div>
      <div className="flex flex-col border-l-4 border-b-4 rounded-b-xl border-zinc-700 bg-zinc-800">
        {teams.map((team, index) => (
          <div key={index} className={`p-2 border-b ${index === teams.length - 1 ? 'rounded-br-xl' : ''} border-zinc-700 ${team.winner ? 'bg-gradient-to-l from-green-900' : 'brightness-75'}`}>
            <div className='flex items-center justify-between text-base'>
              <Link className='flex items-center hover:brightness-75 transition-all' href='#'>
                {team.imgSrc && <Image alt={team.name} width={40} height={40} className='w-5 h-5 object-cover rounded-full mr-2' src={team.imgSrc} />}
                {team.name}</Link>
              <div>
                {team.score && <span>{team.score}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Match;
