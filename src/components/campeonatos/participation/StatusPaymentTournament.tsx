import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CircleHelp } from 'lucide-react';
import { TeamInfos } from '@/lib/types';

interface AdditionalTeamProps {
  TeamPlayerIsPartTournament?: boolean;
  PlayerOwner?: boolean;
  status_payment: string;
}

type ExtendedTeamInfo = TeamInfos & AdditionalTeamProps;

interface IsPartTournamentProps {
  tournamentId: string | null | undefined;
  teamPlayerData: ExtendedTeamInfo;
}

type status_payment = 'confirmed' | 'waiting' | 'canceled';

const getStatusDetails = (status: status_payment) => {
  const statusDetails: Record<status_payment, { text: string; className: string }> = {
    confirmed: {
      text: 'Confirmado',
      className: 'bg-green-800',
    },
    waiting: {
      text: 'Não Confirmado',
      className: 'bg-yellow-800',
    },
    canceled: {
      text: 'Cancelado',
      className: 'bg-red-800',
    },
  };

  return statusDetails[status] || {
    text: 'Desconhecido',
    className: 'bg-gray-800',
  };
};

export default function StatusPaymentTournament({ teamPlayerData }: IsPartTournamentProps) {
  const { text, className } = getStatusDetails(teamPlayerData.status_payment as status_payment);
  return (
    <>
      <h3 className={`text-sm ${className} rounded-xl p-1 text-center`}>
        {text}
      </h3>
      {teamPlayerData.PlayerOwner && teamPlayerData.status_payment !== 'confirmed' && (
        <Popover>
          <PopoverTrigger className="rounded-xl p-1 hover:bg-zinc-800 transition-colors">
            <CircleHelp size={20} />
          </PopoverTrigger>
          <PopoverContent>
            <h3 className="text-center mb-2">
              Você precisa realizar o pagamento da inscrição para confirmar a sua presença no campeonato.
            </h3>
            <Link className="flex justify-center" href='https://wa.me/7382338323?text=Quero%20Confirmar%20Minha%20Inscrição%20no%20Campeonato' target="_blank">
              <Button variant='success'>
                <CalendarCheck className="mr-1" size={18} /> Confirmar Inscrição
              </Button>
            </Link>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
