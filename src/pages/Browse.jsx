import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiSearch, FiFilter, FiDollarSign, FiMapPin, FiTrendingUp, FiHeart, FiDatabase } = FiIcons

const Browse = () => {
  const [franchises, setFranchises] = useState([])
  const [filteredFranchises, setFilteredFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [savedFranchises, setSavedFranchises] = useState(new Set())
  const [dataSource, setDataSource] = useState('live')

  const categories = ['all', 'food', 'retail', 'services', 'fitness', 'automotive', 'education', 'technology']

  useEffect(() => {
    loadFranchises()
  }, [])

  useEffect(() => {
    filterFranchises()
  }, [franchises, searchTerm, selectedCategory])

  const loadFranchises = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get live data first
      try {
        const result = await franchiseService.getFranchiseRecords()
        setFranchises(result.data)
        setDataSource('live')
        console.log(`✅ Loaded ${result.data.length} live franchise records`)
      } catch (liveError) {
        console.log('⚠️ Live data not available, trying individual tables...')
        
        // Try specific tables
        try {
          const data = await franchiseService.getAllBrands()
          setFranchises(data)
          setDataSource('live')
          console.log(`✅ Loaded ${data.length} franchise brands`)
        } catch (brandError) {
          console.log('⚠️ Using fallback mock data')
          setFranchises(mockFranchises)
          setDataSource('mock')
          setError('Using sample data - live database connection pending')
        }
      }
    } catch (err) {
      console.error('Failed to load franchises:', err)
      setError(err.message)
      setFranchises(mockFranchises)
      setDataSource('mock')
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

  const toggleSaved = async (franchiseId) => {
    const newSaved = new Set(savedFranchises)
    const userId = 'demo-user' // In real app, get from auth
    
    try {
      if (newSaved.has(franchiseId)) {
        await franchiseService.removeFromCollection(userId, franchiseId)
        newSaved.delete(franchiseId)
      } else {
        await franchiseService.addToCollection(userId, franchiseId)
        newSaved.add(franchiseId)
      }
      setSavedFranchises(newSaved)
    } catch (err) {
      console.log('Save operation failed, updating locally only')
      setSavedFranchises(newSaved)
    }
  }

  const mockFranchises = [
    {
      id: 1,
      name: 'Premium Burger Co.',
      category: 'food',
      description: 'Gourmet burger franchise with premium ingredients and sustainable sourcing',
      investment_min: 150000,
      investment_max: 300000,
      roi_percentage: 25,
      locations: 450,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'FitZone Gym',
      category: 'fitness',
      description: '24/7 fitness center with modern equipment and personal training',
      investment_min: 200000,
      investment_max: 500000,
      roi_percentage: 30,
      locations: 320,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'TechFix Solutions',
      category: 'technology',
      description: 'Computer and mobile device repair services with certified technicians',
      investment_min: 75000,
      investment_max: 150000,
      roi_percentage: 35,
      locations: 180,
      image: 'https://images.unsplash.com/photo-1581092795442-6d4b8b4a5f4b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Learning Academy',
      category: 'education',
      description: 'After-school tutoring and test prep services for all ages',
      investment_min: 100000,
      investment_max: 200000,
      roi_percentage: 28,
      locations: 275,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Auto Care Plus',
      category: 'automotive',
      description: 'Full-service automotive maintenance and repair with warranty',
      investment_min: 250000,
      investment_max: 400000,
      roi_percentage: 22,
      locations: 150,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Fashion Forward',
      category: 'retail',
      description: 'Trendy clothing and accessories boutique for modern consumers',
      investment_min: 120000,
      investment_max: 250000,
      roi_percentage: 20,
      locations: 200,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Home Services Pro',
      category: 'services',
      description: 'Professional home cleaning and maintenance services',
      investment_min: 50000,
      investment_max: 100000,
      roi_percentage: 32,
      locations: 380,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Coffee Corner',
      category: 'food',
      description: 'Specialty coffee shop with artisan pastries and local sourcing',
      investment_min: 80000,
      investment_max: 180000,
      roi_percentage: 24,
      locations: 520,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading franchise data...</span>
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

      {/* Data Source Status */}
      <motion.div 
        className={`rounded-lg p-4 ${
          dataSource === 'live' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <SafeIcon 
            icon={FiDatabase} 
            className={`w-5 h-5 ${
              dataSource === 'live' ? 'text-green-600' : 'text-yellow-600'
            }`} 
          />
          <span className={`font-medium ${
            dataSource === 'live' ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {dataSource === 'live' 
              ? `✅ Showing ${franchises.length} live franchise records`
              : `⚠️ Showing ${franchises.length} sample records - Live data pending`
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
              placeholder="Search franchises..."
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
            <p className="text-red-700">
              {error}
            </p>
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
            <Card className="overflow-hidden h-full" hover>
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img 
                  src={franchise.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                  alt={franchise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                  }}
                />
                <button
                  onClick={() => toggleSaved(franchise.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    savedFranchises.has(franchise.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:text-red-500'
                  } transition-colors`}
                >
                  <SafeIcon icon={FiHeart} className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-xl font-semibold text-gray-900">
                      {franchise.name}
                    </h3>
                    {franchise.category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {franchise.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {franchise.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {franchise.investment_min && franchise.investment_max && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment Range</span>
                      <span className="font-medium text-gray-900">
                        ${franchise.investment_min.toLocaleString()} - ${franchise.investment_max.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {franchise.roi_percentage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ROI</span>
                      <span className="font-medium text-green-600">
                        {franchise.roi_percentage}%
                      </span>
                    </div>
                  )}
                  
                  {franchise.locations && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Locations</span>
                      <span className="font-medium text-gray-900">
                        {franchise.locations}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="secondary" size="sm">
                    Compare
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredFranchises.length === 0 && !loading && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
            No franchises found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all categories
          </p>
        </div>
      )}
    </div>
  )
}

export default Browse