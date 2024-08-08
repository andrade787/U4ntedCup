import { useEffect, useState } from "react";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Loader } from "lucide-react";
import imageCompression from 'browser-image-compression';
import { useToast } from "@/components/ui/use-toast";
import { usePlayer } from '@/context/PlayerContext';
import { z } from 'zod';
import { useUser } from "@/context/UserContext";

// Define o schema de validação com Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  nickname: z.string().min(1, { message: "Nick é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  assinaturaPlayer: z.string().min(1, { message: "Assinatura do Player é obrigatória" }),
  photoURL: z.string().url({ message: "URL da foto é inválida" }).nullable().optional(),
});

export default function InfosGerais() {
  const { playerData } = usePlayer();
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(playerData.photoURL);
  const [newName, setNewName] = useState(playerData.firstName);
  const [newNick, setNewNick] = useState(playerData.nickname);
  const [newEmail, setNewEmail] = useState(user?.email);
  const [newSubscription, setNewSubscription] = useState(playerData.assinaturaPlayer);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialName = playerData.firstName.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/webp', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Apenas imagens do tipo webp, jpeg, jpg e png são permitidas.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        setError('O tamanho máximo da imagem é 2MB.');
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/webp'
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedPhoto(e.target?.result as string);
          setError(null);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setError('Erro ao processar a imagem.');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const updatedData = {
      name: newName,
      nickname: newNick,
      photoURL: selectedPhoto,
      email: newEmail,
      assinaturaPlayer: newSubscription,
    };


    // Valida os dados usando o schema do Zod
    const result = formSchema.safeParse(updatedData);
    if (!result.success) {
      setIsLoading(false);
      const formattedErrors = result.error.format();
      const errorMessages = Object.values(formattedErrors).flat().map(err => {
        if (Array.isArray(err)) {
          return err.join(', ');
        } else if (err && typeof err === 'object' && '_errors' in err) {
          return (err as { _errors: string[] })._errors.join(', ');
        }
        return 'Erro de validação';
      });
      setError(errorMessages.join(', '));
      return;
    }

    const response = await fetch('/api/user/UserEdit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const result = await response.json();
      toast({
        variant: "success",
        title: "Perfil atualizado",
        description: "Os dados do perfil foram atualizados com sucesso!",
      });

      setTimeout(() => {
        window.location.href = result.url;
      }, 1200);
    } else {
      const result = await response.json();
      const errorMessage = result.error || 'Erro ao atualizar os dados';
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      });
    }
    setIsLoading(false);

  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-5">
          <Avatar className="w-16 h-16">
            <AvatarImage className="w-full rounded-full object-cover" src={selectedPhoto || playerData.photoURL} />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>
          <Button variant='ghost' type="button" onClick={() => document.getElementById('photo-upload')?.click()}>Alterar Foto</Button>
          <input
            id="photo-upload"
            type="file"
            accept="image/webp, image/jpeg, image/jpg, image/png"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <hr className="w-full my-3" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            value={newEmail || null || undefined}
            type="email"
            required
            onChange={(e) => setNewEmail(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Primeiro Nome
          </Label>
          <Input
            id="name"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Seu Nick
          </Label>
          <Input
            id="username"
            value={newNick}
            required
            onChange={(e) => setNewNick(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription" className="text-right">
            Assinatura do Player
          </Label>
          <Input
            id="subscription"
            required
            maxLength={32}
            value={newSubscription}
            onChange={(e) => setNewSubscription(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-center mt-3">
        <Button type="submit">
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Salvando Informações..
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </div>
    </form>
  );
}
