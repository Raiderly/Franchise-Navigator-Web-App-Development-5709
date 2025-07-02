import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  throw new Error('Please update your Supabase credentials in the .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Database service functions
export const franchiseService = {
  // Test connection to verify setup
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('franchise_brands')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('Supabase connection error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Supabase connection successful')
      return { success: true, data }
    } catch (err) {
      console.error('Supabase connection failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Get all franchise brands
  async getAllBrands() {
    try {
      const { data, error } = await supabase
        .from('franchise_brands')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching franchise brands:', error)
        throw error
      }
      
      console.log(`✅ Fetched ${data?.length || 0} franchise brands`)
      return data || []
    } catch (err) {
      console.error('Failed to fetch franchise brands:', err)
      throw err
    }
  },

  // Get franchise data (alternative table name)
  async getFranchiseData() {
    try {
      const { data, error } = await supabase
        .from('franchise_data')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching franchise data:', error)
        throw error
      }
      
      console.log(`✅ Fetched ${data?.length || 0} franchise records`)
      return data || []
    } catch (err) {
      console.error('Failed to fetch franchise data:', err)
      throw err
    }
  },

  // Get brand by ID
  async getBrandById(id) {
    try {
      const { data, error } = await supabase
        .from('franchise_brands')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      // Try alternative table
      const { data, error } = await supabase
        .from('franchise_data')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Get franchise comparisons
  async getComparisons() {
    try {
      const { data, error } = await supabase
        .from('franchise_comparisons')
        .select('*')
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch comparisons:', err)
      return []
    }
  },

  // Get user collections
  async getUserCollections(userId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch user collections:', err)
      return []
    }
  },

  // Add to collection
  async addToCollection(userId, franchiseId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .insert([
          { user_id: userId, franchise_id: franchiseId }
        ])
      
      if (error) throw error
      return data
    } catch (err) {
      console.error('Failed to add to collection:', err)
      throw err
    }
  },

  // Remove from collection
  async removeFromCollection(userId, franchiseId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .delete()
        .eq('user_id', userId)
        .eq('franchise_id', franchiseId)
      
      if (error) throw error
      return data
    } catch (err) {
      console.error('Failed to remove from collection:', err)
      throw err
    }
  },

  // Get AI questions
  async getAIQuestions() {
    try {
      const { data, error } = await supabase
        .from('ai_questions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch AI questions:', err)
      return []
    }
  },

  // Get industry insights
  async getIndustryInsights() {
    try {
      const { data, error } = await supabase
        .from('industry_insights')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch industry insights:', err)
      return []
    }
  },

  // Get all available tables (for debugging)
  async getAvailableTables() {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch table list:', err)
      return []
    }
  },

  // Universal data fetcher - tries multiple table names
  async getFranchiseRecords() {
    const tableNames = ['franchise_brands', 'franchise_data', 'franchises', 'brands']
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('name', { ascending: true })
        
        if (!error && data && data.length > 0) {
          console.log(`✅ Successfully fetched data from table: ${tableName}`)
          return { data, tableName }
        }
      } catch (err) {
        console.log(`⚠️ Table ${tableName} not found, trying next...`)
      }
    }
    
    throw new Error('No franchise data tables found in database')
  }
}

// Auto-test connection on import
franchiseService.testConnection()