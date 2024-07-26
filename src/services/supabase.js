import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://gnssyrydjdovhmhqubjy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc3N5cnlkamRvdmhtaHF1Ymp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NzU0NzAsImV4cCI6MjAzMTI1MTQ3MH0.TyPOYPq4uesChB5NrqQ5JVR3PKyndmlqoHkqoI_HCic";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
