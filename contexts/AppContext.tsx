import { Chat } from "@/components/Chats";
import React, { useState, Dispatch, SetStateAction, useContext } from "react";

type AppContextType = {
  chats: any;
  setChats: Dispatch<SetStateAction<any>>;
};

const Context = React.createContext<AppContextType | undefined>(undefined);
export const useAppContext = ()=> useContext(Context);

const AppContext = ({children}:{children: React.ReactNode}) => {
	const [chats, setChats]= useState<Chat[]>([]);
  return (
	<Context.Provider value={{chats, setChats}}>
	  {children}
	</Context.Provider>
  );
};

export { Context, AppContext };