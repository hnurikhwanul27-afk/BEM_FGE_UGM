# Website BEM Fakultas Geografi UGM

React (JSX) + GSAP di sisi tampilan, Node.js (Express) + MySQL di sisi server.

```
client/   React + Vite (src/*.jsx)
server/   Express API, schema.sql (database), seed.js, defaultContent.json, uploads/ (gambar)
```

## Cara menjalankan
1. **Siapkan database**
   ```
   mysql -u root -p < server/schema.sql     # membuat database bem_fge beserta tabelnya
   ```
2. **Server**
   ```
   cd server
   cp .env.example .env      # isi DATABASE_URL (mysql://user:password@localhost:3306/bem_fge), JWT_SECRET, ADMIN_USER, ADMIN_PASS
   npm install
   npm run seed              # isi konten awal + buat akun admin
   npm run dev               # jalan di http://localhost:3000
   ```
3. **Tampilan (mode pengembangan)**
   ```
   cd client
   npm install
   npm run dev               # buka http://localhost:5173
   ```
4. **Produksi**: `cd client && npm run build`, lalu `cd ../server && npm start`.
   Server otomatis menyajikan hasil build, jadi cukup satu alamat.

## Admin panel
Buka **/admin** (misalnya http://localhost:5173/admin), login dengan ADMIN_USER dan ADMIN_PASS.
Di sana bisa mengubah semua teks, logo navbar, warna tampilan, foto kabinet dan logo, gambar korsa,
sejarah, struktur organisasi (foto dan atasan tiap posisi), berita (dengan gambar), dan gallery.
Klik **Simpan Semua Perubahan** agar tersimpan ke database.

## Database (MySQL 5.7+ / MariaDB 10.2+)
- `site_content`: satu baris (id = 1) berisi seluruh konten website dalam kolom `data` (tipe JSON).
- `admin_users`: akun admin (password di-hash dengan bcrypt).
- `media`: catatan setiap gambar yang diunggah. File gambarnya disimpan di `server/uploads/`.

Gambar contoh (poster dan korsa) sudah ada di `server/uploads/`. Logo dan foto pengurus di dalamnya
hanya pengganti sementara, silakan ganti lewat admin.

## Catatan
- Isi bertanda `[Contoh]` hanya contoh, ganti dengan teks asli.
- Ganti `JWT_SECRET` dan `ADMIN_PASS` sebelum dipublikasikan, dan pakai HTTPS.
