import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { User } from "../types/user";
import { Room } from "../types/game/room";

export interface AppContextProps {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
  currentRoom: Room;
  setCurrentRoom: Dispatch<SetStateAction<Room>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

// Helper functions for localStorage
const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setLocalStorageItem = <T,>(key: string, value: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("App context must be used within a AppContextProvider");
  }
  return context;
};

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with values from localStorage or empty objects
  const [currentUser, setCurrentUser] = useState<User>(
    getLocalStorageItem("currentUser", {} as User)
  );
  const [currentRoom, setCurrentRoom] = useState<Room>(
    getLocalStorageItem("currentRoom", {} as Room)
  );

  // Persist to localStorage whenever state changes
  useEffect(() => {
    setLocalStorageItem("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    setLocalStorageItem("currentRoom", currentRoom);
  }, [currentRoom]);

  const value: AppContextProps = {
    currentUser,
    setCurrentUser,
    currentRoom,
    setCurrentRoom,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
