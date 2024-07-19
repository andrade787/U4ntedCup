import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, LockKeyhole, User2 } from "lucide-react";
import InfosGerais from "@/components/player/InfosGerais";
import Seguranca from "@/components/player/Seguranca";

export function EditPlayer() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Edit size={18} className="mr-2" /> Editar Perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edite o seu Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex">
          <div className="border rounded-xl flex w-full mb-3">
            <Button type="button" className="rounded-r-none flex-1" variant={activeTab === 'info' ? 'roxo' : 'ghost'} onClick={() => setActiveTab('info')}>
              <User2 size={20} className="mr-2" />Informações Gerais
            </Button>

            <Button type="button" className="rounded-l-none flex-1" variant={activeTab === 'security' ? 'roxo' : 'ghost'} onClick={() => setActiveTab('security')}>
              <LockKeyhole size={20} className="mr-2" />Segurança
            </Button>
          </div>
        </div>

        <div className="grid gap-4 py-2">
          {activeTab === 'info' && (
            <InfosGerais />
          )}

          {activeTab === 'security' && (
            <Seguranca />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditPlayer;
