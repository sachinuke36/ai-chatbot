import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ClientProviders>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <div className="flex flex-col items-center w-[300px] sm:w-[500px] md:w-[1024px] md:max-w-5x ">
                {children}
              </div>
            </div>
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
