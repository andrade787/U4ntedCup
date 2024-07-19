import { useState } from "react";
import { ValorantIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Edit, LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EditContasdeJogosProps {
  nick: string;
  tag: string;
  role: string;
}

export function EditContasdeJogos({ nick, tag, role }: EditContasdeJogosProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/gameAccounts/v1/ManageAccounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nick, tag }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          variant: 'success',
          title: "Sucesso!",
          description: "Sua conta foi deletada com sucesso!"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Ocorreu um Erro",
          description: "Por favor, tente novamente mais tarde!"
        });
      }
    } catch (error) {
      console.error('Erro ao deletar a conta:', error);
      toast({
        title: "Erro ao Deletar",
        description: "Por favor, tente novamente mais tarde!"
      });
    }
    setIsSubmitting(false);
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/gameAccounts/v1/ManageAccounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nick, tag, role: selectedRole }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          variant: 'success',
          title: "Sucesso!",
          description: "Sua função foi alterada com sucesso!"
        });
      } else {
        toast({
          title: "Ocorreu um Erro",
          description: "Por favor, tente novamente mais tarde!"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar a função:', error);
      toast({
        title: "Erro ao Atualizar",
        description: "Por favor, tente novamente mais tarde!"
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 rounded-xl p-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
          variant="outline"
        >
          <Edit size={18} className="text-zinc-100" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center animate-in zoom-in-75 gap-2">
            <ValorantIcon size={50} />
            {nick}
          </DialogTitle>
        </DialogHeader>
        {isDeleting ? (
          <div className="flex flex-col items-center py-4 animate-in zoom-in-75">
            <AlertCircle className="mb-2 text-zinc-200" size={40} />
            <p className="text-center text-zinc-200">
              Tem certeza que deseja deletar sua conta? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <Button variant='outline' onClick={handleDeleteCancel} disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle size={16} className="mr-2 animate-spin" />}
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick} disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle size={16} className="mr-2 animate-spin" /> : "Confirmar Deleção"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 animate-in zoom-in-90">
              <Label htmlFor="Nick" className="text-right">
                Nick
              </Label>
              <Input
                id="Nick"
                defaultValue={nick}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 animate-in zoom-in-110">
              <Label htmlFor="Tag" className="text-right">
                Tag
              </Label>
              <Input
                id="Tag"
                defaultValue={tag}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 animate-in zoom-in-125">
              <Label htmlFor="Role" className="text-right col-span-1">
                Função
              </Label>
              <Select value={selectedRole} onValueChange={handleRoleChange} required>
                <SelectTrigger className="w-full col-span-3">
                  <SelectValue placeholder="Sua Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duelista">Duelista</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="iniciador">Iniciador</SelectItem>
                  <SelectItem value="controlador">Controlador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-between animate-in fade-in">
              <Button type="button" variant="destructive" onClick={() => setIsDeleting(true)} disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle size={16} className="mr-2 animate-spin" />}
                Deletar Conta
              </Button>
              <Button type="button" onClick={handleSaveClick} disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle size={16} className="mr-2 animate-spin" /> : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
