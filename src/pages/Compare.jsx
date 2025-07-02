import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiBarChart3, FiDollarSign, FiTrendingUp, FiMapPin, FiUsers, FiClock, FiDatabase } = FiIcons

const Compare = () => {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchises, setSelectedFranchises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState('live')

  useEffect(() => {
    loadFranchises()
  }, [])

  const loadFranchises = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get live data first
      try {
        const result = await franchiseService.getFranchiseRecords()
        setFranchises(result.data)
        setDataSource('live')
        console.log(`✅ Loaded ${result.data.length} franchise records for comparison`)
      } catch (liveError) {
        console.log('⚠️ Live data not available, using mock data')
        setFranchises(mockFranchises)
        setDataSource('mock')
        setError('Using sample data - live database connection pending')
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

  const mockFranchises = [
    {
      id: 1,
      name: 'Premium Burger Co.',
      category: 'Food & Beverage',
      description: 'Gourmet burger franchise with premium ingredients',
      investment_min: 150000,
      investment_max: 300000,
      roi_percentage: 25,
      locations: 450,
      franchise_fee: 45000,
      royalty_fee: 6,
      marketing_fee: 2,
      territory_size: 50000,
      training_duration: 4,
      support_rating: 4.5,
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
      franchise_fee: 60000,
      royalty_fee: 7,
      marketing_fee: 3,
      territory_size: 75000,
      training_duration: 6,
      support_rating: 4.8,
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
      franchise_fee: 35000,
      royalty_fee: 5,
      marketing_fee: 2,
      territory_size: 30000,
      training_duration: 3,
      support_rating: 4.2,
      image: 'https://images.unsplash.com/photo-1581092795442-6d4b8b4a5f4b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Coffee Corner',
      category: 'Food & Beverage',
      description: 'Specialty coffee and pastries',
      investment_min: 80000,
      investment_max: 180000,
      roi_percentage: 24,
      locations: 520,
      franchise_fee: 30000,
      royalty_fee: 5.5,
      marketing_fee: 2.5,
      territory_size: 25000,
      training_duration: 2,
      support_rating: 4.3,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Auto Care Plus',
      category: 'Automotive Services',
      description: 'Full-service automotive maintenance and repair',
      investment_min: 250000,
      investment_max: 400000,
      roi_percentage: 22,
      locations: 150,
      franchise_fee: 55000,
      royalty_fee: 6.5,
      marketing_fee: 2,
      territory_size: 100000,
      training_duration: 8,
      support_rating: 4.6,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
    }
  ]

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

  const comparisonMetrics = [
    { key: 'investment_min', label: 'Min Investment', icon: FiDollarSign, format: (val) => val ? `$${val.toLocaleString()}` : 'N/A' },
    { key: 'investment_max', label: 'Max Investment', icon: FiDollarSign, format: (val) => val ? `$${val.toLocaleString()}` : 'N/A' },
    { key: 'franchise_fee', label: 'Franchise Fee', icon: FiDollarSign, format: (val) => val ? `$${val.toLocaleString()}` : 'N/A' },
    { key: 'roi_percentage', label: 'ROI', icon: FiTrendingUp, format: (val) => val ? `${val}%` : 'N/A' },
    { key: 'royalty_fee', label: 'Royalty Fee', icon: FiDollarSign, format: (val) => val ? `${val}%` : 'N/A' },
    { key: 'marketing_fee', label: 'Marketing Fee', icon: FiDollarSign, format: (val) => val ? `${val}%` : 'N/A' },
    { key: 'locations', label: 'Total Locations', icon: FiMapPin, format: (val) => val ? val.toLocaleString() : 'N/A' },
    { key: 'territory_size', label: 'Territory Size', icon: FiMapPin, format: (val) => val ? `${val.toLocaleString()} pop.` : 'N/A' },
    { key: 'training_duration', label: 'Training Duration', icon: FiClock, format: (val) => val ? `${val} weeks` : 'N/A' },
    { key: 'support_rating', label: 'Support Rating', icon: FiUsers, format: (val) => val ? `${val}/5` : 'N/A' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading comparison data...</span>
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
          Select up to 3 franchises to compare side-by-side
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
              ? `✅ Live comparison data available`
              : `⚠️ Using sample comparison data`
            }
          </span>
        </div>
      </motion.div>

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
                      src={franchise.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
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
                      {franchise.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {franchise.category || 'General'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment</span>
                      <span className="font-medium text-gray-900">
                        {franchise.investment_min && franchise.investment_max 
                          ? `$${franchise.investment_min.toLocaleString()} - $${franchise.investment_max.toLocaleString()}`
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
            Comparison ({selectedFranchises.length} franchise{selectedFranchises.length > 1 ? 's' : ''})
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
                          <div className="font-heading text-lg">{franchise.name}</div>
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
                          {metric.format(franchise[metric.key])}
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

      {selectedFranchises.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiBarChart3} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-2">
            No franchises selected
          </h3>
          <p className="text-gray-600 mb-6">
            Choose up to 3 franchises from the list above to start comparing their key metrics
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