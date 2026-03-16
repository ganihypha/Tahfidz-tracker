# Tahfidz Tracker - Pencatat Hafalan Al-Qur'an

Aplikasi web untuk mencatat dan memantau progress hafalan Al-Qur'an. Dibangun dengan teknologi modern edge-first untuk performa global yang optimal.

## URLs

- **Production**: https://tahfidz-tracker.pages.dev
- **GitHub**: https://github.com/ganihypha/Tahfidz-tracker

## Fitur yang Sudah Selesai

### Dashboard
- Progress keseluruhan hafalan (ayat, halaman, persentase)
- Streak harian (berapa hari berturut-turut aktif)
- Aktivitas hari ini (halaman baru, review, waktu)
- Saran murajaah otomatis (hafalan yang perlu di-review)
- Progress grid per juz (30 juz)
- Kutipan motivasi islami

### Hafalan (Memorization)
- Tambah hafalan baru (pilih surah, ayat, status, kualitas)
- Data lengkap 114 surah Al-Qur'an dengan nama Arab
- Filter hafalan berdasarkan status (Proses/Hafal/Review)
- Update status hafalan (Proses, Hafal, Perlu Review)
- Hapus hafalan
- Quality bar per hafalan

### Murajaah (Review)
- Saran cerdas: hafalan yang belum pernah/lama di-review diprioritaskan
- Catat murajaah dengan quality score (0-100%)
- Pilih tipe review: Sendiri, Ustaz, Teman
- Riwayat murajaah lengkap

### Progress & Statistik
- Total ayat & halaman yang dihafal
- Streak tracker & estimasi penyelesaian
- Distribusi kualitas hafalan (Excellent/Good/Fair/Perlu Latihan)
- Activity heatmap 30 hari terakhir
- Riwayat catatan harian

### Catatan Harian
- Catat halaman baru dihafal per hari
- Catat halaman di-review per hari
- Total waktu (menit)
- Mood tracker (Great, Good, Normal, Tired, Struggling)
- Catatan tambahan

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/quran/surahs` | Data 114 surah Al-Qur'an |
| GET | `/api/quran/juz/:juz` | Surah-surah dalam 1 juz |
| GET | `/api/stats?user_id=1` | Dashboard statistics |
| GET | `/api/hafalan?user_id=1&status=memorized&juz=30` | List hafalan |
| POST | `/api/hafalan` | Tambah hafalan baru |
| PUT | `/api/hafalan/:id` | Update status/kualitas |
| DELETE | `/api/hafalan/:id` | Hapus hafalan |
| GET | `/api/murajaah?user_id=1` | Riwayat murajaah |
| POST | `/api/murajaah` | Catat murajaah |
| GET | `/api/daily-log?user_id=1&days=30` | Riwayat harian |
| POST | `/api/daily-log` | Catat aktivitas harian |
| GET | `/api/suggestions/murajaah?user_id=1` | Saran murajaah |
| GET | `/api/users` | List users |
| POST | `/api/users` | Tambah user |
| PUT | `/api/users/:id` | Update user |

## Data Architecture

- **Database**: Cloudflare D1 (SQLite global distributed)
- **Tables**: `users`, `hafalan`, `murajaah`, `daily_log`
- **Storage**: Persistent via D1, data tersimpan di edge global

## Tech Stack

- **Backend**: Hono (TypeScript) on Cloudflare Workers
- **Frontend**: Vanilla JS + Tailwind CSS (CDN) + Font Awesome
- **Database**: Cloudflare D1 (SQLite)
- **Font Arabic**: Google Fonts (Amiri)
- **Deploy**: Cloudflare Pages
- **Build**: Vite

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Local development (with D1)
npm run dev:sandbox

# Database operations
npm run db:migrate:local
npm run db:seed
npm run db:reset

# Deploy to production
npm run deploy:prod
```

## Project Structure

```
tahfidz-tracker/
├── src/
│   └── index.tsx          # Hono backend + HTML + all API routes
├── public/
│   └── static/
│       ├── app.js         # Frontend JavaScript (SPA logic)
│       └── style.css      # Custom styles
├── migrations/
│   └── 0001_initial_schema.sql  # D1 database schema
├── seed.sql               # Initial seed data
├── wrangler.jsonc         # Cloudflare config
├── ecosystem.config.cjs   # PM2 config for sandbox
├── vite.config.ts         # Vite build config
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript config
```

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: Active
- **D1 Database**: tahfidz-tracker-production
- **Last Updated**: 16 March 2026

## Fitur Belum Diimplementasi (Roadmap)

- [ ] Multi-user authentication (login/register)
- [ ] Export/import data (JSON/CSV)
- [ ] Notifikasi pengingat murajaah (Push notification)
- [ ] Grafik progress mingguan/bulanan
- [ ] Target harian yang bisa dikustomisasi
- [ ] Dark mode
- [ ] PWA (installable di smartphone)
- [ ] Leaderboard komunitas/halaqah
- [ ] Integrasi audio recitation
- [ ] Sharing progress ke social media

## Dibuat Oleh

**Estes786** - Bahtera Digital  
*"Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya."* — HR. Bukhari
