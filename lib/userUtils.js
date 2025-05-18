import { supabase } from './supabase'

export async function resolveUserId() {
  // Get the authenticated user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError

  // Find the corresponding application user ID
  const { data: appUser, error: userError } = await supabase
    .from('users')
    .select('user_id')
    .eq('auth_id', authUser.id)
    .single()

  if (userError) {
    // Fallback to email matching if auth_id not set
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', authUser.email)
      .single()

    if (emailError || !emailUser) {
      throw new Error('No matching user record found')
    }
    
    // Update the user with auth_id for future logins
    await supabase
      .from('users')
      .update({ auth_id: authUser.id })
      .eq('user_id', emailUser.user_id)
      
    return emailUser.user_id
  }

  return appUser.user_id
}