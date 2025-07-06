import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiMessageCircle, FiSend, FiHelpCircle, FiTrendingUp, FiDollarSign, FiMapPin, FiDatabase, FiCheckCircle } = FiIcons

const AskAI = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [conversation, setConversation] = useState([])
  const [isAsking, setIsAsking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test connection first
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)
      
      if (connectionResult.success) {
        // Load AI questions and industry stats in parallel
        const [questionsData, industryData] = await Promise.all([
          franchiseService.getAIQuestions().catch(() => []),
          franchiseService.getIndustryInsights().catch(() => null)
        ])
        
        setQuestions(questionsData)
        setLiveStats(industryData)
        
        console.log(`✅ Loaded ${questionsData.length} AI questions and live stats`)
      }
    } catch (err) {
      console.error('Failed to load AI data:', err)
      setError(`Failed to load AI assistant data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = [
    "What's the average ROI for franchises in my area?",
    "How do I evaluate a franchise opportunity?",
    "What are the hidden costs in franchising?",
    "Which franchises work best in small towns?",
    "How long does it take to break even?",
    "What financing options are available?",
    "How important is location for franchise success?",
    "What should I look for in a franchisor?"
  ]

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) return

    setIsAsking(true)
    const userMessage = { type: 'user', message: currentQuestion, timestamp: new Date() }
    setConversation(prev => [...prev, userMessage])

    // Generate AI response with live data
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: generateAIResponse(currentQuestion),
        timestamp: new Date()
      }
      setConversation(prev => [...prev, aiResponse])
      setCurrentQuestion('')
      setIsAsking(false)
    }, 1500)
  }

  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase()
    
    // Enhanced response matching with live data
    const responses = {
      'roi': liveStats ? 
        `Based on our live franchise database of ${liveStats.totalFranchises} active franchises, the current average ROI is ${liveStats.investmentTrends.avgROI}%. However, performance varies significantly by category: ${Object.entries(liveStats.investmentTrends.categoryROI).map(([cat, roi]) => `${cat} (${roi}%)`).join(', ')}. Individual results depend heavily on location, management quality, and market conditions.` :
        "Based on current market data, franchise ROI varies significantly by industry. Technology services typically lead at 35%, followed by fitness franchises at 28%. Individual results depend heavily on location, management quality, and market conditions.",
      
      'cost': liveStats ?
        `Based on analysis of ${liveStats.totalFranchises} active franchises, typical hidden costs include: ongoing royalty fees (typically 5-7% of gross revenue), national marketing fees (2-3%), local advertising requirements, equipment maintenance and upgrades, insurance premiums, and staff training costs. The average total investment currently ranges from $${Math.round(liveStats.investmentTrends.avgMinInvestment / 1000)}K to $${Math.round(liveStats.investmentTrends.avgMaxInvestment / 1000)}K.` :
        "Hidden costs in franchising often include: ongoing royalty fees (typically 5-7% of gross revenue), national marketing fees (2-3%), local advertising requirements, equipment maintenance and upgrades, insurance premiums, staff training costs, and territory development fees.",
      
      'financing': "Current financing options include: SBA loans (up to 90% financing with favorable terms), franchisor-sponsored financing programs, equipment financing, ROBS (Rollover Business Startups), alternative lending, and investor partnerships. Many franchisors maintain relationships with preferred lenders who understand their business model.",
      
      'location': "Location is critical for most franchise types. Key factors include: foot traffic patterns, demographic alignment with target customers, competition density, accessibility and parking, lease terms and rent costs, and future development plans for the area. Food and retail franchises are particularly location-sensitive.",
      
      'evaluation': "When evaluating franchise opportunities using our live database, focus on: the Franchise Disclosure Document (FDD) review, franchisor's financial stability and track record, existing franchisee satisfaction surveys, territory protection and exclusivity, ongoing support and training programs, unit economics and profitability data, and your personal fit with the business model.",
      
      'timeline': "Typical franchise break-even timelines vary by industry: Fast-casual food (12-18 months), Fitness centers (18-24 months), Service-based franchises (6-12 months), Retail franchises (12-24 months). These timelines depend on initial investment, location quality, management effectiveness, and local market conditions.",
      
      'default': liveStats ?
        `That's an excellent question! Based on our comprehensive live database of ${liveStats.totalFranchises} active franchises across ${liveStats.categoryDistribution.length} categories, I'd recommend considering factors like market demand analysis, franchisor support quality, competitive landscape, and unit economics. The current market shows an average ROI of ${liveStats.investmentTrends.avgROI}% with investment ranges from $${Math.round(liveStats.investmentTrends.avgMinInvestment / 1000)}K to $${Math.round(liveStats.investmentTrends.avgMaxInvestment / 1000)}K. Would you like me to elaborate on any specific aspect?` :
        "That's an excellent question! Based on our comprehensive franchise database and industry insights, I'd recommend considering factors like market demand analysis, franchisor support quality, competitive landscape, and unit economics. Each franchise opportunity is unique, so thorough due diligence is essential."
    }

    // Smart matching logic
    if (lowerQuestion.includes('roi') || lowerQuestion.includes('profit') || lowerQuestion.includes('return')) return responses.roi
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('fee') || lowerQuestion.includes('hidden') || lowerQuestion.includes('expense')) return responses.cost
    if (lowerQuestion.includes('financing') || lowerQuestion.includes('loan') || lowerQuestion.includes('funding') || lowerQuestion.includes('money')) return responses.financing
    if (lowerQuestion.includes('location') || lowerQuestion.includes('site') || lowerQuestion.includes('where')) return responses.location
    if (lowerQuestion.includes('evaluate') || lowerQuestion.includes('choose') || lowerQuestion.includes('select') || lowerQuestion.includes('research')) return responses.evaluation
    if (lowerQuestion.includes('break even') || lowerQuestion.includes('break-even') || lowerQuestion.includes('how long') || lowerQuestion.includes('timeline')) return responses.timeline
    
    return responses.default
  }

  const handleSuggestedQuestion = (question) => {
    setCurrentQuestion(question)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading AI assistant with live data...</span>
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
          AI Assistant with Live Data
        </h1>
        <p className="text-lg text-gray-600">
          Get instant answers powered by real-time franchise market data
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
              ? `✅ AI powered by live data from ${liveStats?.totalFranchises || 0} active franchises`
              : `❌ Database connection failed - Using fallback responses`
            }
          </span>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadData}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Retry loading AI data
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Window */}
          <Card className="h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">Franchise AI Assistant</span>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  connectionStatus?.success ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {connectionStatus?.success ? 'Live Data' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiHelpCircle} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    👋 Hi! I'm your franchise AI assistant powered by live market data.
                  </p>
                  <p className="text-gray-500">
                    Ask me anything about franchise opportunities, investments, or industry trends!
                  </p>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-sm flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm">Analyzing live data...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAskQuestion()}
                  placeholder="Ask about franchises, ROI, investments..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  disabled={isAsking}
                />
                <Button 
                  onClick={handleAskQuestion}
                  disabled={!currentQuestion.trim() || isAsking}
                  className="px-4"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Suggested Questions */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
              Suggested Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{question}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Stats & Popular Questions */}
        <div className="space-y-6">
          {/* Live Market Stats */}
          {liveStats && (
            <Card className="p-6">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                Live Market Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-accent" />
                    <span className="text-sm text-gray-600">Avg ROI</span>
                  </div>
                  <span className="font-medium text-gray-900">{liveStats.investmentTrends.avgROI}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Avg Investment</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${Math.round(liveStats.investmentTrends.avgMinInvestment / 1000)}K
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Active Franchises</span>
                  </div>
                  <span className="font-medium text-gray-900">{liveStats.totalFranchises.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Popular Questions */}
          {questions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                Popular Questions
              </h3>
              <div className="space-y-4">
                {questions.slice(0, 6).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <button
                      onClick={() => handleSuggestedQuestion(item.question)}
                      className="text-left w-full group"
                    >
                      <h4 className="font-medium text-gray-900 mb-2 group-hover:text-primary transition-colors text-sm">
                        {item.question}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.answer.substring(0, 100)}...
                      </p>
                      {item.category && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {item.category}
                        </span>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AskAI