import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import AuthModal from '../components/Auth/AuthModal'
import { likesService } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

const { FiHeart, FiTrash2, FiEye, FiBarChart3, FiBookmark, FiCheckCircle, FiDatabase, FiLock } = FiIcons

const Saved = () => {
  const [savedFranchises, setSavedFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedFranchises()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadSavedFranchises = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const savedData = await likesService.getSavedFranchises()
      setSavedFranchises(savedData)
      
      console.log(`✅ Loaded ${savedData.length} saved franchises`)
    } catch (err) {
      console.error('Failed to load saved franchises:', err)
      setError(`Failed to load saved franchises: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const removeSaved = async (franchiseId) => {
    try {
      const result = await likesService.removeSavedFranchise(franchiseId)
      if (result.success) {
        setSavedFranchises(prev => prev.filter(item => item.franchises.id !== franchiseId))
        console.log('✅ Removed franchise from saved')
      }
    } catch (err) {
      console.error('Failed to remove from saved:', err)
      // Still update UI for better UX
      setSavedFranchises(prev => prev.filter(item => item.franchises.id !== franchiseId))
    }
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

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Sign In to View Saved Franchises
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Create an account or sign in to save your favorite franchise opportunities and access them anytime.
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            size="lg"
          >
            Sign In to Continue
          </Button>
        </motion.div>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signin"
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading saved franchises...</span>
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

      {/* User Info */}
      <motion.div 
        className="bg-green-50 border border-green-200 rounded-lg p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">
            ✅ Signed in as {user?.user_metadata?.full_name || user?.email}
          </span>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadSavedFranchises}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Retry loading saved franchises
          </button>
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
                  ? Math.round(savedFranchises.reduce((sum, item) => {
                      const franchise = item.franchises
                      const min = franchise.total_investment_min || 0
                      const max = franchise.total_investment_max || 0
                      return sum + (min + max) / 2
                    }, 0) / savedFranchises.length).toLocaleString()
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
          {savedFranchises.map((item, index) => {
            const franchise = item.franchises
            return (
              <motion.div
                key={franchise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="overflow-hidden h-full" hover>
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <Link to={`/franchise/${franchise.id}`}>
                      <img 
                        src={franchise.logo_url || franchise.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                        alt={franchise.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                        }}
                      />
                    </Link>
                    <button
                      onClick={() => removeSaved(franchise.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Remove from saved"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                      Saved {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <Link to={`/franchise/${franchise.id}`}>
                        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
                          {franchise.name || franchise.brand_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        {franchise.category || 'General'}
                      </p>
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
                      <Link to={`/franchise/${franchise.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/compare?ids=${franchise.id}`}>
                        <Button variant="secondary" size="sm">
                          <SafeIcon icon={FiBarChart3} className="w-4 h-4 mr-1" />
                          Compare
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
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
            Start exploring live franchise data and save opportunities that interest you
          </p>
          <Link to="/browse">
            <Button size="lg">
              Browse Live Franchises
            </Button>
          </Link>
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
            Compare your saved franchises or get AI-powered recommendations based on live data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
              Compare Selected
            </Button>
            <Link to="/ask-ai">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Get AI Recommendations
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Saved