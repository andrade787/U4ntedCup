import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InformacoesTime from "./Informacoes";
import ConfiguracoesTime from "./Configuracoes";

export default function EditarTime() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-full"><Settings2 size={18} /> Editar Time</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edite o seu time</DialogTitle>
          <DialogDescription>
            Escolha as preferências do seu time
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="infos" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="infos">Informações</TabsTrigger>
            <TabsTrigger className="w-full" value="configs">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="infos">
            <InformacoesTime />
          </TabsContent>
          <TabsContent value="configs">
            <ConfiguracoesTime />
          </TabsContent>
        </Tabs>
        <Button className="flex items-center gap-2"><Save size={18} />Salvar Alterações</Button>
      </DialogContent>
    </Dialog>
  );
}
