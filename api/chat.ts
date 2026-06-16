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
    const { message, history } = body;

    // 1. AMBIL DATA DARI BACKENDLESS
    const baseUrl =
      process.env.VITE_BACKENDLESS_API_URL || "https://api.backendless.com";
    const appId = process.env.VITE_BACKENDLESS_APP_ID || "";
    const apiKey = process.env.VITE_BACKENDLESS_REST_API_KEY || "";
    const tableName = "Product";

    const fetchUrl = `${baseUrl}/${appId}/${apiKey}/data/${tableName}?pageSize=50`;
    const dbResponse = await fetch(fetchUrl);
    const dbData = await dbResponse.json();

    if (!dbResponse.ok) {
      console.error("Gagal Mengambil Database:", dbData);
    }

    // 2. OLAH DATA (MENAMBAHKAN FIELD 'TYPE' & 'BLIND BUY')
    let productList = "KOSONG";
    const records = Array.isArray(dbData) ? dbData : dbData?.data || [];

    if (records.length > 0) {
      const availableProducts = records
        .filter((item: any) => parseInt(item.stock) > 0)
        .map((item: any) => {
          const sillage = item.sillage || "N/A";
          const projection = item.projection || "N/A";
          const longevity = item.longevity || "N/A";
          const usageValue = item.usage_time || "Versatile";
          const aromaNotes = item.notes || item.aroma || "Khas"; 
          const typeValue = item.type || "N/A";
          const blindBuySafe = item.blind_buy_safe === true ? "Ya" : "Tidak"; // <-- TAMBAHAN: Tarik status Blind Buy
          
          // <-- TAMBAHAN: Masukkan status Blind Buy ke string
          return `- Nama Parfum: ${item.name}, Tipe: ${typeValue}, Aroma: ${aromaNotes}, Waktu Penggunaan: ${usageValue}, Sillage: ${sillage}, Projection: ${projection}, Longevity: ${longevity}, Stok: ${item.stock}, Aman Blind Buy: ${blindBuySafe}`;
        })
        .join("\n");
        
      if (availableProducts.length > 0) {
        productList = availableProducts;
      }
    }

    // 3. INSTRUKSI KE AI (DI-UPGRADE: Logika Pemahaman Tipe Niche/Designer & Logika Blind Buy)
    const systemInstruction = `Kamu adalah Fragrance AI, representasi representatif dan asisten ahli parfum dari sebuah butik eksklusif. 
    
    GAYA BAHASA WAJIB: 
    - Singkat, padat, elegan, dan jelas layaknya seorang pemilik butik parfum berkelas. HINDARI basa-basi panjang.
    - Storytelling Aroma: Deskripsikan notes parfum dengan narasi visual yang singkat namun imajinatif (misal: "Membawa Anda ke pelukan hangat kayu cedar di malam hari..."), sehingga pelanggan bisa langsung membayangkan sensasi wanginya di dunia nyata.
    - Tampil elegan dan percaya diri.
    - LARANGAN KERAS: JANGAN PERNAH menggunakan kata "database", "data mentah", "sistem", atau istilah teknis IT lainnya kepada pelanggan. 

    KATALOG PRODUK KAMI (Acuan utama untuk menjawab):
    ${productList}

    ATURAN MENJAWAB:
    1. JIKA USER MEMINTA REKOMENDASI (TERMASUK SPESIFIK TIPE NICHE/DESIGNER DAN SIANG/MALAM):
       - WAJIB perhatikan permintaan tipe dari user. Jika user meminta parfum Niche, filter HANYA parfum dengan "Tipe: Niche". Jika meminta Designer, filter HANYA "Tipe: Designer".
       - WAJIB perhatikan permintaan waktu dari user. Jika user meminta parfum untuk siang hari, filter HANYA parfum dengan "Waktu Penggunaan: Siang" atau "Versatile". Berlaku juga untuk malam.
       - PRIORITAS UTAMA: Analisis nilai Sillage, Projection, dan Longevity dari katalog. PILIH MAKSIMAL 3 parfum yang memiliki nilai atau indikasi paling kuat (tertinggi/beast mode).
       - Gunakan format persis seperti ini (Nama parfum wajib tebal dengan **):
       
       Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :

       1. **[Nama Parfum]** ([Tipe Parfum]) - [Tulis 1 kalimat storytelling visual yang elegan agar pelanggan bisa membayangkan sensasi aromanya. Lalu, sambung dengan 1 kalimat yang menyebutkan angka Sillage, Projection, dan Longevity-nya secara presisi dari katalog] (Tersisa [jumlah] botol)
       
       2. **[Nama Parfum]** ([Tipe Parfum]) - [Tulis 1 kalimat storytelling visual yang elegan agar pelanggan bisa membayangkan sensasi aromanya. Lalu, sambung dengan 1 kalimat yang menyebutkan angka Sillage, Projection, dan Longevity-nya secara presisi dari katalog] (Tersisa [jumlah] botol)
       
       3. **[Nama Parfum]** ([Tipe Parfum]) - [Tulis 1 kalimat storytelling visual yang elegan agar pelanggan bisa membayangkan sensasi aromanya. Lalu, sambung dengan 1 kalimat yang menyebutkan angka Sillage, Projection, dan Longevity-nya secara presisi dari katalog] (Tersisa [jumlah] botol)

    2. ATURAN BLIND BUY (PEMBELIAN TANPA MENCIUM AROMA):
       - Jika pengguna menyebutkan mencari kado, pemula, atau ingin "blind buy", prioritaskan parfum dengan "Aman Blind Buy: Ya".
       - Jika parfum yang direkomendasikan memiliki status "Aman Blind Buy: Tidak", TETAP rekomendasikan untuk menarik minat, TAPI tambahkan kalimat peringatan yang menantang dan elegan di akhir deskripsi (misal: "Karya seni ini memiliki profil aroma yang sangat berani dan kompleks, menantang Anda yang ingin tampil beda, meski kurang disarankan untuk blind buy bagi pemula.").

    3. JIKA USER BERTANYA LANJUTAN ATAU DI LUAR PRODUK:
       - Jawab dengan etika bisnis yang ramah dan natural (maksimal 2-3 kalimat).
       - Jika membahas detail parfum, berikan fakta berbobot berdasarkan koleksi kami.

    4. Jika stok di katalog kosong, jawab dengan profesional: "Mohon maaf, koleksi kami saat ini sedang kehabisan stok."`;

    // 4. INISIALISASI GROQ API
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    const groqMessages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg: any) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error AI Chat:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal memproses pesan AI",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}