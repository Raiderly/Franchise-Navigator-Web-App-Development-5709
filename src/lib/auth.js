import { supabase } from './supabase'

// Authentication service
export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            ...userData
          }
        }
      })
      
      if (error) throw error
      console.log('✅ User signed up successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Sign up failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      console.log('✅ User signed in successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Sign in failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('✅ User signed out successfully')
      return { success: true }
    } catch (err) {
      console.error('Sign out failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (err) {
      console.error('Failed to get current user:', err)
      return null
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (err) {
      console.error('Failed to get current session:', err)
      return null
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      console.log('✅ Password reset email sent')
      return { success: true }
    } catch (err) {
      console.error('Password reset failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      console.log('✅ Profile updated successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Profile update failed:', err)
      return { success: false, error: err.message }
    }
  }
}

// User likes/saved franchises service
export const likesService = {
  // Save a franchise
  async saveFranchise(franchiseId) {
    try {
      const user = await authService.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_likes')
        .insert([
          { 
            user_id: user.id, 
            franchise_id: franchiseId,
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      console.log('✅ Franchise saved successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Failed to save franchise:', err)
      return { success: false, error: err.message }
    }
  },

  // Remove a saved franchise
  async removeSavedFranchise(franchiseId) {
    try {
      const user = await authService.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('user_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('franchise_id', franchiseId)
      
      if (error) throw error
      console.log('✅ Franchise removed from saved')
      return { success: true }
    } catch (err) {
      console.error('Failed to remove saved franchise:', err)
      return { success: false, error: err.message }
    }
  },

  // Get user's saved franchises
  async getSavedFranchises() {
    try {
      const user = await authService.getCurrentUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_likes')
        .select(`
          *,
          franchises (
            *,
            franchise_categories(name),
            franchise_investments(*),
            franchise_locations(*),
            franchise_fees(*),
            franchise_support(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to get saved franchises:', err)
      return []
    }
  },

  // Check if franchise is saved by user
  async isFranchiseSaved(franchiseId) {
    try {
      const user = await authService.getCurrentUser()
      if (!user) return false

      const { data, error } = await supabase
        .from('user_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('franchise_id', franchiseId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (err) {
      console.error('Failed to check if franchise is saved:', err)
      return false
    }
  },

  // Get user's saved franchise IDs
  async getSavedFranchiseIds() {
    try {
      const user = await authService.getCurrentUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_likes')
        .select('franchise_id')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data.map(item => item.franchise_id) || []
    } catch (err) {
      console.error('Failed to get saved franchise IDs:', err)
      return []
    }
  }
}