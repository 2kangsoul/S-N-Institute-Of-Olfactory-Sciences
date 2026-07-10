"use client";

import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/src/stores/useAuthStore";
import ChatBot from "@/src/Features/chatbot/Components/ChatBot";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { fetchCurrentUser } = useAuthStore();

  // Sama seperti App.tsx lama: restore sesi user saat pertama load
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MantineProvider>
      <Toaster position="top-center" containerStyle={{ zIndex: 999999 }} />
      {children}
      <ChatBot />
    </MantineProvider>
  );
}
