// ============================================================
// TAHFIDZ TRACKER PRO - Frontend Application
// Enhanced with Supabase, Gamification, Dark Mode, Auth
// ============================================================

const API = '/api';
let currentPage = 'dashboard';
let currentUser = null;
let appState = {
  user: null, stats: null, hafalan: [], surahs: [],
  suggestions: [], dailyLogs: [], murajaah: [], achievements: []
};

// ============================================================
// THEME MANAGEMENT
// ============================================================
function initTheme() {
  const saved = localStorage.getItem('tahfidz-theme') || 'light';
  applyTheme(saved);
}

function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('tahfidz-theme', next);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-icon')?.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.documentElement.classList.remove('dark');
    document.getElementById('theme-icon')?.classList.replace('fa-sun', 'fa-moon');
  }
}

// ============================================================
// AUTH
// ============================================================
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('register-screen').classList.add('hidden');
}

function showRegister() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('register-screen').classList.remove('hidden');
}

async function doLogin() {
  const btn = document.getElementById('btn-login');
  const name = document.getElementById('login-name').value.trim();
  const pin = document.getElementById('login-pin').value.trim();
  if (!name || !pin) return showToast('Nama dan PIN wajib diisi', 'error');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Masuk...';
  try {
    const res = await axios.post(`${API}/auth/login`, { name, pin });
    currentUser = res.data.data;
    localStorage.setItem('tahfidz-user', JSON.stringify(currentUser));
    showMainApp();
  } catch (err) {
    showToast(err.response?.data?.error || 'Login gagal', 'error');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-right-to-bracket mr-2"></i>Masuk';
  }
}

async function doRegister() {
  const btn = document.getElementById('btn-register');
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pin = document.getElementById('reg-pin').value.trim();
  if (!name || !pin) return showToast('Nama dan PIN wajib diisi', 'error');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mendaftar...';
  try {
    const res = await axios.post(`${API}/auth/register`, { name, email, pin });
    currentUser = res.data.data;
    localStorage.setItem('tahfidz-user', JSON.stringify(currentUser));
    showToast('Akun berhasil dibuat! Selamat datang!');
    showMainApp();
  } catch (err) {
    showToast(err.response?.data?.error || 'Registrasi gagal', 'error');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Daftar';
  }
}

function showMainApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('register-screen').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  document.getElementById('bottom-nav').classList.remove('hidden');
  document.getElementById('user-greeting').textContent = `Assalamu'alaikum, ${currentUser.name}`;
  initApp();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('tahfidz-user');
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('bottom-nav').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  closeModal();
}

// ============================================================
// INITIALIZATION
// ============================================================
async function initApp() {
  try {
    const surahRes = await axios.get(`${API}/quran/surahs`);
    appState.surahs = surahRes.data.data;
    await loadStats();
    navigateTo('dashboard');
  } catch (err) {
    console.error('Init error:', err);
    showToast('Gagal memuat data. Coba refresh.', 'error');
  }
}

async function loadStats() {
  try {
    const statsRes = await axios.get(`${API}/stats?user_id=${currentUser.id}`);
    appState.stats = statsRes.data.data;
    updateHeaderStats();
  } catch(e) { console.error('Stats error:', e); }
}

function updateHeaderStats() {
  const s = appState.stats;
  if (!s || !s.hafalan) return;
  document.getElementById('stat-memorized').textContent = s.hafalan.memorized_count || 0;
  document.getElementById('stat-ayat').textContent = s.hafalan.memorized_ayat || 0;
  document.getElementById('stat-quality').textContent = Math.round(s.hafalan.avg_quality || 0) + '%';
  
  const user = s.user || currentUser;
  const level = user.level || 1;
  const xp = user.xp || 0;
  const xpInLevel = xp % 100;
  const xpNeeded = 100;
  
  document.getElementById('stat-level').textContent = level;
  document.getElementById('xp-label').textContent = `${xp} XP`;
  document.getElementById('xp-next').textContent = `Level ${level + 1}: ${level * 100} XP`;
  document.getElementById('xp-bar').style.width = `${(xpInLevel / xpNeeded) * 100}%`;
  
  if (s.streak > 0) {
    document.getElementById('streak-badge').classList.remove('hidden');
    document.getElementById('streak-count').textContent = s.streak;
  } else {
    document.getElementById('streak-badge').classList.add('hidden');
  }
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.page === page) el.classList.add('active');
  });
  const content = document.getElementById('page-content');
  content.innerHTML = `<div class="flex justify-center py-12"><div class="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`;
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'hafalan': renderHafalan(); break;
    case 'murajaah': renderMurajaah(); break;
    case 'progress': renderProgress(); break;
  }
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
  await loadStats();
  const s = appState.stats;
  const content = document.getElementById('page-content');
  const totalAyat = 6236;
  const memorizedAyat = s.hafalan?.memorized_ayat || 0;
  const progressPct = Math.round((memorizedAyat / totalAyat) * 100);
  const today = s.today_log;

  try {
    const sugRes = await axios.get(`${API}/suggestions/murajaah?user_id=${currentUser.id}`);
    appState.suggestions = sugRes.data.data;
  } catch(e) { appState.suggestions = []; }

  const quotes = [
    { text: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya.", src: "HR. Bukhari" },
    { text: "Bacalah Al-Qur'an, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi penghafalnya.", src: "HR. Muslim" },
    { text: "Orang yang mahir membaca Al-Qur'an bersama para malaikat yang mulia lagi taat.", src: "HR. Bukhari & Muslim" },
    { text: "Sesungguhnya Allah mengangkat derajat kaum dengan Al-Qur'an ini dan merendahkan kaum yang lain.", src: "HR. Muslim" },
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  content.innerHTML = `
    <div class="page-transition space-y-4">
      <!-- Motivational Quote -->
      <div class="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-2xl p-4 border border-primary-200/50 dark:border-primary-800/30">
        <div class="flex items-start gap-3">
          <div class="text-2xl mt-0.5 float">🤲</div>
          <div>
            <p class="text-primary-800 dark:text-primary-300 text-sm font-medium italic leading-relaxed">"${quote.text}"</p>
            <p class="text-primary-600 dark:text-primary-500 text-xs mt-1.5 font-semibold">— ${quote.src}</p>
          </div>
        </div>
      </div>

      <!-- Progress Circle -->
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200 card-hover">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Progress Keseluruhan</h3>
        <div class="flex items-center gap-5">
          <div class="relative w-28 h-28 flex-shrink-0">
            <svg class="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" class="text-gray-100 dark:text-dark-200" stroke-width="7" fill="none"/>
              <circle cx="50" cy="50" r="42" stroke="url(#progressGrad)" stroke-width="7" fill="none"
                stroke-dasharray="${2 * Math.PI * 42}" 
                stroke-dashoffset="${2 * Math.PI * 42 * (1 - progressPct / 100)}"
                stroke-linecap="round" class="progress-ring"/>
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#10b981"/>
                  <stop offset="100%" style="stop-color:#059669"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-extrabold text-primary-700 dark:text-primary-400">${progressPct}%</div>
                <div class="text-[9px] text-gray-400 uppercase tracking-wider">Tercapai</div>
              </div>
            </div>
          </div>
          <div class="flex-1 space-y-2.5">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 text-xs">Ayat dihafal</span>
              <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${memorizedAyat.toLocaleString()} / 6,236</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 text-xs">Halaman</span>
              <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${Math.round(s.hafalan?.memorized_pages || 0)} / 604</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 text-xs">Sedang dihafal</span>
              <span class="font-bold text-gold-600 text-xs">${s.hafalan?.in_progress_count || 0} surah</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 text-xs">Perlu review</span>
              <span class="font-bold text-red-500 text-xs">${s.hafalan?.need_review_count || 0} surah</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Activity -->
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200 card-hover">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aktivitas Hari Ini</h3>
          <button onclick="showDailyLogModal()" class="text-primary-600 dark:text-primary-400 text-xs font-semibold hover:underline">
            <i class="fas fa-pen-to-square mr-1"></i>Catat
          </button>
        </div>
        ${today ? `
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl p-3 text-center border border-primary-200/30 dark:border-primary-800/20">
              <div class="text-xl font-extrabold text-primary-700 dark:text-primary-400">${today.new_memorized_pages || 0}</div>
              <div class="text-[9px] text-primary-600 dark:text-primary-500 uppercase tracking-wider mt-0.5">Hal. Baru</div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-3 text-center border border-blue-200/30 dark:border-blue-800/20">
              <div class="text-xl font-extrabold text-blue-700 dark:text-blue-400">${today.review_pages || 0}</div>
              <div class="text-[9px] text-blue-600 dark:text-blue-500 uppercase tracking-wider mt-0.5">Hal. Review</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-3 text-center border border-purple-200/30 dark:border-purple-800/20">
              <div class="text-xl font-extrabold text-purple-700 dark:text-purple-400">${today.total_minutes || 0}</div>
              <div class="text-[9px] text-purple-600 dark:text-purple-500 uppercase tracking-wider mt-0.5">Menit</div>
            </div>
          </div>
          ${today.mood ? `<div class="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">Mood: ${getMoodEmoji(today.mood)} ${today.mood}</div>` : ''}
        ` : `
          <div class="text-center py-6">
            <div class="text-4xl mb-2 float">📝</div>
            <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">Belum ada catatan hari ini</p>
            <button onclick="showDailyLogModal()" class="mt-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-5 py-2 rounded-xl text-xs font-semibold">
              Catat Sekarang
            </button>
          </div>
        `}
      </div>

      <!-- Murajaah Suggestions -->
      ${appState.suggestions.length > 0 ? `
        <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200 card-hover">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
            <i class="fas fa-bell text-gold-500 mr-1.5"></i>Perlu Dimurajaah
          </h3>
          <div class="space-y-2">
            ${appState.suggestions.slice(0, 3).map(s => `
              <div class="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-3 border border-amber-100 dark:border-amber-800/20">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-600 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs font-bold shadow-sm">${s.surah_number}</div>
                  <div>
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">${s.surah_name}</div>
                    <div class="text-[10px] text-gray-400 dark:text-gray-500">Ayat ${s.start_ayat}-${s.end_ayat} · Juz ${s.juz}</div>
                  </div>
                </div>
                <button onclick="showReviewModal(${s.id}, '${s.surah_name}', ${s.surah_number}, ${s.juz})"
                  class="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                  Review
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Juz Progress Grid -->
      ${s.juz_progress && s.juz_progress.length > 0 ? `
        <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200 card-hover">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Progress per Juz</h3>
          <div class="grid grid-cols-6 gap-2">
            ${Array.from({length: 30}, (_, i) => {
              const juz = i + 1;
              const jp = s.juz_progress.find(j => j.juz === juz);
              const pct = jp ? Math.round((jp.memorized_count / jp.total_entries) * 100) : 0;
              const hasEntries = jp && jp.total_entries > 0;
              let bgColor = 'bg-gray-100 dark:bg-dark-200 text-gray-400 dark:text-gray-600';
              if (hasEntries && pct === 100) bgColor = 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-sm shadow-primary-500/30';
              else if (hasEntries && pct > 0) bgColor = 'bg-primary-200 dark:bg-primary-800/30 text-primary-800 dark:text-primary-300';
              return `<div class="aspect-square rounded-xl ${bgColor} flex items-center justify-center text-xs font-bold juz-cell" title="Juz ${juz}: ${pct}%">${juz}</div>`;
            }).join('')}
          </div>
          <div class="flex items-center gap-4 mt-3 text-[9px] text-gray-400 dark:text-gray-500">
            <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-primary-500"></div>Selesai</div>
            <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-primary-200 dark:bg-primary-800"></div>Proses</div>
            <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-gray-100 dark:bg-dark-200"></div>Belum</div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================
// HAFALAN PAGE
// ============================================================
async function renderHafalan() {
  try {
    const res = await axios.get(`${API}/hafalan?user_id=${currentUser.id}`);
    appState.hafalan = res.data.data;
  } catch(e) { appState.hafalan = []; }

  const content = document.getElementById('page-content');
  const inProgress = appState.hafalan.filter(h => h.status === 'in_progress');
  const memorized = appState.hafalan.filter(h => h.status === 'memorized');
  const needReview = appState.hafalan.filter(h => h.status === 'need_review');

  content.innerHTML = `
    <div class="page-transition space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">Daftar Hafalan</h2>
        <button onclick="showAddModal()" class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary-500/30">
          <i class="fas fa-plus mr-1.5"></i>Tambah
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onclick="filterHafalan('all')" class="hafalan-filter active whitespace-nowrap bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-xl text-xs font-bold" data-filter="all">
          Semua (${appState.hafalan.length})
        </button>
        <button onclick="filterHafalan('in_progress')" class="hafalan-filter whitespace-nowrap bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-xs font-bold" data-filter="in_progress">
          Proses (${inProgress.length})
        </button>
        <button onclick="filterHafalan('memorized')" class="hafalan-filter whitespace-nowrap bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-xs font-bold" data-filter="memorized">
          Hafal (${memorized.length})
        </button>
        <button onclick="filterHafalan('need_review')" class="hafalan-filter whitespace-nowrap bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-xs font-bold" data-filter="need_review">
          Review (${needReview.length})
        </button>
      </div>

      <div id="hafalan-list" class="space-y-2">
        ${appState.hafalan.length === 0 ? renderEmptyHafalan() : renderHafalanList(appState.hafalan)}
      </div>
    </div>
  `;
}

function renderEmptyHafalan() {
  return `
    <div class="text-center py-16">
      <div class="text-6xl mb-4 float">📖</div>
      <p class="font-bold text-gray-700 dark:text-gray-300 text-lg">Belum ada hafalan</p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Mulai perjalanan hafalanmu sekarang</p>
      <button onclick="showAddModal()" class="mt-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30">
        <i class="fas fa-plus mr-2"></i>Tambah Hafalan Pertama
      </button>
    </div>
  `;
}

function renderHafalanList(list) {
  const cfg = {
    'in_progress': { color: 'amber', icon: 'clock', label: 'Proses', gradient: 'from-amber-400 to-amber-500' },
    'memorized': { color: 'primary', icon: 'check-circle', label: 'Hafal', gradient: 'from-primary-400 to-primary-500' },
    'need_review': { color: 'red', icon: 'exclamation-circle', label: 'Review', gradient: 'from-red-400 to-red-500' }
  };
  return list.map(h => {
    const sc = cfg[h.status] || cfg['in_progress'];
    const surah = appState.surahs.find(s => s.number === h.surah_number);
    return `
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-200 card-hover" onclick="showHafalanActions(${h.id})">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${sc.gradient} text-white flex items-center justify-center font-bold text-sm shadow-sm">${h.surah_number}</div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800 dark:text-white text-sm">${h.surah_name}</span>
                ${surah ? `<span class="arabic-text text-gray-300 dark:text-gray-600 text-lg">${surah.arabic}</span>` : ''}
              </div>
              <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                Ayat ${h.start_ayat}-${h.end_ayat} · Juz ${h.juz} · ${h.pages || 0} hal.
              </div>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-${sc.color}-100 dark:bg-${sc.color}-900/20 text-${sc.color}-700 dark:text-${sc.color}-400 font-bold">
              <i class="fas fa-${sc.icon} text-[8px]"></i>${sc.label}
            </span>
            ${h.quality > 0 ? `<div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">${h.quality}%</div>` : ''}
          </div>
        </div>
        ${h.quality > 0 ? `
          <div class="mt-3 h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r ${sc.gradient} rounded-full quality-bar" style="width:${h.quality}%"></div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function filterHafalan(status) {
  document.querySelectorAll('.hafalan-filter').forEach(btn => {
    btn.classList.remove('active', 'bg-primary-100', 'dark:bg-primary-900/30', 'text-primary-700', 'dark:text-primary-400');
    btn.classList.add('bg-gray-100', 'dark:bg-dark-200', 'text-gray-500', 'dark:text-gray-400');
  });
  const activeBtn = document.querySelector(`.hafalan-filter[data-filter="${status}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-100', 'dark:bg-dark-200', 'text-gray-500', 'dark:text-gray-400');
    activeBtn.classList.add('active', 'bg-primary-100', 'dark:bg-primary-900/30', 'text-primary-700', 'dark:text-primary-400');
  }
  const list = status === 'all' ? appState.hafalan : appState.hafalan.filter(h => h.status === status);
  document.getElementById('hafalan-list').innerHTML = list.length === 0
    ? '<div class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">Tidak ada data</div>'
    : renderHafalanList(list);
}

// ============================================================
// MURAJAAH PAGE
// ============================================================
async function renderMurajaah() {
  try {
    const [mRes, sRes] = await Promise.all([
      axios.get(`${API}/murajaah?user_id=${currentUser.id}`),
      axios.get(`${API}/suggestions/murajaah?user_id=${currentUser.id}`)
    ]);
    appState.murajaah = mRes.data.data;
    appState.suggestions = sRes.data.data;
  } catch(e) {}

  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="page-transition space-y-4">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Murajaah</h2>

      ${appState.suggestions.length > 0 ? `
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-800/20">
          <h3 class="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3 uppercase tracking-wider">
            <i class="fas fa-bell mr-1.5"></i>Perlu Dimurajaah
          </h3>
          <div class="space-y-2.5">
            ${appState.suggestions.map(s => `
              <div class="flex items-center justify-between bg-white dark:bg-dark-300 rounded-xl p-3.5 border border-amber-100 dark:border-dark-200 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-600 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs font-bold">${s.surah_number}</div>
                  <div>
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">${s.surah_name}</div>
                    <div class="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      Ayat ${s.start_ayat}-${s.end_ayat} · 
                      ${s.last_reviewed ? formatDate(s.last_reviewed) : 'Belum pernah'} · ${s.review_count || 0}x
                    </div>
                  </div>
                </div>
                <button onclick="showReviewModal(${s.id}, '${s.surah_name}', ${s.surah_number}, ${s.juz})"
                  class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
                  <i class="fas fa-rotate mr-1"></i>Review
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/10 dark:to-emerald-900/10 rounded-2xl p-8 text-center border border-primary-200/50 dark:border-primary-800/20">
          <div class="text-5xl mb-3 float">✨</div>
          <p class="text-primary-700 dark:text-primary-400 font-bold text-base">MasyaAllah!</p>
          <p class="text-primary-600 dark:text-primary-500 text-xs mt-1">Semua hafalan sudah di-review. Terus tambahkan hafalan baru!</p>
        </div>
      `}

      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Riwayat Murajaah</h3>
        ${appState.murajaah.length > 0 ? `
          <div class="space-y-2">
            ${appState.murajaah.slice(0, 15).map(m => `
              <div class="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-dark-200 last:border-0">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold">${m.surah_number}</div>
                  <div>
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">${m.surah_name}</div>
                    <div class="text-[10px] text-gray-400 dark:text-gray-500">${formatDate(m.reviewed_at)} · ${m.review_type}</div>
                  </div>
                </div>
                <div class="text-sm font-extrabold ${m.quality >= 80 ? 'text-primary-600 dark:text-primary-400' : m.quality >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}">
                  ${m.quality}%
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            <i class="fas fa-rotate text-3xl mb-2"></i>
            <p>Belum ada riwayat murajaah</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// ============================================================
// PROGRESS PAGE (with Achievements)
// ============================================================
async function renderProgress() {
  await loadStats();
  try {
    const [logsRes, achRes] = await Promise.all([
      axios.get(`${API}/daily-log?user_id=${currentUser.id}&days=30`),
      axios.get(`${API}/achievements?user_id=${currentUser.id}`)
    ]);
    appState.dailyLogs = logsRes.data.data;
    appState.achievements = achRes.data.data;
  } catch(e) { appState.dailyLogs = []; appState.achievements = []; }

  const content = document.getElementById('page-content');
  const s = appState.stats;
  const totalAyat = 6236;
  const memorizedAyat = s.hafalan?.memorized_ayat || 0;
  const totalPages = 604;
  const memorizedPages = Math.round(s.hafalan?.memorized_pages || 0);
  const avgPPD = appState.dailyLogs.length > 0
    ? appState.dailyLogs.reduce((sum, l) => sum + (l.new_memorized_pages || 0), 0) / appState.dailyLogs.length : 0;
  const estDays = avgPPD > 0 ? Math.ceil((totalPages - memorizedPages) / avgPPD) : 0;

  content.innerHTML = `
    <div class="page-transition space-y-4">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Progress & Prestasi</h2>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white dark:bg-dark-300 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-200 text-center card-hover">
          <div class="text-3xl font-extrabold text-primary-600 dark:text-primary-400">${memorizedAyat.toLocaleString()}</div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">dari ${totalAyat.toLocaleString()} Ayat</div>
          <div class="h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full mt-2">
            <div class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style="width:${(memorizedAyat/totalAyat*100).toFixed(1)}%"></div>
          </div>
        </div>
        <div class="bg-white dark:bg-dark-300 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-200 text-center card-hover">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">${memorizedPages}</div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">dari ${totalPages} Halaman</div>
          <div class="h-1.5 bg-gray-100 dark:bg-dark-200 rounded-full mt-2">
            <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style="width:${(memorizedPages/totalPages*100).toFixed(1)}%"></div>
          </div>
        </div>
      </div>

      <!-- Streak & Estimation -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-800/20 text-center card-hover">
          <div class="text-3xl">${s.streak > 0 ? '🔥' : '💪'}</div>
          <div class="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">${s.streak}</div>
          <div class="text-[10px] text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider">Hari Streak</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-800/20 text-center card-hover">
          <div class="text-3xl">🎯</div>
          <div class="text-2xl font-extrabold text-purple-700 dark:text-purple-400 mt-1">${estDays > 0 ? estDays : '∞'}</div>
          <div class="text-[10px] text-purple-600 dark:text-purple-500 font-semibold uppercase tracking-wider">Est. Selesai</div>
        </div>
      </div>

      <!-- Achievements -->
      ${appState.achievements.length > 0 ? `
        <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
            <i class="fas fa-medal text-gold-500 mr-1.5"></i>Prestasi (${appState.achievements.filter(a=>a.unlocked).length}/${appState.achievements.length})
          </h3>
          <div class="grid grid-cols-4 gap-3">
            ${appState.achievements.map(a => `
              <div class="text-center ${a.unlocked ? 'achievement-unlocked' : 'achievement-locked'}" title="${a.name}: ${a.description}">
                <div class="text-2xl mb-1">${a.icon}</div>
                <div class="text-[9px] font-bold text-gray-700 dark:text-gray-300 truncate">${a.name}</div>
                <div class="text-[8px] text-gray-400 dark:text-gray-500">+${a.xp_reward} XP</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Quality Distribution -->
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Distribusi Kualitas</h3>
        ${renderQualityDistribution()}
      </div>

      <!-- Activity Heatmap -->
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Aktivitas 30 Hari</h3>
        ${renderActivityHeatmap()}
      </div>

      <!-- Daily Log History -->
      <div class="bg-white dark:bg-dark-300 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-200">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Riwayat Harian</h3>
          <button onclick="showDailyLogModal()" class="text-primary-600 dark:text-primary-400 text-xs font-semibold"><i class="fas fa-plus mr-1"></i>Tambah</button>
        </div>
        ${appState.dailyLogs.length > 0 ? `
          <div class="space-y-2">
            ${appState.dailyLogs.slice(0, 10).map(l => `
              <div class="flex items-center justify-between py-2 border-b border-gray-50 dark:border-dark-200 last:border-0">
                <div>
                  <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">${formatDate(l.log_date)}</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">${l.new_memorized_pages || 0} baru · ${l.review_pages || 0} review · ${l.total_minutes || 0} mnt</div>
                </div>
                <div class="text-lg">${getMoodEmoji(l.mood)}</div>
              </div>
            `).join('')}
          </div>
        ` : '<div class="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">Belum ada riwayat</div>'}
      </div>
    </div>
  `;
}

function renderQualityDistribution() {
  const excellent = appState.hafalan.filter(h => h.quality >= 90).length;
  const good = appState.hafalan.filter(h => h.quality >= 70 && h.quality < 90).length;
  const fair = appState.hafalan.filter(h => h.quality >= 50 && h.quality < 70).length;
  const poor = appState.hafalan.filter(h => h.quality > 0 && h.quality < 50).length;
  const total = excellent + good + fair + poor;
  if (total === 0) return '<div class="text-center text-gray-400 dark:text-gray-500 text-sm py-3">Belum ada data</div>';
  const bars = [
    { label: 'Mutqin (90+)', count: excellent, color: 'from-primary-400 to-primary-500', pct: (excellent/total*100) },
    { label: 'Baik (70-89)', count: good, color: 'from-blue-400 to-blue-500', pct: (good/total*100) },
    { label: 'Cukup (50-69)', count: fair, color: 'from-amber-400 to-amber-500', pct: (fair/total*100) },
    { label: 'Perlu Latihan', count: poor, color: 'from-red-400 to-red-500', pct: (poor/total*100) },
  ];
  return `<div class="space-y-2.5">${bars.map(b => `
    <div class="flex items-center gap-2">
      <span class="text-[10px] w-24 text-gray-500 dark:text-gray-400 font-medium">${b.label}</span>
      <div class="flex-1 h-3 bg-gray-100 dark:bg-dark-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r ${b.color} rounded-full quality-bar" style="width:${b.pct}%"></div>
      </div>
      <span class="text-[10px] w-6 text-right font-bold text-gray-700 dark:text-gray-300">${b.count}</span>
    </div>
  `).join('')}</div>`;
}

function renderActivityHeatmap() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const log = appState.dailyLogs.find(l => l.log_date === ds);
    const act = log ? (log.new_memorized_pages || 0) + (log.review_pages || 0) : 0;
    let bg = 'bg-gray-100 dark:bg-dark-200';
    if (act > 0 && act <= 1) bg = 'bg-primary-200 dark:bg-primary-800/40';
    else if (act > 1 && act <= 3) bg = 'bg-primary-400 dark:bg-primary-600';
    else if (act > 3) bg = 'bg-primary-600 dark:bg-primary-400';
    days.push(`<div class="w-full aspect-square rounded-sm ${bg}" title="${ds}: ${act} hal."></div>`);
  }
  return `
    <div class="grid grid-cols-10 gap-1">${days.join('')}</div>
    <div class="flex items-center gap-3 mt-2 text-[9px] text-gray-400 dark:text-gray-500">
      <span>Sedikit</span>
      <div class="flex gap-0.5">
        <div class="w-3 h-3 rounded-sm bg-gray-100 dark:bg-dark-200"></div>
        <div class="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-800"></div>
        <div class="w-3 h-3 rounded-sm bg-primary-400 dark:bg-primary-600"></div>
        <div class="w-3 h-3 rounded-sm bg-primary-600 dark:bg-primary-400"></div>
      </div>
      <span>Banyak</span>
    </div>
  `;
}

// ============================================================
// MODALS
// ============================================================
function showModal(html) {
  document.getElementById('modal-overlay').classList.remove('hidden');
  const c = document.getElementById('modal-container');
  c.classList.remove('hidden');
  c.innerHTML = `<div class="modal-content p-6 slide-up shadow-2xl">${html}</div>`;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-container').classList.add('hidden');
}

// ADD HAFALAN MODAL
function showAddModal() {
  const opts = appState.surahs.map(s =>
    `<option value="${s.number}" data-name="${s.name}" data-ayat="${s.ayat}" data-juz="${s.juz}" data-pages="${s.pages}">${s.number}. ${s.name} (${s.arabic}) - ${s.ayat} ayat</option>`
  ).join('');

  showModal(`
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">Tambah Hafalan</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><i class="fas fa-times"></i></button>
    </div>
    <form onsubmit="submitHafalan(event)" class="space-y-4">
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Pilih Surah</label>
        <select id="add-surah" onchange="updateSurahInfo()" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
          <option value="">-- Pilih Surah --</option>${opts}
        </select>
      </div>
      <div id="surah-info" class="hidden bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 border border-primary-200/50 dark:border-primary-800/20">
        <div class="flex justify-between text-xs font-semibold">
          <span class="text-primary-700 dark:text-primary-400" id="info-juz"></span>
          <span class="text-primary-700 dark:text-primary-400" id="info-ayat"></span>
          <span class="text-primary-700 dark:text-primary-400" id="info-pages"></span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Dari Ayat</label>
          <input type="number" id="add-start-ayat" value="1" min="1" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Sampai Ayat</label>
          <input type="number" id="add-end-ayat" min="1" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
        <select id="add-status" class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
          <option value="in_progress">Sedang Dihafal</option>
          <option value="memorized">Sudah Hafal</option>
          <option value="need_review">Perlu Review</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Kualitas (0-100)</label>
        <input type="range" id="add-quality" min="0" max="100" value="0" oninput="document.getElementById('quality-val').textContent=this.value+'%'" class="w-full accent-primary-600">
        <div class="text-center text-sm text-primary-600 dark:text-primary-400 font-bold mt-1" id="quality-val">0%</div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Catatan (opsional)</label>
        <textarea id="add-notes" rows="2" placeholder="Catatan tambahan..." class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"></textarea>
      </div>
      <button type="submit" id="btn-submit-hafalan" class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform">
        <i class="fas fa-plus mr-2"></i>Simpan Hafalan
      </button>
    </form>
  `);
}

function updateSurahInfo() {
  const sel = document.getElementById('add-surah');
  const opt = sel.selectedOptions[0];
  const info = document.getElementById('surah-info');
  if (opt && opt.value) {
    info.classList.remove('hidden');
    document.getElementById('info-juz').textContent = 'Juz ' + opt.dataset.juz;
    document.getElementById('info-ayat').textContent = opt.dataset.ayat + ' Ayat';
    document.getElementById('info-pages').textContent = opt.dataset.pages + ' Hal.';
    document.getElementById('add-end-ayat').value = opt.dataset.ayat;
    document.getElementById('add-end-ayat').max = opt.dataset.ayat;
    document.getElementById('add-start-ayat').max = opt.dataset.ayat;
  } else info.classList.add('hidden');
}

async function submitHafalan(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-hafalan');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';
  try {
    const sel = document.getElementById('add-surah');
    const opt = sel.selectedOptions[0];
    const startAyat = parseInt(document.getElementById('add-start-ayat').value);
    const endAyat = parseInt(document.getElementById('add-end-ayat').value);
    await axios.post(`${API}/hafalan`, {
      user_id: currentUser.id, surah_number: parseInt(opt.value), surah_name: opt.dataset.name,
      juz: parseInt(opt.dataset.juz), start_ayat: startAyat, end_ayat: endAyat,
      total_ayat: endAyat - startAyat + 1, pages: parseFloat(opt.dataset.pages),
      status: document.getElementById('add-status').value,
      quality: parseInt(document.getElementById('add-quality').value),
      notes: document.getElementById('add-notes').value || null
    });
    closeModal();
    showToast('Hafalan berhasil ditambahkan! +5 XP');
    await loadStats(); updateHeaderStats();
    if (currentPage === 'hafalan') renderHafalan();
    else if (currentPage === 'dashboard') renderDashboard();
  } catch (err) {
    showToast('Gagal menyimpan: ' + (err.response?.data?.error || err.message), 'error');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-plus mr-2"></i>Simpan Hafalan';
  }
}

// HAFALAN ACTIONS
function showHafalanActions(id) {
  const h = appState.hafalan.find(x => x.id === id);
  if (!h) return;
  showModal(`
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">${h.surah_name}</h3>
        <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">Ayat ${h.start_ayat}-${h.end_ayat} · Juz ${h.juz}</p>
      </div>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <div class="space-y-2">
      <button onclick="updateHafalanStatus(${id}, 'memorized')" class="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 border border-gray-100 dark:border-dark-200 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center"><i class="fas fa-check text-primary-600 dark:text-primary-400"></i></div>
        <div class="text-left"><div class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tandai Sudah Hafal</div><div class="text-[10px] text-gray-400 dark:text-gray-500">Pindahkan ke daftar hafal</div></div>
      </button>
      <button onclick="updateHafalanStatus(${id}, 'need_review')" class="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/10 border border-gray-100 dark:border-dark-200 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center"><i class="fas fa-rotate text-amber-600 dark:text-amber-400"></i></div>
        <div class="text-left"><div class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tandai Perlu Review</div><div class="text-[10px] text-gray-400 dark:text-gray-500">Jadwalkan murajaah</div></div>
      </button>
      <button onclick="updateHafalanStatus(${id}, 'in_progress')" class="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-gray-100 dark:border-dark-200 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><i class="fas fa-book-open text-blue-600 dark:text-blue-400"></i></div>
        <div class="text-left"><div class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tandai Sedang Dihafal</div><div class="text-[10px] text-gray-400 dark:text-gray-500">Masih dalam proses</div></div>
      </button>
      <button onclick="showReviewModal(${h.id}, '${h.surah_name}', ${h.surah_number}, ${h.juz})" class="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/10 border border-gray-100 dark:border-dark-200 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center"><i class="fas fa-star text-purple-600 dark:text-purple-400"></i></div>
        <div class="text-left"><div class="text-sm font-semibold text-gray-700 dark:text-gray-200">Catat Murajaah</div><div class="text-[10px] text-gray-400 dark:text-gray-500">Review & beri nilai kualitas</div></div>
      </button>
      <div class="border-t border-gray-100 dark:border-dark-200 pt-2 mt-2">
        <button onclick="deleteHafalan(${id})" class="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center"><i class="fas fa-trash text-red-500"></i></div>
          <div class="text-left"><div class="text-sm font-semibold text-red-600 dark:text-red-400">Hapus Hafalan</div><div class="text-[10px] text-gray-400 dark:text-gray-500">Hapus data ini</div></div>
        </button>
      </div>
    </div>
  `);
}

async function updateHafalanStatus(id, status) {
  try {
    await axios.put(`${API}/hafalan/${id}`, { status, quality: null, notes: null });
    closeModal(); showToast('Status diperbarui!');
    await loadStats(); updateHeaderStats();
    if (currentPage === 'hafalan') renderHafalan();
    else if (currentPage === 'dashboard') renderDashboard();
  } catch (err) { showToast('Gagal: ' + err.message, 'error'); }
}

async function deleteHafalan(id) {
  if (!confirm('Yakin ingin menghapus hafalan ini?')) return;
  try {
    await axios.delete(`${API}/hafalan/${id}`);
    closeModal(); showToast('Hafalan dihapus');
    await loadStats(); updateHeaderStats();
    if (currentPage === 'hafalan') renderHafalan();
    else if (currentPage === 'dashboard') renderDashboard();
  } catch (err) { showToast('Gagal: ' + err.message, 'error'); }
}

// REVIEW MODAL
function showReviewModal(hafalanId, surahName, surahNumber, juz) {
  showModal(`
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">Catat Murajaah</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <div class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 mb-4 border border-primary-200/50 dark:border-primary-800/20">
      <div class="text-sm font-bold text-primary-700 dark:text-primary-400">${surahName} · Juz ${juz}</div>
    </div>
    <form onsubmit="submitReview(event, ${hafalanId}, '${surahName}', ${surahNumber}, ${juz})" class="space-y-4">
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Kualitas Hafalan</label>
        <input type="range" id="review-quality" min="0" max="100" value="70"
          oninput="document.getElementById('review-quality-val').textContent=this.value+'%';document.getElementById('review-quality-val').className='text-center text-xl font-extrabold mt-1 '+(this.value>=80?'text-primary-600 dark:text-primary-400':this.value>=60?'text-amber-600 dark:text-amber-400':'text-red-500 dark:text-red-400')"
          class="w-full accent-primary-600">
        <div class="text-center text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1" id="review-quality-val">70%</div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Tipe Review</label>
        <div class="grid grid-cols-3 gap-2">
          ${[{v:'self',e:'🧑',l:'Sendiri'},{v:'with_ustaz',e:'👨‍🏫',l:'Ustaz'},{v:'peer',e:'👥',l:'Teman'}].map(t => `
            <label class="cursor-pointer">
              <input type="radio" name="review-type" value="${t.v}" ${t.v==='self'?'checked':''} class="hidden peer">
              <div class="text-center p-3 rounded-xl border-2 border-gray-200 dark:border-dark-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 transition-all">
                <div class="text-xl">${t.e}</div>
                <div class="text-[10px] font-bold mt-0.5">${t.l}</div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Catatan</label>
        <textarea id="review-notes" rows="2" placeholder="Bagian yang keliru..." class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"></textarea>
      </div>
      <button type="submit" id="btn-submit-review" class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform">
        <i class="fas fa-check mr-2"></i>Simpan Murajaah
      </button>
    </form>
  `);
}

async function submitReview(e, hafalanId, surahName, surahNumber, juz) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-review');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';
  try {
    await axios.post(`${API}/murajaah`, {
      user_id: currentUser.id, hafalan_id: hafalanId,
      surah_number: surahNumber, surah_name: surahName, juz,
      quality: parseInt(document.getElementById('review-quality').value),
      review_type: document.querySelector('input[name="review-type"]:checked').value,
      notes: document.getElementById('review-notes').value || null
    });
    closeModal(); showToast('Murajaah dicatat! +3 XP');
    await loadStats(); updateHeaderStats(); navigateTo(currentPage);
  } catch (err) { showToast('Gagal: ' + err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check mr-2"></i>Simpan Murajaah'; }
}

// DAILY LOG MODAL
function showDailyLogModal() {
  const today = new Date().toISOString().split('T')[0];
  const tl = appState.stats?.today_log;
  showModal(`
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">Catatan Harian</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <form onsubmit="submitDailyLog(event)" class="space-y-4">
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Tanggal</label>
        <input type="date" id="log-date" value="${today}" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Hal. Baru</label>
          <input type="number" id="log-new-pages" value="${tl?.new_memorized_pages || 0}" min="0" step="0.5" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Hal. Review</label>
          <input type="number" id="log-review-pages" value="${tl?.review_pages || 0}" min="0" step="0.5" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Total Menit</label>
        <input type="number" id="log-minutes" value="${tl?.total_minutes || 0}" min="0" required class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Mood</label>
        <div class="flex justify-between gap-2">
          ${['great','good','normal','tired','struggling'].map(m => `
            <label class="cursor-pointer flex-1">
              <input type="radio" name="log-mood" value="${m}" ${(tl?.mood || 'normal') === m ? 'checked' : ''} class="hidden peer">
              <div class="text-center p-2.5 rounded-xl border-2 border-gray-200 dark:border-dark-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 transition-all">
                <div class="text-xl">${getMoodEmoji(m)}</div>
                <div class="text-[8px] mt-0.5 font-bold uppercase">${m}</div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Catatan</label>
        <textarea id="log-notes" rows="2" placeholder="Apa yang dipelajari..." class="w-full bg-gray-50 dark:bg-dark-400 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white">${tl?.notes || ''}</textarea>
      </div>
      <button type="submit" id="btn-submit-log" class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform">
        <i class="fas fa-check mr-2"></i>Simpan Catatan
      </button>
    </form>
  `);
}

async function submitDailyLog(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-log');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';
  try {
    await axios.post(`${API}/daily-log`, {
      user_id: currentUser.id,
      log_date: document.getElementById('log-date').value,
      new_memorized_pages: parseFloat(document.getElementById('log-new-pages').value),
      review_pages: parseFloat(document.getElementById('log-review-pages').value),
      total_minutes: parseInt(document.getElementById('log-minutes').value),
      mood: document.querySelector('input[name="log-mood"]:checked')?.value || 'normal',
      notes: document.getElementById('log-notes').value || null
    });
    closeModal(); showToast('Catatan disimpan! +2 XP');
    await loadStats(); updateHeaderStats(); navigateTo(currentPage);
  } catch (err) { showToast('Gagal: ' + err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check mr-2"></i>Simpan Catatan'; }
}

// SETTINGS MODAL
function showSettingsModal() {
  showModal(`
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">Pengaturan</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <div class="space-y-3">
      <div class="bg-gray-50 dark:bg-dark-400 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">${(currentUser.name || 'S')[0].toUpperCase()}</div>
          <div>
            <div class="font-bold text-gray-800 dark:text-white">${currentUser.name}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500">${currentUser.email || 'Belum ada email'} · Level ${currentUser.level || 1}</div>
            <div class="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">${currentUser.xp || 0} XP · Tier: ${(currentUser.tier || 'free').toUpperCase()}</div>
          </div>
        </div>
      </div>
      <button onclick="toggleTheme();closeModal()" class="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-dark-200 hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center"><i class="fas fa-palette text-purple-600 dark:text-purple-400"></i></div>
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">Toggle Dark Mode</div>
      </button>
      <button onclick="logout()" class="w-full flex items-center gap-3 p-3.5 rounded-xl border border-red-100 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center"><i class="fas fa-right-from-bracket text-red-500"></i></div>
        <div class="text-sm font-semibold text-red-600 dark:text-red-400">Logout</div>
      </button>
    </div>
    <div class="mt-4 text-center text-[10px] text-gray-400 dark:text-gray-600">
      Tahfidz Tracker Pro v2.0 · Powered by Supabase
    </div>
  `);
}

// ============================================================
// UTILITIES
// ============================================================
function getMoodEmoji(mood) {
  return { great:'🤩', good:'😊', normal:'😐', tired:'😴', struggling:'😣' }[mood] || '😐';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function showToast(msg, type = 'success') {
  const old = document.querySelector('.toast-notification');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = `toast-notification fixed top-4 left-1/2 -translate-x-1/2 max-w-sm w-[calc(100%-2rem)] px-4 py-3 rounded-2xl shadow-2xl z-[100] text-sm font-semibold text-center ${
    type === 'success' ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
  }`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ============================================================
// INIT ON LOAD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Check saved session
  const saved = localStorage.getItem('tahfidz-user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      showMainApp();
    } catch(e) {
      localStorage.removeItem('tahfidz-user');
    }
  }
});
