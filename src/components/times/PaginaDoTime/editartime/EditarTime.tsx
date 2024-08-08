// components/EditarTime.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformacoesTime from "./Informacoes";
import ConfiguracoesTime from "./Configuracoes";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useTeam } from "@/context/TeamContext";
import { useRouter } from "next/router";

export default function EditarTime() {
  const { toast } = useToast();
  const { team } = useTeam();
  const [localTeam, setLocalTeam] = useState(team);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasChanges(JSON.stringify(team) !== JSON.stringify(localTeam));
  }, [localTeam, team]);

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: "Sem Alterações",
        description: "Nenhuma alteração foi feita.",
        variant: 'info'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/teams/update-team', {
        id: localTeam.id,
        name: localTeam.name,
        privacy: localTeam.privacy
      });

      toast({
        title: "Sucesso",
        description: response.data.message,
        variant: 'success'
      });
      router.push(`/times/${response.data.url}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Erro",
          description: error.response?.data?.error || "Erro desconhecido.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro desconhecido.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 max-sm:max-w-40 w-full" disabled={isSubmitting}>
          <Settings2 size={18} /> Editar Time
        </Button>
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
            <InformacoesTime localTeam={localTeam} setLocalTeam={setLocalTeam} />
          </TabsContent>
          <TabsContent value="configs">
            <ConfiguracoesTime localTeam={localTeam} setLocalTeam={setLocalTeam} />
          </TabsContent>
        </Tabs>
        <Button className="flex items-center gap-2" onClick={handleSave} disabled={isSubmitting}>
          <Save size={18} /> Salvar Alterações
        </Button>
      </DialogContent>
    </Dialog>
  );
}
