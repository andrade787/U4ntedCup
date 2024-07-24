import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ValorantIcon } from "@/components/icons";
import { LockKeyhole, Users } from "lucide-react";
import Image from "next/image";
import { firestore } from '@/firebase/firebaseAdmin';
import EditarTime from "@/components/times/PaginaDoTime/editartime/EditarTime";
import { TabNavigation, PlayersDoTime, PartidasDoTime, CampeonatosDoTime, TeamNotFound } from '@/components/times/PaginaDoTime/tabs';
import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { TimesProps } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { ComeIn } from "@/components/times/PaginaDoTime/comein";
import { TeamProvider } from "@/context/TeamContext";
import React from "react";

type TabType = 'players' | 'partidas' | 'campeonatos';

const TimePage = ({ user, team, ValueUrl }: TimesProps) => {
  const { setUser } = useUser();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const validTabs: TabType[] = ['players', 'partidas', 'campeonatos'];
    setActiveTab(validTabs.includes(tab as TabType) ? (tab as TabType) : 'players');
    setIsReady(true);
  }, [tab]);

  const handleTabChange = (newTab: TabType) => {
    router.push({
      pathname: router.pathname,
      query: { tab: newTab },
    }, undefined, { shallow: true });
    setActiveTab(newTab);
  };

  if (!isReady) {
    return null;
  }

  if (!team) {
    return (
      <TeamNotFound ValueUrl={ValueUrl} />
    );
  }

  return (
    <section className="">
      <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
        <div className="container px-3 pt-36">
          <div className="flex justify-between items-center bg-gradient-to-l from-zinc-900 backdrop-blur-xl rounded-xl">
            <Image className="rounded-l-xl" src={team.logo} width={200} height={200} alt={team.name} />
            <div className="flex w-full items-center flex-col justify-center">
              <h1 className="font-semibold text-3xl mb-1">{team.name}</h1>
              <div className="flex gap-2">
                <p className="flex items-center gap-2"><Users size={16} /> {team.players.length} Players</p>
                <p className="flex gap-2">| <ValorantIcon /></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mr-3">
              <EditarTime />
              <div>
                <div className="flex items-center justify-center gap-1 p-1 bg-zinc-800 rounded-xl">
                  <LockKeyhole size={18} />
                  <h3>Time {team.privacy === 'private' ? 'Privado' : 'Público'}</h3>
                </div>
                <ComeIn />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-t pt-16 pb-32 from-zinc-950 from-55%">
          <div className="container px-3">
            <div className='w-full'>
              <div className='flex border border-zinc-400/20 bg-zinc-950/30 rounded-xl'>
                <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
              </div>
            </div>

            {activeTab === 'players' && <PlayersDoTime />}
            {activeTab === 'partidas' && <PartidasDoTime />}
            {activeTab === 'campeonatos' && <CampeonatosDoTime />}
          </div>
        </div>
      </div>
    </section>
  );
};

const Time = ({ user, team, ValueUrl }: TimesProps) => {
  return (
    <TeamProvider team={team}>
      <TimePage user={user} ValueUrl={ValueUrl} team={team} />
    </TeamProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const user = await withUser(context);

  if (!params?.url || typeof params.url !== 'string') {
    const ValueUrl = params?.url;
    return {
      props: {
        ValueUrl,
        user,
        team: null,
      },
    };
  }

  try {
    const teamSnapshot = await firestore.collection('teams').where('url', '==', params.url).get();
    if (teamSnapshot.empty) {
      const ValueUrl = params?.url;
      return {
        props: {
          ValueUrl,
          user,
          team: null,
        },
      };
    }

    const teamData = teamSnapshot.docs[0].data();
    console.log('teamData:', teamData);
    return {
      props: {
        user,
        team: teamData,
      },
    };
  } catch (error) {
    return {
      props: {
        params,
        user,
        team: null,
      },
    };
  }
};

export default React.memo(Time);
