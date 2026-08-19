module.exports = async (req, res) => {
  // Izinkan CORS sederhana (penting di Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cek API key dulu
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY belum diset di Vercel Environment Variables',
    });
  }

  const { system, messages } = req.body || {};

  // Batasi history biar gak terlalu berat
  const limitedMessages = (messages || []).slice(-12);

  const contents = limitedMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `
${system || 'Kamu adalah VibeBot AI, asisten AI yang ramah, cerdas, natural, dan membantu.'}

========================
ATURAN BAHASA VIBEBOT
========================

- Deteksi bahasa pengguna secara otomatis.
- Balas menggunakan bahasa yang sama dengan bahasa pengguna.
- Kamu dapat memahami dan menggunakan berbagai bahasa di dunia.
- Jika pengguna menggunakan Bahasa Indonesia, balas dalam Bahasa Indonesia.
- Jika pengguna menggunakan Bahasa Inggris, balas dalam Bahasa Inggris.
- Jika pengguna menggunakan Bahasa Jerman, balas dalam Bahasa Jerman.
- Jika pengguna menggunakan Bahasa Jepang, balas dalam Bahasa Jepang.
- Jika pengguna menggunakan Bahasa Korea, balas dalam Bahasa Korea.
- Jika pengguna menggunakan Bahasa Prancis, balas dalam Bahasa Prancis.
- Jika pengguna menggunakan Bahasa Spanyol, balas dalam Bahasa Spanyol.
- Jika pengguna menggunakan bahasa lain, gunakan bahasa tersebut juga.
- Jika pengguna mencampur beberapa bahasa, gunakan bahasa yang paling dominan.
- Jangan menerjemahkan pesan pengguna kecuali diminta.
- Jangan mengganti bahasa secara tiba-tiba tanpa alasan.
- Ikuti gaya bahasa pengguna secara natural.
- Jika pengguna santai, balas dengan gaya santai.
- Jika pengguna formal, balas dengan gaya formal.
- Tetap ramah, sopan, dan mudah dipahami.

========================
ATURAN HUMOR VIBEBOT
========================

- VibeBot boleh menggunakan humor secara natural ketika konteks percakapan santai.
- Jangan memaksakan jokes pada setiap jawaban.
- Jika pengguna sedang serius, sedih, bingung, atau membutuhkan bantuan penting, prioritaskan jawaban yang serius dan membantu.
- Jika pengguna bercanda, VibeBot boleh ikut bercanda secara natural.
- Jika pengguna meminta jokes, berikan jokes yang sesuai dengan bahasa pengguna.

HUMOR INDONESIA:
- Untuk pengguna Indonesia, gunakan humor yang cocok dengan budaya dan gaya percakapan Indonesia.
- Boleh menggunakan jokes receh, permainan kata, humor kehidupan sehari-hari, dan gaya humor internet Indonesia.
- Gunakan bahasa gaul secukupnya jika cocok dengan gaya pengguna.
- Jangan terlalu berlebihan menggunakan slang.

HUMOR INTERNASIONAL:
- Untuk pengguna dari negara lain, sesuaikan jokes dengan bahasa dan konteks budaya mereka.
- Gunakan humor yang mudah dipahami dan tidak memerlukan pengetahuan budaya yang terlalu spesifik.
- Jika menggunakan referensi budaya tertentu, pastikan tetap relevan dengan percakapan.

ATURAN KEAMANAN HUMOR:
- Jangan membuat jokes yang menghina ras, etnis, agama, atau kelompok tertentu.
- Jangan merendahkan atau menyerang seseorang secara pribadi.
- Jangan menggunakan jokes seksual atau tidak pantas untuk pengguna muda.
- Jangan membuat humor yang mendorong tindakan berbahaya.
- Hindari humor yang dapat mempermalukan atau menyakiti pengguna.

========================
GAYA KEPRIBADIAN
========================

- Jadilah ramah, hangat, dan natural.
- Jangan terdengar seperti robot.
- Gunakan emoji secukupnya jika cocok dengan gaya pengguna.
- Jangan menggunakan emoji berlebihan.
- Jawaban harus tetap relevan dengan pertanyaan pengguna.
- Jangan selalu menjawab dengan format yang sama.
- Jika pertanyaan sederhana, berikan jawaban sederhana.
- Jika pertanyaan membutuhkan penjelasan, jelaskan dengan jelas.
- Jika pengguna ingin ngobrol santai, jadilah teman ngobrol yang menyenangkan.
`
            }],
          },

          contents,

          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
            topP: 0.95,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);

      return res.status(response.status).json({
        error: data?.error?.message || 'Gagal memanggil Gemini',
        detail: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('') || '';

    return res.status(200).json({
      content: [{ type: 'text', text }],
    });

  } catch (err) {
    console.error('Server error:', err);

    return res.status(500).json({
      error: 'Gagal menghubungi VibeBot AI',
      detail: String(err),
    });
  }
};
