import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nivzxgozqzpopendboad.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnp4Z296cXpwb3BlbmRib2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjI0NzMsImV4cCI6MjA5NDU5ODQ3M30.ol-aMmNBwm61TN74XHNblAAbGxXrQvmMK2_OC-I3UhQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
