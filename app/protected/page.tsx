import Chats from "@/components/Chats";
import InputForm from "@/components/InputForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // 🟡 Fetch chat history
  const { data: chatHistory, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  
    // console.log(chatHistory)

  if (error) {
    console.error("Error fetching chat history:", error.message);
  }

  return (
    <div className="w-[300px] sm:w-[500px] md:w-[1024px] flex flex-col justify-between h-[85vh] max-w-[1024px] mx-auto">
      {/* ai responses */}
      <Chats chats={chatHistory || []} />

      {/* input */}
      <InputForm userId={user.id} />
    </div>
  );
}
