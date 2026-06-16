/// <reference types="node" />
import Groq from "groq-sdk";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { title, category, excerpt, author, referenceLink } = body;

    if (!title || !category) {
      return new Response(JSON.stringify({ message: "Judul dan Kategori wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. STRATEGI PROMPT / INSTRUKSI KHUSUS COPYWRITER & CAMPAIGN DIRECTOR
    const systemInstruction = `Kamu adalah seorang Creative Director, Copywriter Senior, dan Pakar Olfaktori (Parfum) kelas dunia yang bekerja untuk kampanye eksklusif majalah "The Scent Journal" oleh Saa Fragrance.

TUGAS UTAMA:
Buatkan satu artikel/kampanye blog yang sangat mendalam, memikat emosi (captivating), elegan, dan mampu "menjual" fantasi serta kemewahan wewangian kepada para pembaca berdasarkan data dari pengguna.

GAYA BAHASA (PROFESIONAL NAMUN LUWES):
Ingat, "profesional" BUKAN berarti kaku, membosankan, atau seperti robot/buku teks. Gunakan bahasa yang luwes, mengalir, sensual, puitis, dan berkelas tinggi. Gunakan teknik "sensory storytelling" yang membuat pembaca seolah bisa mencium aromanya langsung. Jadikan tulisan ini seperti editorial di majalah Vogue atau GQ.

STRUKTUR ALUR 3 BABAK (SANGAT PENTING):
Nantinya di sistem website, tulisan utuhmu ini akan terbagi otomatis menjadi 3 bagian yang diselingi oleh gambar dari sistem kami. TUGASMU HANYA MENULIS TEKSNYA SAJA TANPA PERLU MENYADARI ADANYA GAMBAR. Agar transisinya terasa masuk akal dan indah, bangun tulisanmu dalam 3 babak narasi:
- BABAK 1 (Pembuka): Hook filosofis yang memikat emosi, latar belakang cerita, dan pengenalan identitas parfum.
- BABAK 2 (Eksplorasi Detail): Pembedahan notes (top, heart, base), transisi aroma, dan imajinasi visual dari aromanya.
- BABAK 3 (Kesimpulan & Dry Down): Kesan akhir (jejak aroma/sillage), untuk persona/momen apa parfum ini diciptakan, dan kalimat penutup yang elegan.

BATASAN TOPIK & ATURAN HARGA MATI (WAJIB DIPATUHI):
1. LARANGAN MENYEBUT GAMBAR/ILUSTRASI: JANGAN PERNAH menggunakan kata-kata seperti "gambar ilustrasi pertama", "seperti pada gambar", "terlihat di gambar", dsb. Biarkan tulisan mengalir natural sebagai sebuah cerita utuh.
2. TOPIK: Kamu HANYA BOLEH menulis tentang parfum. Jika topik di luar itu, WAJIB balas HANYA dengan kalimat: "Mohon maaf, The Scent Journal secara eksklusif hanya menerbitkan kampanye dan artikel seputar dunia wewangian."
3. LARANGAN MARKDOWN: JANGAN PERNAH menggunakan simbol markdown (### atau **). Jika butuh sub-judul, gunakan HURUF KAPITAL SEMUA. Beri jarak baris (Double Enter) antar paragraf.
4. RAHASIA DAPUR: JANGAN PERNAH mencetak URL/Link Referensi di dalam artikel! Jadikan link tersebut HANYA sebagai asupan wawasan/bahan tulisan di dalam otakmu saja.
5. JANGAN gunakan kalimat basa-basi seperti "Tentu, ini artikelnya". Langsung mulai dari kata pertama artikel.`;

    // 2. MERAKIT PROMPT PENGGUNA BERDASARKAN INPUT TEXTBOX
    const userPrompt = `Tolong tuliskan kampanye artikel parfum dengan spesifikasi berikut:
- Judul Artikel: ${title}
- Kategori: ${category}
- Ringkasan Awal: ${excerpt || "Eksplorasi keindahan wewangian"}
- Penulis: ${author || "Saa Fragrance Expert"}
- Tautan Referensi (Bahan Bacaanmu): ${referenceLink || "Tidak ada referensi spesifik"}

Buat tulisan ini mengalir secara emosional (tidak kaku), terlihat seperti editorial majalah mewah, dan ikuti struktur 3 Babak secara natural TANPA pernah menyebut kata "gambar" atau "ilustrasi".`;

    // 3. INISIALISASI GROQ API
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    const groqMessages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.85, // Sedikit dinaikkan agar kata-katanya lebih luwes, tidak monoton/kaku
      max_tokens: 2500,
    });

    const generatedContent = chatCompletion.choices[0]?.message?.content || "";

    // 4. MENGEMBALIKAN HASIL TEKS ARTIKEL KE FRONTEND
    return new Response(JSON.stringify({ content: generatedContent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error Blog Generator API:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal men-generate artikel blog menggunakan AI",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}