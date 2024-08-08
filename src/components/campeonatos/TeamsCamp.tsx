import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { LoadingPlayers } from './Loading';
import { useTournament } from '@/context/TournamentContext';
import { useSmoothScrollOnView } from '@/lib/SmoothScroll';

export default function TeamsCamp() {
  const { tournamentTeams, teamsWithPlayers, fetchPlayersForTeams, loading } = useTournament();
  const containerRef = useSmoothScrollOnView('.team-card');

  useEffect(() => {
    if (tournamentTeams && !teamsWithPlayers) {
      fetchPlayersForTeams();
    }
  }, [fetchPlayersForTeams, teamsWithPlayers, tournamentTeams]);

  return (
    <div ref={containerRef}>
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl">Times Participantes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-4 team-card">
          {tournamentTeams && tournamentTeams.length === 0 && <h3 className="col-span-3">Nenhum Time Encontrado até o momento</h3>}

          {tournamentTeams && tournamentTeams.map((team) => (
            <div key={team.id} className="rounded-xl bg-zinc-900">
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-2 p-2 ">
                  <Link className="hover:brightness-50 transition-all animate-in zoom-in" href={`/times/${team.url}`} target="_blank">
                    <Image className="object-cover rounded-full h-14 w-14" width={70} height={70} alt={team.name} src={team.logo || 'https://i.pinimg.com/originals/1d/46/27/1d4627f8b0a294c5e98e87f6cdbeaa8d.jpg'} />
                  </Link>
                  <Link className="hover:text-zinc-400 transition-colors animate-in zoom-in" href={`/times/${team.url}`} target="_blank">
                    <h3 className="text-center font-semibold">{team.name}</h3>
                  </Link>
                </div>
                <hr />

                <div className="bg-gradient-to-t from-zinc-800/50 space-y-1 divide-y">
                  {loading ? (
                    <LoadingPlayers />
                  ) : (
                    teamsWithPlayers?.find(t => t.id === team.id)?.players.map((player) => (
                      <div key={player.playerId} className="gap-2 py-2 w-full grid grid-cols-4 justify-center items-center animate-in zoom-in">
                        <div className='flex justify-center'>
                          <Link className="col-span-1 hover:brightness-50 transition-all" href={`/player/${player.url}`} target="_blank">
                            <Avatar className='min-w-72'>
                              <AvatarImage className='w-10 h-10 object-cover rounded-full' src={player.photoURL || undefined} alt={player.nickname} />
                              <AvatarFallback className="flex justify-center bg-zinc-800 rounded-full h-10 w-10 p-2 font-semibold">
                                {player.nickname.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </div>
                        <div className='col-span-3'>
                          <Link className="hover:text-zinc-400 transition-colors" href={`/player/${player.url}`} target="_blank">
                            <h3>{player.nickname}</h3>
                          </Link>
                          <div className="flex items-center gap-1">
                            <Image className="object-cover rounded-full h-4 w-4" width={40} height={40} alt={player.roles[0]} src={'/assets/Valorant/Roles/' + player.roles[0] + '.webp' || 'https://i.pinimg.com/originals/1d/46/27/1d4627f8b0a294c5e98e87f6cdbeaa8d.jpg'} />
                            <p className="text-sm text-zinc-300">{player.roles[0]}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
