import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { AlignStartVertical, FilePenLine, InfoIcon, LandPlot, LogIn, Table2, UsersRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Infos from "@/components/campeonatos/Infos";
import TeamsCamp from "@/components/campeonatos/TeamsCamp";
import CampNotFound from '@/components/campeonatos/CampNotFound';
import { withUser } from '@/lib/auth';
import { ValorantIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import GroupStage from '@/components/campeonatos/GroupStage';
import PlayOffs from '@/components/campeonatos/PlayOffs';
import Rules from '@/components/campeonatos/Rules';
import Participation from '@/components/campeonatos/participation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TournamentProvider, useTournament } from '@/context/TournamentContext';
import { Tournament, User } from '@/lib/types';
import Matchs from '@/components/campeonatos/matchs';
import { useUser } from '@/context/UserContext';
import SEO from '@/components/SEO';

interface CampeonatoProps {
  tournament: Tournament | null;
  notFound: boolean;
  campUrl: string;
  user: User;
}

const CampeonatoContent = () => {
  const { tournament, notFound, campUrl, user, tournamentTeams, SoldOut, teamsRemaining } = useTournament();
  const { playerTeam, playerTeamLoading } = useUser();

  console.log(playerTeam);


  if (notFound) {
    return <CampNotFound campUrl={campUrl} />;
  }

  return (
    <>
      <SEO
        title={`${tournament?.name} | U4nted Cup`}
        description={`Participe do ${tournament?.name} na U4nted Cup. Jogue, compita e ganhe prêmios incríveis!`}
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url={`https://www.u4ntedcup.com.br/${tournament?.campUrl}`}
        image={`${tournament?.campUrl}`}
        twitterHandle="u4ntedcup"
      />
      <div>
        <div className="w-full h-96 relative opacity-35 bg-[url('https://firebasestorage.googleapis.com/v0/b/uanted.appspot.com/o/Tournament%2F672b17199778379.665743d0d31f4.webp?alt=media&token=415a5ae1-cb87-45ad-87b6-52e800221f49')] bg-cover bg-center" />
        <div className="relative z-10 -top-32">
          <div className="absolute bg-gradient-to-t from-zinc-950 w-full -z-10 h-20 top-14"></div>
          <div className="container px-3">
            <div className="bg-zinc-900/60 backdrop-blur rounded-2xl py-5 px-3">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    <h1 className="text-4xl font-semibold mb-1 max-md:text-center">{tournament?.name}</h1>
                  </div>
                  <div className="font-normal flex flex-wrap max-md:text-center max-md:justify-center items-center gap-1">
                    <h3 className='text-zinc-300 flex items-center gap-1'>Campeonato de <ValorantIcon size={20} />{tournament!.game}</h3>

                    <h3>De {new Date(tournament!.startDate).toLocaleDateString()} até {new Date(tournament!.endDate).toLocaleDateString()}</h3>
                  </div>
                </div>
                <div className="flex flex-col max-md:justify-center max-md:w-full max-md:mt-2 items-center">

                  {!tournamentTeams && !playerTeamLoading &&
                    <div className='flex flex-col items-center gap-2'><Skeleton className='w-60 h-10 bg-zinc-700' /><Skeleton className='w-32 h-5 bg-zinc-700' /> </div>
                  }


                  {tournament && tournamentTeams && !playerTeamLoading && user &&
                    <div className='animate-in zoom-in'>
                      <Participation user={user} tournament={tournament} playerTeam={playerTeam} tournamentTeams={tournamentTeams} teamsRemaining={teamsRemaining} />
                    </div>
                  }

                  {!user && tournamentTeams &&
                    <div className='animate-in zoom-in'>
                      {SoldOut ? (<p className="text-yellow-500 font-semibold mt-1 text-center">Vagas Esgotadas</p>)
                        : (
                          <>
                            <Link href='/login'><Button className='w-60'><LogIn size={19} className='mr-1' /> Participar</Button></Link>
                            <p className="text-yellow-500 font-semibold mt-1 text-center">Restam {teamsRemaining} Vagas</p>
                          </>
                        )
                      }
                    </div>
                  }


                </div>
              </div>
            </div>
            <div className="pt-5">
              <Tabs defaultValue="infos" className="w-full">
                <TabsList className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] h-auto ">
                  <TabsTrigger className="text-base" value="infos"><InfoIcon className="mr-1" size={18} />Informações</TabsTrigger>
                  <TabsTrigger className="text-base" value="rules"><FilePenLine className="mr-1" size={18} />Regras</TabsTrigger>
                  <TabsTrigger className="text-base" value="teams"><UsersRound className="mr-1" size={18} />Times</TabsTrigger>
                  <TabsTrigger className="text-base" value="partidas"><LandPlot className="mr-1" size={18} />Partidas</TabsTrigger>
                  <TabsTrigger className="text-base" value="group_stage"><Table2 className="mr-1" size={18} />Fase de Grupos</TabsTrigger>
                  <TabsTrigger className="text-base" value="playoffs"><AlignStartVertical className="mr-1" size={18} />PlayOffs</TabsTrigger>
                </TabsList>
                <TabsContent value="infos">
                  <Infos tournament={tournament} />
                </TabsContent>
                <TabsContent value="rules">
                  <Rules tournament={tournament} />
                </TabsContent>
                <TabsContent value="teams">
                  <TeamsCamp />
                </TabsContent>
                <TabsContent value="group_stage">
                  <GroupStage />
                </TabsContent>
                <TabsContent value="playoffs">
                  <PlayOffs />
                </TabsContent>
                <TabsContent value="partidas">
                  <Matchs />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Campeonato = ({ tournament, notFound, campUrl, user }: CampeonatoProps) => (
  <TournamentProvider tournament={tournament} notFound={notFound} campUrl={campUrl} user={user}>
    <CampeonatoContent />
  </TournamentProvider>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campUrl } = context.params!;
  const user = await withUser(context);

  let tournament = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${campUrl}?type=url`);
    if (response.ok) {
      tournament = await response.json();
    } else {
      console.error('Error fetching tournament data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching tournament data:', error);
  }

  if (!tournament) {
    return {
      notFound: true,
      props: {
        user
      },
    };
  }

  return {
    props: {
      tournament,
      user
    },
  };
};

export default Campeonato;
