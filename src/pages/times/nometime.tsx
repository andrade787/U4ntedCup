import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ValorantIcon } from "@/components/icons";
import CampeonatosDoTime from "@/components/times/PaginaDoTime/tabs/Campeonatos";
import PartidasDoTime from "@/components/times/PaginaDoTime/tabs/Partidas";
import PlayersDoTime from "@/components/times/PaginaDoTime/tabs/Players";
import { Button } from "@/components/ui/button";
import { Logs, Settings2, Trophy, Users, Users2 } from "lucide-react";
import Image from "next/image";
import EditarTime from "@/components/times/PaginaDoTime/EditarTime";
import TabNavigation from "@/components/times/PaginaDoTime/tabs/TabNavigation";

type TabType = 'players' | 'partidas' | 'campeonatos';

export default function Time() {
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

  return (
    <section className="">
      <div className="bg-gradient-to-b relative from-Roxo">
        <div className="absolute w-full h-3/4 -z-10 bg-cover bg-center brightness-75 bg-[url(/assets/images/timesbg.webp)]"></div>
        <div className="container px-3 pt-36">

          <div className="flex justify-between items-center bg-zinc-800/20 backdrop-blur-xl rounded-xl">
            <Image className="rounded-l-xl" src='/assets/images/tag_novo_tapa_buraco.jpg' width={200} height={200} alt="nome Time" />
            <div className="flex w-full items-center flex-col justify-center">
              <h1 className="font-semibold text-3xl mb-1">Nome do time</h1>
              <div className="flex gap-2">
                <p className="flex items-center gap-2"><Users size={16} /> 8 Players</p>
                <p className="flex gap-2">| <ValorantIcon /></p>
              </div>
            </div>
            <div>
              <EditarTime />
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
}
