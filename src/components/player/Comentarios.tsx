import { useEffect, useState } from 'react';
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { usePlayer } from "@/context/PlayerContext";
import ComentarioPlayer from "../ui/textareaPlayer";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import ComentariosPagination from './ComentariosPagination';
import Link from 'next/link';
import { Frown, LoaderCircle } from 'lucide-react';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { Skeleton } from '../ui/skeleton';

interface Comment {
  id: string;
  UserComment: string | null;
  Comment: string;
  Created_at: { _seconds: number; _nanoseconds: number };
  nickname: string | null;
  photoURL: string;
  url?: string | null;
}

const commentSchema = z.object({
  playerId: z.string().trim().min(1, "Player ID é obrigatório"),
  userId: z.string().trim().min(1, "User ID é obrigatório"),
  comment: z.string().trim().min(1, "O comentário não pode estar vazio").max(700, "O comentário deve ter no máximo 700 caracteres")
});

export default function ComentariosPerfil() {
  const { user } = useUser();
  const { toast } = useToast();
  const { playerData, comments, setComments, handleTabClick, tabRef } = usePlayer();
  const [comment, setComment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedComments, setPaginatedComments] = useState<Comment[]>([]);
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Alterado para true inicialmente
  const [commentsLoaded, setCommentsLoaded] = useState(false); // Novo estado para controlar o carregamento de comentários
  const commentsPerPage = 6;
  const initialNick = user?.nickname?.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();

  useEffect(() => {
    if (!commentsLoaded && !noMoreComments) {
      fetchComments();
    }
  }, [commentsLoaded]);

  useEffect(() => {
    updatePaginatedComments();
  }, [comments, currentPage]);

  const fetchComments = async () => {
    try {
      const response = await axios.post<{ comments: Comment[] }>('/api/player/getComment', { playerId: playerData.id });
      console.log('API response:', response.data);
      if (response.data.comments.length === 0) {
        setNoMoreComments(true);
      }
      setComments(response.data.comments.map(comment => ({ ...comment, url: comment.url || null })) || []);
      setCommentsLoaded(true); // Define que os comentários foram carregados
    } catch (error) {
      console.log('Fetch error:', error);
      toast({
        title: "Erro ao buscar comentários",
        description: "Não foi possível carregar os comentários. Tente novamente mais tarde.",
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false); // Atualize o estado de carregamento após a tentativa de busca
    }
  };

  const updatePaginatedComments = () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setPaginatedComments(comments.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleAddComment = async () => {
    if (!user?.uid) return;

    const validation = commentSchema.safeParse({
      playerId: playerData.id,
      userId: user.uid,
      comment: comment.trim()
    });

    if (!validation.success) {
      toast({
        title: "Erro de validação",
        description: validation.error.errors[0].message,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/player/addComment', {
        playerId: playerData.id,
        userId: user.uid,
        comment: comment.trim()
      });

      if (response.data.success) {
        const newComment: Comment = {
          id: uuidv4(),
          UserComment: user.nickname,
          Comment: comment,
          Created_at: { _seconds: Math.floor(Date.now() / 1000), _nanoseconds: 0 },
          nickname: user.nickname,
          photoURL: user.photoURL || "",
          url: user.url || null
        };

        setComments([newComment, ...comments]);

        toast({
          title: response.data.message,
          variant: 'success'
        });

        setComment("");
      } else if (response.data.error) {
        toast({
          title: response.data.error,
          description: response.data.details,
          variant: 'destructive'
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: error.response.data.error || "Erro",
          description: error.response.data.details || "Ocorreu um erro ao realizar o comentário. Por favor tente novamente mais tarde.",
          variant: 'destructive'
        });
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao realizar o comentário. Por favor tente novamente mais tarde.",
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div>
        <h1 className='text-2xl font-bold'>Comentários</h1>
        <hr className="w-full" />
      </div>
      <div className="mt-2 bg-zinc-800 p-2 rounded-xl">
        {user &&
          <div className="flex bg-zinc-900 w-full p-2 rounded-xl">
            <Avatar className="flex items-center justify-center bg-zinc-800 mr-2">
              <AvatarImage src={user?.photoURL || undefined}></AvatarImage>
              <AvatarFallback>{initialNick}</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col">
              <Textarea
                minHeight="min-h-12"
                maxLength={700}
                placeholder="Comentar..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {comment.trim() !== "" && (
                <div className="flex animate-in fade-in-40 justify-end mt-3">
                  {!isLoading ? (
                    <Button variant='secondary' onClick={handleAddComment}>Publicar Comentário</Button>
                  ) : (
                    <Button className='flex items-center' variant='secondary' disabled><LoaderCircle className='animate-spin mr-1' size={18} /> Publicando Comentário...</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        }

        <div className="mt-4 mb-6 space-y-2">
          {isLoading ? (
            // Mostrar esqueleto de carregamento enquanto carrega
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="flex bg-zinc-900 rounded-xl py-2">
                <Skeleton className="flex items-center w-11 h-11 rounded-full justify-center bg-zinc-800 m-2" />
                <div className="flex flex-col w-full">
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className="flex bg-zinc-800 rounded-xl mt-3 h-20 w-1/2" />
                </div>
              </Skeleton>
            ))
          ) : (
            paginatedComments.length > 0 ? paginatedComments.map((com) => (
              <div key={com.id} className="flex animate-in fade-in-50 hover:bg-zinc-700/50 rounded-xl transition-colors py-2">
                <Link target='_blank' href={'/player/' + com.url} className='hover:brightness-50 transition-all'>
                  <Avatar className="flex items-center justify-center bg-zinc-900 m-2">
                    <AvatarImage src={com.photoURL || undefined}></AvatarImage>
                    <AvatarFallback>{com.nickname?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col w-full">
                  <div className='flex items-center gap-2'>
                    <Link target='_blank' href={'/player/' + com.url} className="flex items-center mb-1 transition-colors hover:text-zinc-300 text-zinc-100">{com.nickname}</Link>
                    <h4 className="text-xs text-zinc-200">- {formatTimestamp(com.Created_at)}</h4>
                  </div>
                  <ComentarioPlayer text={com.Comment.trim()} />
                </div>
              </div>
            )) : <h3 className='text-zinc-200 flex items-center gap-2 justify-center'><Frown /> Nenhum comentário encontrado no perfil de<span className='font-semibold'>{user?.nickname}</span> até o momento..</h3>
          )}
        </div>
        <ComentariosPagination
          currentPage={currentPage}
          totalPages={Math.ceil(comments.length / commentsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
