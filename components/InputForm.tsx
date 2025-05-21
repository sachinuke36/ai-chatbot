'use client';

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Send, Loader2 } from "lucide-react"; // Loader2 is the spinner icon
import { handleForm } from "@/app/protected/action";
import { useAppContext } from "@/contexts/AppContext";
import { Chat } from "./Chats";

const InputForm = ({ userId }: { userId: string }) => {
  const context = useAppContext();
  if (!context) {
    throw new Error("InputForm must be used within an AppContextProvider");
  }

  const { setChats } = context;
  const [loading, setLoading] = useState(false); // 🔧 new state

  return (
    <form
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const question = formData.get("question")?.toString() || "";
        if (!question) return;

        setLoading(true); // start loading

        try {
          const { answer } = await handleForm(formData);
          if (answer) {
            setChats((prev: Chat[]) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                user_id: userId,
                question,
                answer,
                created_at: new Date().toISOString(),
              },
            ]);
          }
          form.reset(); // clear form
        } catch (err) {
          console.error("Error submitting:", err);
        } finally {
          setLoading(false); // stop loading
        }
      }}
      encType="multipart/form-data"
      className="h-[15%] w-full relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col h-full w-[90%] p-2 gap-2">
          <input type="hidden" name="user_id" value={userId} />
          <Input name="question" placeholder="Enter your question" className="w-full" />
          <Input type="file" name="file" accept="application/pdf" className="w-full" />
        </div>
        <button
          type="submit"
          disabled={loading} // 🛑 disable while loading
          className="h-[50px] w-[50px] flex justify-center items-center bg-gray-700 p-2 rounded-full disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin text-white" size={20} /> : <Send />}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
