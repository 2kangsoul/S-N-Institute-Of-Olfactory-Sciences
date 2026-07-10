// @ts-nocheck
/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // DAFTAR QUICK REPLIES (Bisa Anda ganti teksnya sesuai selera)
  const quickReplies = [
    "Cari Parfum Siang",
    "Parfum Beast Mode",
    "Aroma Manis & Elegan",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Fungsi untuk mengirim pesan dari tombol Quick Reply
  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const formatText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden transform transition-all">
          <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Fragrance AI</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#f8f7f4] flex flex-col gap-3">
            {messages.map((m, i) => {
              if (m.role === "system") return null;

              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-2.5 max-w-[80%] rounded-xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-gray-900 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"}`}
                  >
                    {formatText(m.content)}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2.5 bg-white border border-gray-200 rounded-xl rounded-tl-none shadow-sm">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FITUR QUICK REPLIES DITAMBAHKAN DI SINI */}
          <div className="px-3 pt-2 pb-1 bg-white flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-gray-100">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                disabled={isLoading}
                className="text-[11px] px-3 py-1.5 bg-[#f8f7f4] text-gray-700 rounded-full hover:bg-gray-200 transition-colors border border-gray-200 disabled:opacity-50 flex-shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya rekomendasi parfum..."
              className="input input-sm flex-1 bg-[#f8f7f4] focus:outline-none focus:border-gray-400 rounded-lg text-xs px-3"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn btn-sm bg-gray-900 text-white border-none rounded-lg hover:bg-black disabled:bg-gray-300"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Menampilkan Icon Chat HANYA ketika ChatBox tertutup (!isOpen) sehingga langsung hilang saat diklik */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-transparent border-none p-0 cursor-pointer shadow-2xl hover:scale-105 transition-transform absolute bottom-0 right-0 rounded-full flex items-center justify-center"
        >
          {/* Awan Chat (Chat Bubble) - Dikembalikan ke posisi absolut atas kiri */}
          <div className="absolute right-[60px] bottom-[45px] px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-xl shadow-lg border border-gray-100 whitespace-nowrap rounded-br-none">
            Ai Fragrance
          </div>
          
          {/* Gambar Bunder */}
          <img
            src="/LogoSquare.png"
            alt="Chat Icon"
            className="w-full h-full object-cover rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          />
        </button>
      )}
    </div>
  );
};

export default ChatBot;