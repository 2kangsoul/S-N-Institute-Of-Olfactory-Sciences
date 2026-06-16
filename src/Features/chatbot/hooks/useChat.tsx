// File: src/Features/product/hooks/useChat.tsx
import { useState } from "react";

export interface ChatMessage {
  role: "system" | "ai" | "user";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: "ai", 
      content: "Halo! Saya Fragrance AI. Ada yang ingin ditanyakan tentang aroma, notes, atau rekomendasi parfum dengan SPL beast mode?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Tampilkan pesan user di UI
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // PERBAIKAN UTAMA: Kita potong (slice) pesan pertama agar Gemini tidak error
      // Gemini mewajibkan history obrolan selalu dimulai oleh 'User'
      const apiHistory = messages.slice(1).filter(m => m.role !== "system");

      // 2. Kirim pesan ke Backend Vercel kita
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: apiHistory 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error("Terjadi kesalahan pada server AI");
      }

      const data = await response.json();
      
      // 3. Tampilkan balasan asli dari AI di UI
      const aiResponse: ChatMessage = { 
        role: "ai", 
        content: data.reply 
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: "Maaf, sistem sedang sibuk. Silakan coba beberapa saat lagi." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};