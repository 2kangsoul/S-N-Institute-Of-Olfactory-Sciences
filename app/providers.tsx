"use client";

import { MantineProvider } from "@mantine/core";
// import ChatBot from "@/src/Features/chatbot/Components/ChatBot";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        {children}
        {/* <ChatBot /> */}
      </MantineProvider>
    </QueryClientProvider>
  );
}
