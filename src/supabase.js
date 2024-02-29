import { createClient } from "@supabase/supabase-js";
import("dotenv/config");

const supabaseUrl = "https://dbxnteypzchcfnwqyirn.supabase.co";
const supabaseKey = process.env.API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
