import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import SaveButton from '../components/UI/SaveButton'
import AuthModal from '../components/Auth/AuthModal'
import { franchiseService } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const { FiSearch, FiFilter, FiDollarSign, FiMapPin, FiTrendingUp, FiDatabase, FiCheckCircle } = FiIcons

const Browse = () => {
  const [franchises, setFranchises] = useState([])
  const [filteredFranchises, setFilteredFranchises] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterFranchises()
  }, [franchises, searchTerm, selectedCategory])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test connection first
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)
      
      if (!connectionResult.success) {
        throw new Error('Database connection failed')
      }

      // Load franchises and categories in parallel
      const [franchiseData, categoryData] = await Promise.all([
        franchiseService.getAllFranchises(),
        franchiseService.getCategories()
      ])
      
      setFranchises(franchiseData)
      setCategories(['all', ...categoryData.map(cat => cat.name.toLowerCase())])
      
      console.log(`✅ Loaded ${franchiseData.length} franchises and ${categoryData.length} categories`)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(`Failed to load franchise data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filterFranchises = () => {
    let filtered = franchises

    if (searchTerm) {
      filtered = filtered.filter(franchise => 
        franchise.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchise.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(franchise => 
        franchise.category?.toLowerCase() === selectedCategory
      )
    }

    setFilteredFranchises(filtered)
  }

  const formatInvestmentRange = (franchise) => {
    if (franchise.total_investment_min && franchise.total_investment_max) {
      return `$${franchise.total_investment_min.toLocaleString()} - $${franchise.total_investment_max.toLocaleString()}`
    }
    if (franchise.franchise_investments && franchise.franchise_investments.length > 0) {
      const investment = franchise.franchise_investments[0]
      return `$${investment.min_investment?.toLocaleString() || '0'} - $${investment.max_investment?.toLocaleString() || '0'}`
    }
    return 'Contact for details'
  }

  const getROI = (franchise) => {
    return franchise.estimated_roi || franchise.average_roi || 'N/A'
  }

  const getLocations = (franchise) => {
    if (franchise.total_locations) return franchise.total_locations
    if (franchise.franchise_locations && franchise.franchise_locations.length > 0) {
      return franchise.franchise_locations.reduce((sum, loc) => sum + (loc.count || 0), 0)
    }
    return 'N/A'
  }

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading live franchise data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-heading text-4xl font-bold text-gray-900">
          Browse Franchise Opportunities
        </h1>
        <p className="text-lg text-gray-600">
          Discover the perfect franchise match for your investment goals
        </p>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        className={`rounded-lg p-4 ${
          connectionStatus?.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <SafeIcon 
            icon={connectionStatus?.success ? FiCheckCircle : FiDatabase} 
            className={`w-5 h-5 ${
              connectionStatus?.success ? 'text-green-600' : 'text-red-600'
            }`} 
          />
          <span className={`font-medium ${
            connectionStatus?.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {connectionStatus?.success 
              ? `✅ Live database connected - Showing ${franchises.length} franchise records`
              : `❌ Database connection failed - ${connectionStatus?.error || 'Unknown error'}`
            }
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search franchises by name, brand, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-red-600 underline hover:text-red-800"
            >
              Retry loading data
            </button>
          </div>
        )}
      </motion.div>

      {/* Results */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredFranchises.map((franchise, index) => (
          <motion.div
            key={franchise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            <Link to={`/franchise/${franchise.id}`}>
              <Card className="overflow-hidden h-full cursor-pointer" hover>
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={franchise.logo_url || franchise.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                    alt={franchise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <SaveButton 
                      franchiseId={franchise.id}
                      onAuthRequired={handleAuthRequired}
                    />
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-xl font-semibold text-gray-900">
                        {franchise.name || franchise.brand_name}
                      </h3>
                      {franchise.category && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {franchise.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {franchise.description || franchise.business_description || 'No description available'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment Range</span>
                      <span className="font-medium text-gray-900">
                        {formatInvestmentRange(franchise)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ROI</span>
                      <span className="font-medium text-green-600">
                        {getROI(franchise)}{typeof getROI(franchise) === 'number' ? '%' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Locations</span>
                      <span className="font-medium text-gray-900">
                        {getLocations(franchise)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Add to comparison logic here
                      }}
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredFranchises.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
            No franchises found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all categories
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  )
}

export default Browse