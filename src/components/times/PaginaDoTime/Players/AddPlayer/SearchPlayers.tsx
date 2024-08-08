import { Frown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/inputsearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingAddPlayerTime from "./Loading";
import { TeamInfos, TeamPlayers } from "@/lib/types";
import { useState, useEffect } from "react";
import PlayerItem from "./PlayerItem";

interface Player {
  playerId: string;
  nickname: string;
  photoURL: string | null;
  url: string;
  requestStatus: string;
  type: string;
}

interface SearchPlayersProps {
  team: TeamInfos;
  players: TeamPlayers[];
}

const ITEMS_PER_PAGE = 5;

export default function SearchPlayers({ team, players }: SearchPlayersProps) {
  const [searchValue, setSearchValue] = useState('');
  const [Players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const response = await fetch('/api/teams/search-players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamId: team.id,
          teamPlayers: players
        })
      });
      const data: Player[] = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
      setLoading(false);
    };

    fetchPlayers();
  }, [team.id, players]); // Remover Players da lista de dependências

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setPage(1);
    filterPlayers(value);
  };

  const filterPlayers = (searchTerm: string) => {
    const filtered = Players.filter(player =>
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);
  };

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleStatusChange = (playerId: string, newStatus: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.playerId === playerId ? { ...player, requestStatus: newStatus } : player
      )
    );
    setFilteredPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.playerId === playerId ? { ...player, requestStatus: newStatus } : player
      )
    );
  };

  const displayedPlayers = filteredPlayers.slice(0, ITEMS_PER_PAGE * page);

  return (
    <>
      <SearchInput
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Pesquisar Jogador"
      />
      {loading ? (
        <LoadingAddPlayerTime />
      ) : (
        <div className="flex flex-col">
          <ScrollArea className="h-52">
            <div className="space-y-2">
              {displayedPlayers.length > 0 ? (
                displayedPlayers.map(({ playerId, nickname, url, photoURL, requestStatus, type }) => (
                  <PlayerItem
                    key={playerId}
                    playerId={playerId}
                    teamId={team.id}
                    nickname={nickname}
                    url={url}
                    photoURL={photoURL}
                    requestStatus={requestStatus}
                    type={type}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : searchValue ? (
                <div className="flex flex-col justify-center items-center p-2">
                  <Frown className="mb-1" size={40} />
                  <p className="text-center">Jogador não encontrado <br />com o nick <span className='bg-zinc-900 p-1 rounded-xl'>{searchValue}</span></p>
                  <p className="text-sm text-zinc-400 text-center">Confira se o nick está correto ou se o jogador já faz parte de uma outra equipe.</p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center p-2">
                  <Frown className="mb-1" size={40} />
                  <p className="text-center">No momento, não há nenhum jogador disponível para você convidar.</p>
                  <p className="text-sm text-zinc-400 text-center">Se você já possui um time completo e quer adicionar novos membros, peça que todos os jogadores criem uma conta para que você possa convidá-los.</p>
                </div>
              )}
            </div>
            {filteredPlayers.length > displayedPlayers.length && (
              <Button variant='ghost' className="flex gap-1 w-full rounded-t-none" onClick={handleShowMore}>
                <PlusCircle size={17} /> Mostrar Mais
              </Button>
            )}
          </ScrollArea>
        </div>
      )}
    </>
  );
}
