
import { createClient } from '@supabase/supabase-js';

// Using credentials provided by the user
const supabaseUrl = 'https://qbwxgnntlmspbtiieuwd.supabase.co';
const supabaseAnonKey = 'sb_publishable_ejap-Nmaq9oG9MhoGWjldA_Xq89UTrA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
