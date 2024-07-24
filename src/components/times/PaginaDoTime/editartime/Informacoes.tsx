import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ImageDown, ImageUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

export default function InformacoesTime() {
  const [logo, setLogo] = useState<File | null>(null);
  const [teamName, setTeamName] = useState('');
  const { toast } = useToast();

  const schema = useMemo(() => z.object({
    teamName: z.string()
      .min(2, { message: "O Nome do Time é obrigatório" })
      .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Nome do Time deve conter apenas letras, números, espaços, underscores ou hifens" }),
    logo: z.custom<File>((file) => file instanceof File, {
      message: "O logo do time é obrigatório"
    }).refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "A logo deve ter no máximo 2MB"
    }).refine((file) => ["image/webp", "image/png", "image/jpg", "image/jpeg"].includes(file.type), {
      message: "Formato de arquivo não suportado. Use webp, png, jpg ou jpeg"
    })
  }), []);

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
  }, [toast, schema.shape.logo]);

  return (
    <div className="flex flex-col space-y-2 mt-4 mb-5">
      <div className="mb-3">
        <Label>Nome do Time</Label>
        <Input
          placeholder="Informe o nome do seu time"
        />
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
    </div>
  );
}