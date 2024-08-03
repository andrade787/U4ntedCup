// components/Players/CardPlayers.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Biohazard, Crown } from "lucide-react";
import { EditPlayerTeam } from './EditPlayerTeam';
import { TeamPlayers, User, TeamInfos } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import clsx from 'clsx';

const specialRoles: { [key: string]: { color: string; icon: JSX.Element } } = {
  Igl: {
    color: 'bg-gradient-to-l from-Roxo/50',
    icon: <Biohazard size={21} />,
  },
  "6 Player": {
    color: 'bg-gradient-to-l from-blue-800/50',
    icon: <Biohazard size={21} />,
  },
};

interface CardPlayersProps {
  player: TeamPlayers;
  user: User;
  team: TeamInfos;
  isOwner: string | null;
}

const CardPlayers: React.FC<CardPlayersProps> = ({ player, user, team, isOwner }) => {
  const Initial = player.nickname?.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();
  const classNameDiff = clsx({
    'bg-gradient-to-l from-MvpColor/40': team.owner == player.playerId,
    'bg-gradient-to-l from-Roxo/40': user && user.uid == player.playerId && !isOwner,
  });

  return (
    <div className={`bg-zinc-800/50 hover:bg-zinc-800 transition-colors rounded-xl w-full ${classNameDiff}`}>
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <Link target="_blank" href={`/player/${player.url}`}>
            <Avatar className="rounded-l-xl hover:opacity-80 transition-all">
              <AvatarImage className='rounded-l-xl w-25 h-25 object-cover' src={player.photoURL || ''} />
              <AvatarFallback className='flex items-center bg-zinc-800 rounded-l-xl justify-center font-semibold w-25 h-25'>
                {Initial}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-col">
            <Link target="_blank" href={`/player/${player.url}`}>
              <h3 className="text-lg hover:text-zinc-400 transition-colors font-semibold mb-1">{player.nickname}</h3>
            </Link>
            <div className='flex gap-3'>
              {player.roles.map((role, index) => {
                const roleKey = `${role}-${index}`;
                if (specialRoles[role]) {
                  return (
                    <div key={roleKey} className={`flex items-center justify-center gap-2 ${specialRoles[role].color} rounded-xl p-1`}>
                      {specialRoles[role].icon}
                      <p>{role}</p>
                    </div>
                  );
                } else {
                  return (
                    <div key={roleKey} className="flex items-center justify-center gap-2 bg-zinc-700/50 rounded-xl p-1">
                      <Image width={18} height={18} alt={role} src={`/assets/Valorant/Roles/${role}.webp`} />
                      <p>{role}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className='flex items-center'>
          {player.playerId == team.owner && <h3 className="flex items-center gap-2 mr-2 bg-gradient-to-l from-MvpColor/30 font-medium rounded-xl p-2"><Crown /> DONO</h3>}


          {user && user.uid == isOwner && <EditPlayerTeam team={team.id} isOwner={isOwner} nickname={player.nickname} roles={player.roles} playerId={player.playerId} />}

        </div>
      </div>
    </div>
  );
}

export default CardPlayers;
