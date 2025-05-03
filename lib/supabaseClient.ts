import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmuzqoojyopujpvraucl.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdXpxb29qeW9wdWpwdnJhdWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODY5MDMsImV4cCI6MjA2MTg2MjkwM30.gqEJpi55CvE23oPANDWx_ieOwUPPzn9JsisNFHn0Wpk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
