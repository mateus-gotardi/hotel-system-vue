const supabase = require('@supabase/supabase-js')
require('dotenv').config();

const databaseUrl = process.env.DB_URL;
const databaseKey = process.env.DB_KEY;

module.exports = supabase.createClient(databaseUrl, databaseKey);
