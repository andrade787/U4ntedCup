import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CheckCircleIcon, LoaderCircle, Zap } from "lucide-react";
import { Tournament, User } from "@/lib/types";
import { useToast } from '../ui/use-toast';
interface EnterCampProps {
  tournamentInfo: Tournament;
  user: User;
}

export default function EnterCamp({ tournamentInfo, user }: EnterCampProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleParticipate = async () => {
    setIsSubmitting(true);
    const participationData = {
      tournamentId: tournamentInfo.id,
      teamId: user.activeTeamId, // Usando activeTeamId do usuário
    };

    try {
      const response = await fetch('/api/participations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participationData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        toast({
          title: "Ocorreu um erro",
          description: "Houve um erro ao inscrever seu time. Tente novamente mais tarde!",
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: "Ocorreu um erro",
        description: "Houve um erro ao inscrever seu time. Tente novamente mais tarde!",
        variant: 'destructive'
      })
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
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-lg">
        {success ? (
          <div className="flex flex-col items-center justify-center p-6 border-zinc-800 rounded-lg shadow-md">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold text-green-700 mt-4">Sucesso!</h2>
            <p className="text-zinc-700 text-center font-semibold mt-2 mb-2">
              Seu time foi adicionado com sucesso ao campeonato. Prepare-se para competir e boa sorte!
            </p>
            <DialogClose asChild>
              <Button variant="ghost" className="border border-gray-300 text-gray-700 hover:text-gray-100 hover:bg-gray-500">Fechar</Button>
            </DialogClose>
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-Roxo mb-2">Inscrição no Campeonato</DialogTitle>
            <DialogDescription className="text-gray-700 text-base text-center">
              Você está prestes a inscrever seu time no campeonato. Prepare-se para competir e que vença o melhor!
              <div className="">
                <p className="text-red-700 text-sm text-center ">
                  Ao clicar em Participar, você se compromete a seguir todas as regras do campeonato e a competir de maneira justa e honesta.
                </p>
              </div>
              <div className='flex justify-center mt-5 gap-2'>
                <DialogClose asChild>
                  <Button variant="ghost" className="border border-gray-300 text-gray-700 hover:text-gray-100 hover:bg-gray-500">Cancelar</Button>
                </DialogClose>
                <Button
                  onClick={handleParticipate}
                  disabled={isSubmitting}
                  className="bg-Roxo text-white hover:bg-Roxo/80"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className='animate-spin mr-1' />
                      Adicionando o seu time
                    </>
                  ) : (
                    'Participar'
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        )}




      </DialogContent>
    </Dialog>
  );
}
