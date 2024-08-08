// components/PlayerItem.tsx
import { CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import RequestStatusButton from "./RequestStatusButton";

interface PlayerItemProps {
  playerId: string;
  nickname: string;
  url: string;
  photoURL: string | null;
  requestStatus: 'pending' | 'rejected' | string;
  type: string;
  teamId: string;
  onStatusChange: (playerId: string, newStatus: string) => void;
}

export default function PlayerItem({ playerId, nickname, url, photoURL, requestStatus, type, teamId, onStatusChange }: PlayerItemProps) {
  return (
    <div key={playerId} className="flex items-center bg-gradient-to-r hover:from-zinc-900 px-2 py-2 gap-2 justify-between">
      <div className="flex w-full gap-2">
        <Avatar className="flex items-center">
          <AvatarImage className="rounded-full object-cover w-6 h-6" width={30} height={30} src={photoURL || undefined} />
          <AvatarFallback className="flex items-center justify-center bg-zinc-600 h-[23px] w-[23px] text-xs rounded-full py-1 px-1">
            {nickname[0]}
          </AvatarFallback>
        </Avatar>
        <p className="text-base">{nickname}</p>
      </div>
      <TooltipProvider>
        <RequestStatusButton status={requestStatus} nickname={nickname} playerId={playerId} teamId={teamId} onStatusChange={onStatusChange} />
        <Tooltip>
          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
            <Link href={'/player/' + url || '#'} target="_blank">
              <CircleUserRound />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver Perfil de {nickname}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
