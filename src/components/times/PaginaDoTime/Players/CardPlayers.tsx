import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Biohazard, Crown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { EditPlayerTeam } from './EditPlayerTeam';

interface PlayerCardProps {
  imageSrc: string;
  imageHref: string;
  playerName: string;
  role: string;
  isOwner?: boolean;
}

const CardPlayers: React.FC<PlayerCardProps> = ({ imageSrc, imageHref, playerName, role, isOwner = false }) => {
  return (
    <div className={`bg-zinc-800/50 hover:bg-zinc-800 transition-colors rounded-xl w-full ${isOwner && 'bg-gradient-to-l from-MvpColor/40'}`}>
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <Link target="_blank" href={imageHref}>
            <Image className="rounded-l-xl hover:opacity-80 transition-all" width={100} height={100} alt={playerName} src={imageSrc} />
          </Link>
          <div className="flex-col">
            <Link target="_blank" href={imageHref}>
              <h3 className="text-lg hover:text-zinc-400 transition-colors font-semibold mb-1">{playerName}</h3>
            </Link>
            <div className='flex gap-3'>
              <div className="flex items-center justify-center gap-2 bg-zinc-700/50 rounded-xl p-1">
                <Image width={18} height={18} alt="Controller" src='/assets/Valorant/Roles/ControllerClassSymbol.webp' />
                <p>{role}</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-gradient-to-l from-Roxo/50 rounded-xl p-1">
                <Biohazard size={21} />
                <p>IGL</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-gradient-to-l from-blue-800/50 rounded-xl p-1">
                <Biohazard size={21} />
                <p>6° Player</p>
              </div>
            </div>
          </div>
        </div>
        {isOwner ? (
          <h3 className="flex items-center gap-2 mr-2 bg-gradient-to-l from-MvpColor/30 font-medium rounded-xl p-2"><Crown /> DONO</h3>
        ) : (
          <EditPlayerTeam />
        )}
      </div>
    </div>
  );
}

export default CardPlayers;
