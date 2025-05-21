"use client";
import { useAppContext } from "@/contexts/AppContext";
import React, { useEffect, useRef, useState } from "react";

export type Chat = {
  id?: string;
  user_id?: string;
  question: string;
  answer: string;
  created_at: string;
};

const Chats = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
const { setChats, chats }:any = useAppContext()  
const [isClient, setIsClient] = useState<boolean>(false);

// useEffect(()=>{
//   setIsClient(true);
//   setChats(chat);
// },[])


  useEffect(() => {
    setIsClient(true);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]); // scrolls when chats change

  if (!isClient) return null; // ✅ avoid hydration mismatch

  return (
    <div className="w-full h-[85%] bg-gray-900 p-4 overflow-y-auto space-y-4 text-white">
      {chats.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No messages yet.</p>
      ) : (
        <>
          {chats?.map((chat: any) => (
            <div
              key={chat?.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2 shadow"
            >
              <div>
                <p className="text-sm text-blue-400 font-medium">You</p>
                <p className="text-base">{chat?.question}</p>
              </div>
              <div>
                <p className="text-sm text-green-400 font-medium">AI</p>
                <p className="text-base whitespace-pre-wrap">{chat?.answer}</p>
              </div>
             { isClient && <p className="text-xs text-right text-gray-500 italic">
                {new Date(chat.created_at).toLocaleString()}
              </p>}
            </div>
          ))}
          {/* Invisible div to scroll into view */}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

export default Chats;
