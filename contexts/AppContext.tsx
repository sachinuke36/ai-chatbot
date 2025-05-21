"use client";
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { Chat } from "@/components/Chats";

type AppContextType = {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
};

const Context = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => useContext(Context)!;

export const AppContext = ({
  children,
  initialChats = [],
}: {
  children: React.ReactNode;
  initialChats?: Chat[];
}) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  return (
    <Context.Provider value={{ chats, setChats }}>
      {children}
    </Context.Provider>
  );
};
