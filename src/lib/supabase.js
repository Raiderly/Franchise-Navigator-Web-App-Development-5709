import { createClient } from '@supabase/supabase-js'

// Production Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  throw new Error('Please update your Supabase credentials in the .env file.')
}

// Create Supabase client for production
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Production-ready franchise service with comprehensive error handling
export const franchiseService = {
  // Test connection and get database info
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('franchises')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('Supabase connection error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Production Supabase connection successful')
      return { success: true, data }
    } catch (err) {
      console.error('Supabase connection failed:', err)
      return { success: false, error: err.message }
    }
  },

  // Get all franchise records with comprehensive data
  async getAllFranchises() {
    try {
      const { data, error } = await supabase
        .from('franchises')
        .select(`
          *,
          franchise_categories(name),
          franchise_investments(*),
          franchise_locations(*)
        `)
        .order('name')
      
      if (error) {
        console.error('Error fetching franchises:', error)
        throw error
      }
      
      console.log(`✅ Fetched ${data?.length || 0} franchise records`)
      return data || []
    } catch (err) {
      console.error('Failed to fetch franchises:', err)
      throw err
    }
  },

  // Get franchise by ID with full details
  async getFranchiseById(id) {
    try {
      const { data, error } = await supabase
        .from('franchises')
        .select(`
          *,
          franchise_categories(name),
          franchise_investments(*),
          franchise_locations(*),
          franchise_fees(*),
          franchise_support(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      console.error('Failed to fetch franchise by ID:', err)
      throw err
    }
  },

  // Search franchises with filters
  async searchFranchises(searchTerm = '', category = 'all', filters = {}) {
    try {
      let query = supabase
        .from('franchises')
        .select(`
          *,
          franchise_categories(name),
          franchise_investments(*),
          franchise_locations(*)
        `)

      // Apply search term
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand_name.ilike.%${searchTerm}%`)
      }

      // Apply category filter
      if (category !== 'all') {
        query = query.eq('category', category)
      }

      // Apply investment range filter
      if (filters.minInvestment) {
        query = query.gte('total_investment_min', filters.minInvestment)
      }
      if (filters.maxInvestment) {
        query = query.lte('total_investment_max', filters.maxInvestment)
      }

      // Apply ROI filter
      if (filters.minROI) {
        query = query.gte('estimated_roi', filters.minROI)
      }

      const { data, error } = await query.order('name')
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to search franchises:', err)
      throw err
    }
  },

  // Get franchise categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('franchise_categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      return []
    }
  },

  // Get industry insights and analytics
  async getIndustryInsights() {
    try {
      // Get category distribution
      const { data: categoryData, error: categoryError } = await supabase
        .from('franchises')
        .select('category')
      
      if (categoryError) throw categoryError

      // Get investment trends
      const { data: investmentData, error: investmentError } = await supabase
        .from('franchises')
        .select('total_investment_min, total_investment_max, category, estimated_roi')
      
      if (investmentError) throw investmentError

      // Process data for insights
      const categoryStats = this.processCategoryStats(categoryData)
      const investmentStats = this.processInvestmentStats(investmentData)
      
      return {
        categoryDistribution: categoryStats,
        investmentTrends: investmentStats,
        totalFranchises: categoryData.length
      }
    } catch (err) {
      console.error('Failed to fetch industry insights:', err)
      throw err
    }
  },

  // Process category statistics
  processCategoryStats(data) {
    const categoryCount = {}
    data.forEach(item => {
      const category = item.category || 'Other'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    
    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      value: count
    }))
  },

  // Process investment statistics
  processInvestmentStats(data) {
    const stats = {
      avgMinInvestment: 0,
      avgMaxInvestment: 0,
      avgROI: 0,
      categoryROI: {}
    }

    let totalMin = 0, totalMax = 0, totalROI = 0, count = 0
    const categoryROI = {}
    const categoryCount = {}

    data.forEach(item => {
      if (item.total_investment_min) {
        totalMin += item.total_investment_min
        count++
      }
      if (item.total_investment_max) {
        totalMax += item.total_investment_max
      }
      if (item.estimated_roi) {
        totalROI += item.estimated_roi
        
        const category = item.category || 'Other'
        if (!categoryROI[category]) {
          categoryROI[category] = 0
          categoryCount[category] = 0
        }
        categoryROI[category] += item.estimated_roi
        categoryCount[category]++
      }
    })

    stats.avgMinInvestment = count > 0 ? Math.round(totalMin / count) : 0
    stats.avgMaxInvestment = count > 0 ? Math.round(totalMax / count) : 0
    stats.avgROI = count > 0 ? Math.round(totalROI / count) : 0

    // Calculate average ROI by category
    Object.keys(categoryROI).forEach(category => {
      stats.categoryROI[category] = Math.round(categoryROI[category] / categoryCount[category])
    })

    return stats
  },

  // User collections management
  async getUserCollections(userId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .select(`
          *,
          franchises(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch user collections:', err)
      return []
    }
  },

  // Add franchise to user collection
  async addToCollection(userId, franchiseId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .insert([
          { 
            user_id: userId, 
            franchise_id: franchiseId,
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      console.log('✅ Added franchise to collection')
      return data
    } catch (err) {
      console.error('Failed to add to collection:', err)
      throw err
    }
  },

  // Remove franchise from user collection
  async removeFromCollection(userId, franchiseId) {
    try {
      const { data, error } = await supabase
        .from('user_collections')
        .delete()
        .eq('user_id', userId)
        .eq('franchise_id', franchiseId)
      
      if (error) throw error
      console.log('✅ Removed franchise from collection')
      return data
    } catch (err) {
      console.error('Failed to remove from collection:', err)
      throw err
    }
  },

  // AI Q&A management
  async getAIQuestions() {
    try {
      const { data, error } = await supabase
        .from('ai_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch AI questions:', err)
      return []
    }
  },

  // Add new AI question
  async addAIQuestion(question, answer, category = 'general') {
    try {
      const { data, error } = await supabase
        .from('ai_questions')
        .insert([
          {
            question,
            answer,
            category,
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      return data
    } catch (err) {
      console.error('Failed to add AI question:', err)
      throw err
    }
  },

  // Get franchise comparisons
  async getFranchiseComparisons(franchiseIds) {
    try {
      const { data, error } = await supabase
        .from('franchises')
        .select(`
          *,
          franchise_categories(name),
          franchise_investments(*),
          franchise_fees(*),
          franchise_support(*)
        `)
        .in('id', franchiseIds)
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch franchise comparisons:', err)
      throw err
    }
  },

  // Get database schema information
  async getDatabaseSchema() {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch database schema:', err)
      return []
    }
  },

  // Health check for production monitoring
  async healthCheck() {
    try {
      const start = Date.now()
      
      const { data, error } = await supabase
        .from('franchises')
        .select('count')
        .limit(1)
      
      const responseTime = Date.now() - start
      
      if (error) {
        return {
          status: 'error',
          error: error.message,
          responseTime
        }
      }
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      return {
        status: 'error',
        error: err.message,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Auto-initialize connection on import
franchiseService.testConnection().then(result => {
  if (result.success) {
    console.log('🚀 Production Supabase client initialized successfully')
  } else {
    console.error('❌ Failed to initialize Supabase client:', result.error)
  }
})

// Export for external monitoring
export { supabaseUrl, supabaseAnonKey }