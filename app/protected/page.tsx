// app/protected/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AppContext } from "@/contexts/AppContext";
import InputForm from "@/components/InputForm";
import Chats from "@/components/Chats";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: chats } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <AppContext initialChats={chats || []}>
      <div className="w-[1024px] flex flex-col justify-between h-[85vh] mx-auto">
        <Chats />
        <InputForm userId={user.id} />
      </div>
    </AppContext>
  );
}
