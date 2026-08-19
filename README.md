# VibeBot AI — Panduan Deploy dari NOL (Gratis, tanpa kartu kredit)

Kamu bakal daftar 3 layanan gratis, terus sambungkan satu sama lain. Ikuti urutan ya, jangan lompat.

---

## BAGIAN 1 — Ambil kunci AI gratis dari Google

1. Buka **aistudio.google.com** di browser
2. Login pakai akun Google/Gmail kamu (yang biasa dipakai)
3. Di sisi kiri, cari tombol **"Get API key"**
4. Klik **"Create API key"**
5. Nanti muncul kode panjang (contoh: `AIzaSy...`) — **copy, simpan di Notes HP kamu**

Selesai — gak ada isi saldo, gak ada kartu kredit. Ini bagian paling penting dan paling gampang.

---

## BAGIAN 2 — Simpan kode di GitHub

GitHub itu semacam "Google Drive" khusus buat kode program.

1. Buka **github.com** → **Sign up** → daftar pakai email
2. Setelah masuk, klik tombol hijau **"New"** (atau ikon **+** di kanan atas → "New repository")
3. Isi nama repo, misal: `vibebot-ai`
4. Biarkan setting default, klik **"Create repository"**
5. Di halaman repo yang baru dibuat, klik **"uploading an existing file"**
6. Drag & drop semua isi folder `vibebot-deploy` (file `index.html`, `README.md`, dan folder `api` beserta isinya) ke situ
7. Scroll ke bawah, klik **"Commit changes"**

---

## BAGIAN 3 — Deploy jadi website beneran (Vercel)

1. Buka **vercel.com** → **Sign Up** → pilih **"Continue with GitHub"** (biar otomatis nyambung)
2. Setelah masuk, klik **"Add New..."** → **"Project"**
3. Cari repo `vibebot-ai` tadi → klik **"Import"**
4. Sebelum klik Deploy, buka bagian **"Environment Variables"**, isi:
   - Name: `GEMINI_API_KEY`
   - Value: (paste kode dari Bagian 1 tadi)
   - Klik **"Add"**
5. Klik tombol **"Deploy"**
6. Tunggu ± 1 menit sampai muncul tulisan **"Congratulations!"**

Klik **"Visit"** — itu dia, website VibeBot kamu sudah hidup! Linknya kira-kira `vibebot-ai-xxxx.vercel.app`, bisa langsung dibagikan ke teman.

---

## Kalau ada yang error

- **Bot gak jawab / error merah** → cek lagi Environment Variable `GEMINI_API_KEY` di Vercel: Project → Settings → Environment Variables. Pastikan namanya persis `GEMINI_API_KEY`, lalu klik **Redeploy**.
- **Upload GitHub gagal** → pastikan struktur foldernya tetap: `index.html` di paling luar, folder `api` berisi `chat.js` di dalamnya.
- Bingung di langkah manapun → screenshot aja, kirim ke aku, nanti aku bantu baca errornya.

## Catatan
- Gratis dari Google Gemini ada batas jumlah pesan per hari (cukup banyak untuk pemakaian normal/tugas sekolah)
- Tiap kamu ubah kode di GitHub, Vercel otomatis update websitenya sendiri
