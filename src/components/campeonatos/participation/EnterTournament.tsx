import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { AlertCircle, Check, CheckCircleIcon, LoaderCircle, Zap } from "lucide-react";
import { TeamInfos, Tournament, User } from "@/lib/types";
import { useToast } from '../../ui/use-toast';
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link';


interface EnterTournamentProps {
  tournament: Tournament;
  playerTeam: TeamInfos | null;
  user: User;
}

export default function EnterTournament({ tournament, playerTeam, user }: EnterTournamentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleParticipate = async () => {
    setIsSubmitting(true);
    const participationData = {
      teamId: playerTeam?.id
    };

    try {
      const response = await fetch(`/api/tournament_teams/${tournament.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participationData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        toast({
          title: "Ocorreu um erro",
          description: data.message || "Houve um erro ao inscrever seu time. Tente novamente mais tarde!",
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: "Ocorreu um erro",
        description: "Houve um erro ao inscrever seu time. Tente novamente mais tarde!",
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-semibold text-lg gap-1 items-center bg-Roxo text-white hover:bg-Roxo/50" variant="roxo">
          <Zap size={18} /> INSCREVER MEU TIME
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-green-700 animate-in fade-in zoom-in">

        {!playerTeam &&
          <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-4">Participar de um Campeonato</h3>
            <p className="text-center text-lg">Para participar de um campeonato, você precisa fazer parte de um time.</p>
            <p className="text-center text-lg mt-2">Crie um novo time ou junte-se a um existente para começar sua jornada!</p>
            <div className='flex justify-center'>
              <Link href={`/player/${user.url}`} >
                <Button className='mt-2'>Criar Meu Time</Button>
              </Link>

            </div>
          </div>
        }

        {playerTeam && playerTeam.owner != user.uid && <div className='flex flex-col items-center'><AlertCircle size={50} /><h3 className='text-xl font-semibold text-center'>Você não tem permissão para inscrever o time.</h3> <p>Somente o dono do time pode realizar essa ação.</p></div>}

        {success &&
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-top-10">
            <CheckCircleIcon className='mb-2 text-white' size={50} />
            <p className='text-xl font-bold mb-2'>Inscrição realizada com sucesso!</p>
            <p className='text-sm mb-4'>
              Parabéns! Sua equipe está oficialmente inscrita no campeonato. Para confirmar sua presença, é necessário realizar o pagamento da inscrição. <br /> O campeonato ocorrerá do dia
              <strong> {format(new Date(tournament.startDate), "dd/MM/yyyy", { locale: ptBR })} até o dia {format(new Date(tournament.endDate), "dd/MM/yyyy", { locale: ptBR })}</strong>.
            </p>
            <p className='text-sm mb-4'>
              Para mais informações ou dúvidas, entre em contato pelo WhatsApp.
            </p>
            <Link href="https://wa.me/7382338323?text=Quero%20Confirmar%20Minha%20Inscri%C3%A7%C3%A3o%20no%20Campeonato" target="_blank" rel="noopener noreferrer">
              <Button variant="success">
                <Check className='mr-1' size={19} /> Confirmar Inscrição
              </Button>
            </Link>
          </div>}

        {!success && playerTeam?.owner == user.uid &&
          <>
            <DialogTitle className='flex flex-col items-center animate-in fade-in slide-in-from-top-10'>
              <Zap className='mb-2' size={50} />
              <p className='text-center font-normal text-xl mb-1'>Você está prestes a inscrever seu time no campeonato!</p>
            </DialogTitle>
            <DialogDescription className='text-sm text-center text-white bg-red-800 p-2 rounded-xl shadow animate-in fade-in slide-in-from-bottom-10'>
              Ao clicar no botão Inscrever Meu Time abaixo, você se compromete a seguir todas as regras do campeonato e a competir de maneira justa e honesta.
            </DialogDescription>
            <DialogFooter className="flex sm:justify-between animate-in fade-in slide-in-from-bottom-10">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button onClick={handleParticipate} disabled={isSubmitting} variant='roxo'>
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin mr-1" />
                    Adicionando o seu time
                  </>
                ) : (
                  'Inscrever Meu Time'
                )}
              </Button>
            </DialogFooter>
          </>
        }
      </DialogContent>
    </Dialog>
  );
}
