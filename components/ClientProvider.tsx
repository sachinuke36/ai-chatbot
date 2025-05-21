"use client";
import { ThemeProvider } from "next-themes";
import { AppContext } from "@/contexts/AppContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppContext>
        {children}
      </AppContext>
    </ThemeProvider>
  );
}
