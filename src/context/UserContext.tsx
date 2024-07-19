import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/types";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>; // Add logout method
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUser(null);
      } else {
        console.error("Falha ao realizar logout");
      }
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
