import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ImageDown, ImageUp, LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  teamName: z.string()
    .min(2, { message: "O Nome do Time é obrigatório" })
    .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Nome do Time deve conter apenas letras, números, espaços, underscores ou hifens" }),
  logo: z.custom<File>((file) => file instanceof File, {
    message: "O logo do time é obrigatório"
  }).refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "A logo deve ter no máximo 2MB"
  }).refine((file) => ["image/webp", "image/png", "image/jpg", "image/jpeg"].includes(file.type), {
    message: "Formato de arquivo não suportado. Use webp, png, jpg ou jpeg"
  }),
  role: z.string().min(1, { message: "A função é obrigatória" })
});

export default function CriarTime() {
  const [logo, setLogo] = useState<File | null>(null);
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const logoUrl = useMemo(() => {
    if (logo) {
      return URL.createObjectURL(logo);
    }
    return null;
  }, [logo]);

  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = schema.shape.logo.safeParse(file);
      if (!validation.success) {
        toast({
          title: 'Erro',
          variant: "destructive",
          description: validation.error.errors[0].message,
        });
        return;
      }
      setLogo(file);
    }
  }, [toast]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const result = schema.safeParse({ teamName, logo, role });

    if (!result.success) {
      result.error.errors.forEach((error) => {
        toast({
          title: 'Erro',
          variant: "destructive",
          description: error.message,
        });
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('logo', logo!);
    formData.append('role', role);

    try {
      const response = await fetch('/api/teams/create-team', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/times/${data.url}`);
      } else {
        toast({
          title: 'Erro',
          variant: "destructive",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        variant: "destructive",
        description: 'Ocorreu um erro ao criar o time. Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  }, [teamName, logo, role, toast, router]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Criar Meu Time</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crie o seu time</DialogTitle>
          <DialogDescription>
            É muito simples e rápido, informe as informações abaixo e clique em Criar Time.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2 mb-4">
            <Label>Nome do Time</Label>
            <Input
              placeholder="Informe o nome do seu time"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2 mb-4">
            <Label>Função</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sua função" />
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
          <div className="flex flex-col space-y-2 mb-4">
            <Label>Logo do Time</Label>
            <input
              type="file"
              accept="image/*"
              id="upload-button"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            {!logo && (
              <Button
                className="flex items-center gap-1"
                variant='outline'
                type="button"
                onClick={() => document.getElementById('upload-button')?.click()}
              >
                <ImageUp />Enviar Logo
              </Button>
            )}
            {logo && logoUrl && (
              <div className="flex items-center gap-5">
                <Image
                  className="w-14 h-14 object-cover rounded-full"
                  alt="Logo do Time"
                  width={60}
                  height={60}
                  src={logoUrl}
                />
                <Button
                  className="flex items-center gap-1"
                  variant='outline'
                  type="button"
                  onClick={() => document.getElementById('upload-button')?.click()}
                >
                  <ImageDown /> Alterar Logo
                </Button>
              </div>
            )}
          </div>
          <Button className="mt-5" type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1">
                <LoaderCircle size={18} className="animate-spin" /> Criando Time...
              </div>
            ) : 'Criar Time'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
