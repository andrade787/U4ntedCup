import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertCircle, CalendarCheck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/components/ui/use-toast';
import { TeamInfos } from '@/lib/types';
import StatusPaymentTournament from './StatusPaymentTournament';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdditionalTeamProps {
  TeamPlayerIsPartTournament?: boolean;
  PlayerOwner?: boolean;
  status_payment: string;
  joinedAt: string;
}

type ExtendedTeamInfo = TeamInfos & AdditionalTeamProps;

interface IsPartTournamentProps {
  tournamentId: string | null | undefined;
  teamPlayerData: ExtendedTeamInfo;
}

export default function IsPartTournament({ tournamentId, teamPlayerData }: IsPartTournamentProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const handleRemoveTeam = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/tournament_teams/${tournamentId}?teamId=${teamPlayerData.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Equipe removida do torneio com sucesso.",
          variant: 'success',
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Erro",
          description: "Erro ao remover equipe do torneio. Tente novamente mais tarde.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover equipe do torneio. Tente novamente mais tarde.",
        variant: 'destructive',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gradient-to-b from-green-800 rounded-xl p-2">
      <h3 className="flex items-center text-xl gap-2 font-semibold"><CheckCircle /> Seu Time Está Inscrito</h3>
      <Dialog>
        <DialogTrigger><Button>Ver Informações</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Informações
            </DialogTitle>
            <DialogDescription>
              Algumas informações do seu time no campeonato
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              <h3 className="col-span-1">Status</h3>
              <div className="flex items-center col-span-2 gap-1">

                <StatusPaymentTournament tournamentId={tournamentId} teamPlayerData={teamPlayerData} />

              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <h3 className="col-span-1">Time Entrou</h3>
              <h3 className="col-span-2 text-sm">{format(new Date(teamPlayerData.joinedAt), "dd/MM/yyyy 'às' HH:mm'H'", { locale: ptBR })}</h3>
            </div>
            <div className="flex items-center justify-center gap-5">
              {teamPlayerData.PlayerOwner &&
                <>
                  <AlertDialog>
                    <AlertDialogTrigger><Button variant='destructive'>Cancelar Inscrição</Button></AlertDialogTrigger>
                    <AlertDialogContent className="flex flex-col items-center">
                      <AlertCircle size={40} />
                      <AlertDialogTitle className="text-center">Tem certeza de que deseja cancelar sua inscrição no campeonato?</AlertDialogTitle>
                      <div className="flex gap-5 mt-4">
                        <AlertDialogCancel>Não, manter inscrição</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button onClick={handleRemoveTeam} disabled={isRemoving} variant='destructive'>
                            {isRemoving ? "Cancelando..." : "Sim, cancelar inscrição"}
                          </Button>
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Link href='https://wa.me/7382338323?text=Quero%20Confirmar%20Minha%20Inscrição%20no%20Campeonato' target="_blank">
                    <Button variant='success'><CalendarCheck className="mr-1" size={18} /> Confirmar Inscrição</Button>
                  </Link>
                </>
              }
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
