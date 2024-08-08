import Image from 'next/image';
import React from 'react';

interface Team {
  position: number;
  logo: string;
  name: string;
  wins: number;
  losses: number;
  matches: number;
}

interface GroupTableProps {
  groupName: string;
  teams: Team[];
}

export default function GroupTable({ groupName, teams }: GroupTableProps) {
  return (
    <div className="bg-zinc-900 rounded-xl">
      <div className="bg-Roxo rounded-t-xl py-4">
        <h1 className="text-3xl font-bold text-center">{groupName}</h1>
      </div>
      <div className='overflow-x-auto'>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12 py-3 px-4 text-center"></th>
              <th className="w-1/6 py-3 px-4 text-center">Time</th>
              <th className="w-1/6 py-3 px-4 text-center">Vitórias</th>
              <th className="w-1/6 py-3 px-4 text-center">Derrotas</th>
              <th className="w-1/6 py-3 px-4 text-center">Partidas</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.position} className="border-t border-zinc-700">
                <th className="bg-gradient-to-r from-zinc-900/50 w-1/12 py-3 px-4 text-center">{team.position}º</th>
                <td className="min-w-56 py-3 px-4 flex items-center gap-2">
                  <Image width={90} height={90} src={team.logo} alt={`Logo ${team.name}`} className="w-10 h-10 object-cover rounded-full" />
                  {team.name}
                </td>
                <td className="py-3 px-4 text-center">{team.wins}</td>
                <td className="py-3 px-4 text-center">{team.losses}</td>
                <td className="py-3 px-4 text-center">{team.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

