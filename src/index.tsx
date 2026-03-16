import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// Helper: get Supabase client (service role for server-side)
function getSupabase(c: any) {
  return createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
}

// ============================================================
// QURAN DATA - Complete 114 Surah
// ============================================================
const QURAN_DATA = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayat: 7, juz: 1, pages: 0.5 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayat: 286, juz: 1, pages: 48 },
  { number: 3, name: "Ali 'Imran", arabic: "آل عمران", ayat: 200, juz: 3, pages: 30 },
  { number: 4, name: "An-Nisa'", arabic: "النساء", ayat: 176, juz: 4, pages: 28 },
  { number: 5, name: "Al-Ma'idah", arabic: "المائدة", ayat: 120, juz: 6, pages: 22 },
  { number: 6, name: "Al-An'am", arabic: "الأنعام", ayat: 165, juz: 7, pages: 23 },
  { number: 7, name: "Al-A'raf", arabic: "الأعراف", ayat: 206, juz: 8, pages: 27 },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", ayat: 75, juz: 9, pages: 10 },
  { number: 9, name: "At-Taubah", arabic: "التوبة", ayat: 129, juz: 10, pages: 19 },
  { number: 10, name: "Yunus", arabic: "يونس", ayat: 109, juz: 11, pages: 14 },
  { number: 11, name: "Hud", arabic: "هود", ayat: 123, juz: 11, pages: 14 },
  { number: 12, name: "Yusuf", arabic: "يوسف", ayat: 111, juz: 12, pages: 13 },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", ayat: 43, juz: 13, pages: 6 },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", ayat: 52, juz: 13, pages: 6 },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", ayat: 99, juz: 14, pages: 5 },
  { number: 16, name: "An-Nahl", arabic: "النحل", ayat: 128, juz: 14, pages: 16 },
  { number: 17, name: "Al-Isra'", arabic: "الإسراء", ayat: 111, juz: 15, pages: 12 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", ayat: 110, juz: 15, pages: 12 },
  { number: 19, name: "Maryam", arabic: "مريم", ayat: 98, juz: 16, pages: 7 },
  { number: 20, name: "Taha", arabic: "طه", ayat: 135, juz: 16, pages: 9 },
  { number: 21, name: "Al-Anbiya'", arabic: "الأنبياء", ayat: 112, juz: 17, pages: 10 },
  { number: 22, name: "Al-Hajj", arabic: "الحج", ayat: 78, juz: 17, pages: 10 },
  { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", ayat: 118, juz: 18, pages: 9 },
  { number: 24, name: "An-Nur", arabic: "النور", ayat: 64, juz: 18, pages: 10 },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", ayat: 77, juz: 18, pages: 7 },
  { number: 26, name: "Asy-Syu'ara'", arabic: "الشعراء", ayat: 227, juz: 19, pages: 11 },
  { number: 27, name: "An-Naml", arabic: "النمل", ayat: 93, juz: 19, pages: 9 },
  { number: 28, name: "Al-Qasas", arabic: "القصص", ayat: 88, juz: 20, pages: 11 },
  { number: 29, name: "Al-'Ankabut", arabic: "العنكبوت", ayat: 69, juz: 20, pages: 8 },
  { number: 30, name: "Ar-Rum", arabic: "الروم", ayat: 60, juz: 21, pages: 7 },
  { number: 31, name: "Luqman", arabic: "لقمان", ayat: 34, juz: 21, pages: 4 },
  { number: 32, name: "As-Sajdah", arabic: "السجدة", ayat: 30, juz: 21, pages: 3 },
  { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", ayat: 73, juz: 21, pages: 10 },
  { number: 34, name: "Saba'", arabic: "سبأ", ayat: 54, juz: 22, pages: 7 },
  { number: 35, name: "Fatir", arabic: "فاطر", ayat: 45, juz: 22, pages: 6 },
  { number: 36, name: "Ya-Sin", arabic: "يس", ayat: 83, juz: 22, pages: 6 },
  { number: 37, name: "As-Saffat", arabic: "الصافات", ayat: 182, juz: 23, pages: 9 },
  { number: 38, name: "Sad", arabic: "ص", ayat: 88, juz: 23, pages: 6 },
  { number: 39, name: "Az-Zumar", arabic: "الزمر", ayat: 75, juz: 23, pages: 10 },
  { number: 40, name: "Ghafir", arabic: "غافر", ayat: 85, juz: 24, pages: 10 },
  { number: 41, name: "Fussilat", arabic: "فصلت", ayat: 54, juz: 24, pages: 7 },
  { number: 42, name: "Asy-Syura", arabic: "الشورى", ayat: 53, juz: 25, pages: 7 },
  { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", ayat: 89, juz: 25, pages: 8 },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", ayat: 59, juz: 25, pages: 4 },
  { number: 45, name: "Al-Jasiyah", arabic: "الجاثية", ayat: 37, juz: 25, pages: 4 },
  { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", ayat: 35, juz: 26, pages: 5 },
  { number: 47, name: "Muhammad", arabic: "محمد", ayat: 38, juz: 26, pages: 5 },
  { number: 48, name: "Al-Fath", arabic: "الفتح", ayat: 29, juz: 26, pages: 5 },
  { number: 49, name: "Al-Hujurat", arabic: "الحجرات", ayat: 18, juz: 26, pages: 3 },
  { number: 50, name: "Qaf", arabic: "ق", ayat: 45, juz: 26, pages: 3 },
  { number: 51, name: "Az-Zariyat", arabic: "الذاريات", ayat: 60, juz: 26, pages: 3 },
  { number: 52, name: "At-Tur", arabic: "الطور", ayat: 49, juz: 27, pages: 3 },
  { number: 53, name: "An-Najm", arabic: "النجم", ayat: 62, juz: 27, pages: 3 },
  { number: 54, name: "Al-Qamar", arabic: "القمر", ayat: 55, juz: 27, pages: 3 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayat: 78, juz: 27, pages: 4 },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", ayat: 96, juz: 27, pages: 4 },
  { number: 57, name: "Al-Hadid", arabic: "الحديد", ayat: 29, juz: 27, pages: 5 },
  { number: 58, name: "Al-Mujadilah", arabic: "المجادلة", ayat: 22, juz: 28, pages: 4 },
  { number: 59, name: "Al-Hasyr", arabic: "الحشر", ayat: 24, juz: 28, pages: 4 },
  { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", ayat: 13, juz: 28, pages: 3 },
  { number: 61, name: "As-Saff", arabic: "الصف", ayat: 14, juz: 28, pages: 2 },
  { number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", ayat: 11, juz: 28, pages: 2 },
  { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", ayat: 11, juz: 28, pages: 2 },
  { number: 64, name: "At-Tagabun", arabic: "التغابن", ayat: 18, juz: 28, pages: 2 },
  { number: 65, name: "At-Talaq", arabic: "الطلاق", ayat: 12, juz: 28, pages: 3 },
  { number: 66, name: "At-Tahrim", arabic: "التحريم", ayat: 12, juz: 28, pages: 2 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", ayat: 30, juz: 29, pages: 3 },
  { number: 68, name: "Al-Qalam", arabic: "القلم", ayat: 52, juz: 29, pages: 3 },
  { number: 69, name: "Al-Haqqah", arabic: "الحاقة", ayat: 52, juz: 29, pages: 3 },
  { number: 70, name: "Al-Ma'arij", arabic: "المعارج", ayat: 44, juz: 29, pages: 2 },
  { number: 71, name: "Nuh", arabic: "نوح", ayat: 28, juz: 29, pages: 2 },
  { number: 72, name: "Al-Jinn", arabic: "الجن", ayat: 28, juz: 29, pages: 2 },
  { number: 73, name: "Al-Muzzammil", arabic: "المزمل", ayat: 20, juz: 29, pages: 2 },
  { number: 74, name: "Al-Muddassir", arabic: "المدثر", ayat: 56, juz: 29, pages: 3 },
  { number: 75, name: "Al-Qiyamah", arabic: "القيامة", ayat: 40, juz: 29, pages: 2 },
  { number: 76, name: "Al-Insan", arabic: "الإنسان", ayat: 31, juz: 29, pages: 2 },
  { number: 77, name: "Al-Mursalat", arabic: "المرسلات", ayat: 50, juz: 29, pages: 2 },
  { number: 78, name: "An-Naba'", arabic: "النبأ", ayat: 40, juz: 30, pages: 2 },
  { number: 79, name: "An-Nazi'at", arabic: "النازعات", ayat: 46, juz: 30, pages: 2 },
  { number: 80, name: "'Abasa", arabic: "عبس", ayat: 42, juz: 30, pages: 1 },
  { number: 81, name: "At-Takwir", arabic: "التكوير", ayat: 29, juz: 30, pages: 1 },
  { number: 82, name: "Al-Infitar", arabic: "الانفطار", ayat: 19, juz: 30, pages: 1 },
  { number: 83, name: "Al-Mutaffifin", arabic: "المطففين", ayat: 36, juz: 30, pages: 2 },
  { number: 84, name: "Al-Insyiqaq", arabic: "الانشقاق", ayat: 25, juz: 30, pages: 1 },
  { number: 85, name: "Al-Buruj", arabic: "البروج", ayat: 22, juz: 30, pages: 1 },
  { number: 86, name: "At-Tariq", arabic: "الطارق", ayat: 17, juz: 30, pages: 0.5 },
  { number: 87, name: "Al-A'la", arabic: "الأعلى", ayat: 19, juz: 30, pages: 0.5 },
  { number: 88, name: "Al-Gasyiyah", arabic: "الغاشية", ayat: 26, juz: 30, pages: 1 },
  { number: 89, name: "Al-Fajr", arabic: "الفجر", ayat: 30, juz: 30, pages: 1 },
  { number: 90, name: "Al-Balad", arabic: "البلد", ayat: 20, juz: 30, pages: 0.5 },
  { number: 91, name: "Asy-Syams", arabic: "الشمس", ayat: 15, juz: 30, pages: 0.5 },
  { number: 92, name: "Al-Lail", arabic: "الليل", ayat: 21, juz: 30, pages: 0.5 },
  { number: 93, name: "Ad-Duha", arabic: "الضحى", ayat: 11, juz: 30, pages: 0.5 },
  { number: 94, name: "Asy-Syarh", arabic: "الشرح", ayat: 8, juz: 30, pages: 0.3 },
  { number: 95, name: "At-Tin", arabic: "التين", ayat: 8, juz: 30, pages: 0.3 },
  { number: 96, name: "Al-'Alaq", arabic: "العلق", ayat: 19, juz: 30, pages: 0.5 },
  { number: 97, name: "Al-Qadr", arabic: "القدر", ayat: 5, juz: 30, pages: 0.3 },
  { number: 98, name: "Al-Bayyinah", arabic: "البينة", ayat: 8, juz: 30, pages: 0.5 },
  { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", ayat: 8, juz: 30, pages: 0.3 },
  { number: 100, name: "Al-'Adiyat", arabic: "العاديات", ayat: 11, juz: 30, pages: 0.3 },
  { number: 101, name: "Al-Qari'ah", arabic: "القارعة", ayat: 11, juz: 30, pages: 0.3 },
  { number: 102, name: "At-Takasur", arabic: "التكاثر", ayat: 8, juz: 30, pages: 0.3 },
  { number: 103, name: "Al-'Asr", arabic: "العصر", ayat: 3, juz: 30, pages: 0.2 },
  { number: 104, name: "Al-Humazah", arabic: "الهمزة", ayat: 9, juz: 30, pages: 0.3 },
  { number: 105, name: "Al-Fil", arabic: "الفيل", ayat: 5, juz: 30, pages: 0.2 },
  { number: 106, name: "Quraisy", arabic: "قريش", ayat: 4, juz: 30, pages: 0.2 },
  { number: 107, name: "Al-Ma'un", arabic: "الماعون", ayat: 7, juz: 30, pages: 0.3 },
  { number: 108, name: "Al-Kausar", arabic: "الكوثر", ayat: 3, juz: 30, pages: 0.2 },
  { number: 109, name: "Al-Kafirun", arabic: "الكافرون", ayat: 6, juz: 30, pages: 0.3 },
  { number: 110, name: "An-Nasr", arabic: "النصر", ayat: 3, juz: 30, pages: 0.2 },
  { number: 111, name: "Al-Lahab", arabic: "المسد", ayat: 5, juz: 30, pages: 0.2 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayat: 4, juz: 30, pages: 0.2 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", ayat: 5, juz: 30, pages: 0.2 },
  { number: 114, name: "An-Nas", arabic: "الناس", ayat: 6, juz: 30, pages: 0.2 },
]

// ============================================================
// API: Quran Data
// ============================================================
app.get('/api/quran/surahs', (c) => c.json({ success: true, data: QURAN_DATA }))
app.get('/api/quran/juz/:juz', (c) => {
  const juz = parseInt(c.req.param('juz'))
  return c.json({ success: true, data: QURAN_DATA.filter(s => s.juz === juz) })
})

// ============================================================
// API: Auth (simple PIN-based)
// ============================================================
app.post('/api/auth/login', async (c) => {
  const sb = getSupabase(c)
  const { name, pin } = await c.req.json()
  const { data, error } = await sb.from('users').select('*').eq('name', name).eq('pin', pin).single()
  if (error || !data) return c.json({ success: false, error: 'Nama atau PIN salah' }, 401)
  await sb.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', data.id)
  return c.json({ success: true, data })
})

app.post('/api/auth/register', async (c) => {
  const sb = getSupabase(c)
  const { name, email, pin } = await c.req.json()
  if (!name || !pin) return c.json({ success: false, error: 'Nama dan PIN wajib diisi' }, 400)
  const { data, error } = await sb.from('users').insert({ name, email: email || null, pin }).select().single()
  if (error) return c.json({ success: false, error: error.message }, 400)
  return c.json({ success: true, data })
})

// ============================================================
// API: Users
// ============================================================
app.get('/api/users', async (c) => {
  const sb = getSupabase(c)
  const { data } = await sb.from('users').select('id, name, xp, level, tier, created_at').order('xp', { ascending: false })
  return c.json({ success: true, data })
})

app.get('/api/users/:id', async (c) => {
  const sb = getSupabase(c)
  const id = c.req.param('id')
  const { data, error } = await sb.from('users').select('*').eq('id', id).single()
  if (error) return c.json({ success: false, error: 'User not found' }, 404)
  return c.json({ success: true, data })
})

app.put('/api/users/:id', async (c) => {
  const sb = getSupabase(c)
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, target_juz, daily_target_pages, theme } = body
  const updates: any = { updated_at: new Date().toISOString() }
  if (name) updates.name = name
  if (target_juz) updates.target_juz = target_juz
  if (daily_target_pages) updates.daily_target_pages = daily_target_pages
  if (theme) updates.theme = theme
  const { error } = await sb.from('users').update(updates).eq('id', id)
  if (error) return c.json({ success: false, error: error.message }, 400)
  return c.json({ success: true })
})

// ============================================================
// API: Hafalan (Memorization)
// ============================================================
app.get('/api/hafalan', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  const status = c.req.query('status')
  const juz = c.req.query('juz')
  
  let query = sb.from('hafalan').select('*').eq('user_id', userId)
  if (status) query = query.eq('status', status)
  if (juz) query = query.eq('juz', parseInt(juz))
  query = query.order('surah_number').order('start_ayat')
  
  const { data, error } = await query
  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true, data: data || [] })
})

app.post('/api/hafalan', async (c) => {
  const sb = getSupabase(c)
  const body = await c.req.json()
  const { user_id, surah_number, surah_name, juz, start_ayat, end_ayat, total_ayat, pages, status, quality, notes } = body
  
  const { data, error } = await sb.from('hafalan').insert({
    user_id: user_id || 1,
    surah_number, surah_name, juz,
    start_ayat: start_ayat || 1,
    end_ayat, total_ayat,
    pages: pages || 0,
    status: status || 'in_progress',
    quality: quality || 0,
    notes: notes || null
  }).select().single()
  
  if (error) return c.json({ success: false, error: error.message }, 500)
  
  // Award XP
  await addXP(sb, user_id || 1, 5)
  
  return c.json({ success: true, id: data.id, data })
})

app.put('/api/hafalan/:id', async (c) => {
  const sb = getSupabase(c)
  const id = c.req.param('id')
  const body = await c.req.json()
  const { status, quality, notes } = body
  
  const updates: any = { updated_at: new Date().toISOString() }
  if (status !== undefined) updates.status = status
  if (quality !== undefined) updates.quality = quality
  if (notes !== undefined) updates.notes = notes
  if (status === 'memorized') updates.completed_at = new Date().toISOString()
  
  const { error } = await sb.from('hafalan').update(updates).eq('id', id)
  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true })
})

app.delete('/api/hafalan/:id', async (c) => {
  const sb = getSupabase(c)
  const id = c.req.param('id')
  await sb.from('murajaah').delete().eq('hafalan_id', id)
  await sb.from('hafalan').delete().eq('id', id)
  return c.json({ success: true })
})

// ============================================================
// API: Murajaah (Review)
// ============================================================
app.get('/api/murajaah', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  const hafalanId = c.req.query('hafalan_id')
  
  let query = sb.from('murajaah').select('*').eq('user_id', userId)
  if (hafalanId) query = query.eq('hafalan_id', hafalanId)
  query = query.order('reviewed_at', { ascending: false }).limit(50)
  
  const { data } = await query
  return c.json({ success: true, data: data || [] })
})

app.post('/api/murajaah', async (c) => {
  const sb = getSupabase(c)
  const body = await c.req.json()
  const { user_id, hafalan_id, surah_number, surah_name, juz, quality, review_type, notes } = body
  
  const { data, error } = await sb.from('murajaah').insert({
    user_id: user_id || 1,
    hafalan_id, surah_number, surah_name, juz,
    quality, review_type: review_type || 'self',
    notes: notes || null
  }).select().single()
  
  if (error) return c.json({ success: false, error: error.message }, 500)
  
  // Update hafalan quality
  await sb.from('hafalan').update({ quality, updated_at: new Date().toISOString() }).eq('id', hafalan_id)
  
  // Award XP for review
  await addXP(sb, user_id || 1, 3)
  
  return c.json({ success: true, id: data.id })
})

// ============================================================
// API: Daily Log
// ============================================================
app.get('/api/daily-log', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  const days = parseInt(c.req.query('days') || '30')
  
  const { data } = await sb.from('daily_log').select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(days)
  
  return c.json({ success: true, data: data || [] })
})

app.post('/api/daily-log', async (c) => {
  const sb = getSupabase(c)
  const body = await c.req.json()
  const { user_id, log_date, new_memorized_pages, review_pages, total_minutes, mood, notes } = body
  
  const { data, error } = await sb.from('daily_log').upsert({
    user_id: user_id || 1,
    log_date,
    new_memorized_pages: new_memorized_pages || 0,
    review_pages: review_pages || 0,
    total_minutes: total_minutes || 0,
    mood: mood || 'normal',
    notes: notes || null
  }, { onConflict: 'user_id,log_date' }).select().single()
  
  if (error) return c.json({ success: false, error: error.message }, 500)
  
  await addXP(sb, user_id || 1, 2)
  
  return c.json({ success: true, id: data.id })
})

// ============================================================
// API: Dashboard Stats
// ============================================================
app.get('/api/stats', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  
  // Get user
  const { data: user } = await sb.from('users').select('*').eq('id', userId).single()
  
  // Get all hafalan for this user
  const { data: allHafalan } = await sb.from('hafalan').select('*').eq('user_id', userId)
  const hafalan = allHafalan || []
  
  const memorized = hafalan.filter((h: any) => h.status === 'memorized')
  const inProgress = hafalan.filter((h: any) => h.status === 'in_progress')
  const needReview = hafalan.filter((h: any) => h.status === 'need_review')
  
  const totalHafalan = {
    total_entries: hafalan.length,
    memorized_count: memorized.length,
    in_progress_count: inProgress.length,
    need_review_count: needReview.length,
    memorized_ayat: memorized.reduce((sum: number, h: any) => sum + (h.total_ayat || 0), 0),
    total_tracked_ayat: hafalan.reduce((sum: number, h: any) => sum + (h.total_ayat || 0), 0),
    memorized_pages: memorized.reduce((sum: number, h: any) => sum + (h.pages || 0), 0),
    avg_quality: memorized.length > 0 ? Math.round(memorized.reduce((sum: number, h: any) => sum + (h.quality || 0), 0) / memorized.length) : 0
  }
  
  // Juz progress
  const juzMap = new Map<number, any>()
  hafalan.forEach((h: any) => {
    if (!juzMap.has(h.juz)) {
      juzMap.set(h.juz, { juz: h.juz, total_entries: 0, memorized_count: 0, total_ayat: 0, memorized_ayat: 0 })
    }
    const j = juzMap.get(h.juz)!
    j.total_entries++
    j.total_ayat += h.total_ayat || 0
    if (h.status === 'memorized') {
      j.memorized_count++
      j.memorized_ayat += h.total_ayat || 0
    }
  })
  const juzProgress = Array.from(juzMap.values()).sort((a, b) => a.juz - b.juz)
  
  // Recent murajaah
  const { data: recentMurajaah } = await sb.from('murajaah').select('*')
    .eq('user_id', userId).order('reviewed_at', { ascending: false }).limit(5)
  
  // Streak
  const { data: dailyLogs } = await sb.from('daily_log').select('log_date')
    .eq('user_id', userId)
    .or('new_memorized_pages.gt.0,review_pages.gt.0')
    .order('log_date', { ascending: false }).limit(60)
  
  let streak = 0
  if (dailyLogs && dailyLogs.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < dailyLogs.length; i++) {
      const logDate = new Date(dailyLogs[i].log_date)
      logDate.setHours(0, 0, 0, 0)
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)
      if (logDate.getTime() === expectedDate.getTime()) streak++
      else break
    }
  }
  
  // Today's log
  const todayStr = new Date().toISOString().split('T')[0]
  const { data: todayLog } = await sb.from('daily_log').select('*')
    .eq('user_id', userId).eq('log_date', todayStr).single()
  
  // Achievements
  const { data: userAchievements } = await sb.from('user_achievements')
    .select('*, achievements(*)').eq('user_id', userId)
  
  return c.json({
    success: true,
    data: {
      user,
      hafalan: totalHafalan,
      juz_progress: juzProgress,
      recent_murajaah: recentMurajaah || [],
      streak,
      today_log: todayLog,
      achievements: userAchievements || []
    }
  })
})

// ============================================================
// API: Suggestions
// ============================================================
app.get('/api/suggestions/murajaah', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  
  // Get hafalan that are memorized or need review
  const { data: hafalanList } = await sb.from('hafalan').select('*')
    .eq('user_id', userId)
    .in('status', ['memorized', 'need_review'])
    .order('quality').order('updated_at')
  
  if (!hafalanList || hafalanList.length === 0) {
    return c.json({ success: true, data: [] })
  }
  
  // For each, find last review date
  const results = []
  for (const h of hafalanList.slice(0, 10)) {
    const { data: lastReview } = await sb.from('murajaah')
      .select('reviewed_at').eq('hafalan_id', h.id)
      .order('reviewed_at', { ascending: false }).limit(1).single()
    
    const { count } = await sb.from('murajaah')
      .select('*', { count: 'exact', head: true }).eq('hafalan_id', h.id)
    
    results.push({
      ...h,
      last_reviewed: lastReview?.reviewed_at || null,
      review_count: count || 0
    })
  }
  
  // Sort: need_review first, then by last_reviewed (null first), then by quality ascending
  results.sort((a, b) => {
    if (a.status === 'need_review' && b.status !== 'need_review') return -1
    if (a.status !== 'need_review' && b.status === 'need_review') return 1
    if (!a.last_reviewed && b.last_reviewed) return -1
    if (a.last_reviewed && !b.last_reviewed) return 1
    return (a.quality || 0) - (b.quality || 0)
  })
  
  return c.json({ success: true, data: results })
})

// ============================================================
// API: Achievements
// ============================================================
app.get('/api/achievements', async (c) => {
  const sb = getSupabase(c)
  const userId = c.req.query('user_id') || '1'
  
  const { data: all } = await sb.from('achievements').select('*').order('id')
  const { data: unlocked } = await sb.from('user_achievements').select('achievement_id').eq('user_id', userId)
  
  const unlockedIds = new Set((unlocked || []).map((u: any) => u.achievement_id))
  const result = (all || []).map((a: any) => ({ ...a, unlocked: unlockedIds.has(a.id) }))
  
  return c.json({ success: true, data: result })
})

// ============================================================
// API: Leaderboard
// ============================================================
app.get('/api/leaderboard', async (c) => {
  const sb = getSupabase(c)
  const { data } = await sb.from('users')
    .select('id, name, xp, level, tier')
    .eq('is_active', true)
    .order('xp', { ascending: false })
    .limit(20)
  
  return c.json({ success: true, data: data || [] })
})

// ============================================================
// Helper: Add XP and level up
// ============================================================
async function addXP(sb: any, userId: number, amount: number) {
  const { data: user } = await sb.from('users').select('xp, level').eq('id', userId).single()
  if (!user) return
  
  const newXP = (user.xp || 0) + amount
  const newLevel = Math.floor(newXP / 100) + 1
  
  await sb.from('users').update({ xp: newXP, level: newLevel, total_points: newXP, updated_at: new Date().toISOString() }).eq('id', userId)
}

// ============================================================
// FRONTEND
// ============================================================
app.get('/', (c) => c.html(getMainHTML()))
app.get('/:path{.*}', (c) => {
  const path = c.req.param('path')
  if (path.startsWith('api/') || path.startsWith('static/')) return c.notFound()
  return c.html(getMainHTML())
})

function getMainHTML() {
  return `<!DOCTYPE html>
<html lang="id" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tahfidz Tracker Pro - Pencatat Hafalan Al-Qur'an</title>
  <meta name="description" content="Aplikasi premium pencatat dan tracker hafalan Al-Qur'an. Catat progress hafalan, jadwalkan murajaah, gamifikasi, dan pantau perkembangan.">
  <meta name="theme-color" content="#065f46">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
            gold: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309' },
            dark: { 50:'#f8fafc',100:'#1e293b',200:'#1a2332',300:'#151d2b',400:'#111827',500:'#0f172a',600:'#0d1117',700:'#090c10' }
          },
          fontFamily: { arabic:['Amiri','serif'], sans:['Poppins','Inter','sans-serif'] }
        }
      }
    }
  </script>
  <link href="/static/style.css" rel="stylesheet">
</head>
<body class="bg-gray-50 dark:bg-dark-600 min-h-screen max-w-lg mx-auto relative transition-colors duration-300">
  <div id="app" class="pb-24">
    <!-- Login Screen -->
    <div id="login-screen" class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span class="text-4xl">📖</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Tahfidz Tracker</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Pro Edition</p>
        </div>
        <div class="bg-white dark:bg-dark-300 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-200">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Nama</label>
              <input type="text" id="login-name" value="Santri" placeholder="Masukkan nama"
                class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white transition-all">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">PIN</label>
              <input type="password" id="login-pin" value="1234" placeholder="Masukkan PIN"
                class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white transition-all">
            </div>
            <button onclick="doLogin()" id="btn-login" class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all active:scale-[0.98]">
              <i class="fas fa-right-to-bracket mr-2"></i>Masuk
            </button>
            <div class="text-center">
              <button onclick="showRegister()" class="text-primary-600 text-xs font-medium hover:underline">Belum punya akun? Daftar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Screen -->
    <div id="register-screen" class="min-h-screen flex items-center justify-center p-6 hidden">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span class="text-4xl">📖</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Daftar Akun</h1>
        </div>
        <div class="bg-white dark:bg-dark-300 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-200">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Nama</label>
              <input type="text" id="reg-name" placeholder="Masukkan nama"
                class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Email (opsional)</label>
              <input type="email" id="reg-email" placeholder="email@contoh.com"
                class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">PIN (4 digit)</label>
              <input type="password" id="reg-pin" placeholder="Buat PIN" maxlength="6"
                class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
            </div>
            <button onclick="doRegister()" id="btn-register" class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl font-semibold shadow-lg">
              <i class="fas fa-user-plus mr-2"></i>Daftar
            </button>
            <div class="text-center">
              <button onclick="showLogin()" class="text-primary-600 text-xs font-medium hover:underline">Sudah punya akun? Masuk</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div id="main-content" class="hidden">
      <!-- Header -->
      <header id="app-header" class="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 dark:from-dark-400 dark:via-dark-300 dark:to-dark-500 text-white px-5 pt-6 pb-10 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <!-- Decorative pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-2 right-4 arabic-text text-6xl">بسم الله</div>
          <div class="absolute bottom-2 left-4 arabic-text text-4xl">الحمد لله</div>
        </div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h1 class="text-lg font-bold flex items-center gap-2">
                <span>📖</span> Tahfidz Tracker
                <span class="text-[9px] bg-gold-400/20 text-gold-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Pro</span>
              </h1>
              <p id="user-greeting" class="text-primary-200 dark:text-gray-400 text-xs mt-0.5">Assalamu'alaikum, Santri</p>
            </div>
            <div class="flex items-center gap-3">
              <div id="streak-badge" class="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 hidden border border-white/10">
                <span class="streak-fire">🔥</span>
                <span id="streak-count" class="font-bold">0</span>
                <span class="text-primary-200 text-[10px]">hari</span>
              </div>
              <button onclick="toggleTheme()" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <i id="theme-icon" class="fas fa-moon text-sm"></i>
              </button>
              <button onclick="showSettingsModal()" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <i class="fas fa-gear text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-4 gap-2">
            <div class="glass-card rounded-2xl p-3 text-center">
              <div id="stat-memorized" class="text-xl font-extrabold">0</div>
              <div class="text-primary-200 dark:text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">Surah</div>
            </div>
            <div class="glass-card rounded-2xl p-3 text-center">
              <div id="stat-ayat" class="text-xl font-extrabold">0</div>
              <div class="text-primary-200 dark:text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">Ayat</div>
            </div>
            <div class="glass-card rounded-2xl p-3 text-center">
              <div id="stat-quality" class="text-xl font-extrabold">0%</div>
              <div class="text-primary-200 dark:text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">Mutqin</div>
            </div>
            <div class="glass-card rounded-2xl p-3 text-center">
              <div id="stat-level" class="text-xl font-extrabold">1</div>
              <div class="text-primary-200 dark:text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">Level</div>
            </div>
          </div>
          
          <!-- XP Bar -->
          <div class="mt-3">
            <div class="flex justify-between text-[10px] text-primary-200 dark:text-gray-400 mb-1">
              <span id="xp-label">0 XP</span>
              <span id="xp-next">Level 2: 100 XP</span>
            </div>
            <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div id="xp-bar" class="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-700" style="width:0%"></div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div id="page-content" class="px-4 py-4 -mt-4"></div>
    </div>
  </div>

  <!-- Bottom Nav -->
  <nav id="bottom-nav" class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 dark:bg-dark-400/90 backdrop-blur-xl border-t border-gray-100 dark:border-dark-200 shadow-2xl rounded-t-2xl hidden z-50">
    <div class="flex justify-around items-center py-2 px-1">
      <button onclick="navigateTo('dashboard')" class="nav-item flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all" data-page="dashboard">
        <i class="fas fa-mosque text-lg mb-0.5"></i>
        <span class="text-[9px] font-semibold uppercase tracking-wider">Beranda</span>
      </button>
      <button onclick="navigateTo('hafalan')" class="nav-item flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all" data-page="hafalan">
        <i class="fas fa-book-quran text-lg mb-0.5"></i>
        <span class="text-[9px] font-semibold uppercase tracking-wider">Hafalan</span>
      </button>
      <button onclick="showAddModal()" class="nav-item flex flex-col items-center py-1 px-1 -mt-6 transition-all">
        <div class="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/40 rotate-0 hover:rotate-90 transition-transform duration-300">
          <i class="fas fa-plus text-xl"></i>
        </div>
      </button>
      <button onclick="navigateTo('murajaah')" class="nav-item flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all" data-page="murajaah">
        <i class="fas fa-rotate text-lg mb-0.5"></i>
        <span class="text-[9px] font-semibold uppercase tracking-wider">Murajaah</span>
      </button>
      <button onclick="navigateTo('progress')" class="nav-item flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all" data-page="progress">
        <i class="fas fa-trophy text-lg mb-0.5"></i>
        <span class="text-[9px] font-semibold uppercase tracking-wider">Progress</span>
      </button>
    </div>
  </nav>

  <!-- Modal -->
  <div id="modal-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] hidden transition-opacity" onclick="closeModal()"></div>
  <div id="modal-container" class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-[70] hidden"></div>

  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`
}

export default app
