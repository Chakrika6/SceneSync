// server/db.js - Updated to include both PG Pool and Supabase Client

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// --- 1. Postgres (pg) Pool Setup ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// --- 2. Supabase Client Setup (For Auth) ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
    console.warn("WARNING: Supabase URL or Key env vars are not set. Auth routes will fail.");
}

const supabase = createClient(supabaseUrl, supabaseKey);


// --- 3. Export BOTH Clients ---
module.exports = {
  // Use 'db' for raw SQL queries (like existing submission logic)
  db: pool, 
  // Use 'supabase' for Auth, Storage, etc.
  supabase: supabase, 
};
