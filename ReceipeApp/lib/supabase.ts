
import { createClient } from "@supabase/supabase-js";

// paste your values here
const SUPABASE_URL = "https://wgotrndfpoqcjmvzeshy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3RybmRmcG9xY2ptdnplc2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjA4MjAsImV4cCI6MjA3NDg5NjgyMH0.NR3j_ctwE-50ItD8b9gzTPxoMx_Zf57g78W8V7I3SQo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
