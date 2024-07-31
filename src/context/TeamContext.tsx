import { createContext, useContext, useState, ReactNode } from "react";
import { TeamContextProps, TeamProviderProps, TeamPlayers } from "@/lib/types";

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider = ({ team, team_players: initialPlayers, children, user }: TeamProviderProps) => {
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayers[]>(initialPlayers);



  return (
    <TeamContext.Provider value={{ team, team_players: teamPlayers, user, setTeamPlayers }}>
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
