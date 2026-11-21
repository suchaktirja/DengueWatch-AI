const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
} else {
    console.warn(
        'Supabase credentials are missing. Database endpoints will be unavailable.'
    );

    supabase = {
        from() {
            const error = new Error(
                'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.'
            );

            error.status = 503;
            throw error;
        }
    };
}

module.exports = supabase;
