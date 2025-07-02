import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import { franchiseService } from '../lib/supabase'

const { FiSearch, FiBarChart3, FiTrendingUp, FiUsers, FiDollarSign, FiStar, FiDatabase, FiCheckCircle } = FiIcons

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [franchiseCount, setFranchiseCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConnectionAndData()
  }, [])

  const checkConnectionAndData = async () => {
    try {
      setLoading(true)
      
      // Test connection
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)

      // Try to get franchise data
      try {
        const franchiseResult = await franchiseService.getFranchiseRecords()
        setFranchiseCount(franchiseResult.data.length)
        console.log(`📊 Found ${franchiseResult.data.length} franchise records in table: ${franchiseResult.tableName}`)
      } catch (err) {
        console.log('📊 Using fallback data - no live franchise records found')
        setFranchiseCount(0)
      }
    } catch (err) {
      console.error('Connection check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: FiSearch,
      title: 'Browse Franchises',
      description: 'Explore hundreds of franchise opportunities across different industries',
      link: '/browse'
    },
    {
      icon: FiBarChart3,
      title: 'Compare Brands',
      description: 'Side-by-side comparison of franchise investments and returns',
      link: '/compare'
    },
    {
      icon: FiTrendingUp,
      title: 'Industry Insights',
      description: 'Data-driven insights and trends in the franchise market',
      link: '/insights'
    }
  ]

  const stats = [
    { 
      icon: FiUsers, 
      value: franchiseCount > 0 ? `${franchiseCount}+` : '500+', 
      label: 'Franchise Brands' 
    },
    { 
      icon: FiDollarSign, 
      value: '$50K+', 
      label: 'Investment Range' 
    },
    { 
      icon: FiStar, 
      value: '4.8/5', 
      label: 'User Rating' 
    },
  ]

  return (
    <div className="space-y-16">
      {/* Connection Status Banner */}
      {!loading && (
        <motion.div 
          className={`rounded-lg p-4 ${
            connectionStatus?.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <SafeIcon 
              icon={connectionStatus?.success ? FiCheckCircle : FiDatabase} 
              className={`w-5 h-5 ${
                connectionStatus?.success ? 'text-green-600' : 'text-yellow-600'
              }`} 
            />
            <span className={`font-medium ${
              connectionStatus?.success ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {connectionStatus?.success 
                ? `✅ Live Database Connected - ${franchiseCount} records available`
                : '⚠️ Using sample data - Database connection pending'
              }
            </span>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gray-900">
            Find Your Perfect
            <span className="text-primary block">Franchise Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate the world of franchising with confidence. Compare brands, analyze data, 
            and make informed decisions with our comprehensive franchise platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiSearch} className="mr-2" />
              Browse Franchises
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiBarChart3} className="mr-2" />
              Compare Brands
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center" hover>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={stat.icon} className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-heading font-bold text-gray-900 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Make the Right Choice
          </h2>
          <p className="text-gray-600 text-lg">
            Comprehensive tools and data to guide your franchise investment decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Link to={feature.link}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow" hover>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <SafeIcon icon={feature.icon} className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="font-heading text-3xl font-bold mb-4">
          Ready to Start Your Franchise Journey?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of entrepreneurs who have found their perfect franchise match
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50">
              Get Started Today
            </Button>
          </Link>
          <Link to="/ask-ai">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10">
              Ask AI for Help
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default Home