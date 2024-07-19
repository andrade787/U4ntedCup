import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, ImageIcon, TrashIcon } from "lucide-react"; // Import TrashIcon
import imageCompression from 'browser-image-compression';
import { z } from 'zod';
import { useToast } from "@/components/ui/use-toast";

const imageSchema = z.object({
  file: z.instanceof(File).refine(file => file.size <= 1024 * 1024, {
    message: 'A imagem deve ter no máximo 1MB'
  }).refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), {
    message: 'Formato de imagem inválido'
  })
});

interface EditCapaProps {
  capaUrl?: string;
}

export function EditCapa({ capaUrl }: EditCapaProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(capaUrl || null);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const parseResult = imageSchema.safeParse({ file });

      if (!parseResult.success) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: parseResult.error.errors[0]?.message || 'Erro ao selecionar a imagem',
        });
        return;
      }

      // Comprimir a imagem
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      // Converter para WebP
      const convertedFile = await imageCompression(compressedFile, {
        fileType: 'image/webp'
      });

      setSelectedImage(convertedFile);
      setPreviewUrl(URL.createObjectURL(convertedFile));
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('/api/user/changeCapa', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Capa alterada com sucesso",
        });
        setPreviewUrl(data.capaUrl);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error || 'Erro ao alterar a capa',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: 'Erro ao alterar a capa',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/changeCapa', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Capa removida com sucesso",
        });
        setPreviewUrl(null);
        setShowConfirmDelete(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error || 'Erro ao remover a capa',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: 'Erro ao remover a capa',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <ImageIcon size={18} className="mr-2" /> Alterar Capa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{showConfirmDelete ? "Confirmar Exclusão" : "Altere a capa do seu perfil"}</DialogTitle>
        </DialogHeader>
        {showConfirmDelete ? (
          <div className='flex flex-col items-center'>
            <AlertCircle size={50} />
            <h3 className='font-semibold mb-3'>Deseja Realmente Deletar?</h3>
            <div className='flex gap-4'>
              <Button variant='outline' onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
              <Button variant='destructive' onClick={handleDelete}>Sim, deletar</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-5">
              {previewUrl && <img className="w-24 rounded-xl" src={previewUrl} alt="Capa" />}
              <Button variant='outline' onClick={() => document.getElementById('fileInput')?.click()}>
                <ImageIcon size={16} className='mr-2' /> Alterar Capa
              </Button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              {previewUrl && (
                <Button variant='destructive' onClick={() => setShowConfirmDelete(true)}>
                  <TrashIcon size={16} className='mr-2' /> Remover Capa
                </Button>
              )}
            </div>
          </div>
        )}
        {!showConfirmDelete && (
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditCapa;
