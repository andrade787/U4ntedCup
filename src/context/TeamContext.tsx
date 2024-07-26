// context/TeamContext.tsx
import { createContext, useContext, useState } from "react";
import { TeamContextProps, TeamProviderProps, TeamInfos } from "@/lib/types";

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider = ({ team, children, user }: TeamProviderProps) => {
  const [currentTeam, setCurrentTeam] = useState<TeamInfos>(team);

  const updateTeam = (updates: Partial<TeamInfos>) => {
    setCurrentTeam((prevTeam) => ({ ...prevTeam, ...updates }));
  };

  return (
    <TeamContext.Provider value={{ team: currentTeam, user, updateTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
