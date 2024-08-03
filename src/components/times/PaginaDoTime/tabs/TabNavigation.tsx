// components/TabNavigation.tsx
import React from 'react';
import { Users2, Logs, Trophy } from 'lucide-react';

type TabType = 'players' | 'partidas' | 'campeonatos';

interface TabProps {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabProps> = ({ activeTab, handleTabChange }) => {
  const tabs = [
    { id: 'players', label: 'Players', icon: <Users2 size={20} /> },
    { id: 'partidas', label: 'Partidas', icon: <Logs size={20} /> },
    { id: 'campeonatos', label: 'Campeonatos', icon: <Trophy size={20} /> }
  ];

  return (
    <div className="flex flex-wrap w-full">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`flex flex-1 justify-center items-center gap-2 p-2 ${activeTab === tab.id ? 'bg-zinc-500/20' : 'bg-zinc-800/20 hover:bg-zinc-400/30'
            } ${index === 0 ? 'rounded-l-xl' : index === tabs.length - 1 ? 'rounded-r-xl' : ''} 
          backdrop-blur-xl transition-colors flex-1 cursor-pointer`}
          onClick={() => handleTabChange(tab.id as TabType)}
        >
          <h3 className="text-lg flex items-center gap-2">{tab.icon} {tab.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;
