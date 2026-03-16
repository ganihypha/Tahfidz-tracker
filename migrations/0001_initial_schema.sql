-- Tahfidz Tracker - Initial Schema
-- Track Quran memorization progress

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  pin TEXT NOT NULL DEFAULT '1234',
  target_juz INTEGER DEFAULT 30,
  daily_target_pages REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hafalan (memorization) records
CREATE TABLE IF NOT EXISTS hafalan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  surah_number INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  juz INTEGER NOT NULL,
  start_ayat INTEGER NOT NULL DEFAULT 1,
  end_ayat INTEGER NOT NULL,
  total_ayat INTEGER NOT NULL,
  pages REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress, memorized, need_review
  quality INTEGER DEFAULT 0, -- 0-100 quality score
  notes TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Murajaah (review) sessions
CREATE TABLE IF NOT EXISTS murajaah (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  hafalan_id INTEGER NOT NULL,
  surah_number INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  juz INTEGER NOT NULL,
  quality INTEGER NOT NULL DEFAULT 0, -- 0-100
  review_type TEXT NOT NULL DEFAULT 'self', -- self, with_ustaz, peer
  notes TEXT,
  reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (hafalan_id) REFERENCES hafalan(id)
);

-- Daily activity log
CREATE TABLE IF NOT EXISTS daily_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  log_date DATE NOT NULL,
  new_memorized_pages REAL DEFAULT 0,
  review_pages REAL DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  mood TEXT DEFAULT 'normal', -- great, good, normal, tired, struggling
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, log_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hafalan_user ON hafalan(user_id);
CREATE INDEX IF NOT EXISTS idx_hafalan_status ON hafalan(status);
CREATE INDEX IF NOT EXISTS idx_hafalan_juz ON hafalan(juz);
CREATE INDEX IF NOT EXISTS idx_murajaah_user ON murajaah(user_id);
CREATE INDEX IF NOT EXISTS idx_murajaah_hafalan ON murajaah(hafalan_id);
CREATE INDEX IF NOT EXISTS idx_daily_log_user_date ON daily_log(user_id, log_date);
