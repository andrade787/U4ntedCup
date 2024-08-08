import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import { User, UserContextProps, Notification, TeamInfos } from "@/lib/types";
import { auth, database } from "@/firebase/firebaseConfig";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { ref, onValue, off, DatabaseReference } from "firebase/database";
import router from "next/router";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [playerTeam, setPlayerTeam] = useState<TeamInfos | null>(null);
  const [playerTeamLoading, setPlayerTeamLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<DatabaseReference | null>(null);

  useEffect(() => {
    if (user?.token) {
      signInWithCustomToken(auth, user.token).catch((error) => {
        console.error("Falha na autenticação com o token personalizado", error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchPlayerTeam = async (user: User) => {
        try {
          setPlayerTeamLoading(true);
          const response = await fetch(`/api/player/${user.uid}/teams?status=active`);
          const playerTeamData = await response.json();
          if (response.ok && Array.isArray(playerTeamData) && playerTeamData.length > 0) {
            setPlayerTeam(playerTeamData[0]);
          } else {
            setPlayerTeam(null);
          }
        } catch (error) {
          setPlayerTeam(null);
        } finally {
          setPlayerTeamLoading(false);
        }
      };
      if (!playerTeam) {
        fetchPlayerTeam(user);
      }
    }
  }, [user, playerTeam]);

  const handleValueChange = useCallback((snapshot: any) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const newNotifications: Notification[] = Object.keys(data)
        .map((key) => ({ ...data[key], id: key }))
        .filter((notification) => !notification.isRead);

      setNotifications(newNotifications);
    } else {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      notificationRef.current = ref(database, `notifications/${user.uid}`);
      onValue(notificationRef.current, handleValueChange);

      return () => {
        if (notificationRef.current) {
          off(notificationRef.current, 'value', handleValueChange);
        }
      };
    }
  }, [user, handleValueChange]);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      await signOut(auth);
      setUser(null);
      setNotifications([]);
      console.log("Logout successful");

      // Redirect to /login
      router.push('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, notifications, playerTeam, playerTeamLoading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
