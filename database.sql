-- Profiles Table
-- No changes needed for this table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications Table
-- Updated to match the frontend form
CREATE TABLE medications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT,
  dosage TEXT,
  frequency TEXT,
  time TEXT,
  refill_date DATE,
  refill_reminder INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders Table
-- Updated to match the frontend form
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  medication_id INTEGER REFERENCES medications(id),
  medication_name TEXT, -- Denormalized for easier display
  dosage TEXT, -- Denormalized for easier display
  reminder_time TIMESTAMPTZ NOT NULL,
  frequency TEXT,
  type TEXT, -- 'email' or 'whatsapp'
  status TEXT DEFAULT 'active', -- 'active' or 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adherence Table
-- No changes needed for this table
CREATE TABLE adherence (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  medication_id INTEGER REFERENCES medications(id),
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT, -- e.g., taken, missed
  created_at TIMESTAMPTZ DEFAULT NOW()
);
