import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../types/user";

export interface AppContextProps {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

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
  const [currentUser, setCurrentUser] = useState<User>({} as User);

  const value: AppContextProps = {
    currentUser,
    setCurrentUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
