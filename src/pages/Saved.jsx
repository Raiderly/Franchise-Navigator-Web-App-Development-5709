import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiHeart, FiTrash2, FiEye, FiBarChart3, FiBookmark } = FiIcons

const Saved = () => {
  const [savedFranchises, setSavedFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSavedFranchises()
  }, [])

  const loadSavedFranchises = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get the user ID from auth
      const userId = 'demo-user'
      const collections = await franchiseService.getUserCollections(userId)
      
      // Get franchise details for each saved item
      const franchiseDetails = await Promise.all(
        collections.map(async (collection) => {
          try {
            return await franchiseService.getBrandById(collection.franchise_id)
          } catch {
            return null
          }
        })
      )
      
      setSavedFranchises(franchiseDetails.filter(Boolean))
      setError(null)
    } catch (err) {
      setError(err.message)
      // Use mock data
      setSavedFranchises(mockSavedFranchises)
    } finally {
      setLoading(false)
    }
  }

  const removeSaved = async (franchiseId) => {
    try {
      const userId = 'demo-user'
      await franchiseService.removeFromCollection(userId, franchiseId)
      setSavedFranchises(prev => prev.filter(f => f.id !== franchiseId))
    } catch (err) {
      // For demo, just remove from local state
      setSavedFranchises(prev => prev.filter(f => f.id !== franchiseId))
    }
  }

  const mockSavedFranchises = [
    {
      id: 1,
      name: 'Premium Burger Co.',
      category: 'Food & Beverage',
      description: 'Gourmet burger franchise with premium ingredients',
      investment_min: 150000,
      investment_max: 300000,
      roi_percentage: 25,
      locations: 450,
      saved_date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'FitZone Gym',
      category: 'Fitness & Health',
      description: '24/7 fitness center with modern equipment',
      investment_min: 200000,
      investment_max: 500000,
      roi_percentage: 30,
      locations: 320,
      saved_date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'TechFix Solutions',
      category: 'Technology Services',
      description: 'Computer and mobile device repair services',
      investment_min: 75000,
      investment_max: 150000,
      roi_percentage: 35,
      locations: 180,
      saved_date: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1581092795442-6d4b8b4a5f4b?w=400&h=300&fit=crop'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
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
          Saved Franchises
        </h1>
        <p className="text-lg text-gray-600">
          Your collection of favorite franchise opportunities
        </p>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Database connection error: {error}. Showing sample data.
          </p>
        </div>
      )}

      {/* Stats Bar */}
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBookmark} className="w-5 h-5 text-primary" />
              <span className="text-gray-600">Total Saved:</span>
              <span className="font-semibold text-gray-900">{savedFranchises.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-accent" />
              <span className="text-gray-600">Avg Investment:</span>
              <span className="font-semibold text-gray-900">
                ${savedFranchises.length > 0 
                  ? Math.round(savedFranchises.reduce((sum, f) => sum + (f.investment_min + f.investment_max) / 2, 0) / savedFranchises.length).toLocaleString()
                  : '0'
                }
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            Export List
          </Button>
        </div>
      </motion.div>

      {/* Saved Franchises */}
      {savedFranchises.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {savedFranchises.map((franchise, index) => (
            <motion.div
              key={franchise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="overflow-hidden h-full" hover>
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={franchise.image} 
                    alt={franchise.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeSaved(franchise.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Remove from saved"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    Saved {franchise.saved_date}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-gray-900 mb-1">
                      {franchise.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {franchise.category}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {franchise.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment Range</span>
                      <span className="font-medium text-gray-900">
                        ${franchise.investment_min?.toLocaleString()} - ${franchise.investment_max?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ROI</span>
                      <span className="font-medium text-green-600">
                        {franchise.roi_percentage}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Locations</span>
                      <span className="font-medium text-gray-900">
                        {franchise.locations}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="secondary" size="sm">
                      <SafeIcon icon={FiBarChart3} className="w-4 h-4 mr-1" />
                      Compare
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SafeIcon icon={FiHeart} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-2">
            No saved franchises yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start exploring and save franchises that interest you to build your collection
          </p>
          <Button size="lg">
            Browse Franchises
          </Button>
        </motion.div>
      )}

      {/* Quick Actions */}
      {savedFranchises.length > 0 && (
        <motion.div 
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="font-heading text-2xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Compare your saved franchises or get personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
              Compare Selected
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Get AI Recommendations
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Saved