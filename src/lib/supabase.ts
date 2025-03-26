
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhfukgqkaijaipwpcdi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZnVrZ3FrYWlqYWlscHdwY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE2MzksImV4cCI6MjA1ODQ1NzYzOX0.qlpqn-yOrxJsxEhwr6ZALLCWa1tNHD7HM-acE5Fsfw8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession()
  
  if (error || !data.session) {
    return null
  }
  
  return data.session.user
}
