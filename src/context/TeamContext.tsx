import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TeamContextProps, TeamProviderProps, TeamPlayers } from "@/lib/types";

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider = ({ team, players, children, user }: TeamProviderProps) => {
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayers[]>(players);

  useEffect(() => {
    setTeamPlayers(players)
  }, [players]);



  return (
    <TeamContext.Provider value={{ team, players: teamPlayers, user, setTeamPlayers }}>
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
