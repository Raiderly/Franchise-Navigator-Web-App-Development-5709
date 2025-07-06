import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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

const { 
  FiArrowLeft, FiDollarSign, FiTrendingUp, FiMapPin, FiUsers, FiClock, 
  FiPhone, FiMail, FiGlobe, FiBarChart3, FiInfo, FiStar, FiAward,
  FiCheckCircle, FiDatabase
} = FiIcons

const FranchiseProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [franchise, setFranchise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)

  useEffect(() => {
    if (id) {
      loadFranchiseData()
    }
  }, [id])

  const loadFranchiseData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test connection first
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)
      
      if (!connectionResult.success) {
        throw new Error('Database connection failed')
      }

      // Load franchise data
      const franchiseData = await franchiseService.getFranchiseById(id)
      if (!franchiseData) {
        throw new Error('Franchise not found')
      }
      
      setFranchise(franchiseData)
      console.log(`✅ Loaded franchise profile: ${franchiseData.name}`)
    } catch (err) {
      console.error('Failed to load franchise:', err)
      setError(`Failed to load franchise: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatInvestmentRange = () => {
    if (franchise.total_investment_min && franchise.total_investment_max) {
      return `$${franchise.total_investment_min.toLocaleString()} - $${franchise.total_investment_max.toLocaleString()}`
    }
    if (franchise.franchise_investments && franchise.franchise_investments.length > 0) {
      const investment = franchise.franchise_investments[0]
      return `$${investment.min_investment?.toLocaleString() || '0'} - $${investment.max_investment?.toLocaleString() || '0'}`
    }
    return 'Contact for details'
  }

  const getROI = () => {
    return franchise.estimated_roi || franchise.average_roi || 'N/A'
  }

  const getLocations = () => {
    if (franchise.total_locations) return franchise.total_locations
    if (franchise.franchise_locations && franchise.franchise_locations.length > 0) {
      return franchise.franchise_locations.reduce((sum, loc) => sum + (loc.count || 0), 0)
    }
    return 'N/A'
  }

  const getFranchiseFee = () => {
    if (franchise.franchise_fee) return `$${franchise.franchise_fee.toLocaleString()}`
    if (franchise.franchise_fees && franchise.franchise_fees.length > 0) {
      return `$${franchise.franchise_fees[0].initial_fee?.toLocaleString() || '0'}`
    }
    return 'Contact for details'
  }

  const getRoyaltyFee = () => {
    if (franchise.royalty_fee) return `${franchise.royalty_fee}%`
    if (franchise.franchise_fees && franchise.franchise_fees.length > 0) {
      return `${franchise.franchise_fees[0].royalty_percentage || 0}%`
    }
    return 'Contact for details'
  }

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading franchise details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="font-heading text-xl font-semibold text-red-900 mb-2">
            Error Loading Franchise
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={loadFranchiseData}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/browse')}>
              Browse Franchises
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!franchise) {
    return (
      <div className="text-center py-12">
        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
          Franchise Not Found
        </h3>
        <p className="text-gray-600 mb-4">
          The franchise you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/browse')}>
          Browse Franchises
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back
        </Button>
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
              ? `✅ Live franchise data from official disclosure register`
              : `❌ Database connection failed`
            }
          </span>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Franchise Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative">
                <img 
                  src={franchise.logo_url || franchise.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'} 
                  alt={franchise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
                  }}
                />
                <div className="absolute top-4 right-4">
                  <SaveButton 
                    franchiseId={franchise.id}
                    onAuthRequired={handleAuthRequired}
                  />
                </div>
              </div>
            </div>

            {/* Franchise Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-heading text-3xl font-bold text-gray-900">
                    {franchise.name || franchise.brand_name}
                  </h1>
                  {franchise.category && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {franchise.category}
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {franchise.description || franchise.business_description || 'No description available'}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Investment</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatInvestmentRange()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm text-gray-600">ROI</div>
                  <div className="font-semibold text-gray-900">
                    {getROI()}{typeof getROI() === 'number' ? '%' : ''}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiMapPin} className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Locations</div>
                  <div className="font-semibold text-gray-900">{getLocations()}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiAward} className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Founded</div>
                  <div className="font-semibold text-gray-900">
                    {franchise.founded_year || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  Request Information
                </Button>
                <Link to={`/compare?ids=${franchise.id}`}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <SafeIcon icon={FiBarChart3} className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Investment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 h-full">
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 mr-2 text-green-500" />
              Investment Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Investment</span>
                <span className="font-medium text-gray-900">{formatInvestmentRange()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Franchise Fee</span>
                <span className="font-medium text-gray-900">{getFranchiseFee()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Royalty Fee</span>
                <span className="font-medium text-gray-900">{getRoyaltyFee()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Marketing Fee</span>
                <span className="font-medium text-gray-900">
                  {franchise.marketing_fee ? `${franchise.marketing_fee}%` : 'Contact for details'}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2 text-blue-500" />
              Business Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Locations</span>
                <span className="font-medium text-gray-900">{getLocations()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Founded</span>
                <span className="font-medium text-gray-900">
                  {franchise.founded_year || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Training Duration</span>
                <span className="font-medium text-gray-900">
                  {franchise.training_duration ? `${franchise.training_duration} weeks` : 'Contact for details'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Territory Size</span>
                <span className="font-medium text-gray-900">
                  {franchise.territory_population ? franchise.territory_population.toLocaleString() : 'Varies'}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 mr-2 text-accent" />
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estimated ROI</span>
                <span className="font-medium text-green-600">
                  {getROI()}{typeof getROI() === 'number' ? '%' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Support Rating</span>
                <span className="font-medium text-gray-900">
                  {franchise.support_rating ? `${franchise.support_rating}/10` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium text-gray-900">
                  {franchise.success_rate ? `${franchise.success_rate}%` : 'Contact for details'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Break-even Time</span>
                <span className="font-medium text-gray-900">
                  {franchise.breakeven_months ? `${franchise.breakeven_months} months` : 'Varies'}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Contact Information */}
      {(franchise.contact_phone || franchise.contact_email || franchise.website) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {franchise.contact_phone && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{franchise.contact_phone}</div>
                  </div>
                </div>
              )}
              {franchise.contact_email && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{franchise.contact_email}</div>
                  </div>
                </div>
              )}
              {franchise.website && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiGlobe} className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Website</div>
                    <a 
                      href={franchise.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="font-heading text-2xl font-bold mb-4">
          Ready to Learn More?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Get detailed information about this franchise opportunity and start your journey today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
            Request Information
          </Button>
          <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
            Schedule Consultation
          </Button>
        </div>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  )
}

export default FranchiseProfile