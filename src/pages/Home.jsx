import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import ChatButton from '../components/UI/ChatButton'
import ChatStatus from '../components/LiveChat/ChatStatus'
import { franchiseService } from '../lib/supabase'

const { FiSearch, FiBarChart3, FiTrendingUp, FiUsers, FiDollarSign, FiStar, FiDatabase, FiCheckCircle } = FiIcons

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [franchiseCount, setFranchiseCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [industryStats, setIndustryStats] = useState(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setLoading(true)
      
      // Test connection and get health status
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)
      
      if (connectionResult.success) {
        // Get franchise data and industry insights
        const [franchiseData, insights] = await Promise.all([
          franchiseService.getAllFranchises().catch(() => []),
          franchiseService.getIndustryInsights().catch(() => null)
        ])
        
        setFranchiseCount(franchiseData.length)
        setIndustryStats(insights)
        
        console.log(`📊 App initialized with ${franchiseData.length} franchise records`)
      }
    } catch (err) {
      console.error('App initialization failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: FiSearch,
      title: 'Browse Franchises',
      description: 'Explore live franchise opportunities from the official disclosure register',
      link: '/browse'
    },
    {
      icon: FiBarChart3,
      title: 'Compare Brands',
      description: 'Side-by-side comparison of franchise investments, fees, and performance',
      link: '/compare'
    },
    {
      icon: FiTrendingUp,
      title: 'Industry Insights',
      description: 'Real-time analytics and trends based on current market data',
      link: '/insights'
    }
  ]

  const stats = [
    {
      icon: FiUsers,
      value: franchiseCount > 0 ? `${franchiseCount.toLocaleString()}+` : '2,500+',
      label: 'Live Franchise Records',
      description: 'Official franchise opportunities'
    },
    {
      icon: FiDollarSign,
      value: industryStats ? `$${Math.round(industryStats.investmentTrends.avgMinInvestment / 1000)}K+` : '$75K+',
      label: 'Average Investment',
      description: 'Based on current data'
    },
    {
      icon: FiTrendingUp,
      value: industryStats ? `${industryStats.investmentTrends.avgROI}%` : '28%',
      label: 'Average ROI',
      description: 'Industry performance'
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
              : 'bg-red-50 border border-red-200'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
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
                  ? `🚀 Live Production Database - ${franchiseCount.toLocaleString()} franchise records available`
                  : `❌ Database Connection Failed - ${connectionStatus?.error || 'Unknown error'}`
                }
              </span>
            </div>
            <ChatStatus />
          </div>
          {connectionStatus?.success && (
            <div className="mt-2 text-sm text-green-700">
              Data sourced from official Franchise Disclosure Register
            </div>
          )}
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
            Find Your Perfect{' '}
            <span className="text-primary block">Franchise Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate the world of franchising with confidence using live data from official sources. 
            Compare brands, analyze performance, and make informed investment decisions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiSearch} className="mr-2" />
              Browse Live Data
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiBarChart3} className="mr-2" />
              Compare Franchises
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
            <div className="text-gray-900 font-medium mb-1">{stat.label}</div>
            <div className="text-sm text-gray-600">{stat.description}</div>
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
            Powered by Official Franchise Data
          </h2>
          <p className="text-gray-600 text-lg">
            Access real-time franchise information and make data-driven investment decisions
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

      {/* Industry Insights Preview */}
      {industryStats && (
        <motion.section 
          className="bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Live Market Insights
            </h2>
            <p className="text-gray-600">
              Real-time analytics from {industryStats.totalFranchises} active franchises
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${Math.round(industryStats.investmentTrends.avgMinInvestment / 1000)}K
              </div>
              <div className="text-sm text-gray-600">Avg Min Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                ${Math.round(industryStats.investmentTrends.avgMaxInvestment / 1000)}K
              </div>
              <div className="text-sm text-gray-600">Avg Max Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {industryStats.investmentTrends.avgROI}%
              </div>
              <div className="text-sm text-gray-600">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {industryStats.categoryDistribution.length}
              </div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/insights">
              <Button variant="secondary">
                View Detailed Analytics
              </Button>
            </Link>
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h2 className="font-heading text-3xl font-bold mb-4">
          Ready to Start Your Franchise Journey?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Access live franchise data and make informed investment decisions with confidence
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50">
              Explore Live Franchises
            </Button>
          </Link>
          <Link to="/ask-ai">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10">
              Ask AI Assistant
            </Button>
          </Link>
          <ChatButton variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/20">
            Get Live Support
          </ChatButton>
        </div>
      </motion.section>
    </div>
  )
}

export default Home