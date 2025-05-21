import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

// const geistSans = Geist({
//   display: "swap",
//   subsets: ["latin"],
// });

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
            <div className="flex-1 w-full border-red-100 flex flex-col gap-2 items-center">
              <nav className="w-full flex justify-center border-red-50 border-b border-b-foreground/10 h-16">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </nav>
              <div className="flex border-red-50 flex-col max-w-5xl ">
                {children}
              </div>
              
            </div>
  );
}
