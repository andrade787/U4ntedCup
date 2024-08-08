import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Edit, LoaderCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useTeam } from '@/context/TeamContext';

interface EditPlayerTeamProps {
  roles: string[];
  playerId: string;
  nickname: string;
  team: string;
  isOwner: string;
}

const playerSchema = z.object({
  selectedRole: z.string().min(1, 'Função é obrigatória'),
  isSixthPlayer: z.boolean(),
  isIGL: z.boolean()
});

export function EditPlayerTeam({ roles, nickname, team, playerId, isOwner }: EditPlayerTeamProps) {
  const { toast } = useToast();
  const { setTeamPlayers } = useTeam();  // Get the players and setTeamPlayers from the context

  const initialRole = useMemo(() => {
    return roles.find(role => ["Controlador", "Duelista", "Iniciador", "Sentinela"].includes(role)) || undefined;
  }, [roles]);

  const [selectedRole, setSelectedRole] = useState<string | undefined>(initialRole);
  const [isSixthPlayer, setIsSixthPlayer] = useState(roles.includes("6 Player"));
  const [isIGL, setIsIGL] = useState(roles.includes("Igl"));
  const [loading, setLoading] = useState(false);
  const [deletePlayer, setDeletePlayer] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const deletePlayerConfirm = () => {
    setDeletePlayer(true);
  }

  const deletePlayerTeam = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/teams/${team}/editPlayer`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Tudo Certo',
          variant: 'success',
          description: 'O player foi removido com sucesso'
        });
        setDeletePlayer(false);
        setIsSheetOpen(false);

        // Update the context state
        setTeamPlayers(prevPlayers => prevPlayers.filter(player => player.playerId !== playerId));
      } else {
        throw new Error(result.message || 'Failed to delete player');
      }
    } catch (error) {
      toast({
        title: 'Ocorreu um erro',
        variant: 'destructive',
        description: `${(error as Error).message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelPlayerTeam = () => {
    setDeletePlayer(false);
  };

  const updatePlayerRoles = async (updatedRoles: string[]) => {
    setLoading(true);
    try {
      playerSchema.parse({ selectedRole, isSixthPlayer, isIGL });

      const response = await fetch(`/api/teams/${team}/editPlayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, roles: updatedRoles })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Tudo Certo',
          variant: 'success',
          description: 'As informações do player foram atualizadas'
        });

        setTeamPlayers(prevPlayers => prevPlayers.map(player =>
          player.playerId === playerId ? { ...player, roles: updatedRoles } : player
        ));
      } else {
        throw new Error(result.message || 'Failed to update player');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'A função é obrigatória',
          variant: 'destructive',
          description: error.errors.map(err => err.message).join(', ')
        });
      } else {
        toast({
          title: 'Ocorreu um erro',
          variant: 'destructive',
          description: `${(error as Error).message}`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    const updatedRoles = [
      value,
      isSixthPlayer ? "6 Player" : null,
      isIGL ? "Igl" : null
    ].filter(Boolean);
    updatePlayerRoles(updatedRoles as string[]);
  };

  const handleSixthPlayerToggle = () => {
    setIsSixthPlayer(!isSixthPlayer);
    const updatedRoles = [
      selectedRole,
      !isSixthPlayer ? "6 Player" : null,
      isIGL ? "Igl" : null
    ].filter(Boolean);
    updatePlayerRoles(updatedRoles as string[]);
  };

  const handleIGLToggle = () => {
    setIsIGL(!isIGL);
    const updatedRoles = [
      selectedRole,
      isSixthPlayer ? "6 Player" : null,
      !isIGL ? "Igl" : null
    ].filter(Boolean);
    updatePlayerRoles(updatedRoles as string[]);
  };


  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-1 mr-2 max-sm:flex-1 " onClick={() => setIsSheetOpen(true)}><Edit size={18} /> Editar Player</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edite seu player</SheetTitle>
          <SheetDescription>
            Faça alterações do seu player aqui.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nick" className="text-right">
              Nick
            </Label>
            <Input id="nick" disabled value={nickname} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="col-span-1 text-right">
              Função
            </Label>
            <div className="col-span-3">
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Funções</SelectLabel>
                    <SelectItem value="Controlador">
                      <div className="flex items-center gap-1">
                        <Image className="object-contain" width={15} height={15} alt="Controlador" src='/assets/Valorant/Roles/Controlador.webp' />
                        Controlador
                      </div>
                    </SelectItem>
                    <SelectItem value="Duelista">
                      <div className="flex items-center gap-1">
                        <Image className="object-contain" width={15} height={15} alt="Duelista" src='/assets/Valorant/Roles/Duelista.webp' />
                        Duelista
                      </div>
                    </SelectItem>
                    <SelectItem value="Iniciador">
                      <div className="flex items-center gap-1">
                        <Image className="object-contain" width={15} height={15} alt="Iniciador" src='/assets/Valorant/Roles/Iniciador.webp' />
                        Iniciador
                      </div>
                    </SelectItem>
                    <SelectItem value="Sentinela">
                      <div className="flex items-center gap-1">
                        <Image className="object-contain" width={15} height={15} alt="Sentinela" src='/assets/Valorant/Roles/Sentinela.webp' />
                        Sentinela
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sixth-player" className="text-right">
              6° Player
            </Label>
            <Switch id="sixth-player" checked={isSixthPlayer} onCheckedChange={handleSixthPlayerToggle} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="igl" className="text-right">
              IGL
            </Label>
            <Switch id="igl" checked={isIGL} onCheckedChange={handleIGLToggle} />
          </div>

          <div className='flex flex-col'>
            {isOwner != playerId && (
              deletePlayer ? (
                <div className='flex flex-col animate-in zoom-in-105 items-center justify-center gap-2'>
                  <AlertCircle size={50} />
                  <h3 className='text-center'>Você tem certeza que deseja remover {nickname} do seu time ?</h3>
                  <p className='text-center'>Essa ação não poderá ser desfeita</p>
                  <div className='flex gap-3'>
                    <Button onClick={cancelPlayerTeam} variant='outline'>Cancelar</Button>
                    <Button onClick={deletePlayerTeam} variant='default'>Sim, Remover</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={deletePlayerConfirm} className='animate-in zoom-in-105' variant='destructive'>
                  <Trash size={18} /> Remover do Time
                </Button>
              )
            )}
          </div>
        </div>
        {loading && <h3 className='flex justify-center mt-2 w-full animate-in fade-in'><LoaderCircle size={30} className='text-zinc-300 animate-spin' /></h3>}
      </SheetContent>
    </Sheet>
  );
}
