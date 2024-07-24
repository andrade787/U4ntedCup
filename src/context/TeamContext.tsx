// context/TeamContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { TeamContextProps } from "@/lib/types";

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider = ({ team, children }: { team: any, children: ReactNode }) => {
  return (
    <TeamContext.Provider value={{ team }}>
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
