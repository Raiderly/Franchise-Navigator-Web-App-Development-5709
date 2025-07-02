import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiTrendingUp, FiPieChart, FiBarChart3, FiDollarSign, FiUsers, FiGlobe } = FiIcons

const Insights = () => {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      setLoading(true)
      const data = await franchiseService.getIndustryInsights()
      setInsights(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      // Use mock data
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  const marketShareData = {
    title: {
      text: 'Market Share by Industry',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Market Share',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 35, name: 'Food & Beverage' },
          { value: 25, name: 'Retail' },
          { value: 20, name: 'Services' },
          { value: 12, name: 'Fitness & Health' },
          { value: 8, name: 'Other' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  const investmentTrendsData = {
    title: {
      text: 'Average Investment Trends (2020-2024)',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['2020', '2021', '2022', '2023', '2024']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}K'
      }
    },
    series: [
      {
        name: 'Average Investment',
        type: 'line',
        data: [180, 195, 210, 225, 240],
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#440088' }
      }
    ]
  }

  const roiComparisonData = {
    title: {
      text: 'ROI by Industry Category',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: ['Food & Beverage', 'Technology', 'Fitness', 'Retail', 'Services', 'Automotive']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'Average ROI',
        type: 'bar',
        data: [22, 35, 28, 18, 32, 25],
        itemStyle: { color: '#23DBC6' }
      }
    ]
  }

  const keyStats = [
    { icon: FiDollarSign, value: '$240K', label: 'Avg Investment', change: '+8%' },
    { icon: FiTrendingUp, value: '26%', label: 'Avg ROI', change: '+3%' },
    { icon: FiUsers, value: '12K+', label: 'Active Franchises', change: '+15%' },
    { icon: FiGlobe, value: '45', label: 'Countries', change: '+2%' },
  ]

  const marketInsights = [
    {
      title: 'Technology Services Leading Growth',
      description: 'Tech-based franchises show 35% average ROI, highest among all categories.',
      trend: 'up',
      impact: 'high'
    },
    {
      title: 'Food & Beverage Market Dominance',
      description: 'Still holds 35% market share but growth rate slowing to 5% annually.',
      trend: 'stable',
      impact: 'medium'
    },
    {
      title: 'Fitness Franchise Boom',
      description: 'Health-conscious consumers drive 28% ROI in fitness franchises.',
      trend: 'up',
      impact: 'high'
    },
    {
      title: 'Retail Adaptation Required',
      description: 'Traditional retail franchises need digital transformation for competitiveness.',
      trend: 'down',
      impact: 'medium'
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
          Industry Insights & Analytics
        </h1>
        <p className="text-lg text-gray-600">
          Data-driven insights to guide your franchise investment decisions
        </p>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Database connection error: {error}. Showing sample data.
          </p>
        </div>
      )}

      {/* Key Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {keyStats.map((stat, index) => (
          <Card key={index} className="p-6 text-center" hover>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={stat.icon} className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-heading font-bold text-gray-900 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 mb-2">{stat.label}</div>
            <div className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} vs last year
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <ReactECharts option={marketShareData} style={{ height: '350px' }} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <ReactECharts option={investmentTrendsData} style={{ height: '350px' }} />
          </Card>
        </motion.div>
      </div>

      {/* ROI Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <ReactECharts option={roiComparisonData} style={{ height: '400px' }} />
        </Card>
      </motion.div>

      {/* Market Insights */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="font-heading text-2xl font-semibold text-gray-900">
          Market Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketInsights.map((insight, index) => (
            <Card key={index} className="p-6" hover>
              <div className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  insight.trend === 'up' ? 'bg-green-500' : 
                  insight.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {insight.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.trend === 'up' ? 'bg-green-100 text-green-800' : 
                      insight.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {insight.trend === 'up' ? '↗ Growing' : insight.trend === 'down' ? '↘ Declining' : '→ Stable'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Insights