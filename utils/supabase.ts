import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kuuioikqtoxxrdglvqlo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dWlvaWtxdG94eHJkZ2x2cWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MzA4MTQsImV4cCI6MjAyNTUwNjgxNH0.mqfW5sOau5XI1pCq0XiISG3K2asrJQPgfciW-2kemps";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
