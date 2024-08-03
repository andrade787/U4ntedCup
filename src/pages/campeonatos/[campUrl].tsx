import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { firestore } from '@/firebase/firebaseAdmin';
import { AlignStartVertical, FilePenLine, InfoIcon, Table2, UsersRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Infos from "@/components/campeonatos/Infos";
import TeamsCamp from "@/components/campeonatos/TeamsCamp";
import EnterCamp from '@/components/campeonatos/EnterCamp';
import CampNotFound from '@/components/campeonatos/CampNotFound';
import { useUser } from '@/context/UserContext';
import { withUser } from '@/lib/auth';
import { Tournament, User, TeamInfos, TeamPlayers } from '@/lib/types';
import { ValorantIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import GroupStage from '@/components/campeonatos/GroupStage';
import PlayOffs from '@/components/campeonatos/PlayOffs';
import Rules from '@/components/campeonatos/Rules';

interface CampeonatoProps {
  tournament: Tournament;
  notFound: boolean;
  campUrl: string;
  user: User;
}

const MAX_TEAMS = 10; // Número máximo de times permitidos

const Campeonato = ({ tournament, notFound, campUrl, user }: CampeonatoProps) => {
  const { setUser } = useUser();
  const [tournamentInfo, setTournamentInfo] = useState<Tournament | null>(null);
  const [participatingTeams, setParticipatingTeams] = useState<(TeamInfos & { players: TeamPlayers[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserTeamParticipating, setIsUserTeamParticipating] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(MAX_TEAMS); // Estado para vagas restantes

  useEffect(() => {
    if (user) {
      setUser(user);
    }
    if (tournament) {
      setTournamentInfo(tournament);
    }
  }, [user, tournament, setUser]);
  useEffect(() => {
    const fetchParticipations = async () => {
      if (tournamentInfo) {
        try {
          setLoading(true);
          const response = await fetch(`/api/participations?tournamentId=${tournamentInfo.id}`);
          if (response.ok) {
            const teams: (TeamInfos & { players: TeamPlayers[] })[] = await response.json();
            setParticipatingTeams(teams);
            console.log(teams)
            const remainingSlotsCount = MAX_TEAMS - teams.length;
            setRemainingSlots(remainingSlotsCount > 0 ? remainingSlotsCount : 0);
            if (user) {
              const isUserParticipating = teams.some((team) => team.id === user.activeTeamId);
              setIsUserTeamParticipating(isUserParticipating);
            }
          } else {
            console.error('Failed to fetch participations');
          }
        } catch (error) {
          console.error('Error fetching participations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchParticipations();
  }, [tournamentInfo, user]);

  if (notFound) {
    return <CampNotFound campUrl={campUrl} />;
  }

  return (
    <div>
      <div className="w-full h-96 relative opacity-35 bg-[url('https://firebasestorage.googleapis.com/v0/b/uanted.appspot.com/o/Tournament%2F672b17199778379.665743d0d31f4.webp?alt=media&token=415a5ae1-cb87-45ad-87b6-52e800221f49')] bg-cover bg-center" />
      <div className="relative z-10 -top-32">
        <div className="absolute bg-gradient-to-t from-zinc-950 w-full -z-10 h-20 top-14"></div>
        <div className="container px-3">
          <div className="bg-zinc-900/60 backdrop-blur rounded-2xl py-5 px-3">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex">
                  <h1 className="text-4xl font-semibold mb-1 max-md:text-center">{tournament!.name}</h1>
                </div>
                <div className="font-normal flex flex-wrap max-md:text-center max-md:justify-center items-center gap-1">
                  <h3 className='text-zinc-300 flex items-center gap-1'>Campeonato de <ValorantIcon size={20} />{tournament!.game}</h3>
                  <h3>De {new Date(tournament!.startDate).toLocaleDateString()} até {new Date(tournament!.endDate).toLocaleDateString()}</h3>
                </div>
              </div>
              <div className="flex flex-col max-md:justify-center max-md:w-full max-md:mt-2 items-center">
                {loading && <div className='flex flex-col items-center gap-2'><Skeleton className='w-60 h-10 bg-zinc-700' /><Skeleton className='w-32 h-5 bg-zinc-700' /> </div>}
                {!loading && tournamentInfo && !isUserTeamParticipating && user && user.activeTeamId && (
                  <EnterCamp user={user} tournamentInfo={tournamentInfo} />
                )}
                {!loading && (
                  <p className="text-yellow-500 font-semibold mt-1">Restam {remainingSlots} Vagas</p>
                )}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <Tabs defaultValue="infos" className="w-full">
              <TabsList className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] h-auto ">
                <TabsTrigger className="text-base" value="infos"><InfoIcon className="mr-1" size={18} />Informações</TabsTrigger>
                <TabsTrigger className="text-base" value="rules"><FilePenLine className="mr-1" size={18} />Regras</TabsTrigger>
                <TabsTrigger className="text-base" value="teams"><UsersRound className="mr-1" size={18} />Times</TabsTrigger>
                <TabsTrigger className="text-base" value="group_stage"><Table2 className="mr-1" size={18} />Fase de Grupos</TabsTrigger>
                <TabsTrigger className="text-base" value="playoffs"><AlignStartVertical className="mr-1" size={18} />PlayOffs</TabsTrigger>
              </TabsList>
              <TabsContent value="infos">
                <Infos />
              </TabsContent>
              <TabsContent value="rules">
                <Rules />
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  campUrl: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campUrl } = context.params!;
  const user = await withUser(context);

  const tournamentRef = firestore.collection('tournaments').where('campUrl', '==', campUrl);
  const snapshot = await tournamentRef.get();

  if (snapshot.empty) {
    return {
      props: {
        notFound: true,
        campUrl,
        user
      },
    };
  }

  const tournamentDoc = snapshot.docs[0];
  const tournamentData = tournamentDoc.data();
  const tournament = {
    id: tournamentDoc.id,
    name: tournamentData.name,
    game: tournamentData.game,
    startDate: tournamentData.startDate.toMillis(),
    endDate: tournamentData.endDate.toMillis(),
    status: tournamentData.status,
    createdAt: tournamentData.createdAt.toMillis(),
  };

  return {
    props: {
      tournament,
      user
    },
  };
};

export default Campeonato;
