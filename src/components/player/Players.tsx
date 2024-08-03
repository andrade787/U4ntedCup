import { useState, useEffect, useCallback } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Frown } from "lucide-react";

type Player = {
  nickname: string;
  name: string;
  photoURL: string;
  capaUrl: string;
  url: string;
};

interface PlayersUantedCupProps {
  search: string;
}

export default function PlayersUantedCup({ search }: PlayersUantedCupProps) {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const playersPerPage = 6;

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/player/getplayer', {
        method: 'POST',
      });
      const data: Player[] = await response.json();
      setAllPlayers(data);
      setFilteredPlayers(data); // Inicialmente, todos os jogadores são considerados como filtrados.
      setDisplayedPlayers(data.slice(0, playersPerPage));
      setPage(1);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = useCallback(() => {
    const filtered = allPlayers.filter((player) => {
      const nickname = player.nickname ? player.nickname.toLowerCase() : '';
      const name = player.name ? player.name.toLowerCase() : '';
      return nickname.includes(search.toLowerCase()) || name.includes(search.toLowerCase());
    });
    setFilteredPlayers(filtered);
    setDisplayedPlayers(filtered.slice(0, playersPerPage));
    setPage(1); // Resetar a página ao filtrar
  }, [allPlayers, search, playersPerPage]);

  const loadMorePlayers = useCallback(() => {
    const startIndex = (page - 1) * playersPerPage;
    const newPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage);
    setDisplayedPlayers((prevPlayers) => [...prevPlayers, ...newPlayers]);
  }, [filteredPlayers, page, playersPerPage]);

  useEffect(() => {
    filterPlayers();
  }, [search, allPlayers, filterPlayers]);

  useEffect(() => {
    if (page > 1) {
      loadMorePlayers();
    }
  }, [page, loadMorePlayers]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-7">
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="flex flex-col flex-1 min-w-96 rounded-xl">
                <div className="flex flex-col w-full items-center justify-center p-3">
                  <Skeleton className="w-28 h-28 rounded-full bg-zinc-700" />
                  <Skeleton className="w-32 h-6 mt-3 bg-zinc-700" />
                  <Skeleton className="w-24 h-4 mt-2 bg-zinc-700" />
                </div>
                <div className="flex justify-center w-full">
                  <Skeleton className="w-full h-9 mt-2 bg-zinc-700 rounded-t-none rounded-b-xl" />
                </div>
              </Skeleton>
            ))}
          </>
        ) : (
          <>
            {displayedPlayers.length > 0 ? (
              displayedPlayers.map((player, index) => {
                const backgroundUrl = player.capaUrl ? player.capaUrl : '/assets/images/uanted_thumb.png';
                return (
                  <div key={index} className="flex flex-col bg-zinc-900 rounded-xl animate-in fade-in-30">
                    <div className="flex flex-col items-center justify-center p-4 relative">
                      <div className="w-full h-full rounded-xl opacity-40 bg-no-repeat bg-cover bg-center absolute" style={{ backgroundImage: `url('${backgroundUrl}')` }}></div>
                      <div className="w-full h-full rounded-xl from-20% bg-gradient-to-t from-zinc-900 absolute"></div>
                      <div className="relative w-full flex flex-col items-center justify-center">
                        <Avatar className="w-28 h-28 mb-2">
                          <AvatarImage src={player.photoURL}></AvatarImage>
                          <AvatarFallback className="bg-zinc-800 flex w-full items-center justify-center text-2xl font-semibold">
                            {player.nickname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-center">{player.nickname}</h3>
                        <h4 className="text-sm text-zinc-400 text-center">{player.name}</h4>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Link href={'/player/' + player.url} className="w-full">
                        <Button className="w-full rounded-t-none rounded-b-xl">Ver Perfil</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-gradient-to-r from-zinc-900 rounded-xl p-3 animate-in fade-in-65 w-full flex justify-center">
                <h3 className="flex gap-2 items-center text-lg">
                  <Frown /> Nenhum player encontrado com o nick <span className="font-semibold">{search}</span>
                </h3>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex justify-center mt-8">

        <Button variant='outline' onClick={handleLoadMore} disabled={loading || (page * playersPerPage >= filteredPlayers.length)}>
          {loading ? 'Buscando Jogadores..' : 'Ver Mais'}
        </Button>
      </div>
    </div>
  );
}
