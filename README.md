# Tahfidz Tracker Pro - Pencatat Hafalan Al-Qur'an

Aplikasi web premium untuk mencatat dan memantau progress hafalan Al-Qur'an. Dilengkapi gamifikasi, multi-user, dark mode, dan achievement system. Dibangun dengan teknologi edge-first untuk performa global yang optimal.

## URLs

- **Production**: https://tahfidz-tracker.pages.dev
- **GitHub**: https://github.com/ganihypha/Tahfidz-tracker

## Fitur yang Sudah Selesai

### Authentication & Multi-User
- Login dengan nama + PIN
- Registrasi akun baru
- Session management (localStorage)
- Multi-user support (setiap user punya data sendiri)

### Dashboard
- Progress keseluruhan hafalan (ayat, halaman, persentase) dengan circular progress
- Streak harian (berapa hari berturut-turut aktif)
- Aktivitas hari ini (halaman baru, review, waktu)
- Saran murajaah otomatis (hafalan yang perlu di-review)
- Progress grid per juz (30 juz) dengan visualisasi warna
- Kutipan motivasi islami (random)
- Level & XP bar

### Hafalan (Memorization)
- Tambah hafalan baru (pilih surah, ayat, status, kualitas)
- Data lengkap 114 surah Al-Qur'an dengan nama Arab
- Filter hafalan berdasarkan status (Proses/Hafal/Review)
- Update status hafalan (Proses, Hafal, Perlu Review)
- Hapus hafalan
- Quality bar per hafalan dengan gradient

### Murajaah (Review)
- Saran cerdas: hafalan yang belum pernah/lama di-review diprioritaskan
- Catat murajaah dengan quality score (0-100%)
- Pilih tipe review: Sendiri, Ustaz, Teman
- Riwayat murajaah lengkap

### Progress & Statistik
- Total ayat & halaman yang dihafal
- Streak tracker & estimasi penyelesaian
- Distribusi kualitas hafalan (Mutqin/Baik/Cukup/Perlu Latihan)
- Activity heatmap 30 hari terakhir
- Riwayat catatan harian

### Gamifikasi (SAAS-Ready)
- **XP System**: Dapatkan XP untuk setiap aktivitas (+5 hafalan baru, +3 murajaah, +2 catatan harian)
- **Level System**: Naik level setiap 100 XP
- **12 Achievements**: Dari "Langkah Pertama" hingga "Hafidz Al-Quran"
- **Tier System**: Free, Pro, Premium (siap monetisasi)
- **Leaderboard**: Ranking user berdasarkan XP

### UI/UX Premium
- Dark mode dengan toggle
- Glass morphism design
- Gradient buttons dan cards
- Animasi halus (fade, slide, float, shimmer)
- Mobile-first responsive design
- Arabic font (Amiri) untuk nama surah
- Poppins font untuk UI modern

### Catatan Harian
- Catat halaman baru dihafal per hari
- Catat halaman di-review per hari
- Total waktu (menit)
- Mood tracker (Great, Good, Normal, Tired, Struggling)
- Catatan tambahan

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login (name + pin) |
| POST | `/api/auth/register` | Register akun baru |
| GET | `/api/quran/surahs` | Data 114 surah |
| GET | `/api/quran/juz/:juz` | Surah dalam 1 juz |
| GET | `/api/stats?user_id=1` | Dashboard statistics |
| GET | `/api/hafalan?user_id=1&status=memorized` | List hafalan |
| POST | `/api/hafalan` | Tambah hafalan |
| PUT | `/api/hafalan/:id` | Update status/kualitas |
| DELETE | `/api/hafalan/:id` | Hapus hafalan |
| GET | `/api/murajaah?user_id=1` | Riwayat murajaah |
| POST | `/api/murajaah` | Catat murajaah |
| GET | `/api/daily-log?user_id=1&days=30` | Riwayat harian |
| POST | `/api/daily-log` | Catat aktivitas |
| GET | `/api/suggestions/murajaah?user_id=1` | Saran murajaah |
| GET | `/api/achievements?user_id=1` | Daftar achievements |
| GET | `/api/leaderboard` | Leaderboard XP |
| GET | `/api/users` | List users |
| PUT | `/api/users/:id` | Update user |

## Data Architecture

- **Database**: Supabase (PostgreSQL)
- **Tables**: `users`, `hafalan`, `murajaah`, `daily_log`, `achievements`, `user_achievements`
- **Auth**: PIN-based via API (server-side with service_role key)
- **Storage**: Persistent via Supabase cloud

### Schema (key fields):

**users**: id, name, email, pin, target_juz, daily_target_pages, tier, xp, level, theme
**hafalan**: id, user_id, surah_number, surah_name, juz, start_ayat, end_ayat, total_ayat, pages, status, quality, notes
**murajaah**: id, user_id, hafalan_id, surah_number, surah_name, juz, quality, review_type, notes
**daily_log**: id, user_id, log_date, new_memorized_pages, review_pages, total_minutes, mood, notes
**achievements**: id, code, name, description, icon, xp_reward, tier
**user_achievements**: id, user_id, achievement_id, unlocked_at

## Tech Stack

- **Backend**: Hono (TypeScript) on Cloudflare Workers
- **Database**: Supabase (PostgreSQL cloud) - migrated from Cloudflare D1
- **Frontend**: Vanilla JS + Tailwind CSS (CDN) + Font Awesome + Poppins + Amiri
- **Deploy**: Cloudflare Pages
- **Build**: Vite + @hono/vite-build

## User Guide

1. Buka https://tahfidz-tracker.pages.dev
2. Login dengan nama "Santri" dan PIN "1234" (default)
3. Atau daftar akun baru dengan klik "Daftar"
4. Di Dashboard: lihat progress, aktivitas hari ini, saran murajaah
5. Di Hafalan: tambah/kelola hafalan surah
6. Di Murajaah: review hafalan dan catat kualitas
7. Di Progress: lihat statistik, achievements, heatmap aktivitas
8. Klik gear icon untuk pengaturan, dark mode, dan logout

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Local development
npm run dev:sandbox

# Deploy to production
npm run deploy:prod
```

### Environment Variables (secrets):
```
SUPABASE_URL=https://fsbpiyeigdptuxitplzo.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## Project Structure

```
tahfidz-tracker/
├── src/
│   └── index.tsx          # Hono backend + HTML + API routes
├── public/
│   └── static/
│       ├── app.js         # Frontend JS (SPA, auth, dark mode)
│       └── style.css      # Premium CSS animations
├── migrations/
│   └── 0001_initial_schema.sql  # Legacy D1 schema (reference)
├── .dev.vars              # Local Supabase secrets
├── seed.sql               # Test data
├── wrangler.jsonc         # Cloudflare config
├── ecosystem.config.cjs   # PM2 config
├── vite.config.ts         # Vite build config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: Active
- **Database**: Supabase (PostgreSQL)
- **Secrets**: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- **Last Updated**: 16 March 2026

## Fitur Belum Diimplementasi (Roadmap)

- [ ] Auto-unlock achievements (backend logic)
- [ ] Push notification pengingat murajaah
- [ ] Export/import data (JSON/CSV)
- [ ] Grafik progress mingguan/bulanan (Chart.js)
- [ ] PWA (installable di smartphone)
- [ ] Subscription/payment integration (Stripe)
- [ ] Admin dashboard untuk SAAS management
- [ ] Integrasi audio recitation (Quran.com API)
- [ ] Social sharing progress
- [ ] Halaqah/group feature
- [ ] Spaced repetition algorithm untuk murajaah
- [ ] Quran verse text display

## Changelog

### v2.0 (16 March 2026)
- Migrasi dari Cloudflare D1 ke Supabase (PostgreSQL)
- Multi-user authentication (login/register)
- Dark mode toggle
- Gamifikasi: XP, Level, Achievements
- Leaderboard API
- Premium UI/UX overhaul dengan glass morphism
- SAAS-ready tier system (free/pro/premium)
- Session persistence (localStorage)
- Settings modal dengan user profile

### v1.0
- Initial release dengan D1 database
- Basic hafalan CRUD
- Murajaah tracking
- Daily log
- Dashboard statistics

## Dibuat Oleh

**Estes786** - Bahtera Digital
*"Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya."* - HR. Bukhari
