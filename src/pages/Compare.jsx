import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiBarChart3, FiDollarSign, FiTrendingUp, FiMapPin, FiUsers, FiClock, FiDatabase, FiCheckCircle } = FiIcons

const Compare = () => {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchises, setSelectedFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)

  useEffect(() => {
    loadFranchises()
  }, [])

  const loadFranchises = async () => {
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
      const franchiseData = await franchiseService.getAllFranchises()
      setFranchises(franchiseData)
      
      console.log(`✅ Loaded ${franchiseData.length} franchises for comparison`)
    } catch (err) {
      console.error('Failed to load franchises:', err)
      setError(`Failed to load franchise data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFranchiseSelect = (franchise) => {
    if (selectedFranchises.find(f => f.id === franchise.id)) {
      setSelectedFranchises(prev => prev.filter(f => f.id !== franchise.id))
    } else if (selectedFranchises.length < 3) {
      setSelectedFranchises(prev => [...prev, franchise])
    }
  }

  const clearComparison = () => {
    setSelectedFranchises([])
  }

  const formatValue = (value, type = 'text') => {
    if (value === null || value === undefined) return 'N/A'
    
    switch (type) {
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'percentage':
        return `${value}%`
      case 'number':
        return value.toLocaleString()
      default:
        return value || 'N/A'
    }
  }

  const getComparisonValue = (franchise, metric) => {
    switch (metric.key) {
      case 'total_investment_min':
        return franchise.total_investment_min || 
               (franchise.franchise_investments?.[0]?.min_investment)
      case 'total_investment_max':
        return franchise.total_investment_max || 
               (franchise.franchise_investments?.[0]?.max_investment)
      case 'franchise_fee':
        return franchise.franchise_fee || 
               (franchise.franchise_fees?.[0]?.initial_fee)
      case 'estimated_roi':
        return franchise.estimated_roi || franchise.average_roi
      case 'royalty_fee':
        return franchise.royalty_fee || 
               (franchise.franchise_fees?.[0]?.royalty_percentage)
      case 'marketing_fee':
        return franchise.marketing_fee || 
               (franchise.franchise_fees?.[0]?.marketing_fee_percentage)
      case 'total_locations':
        return franchise.total_locations || 
               (franchise.franchise_locations?.reduce((sum, loc) => sum + (loc.count || 0), 0))
      case 'territory_population':
        return franchise.territory_population || 
               (franchise.franchise_support?.[0]?.territory_size)
      case 'training_duration':
        return franchise.training_duration || 
               (franchise.franchise_support?.[0]?.training_weeks)
      case 'support_rating':
        return franchise.support_rating || 
               (franchise.franchise_support?.[0]?.support_score)
      default:
        return franchise[metric.key]
    }
  }

  const comparisonMetrics = [
    { key: 'total_investment_min', label: 'Min Investment', icon: FiDollarSign, type: 'currency' },
    { key: 'total_investment_max', label: 'Max Investment', icon: FiDollarSign, type: 'currency' },
    { key: 'franchise_fee', label: 'Franchise Fee', icon: FiDollarSign, type: 'currency' },
    { key: 'estimated_roi', label: 'Estimated ROI', icon: FiTrendingUp, type: 'percentage' },
    { key: 'royalty_fee', label: 'Royalty Fee', icon: FiDollarSign, type: 'percentage' },
    { key: 'marketing_fee', label: 'Marketing Fee', icon: FiDollarSign, type: 'percentage' },
    { key: 'total_locations', label: 'Total Locations', icon: FiMapPin, type: 'number' },
    { key: 'territory_population', label: 'Territory Size', icon: FiMapPin, type: 'number' },
    { key: 'training_duration', label: 'Training Duration (weeks)', icon: FiClock, type: 'number' },
    { key: 'support_rating', label: 'Support Rating', icon: FiUsers, type: 'text' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading live comparison data...</span>
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
          Compare Franchise Opportunities
        </h1>
        <p className="text-lg text-gray-600">
          Select up to 3 franchises to compare side-by-side using live data
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
              ? `✅ Live comparison data from ${franchises.length} franchise records`
              : `❌ Database connection failed - ${connectionStatus?.error || 'Unknown error'}`
            }
          </span>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadFranchises}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Retry loading data
          </button>
        </div>
      )}

      {/* Franchise Selection */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-gray-900">
            Available Franchises ({franchises.length})
          </h2>
          {selectedFranchises.length > 0 && (
            <Button variant="secondary" onClick={clearComparison}>
              Clear Selection ({selectedFranchises.length})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchises.map((franchise) => {
            const isSelected = selectedFranchises.find(f => f.id === franchise.id)
            const canSelect = selectedFranchises.length < 3 || isSelected
            
            return (
              <motion.div
                key={franchise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-primary border-primary shadow-lg' 
                      : canSelect 
                        ? 'hover:shadow-lg hover:border-primary/30' 
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => canSelect && handleFranchiseSelect(franchise)}
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img 
                      src={franchise.logo_url || franchise.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                      alt={franchise.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                      }}
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-gray-900 mb-1">
                      {franchise.name || franchise.brand_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {franchise.category || 'General'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment</span>
                      <span className="font-medium text-gray-900">
                        {getComparisonValue(franchise, { key: 'total_investment_min' }) && getComparisonValue(franchise, { key: 'total_investment_max' })
                          ? `${formatValue(getComparisonValue(franchise, { key: 'total_investment_min' }), 'currency')} - ${formatValue(getComparisonValue(franchise, { key: 'total_investment_max' }), 'currency')}`
                          : 'Contact for details'
                        }
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Comparison Table */}
      {selectedFranchises.length > 0 && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="font-heading text-2xl font-semibold text-gray-900">
            Live Data Comparison ({selectedFranchises.length} franchise{selectedFranchises.length > 1 ? 's' : ''})
          </h2>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                      Metric
                    </th>
                    {selectedFranchises.map(franchise => (
                      <th key={franchise.id} className="text-left p-4 font-medium text-gray-900 min-w-48">
                        <div className="space-y-2">
                          <div className="font-heading text-lg">{franchise.name || franchise.brand_name}</div>
                          <div className="text-sm text-gray-600 font-normal">{franchise.category || 'General'}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonMetrics.map(metric => (
                    <tr key={metric.key} className="hover:bg-gray-50">
                      <td className="p-4 sticky left-0 bg-white hover:bg-gray-50 z-10">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={metric.icon} className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{metric.label}</span>
                        </div>
                      </td>
                      {selectedFranchises.map(franchise => (
                        <td key={franchise.id} className="p-4 text-gray-900">
                          {formatValue(getComparisonValue(franchise, metric), metric.type)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button size="lg">
              Generate Detailed Report
            </Button>
            <Button variant="secondary" size="lg">
              Export Comparison
            </Button>
          </div>
        </motion.div>
      )}

      {selectedFranchises.length === 0 && !error && (
        <div className="text-center py-12">
          <SafeIcon icon={FiBarChart3} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-2">
            No franchises selected
          </h3>
          <p className="text-gray-600 mb-6">
            Choose up to 3 franchises from the live data above to start comparing their key metrics
          </p>
          <Button size="lg">
            Browse All Franchises
          </Button>
        </div>
      )}
    </div>
  )
}

export default Compare