import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzkshsfjzshqwmulxfmx.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6a3Noc2ZqenNocXdtdWx4Zm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODMyOTksImV4cCI6MjA4MjY1OTI5OX0.LyD9v6pU93WeBIX2RhR14HTfkXqmCi08bJeB-D2GxhI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
   auth:{
    storage: AsyncStorage,
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:false,
   } ,
})
