import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { franchiseService } from '../lib/supabase'

const { FiMessageCircle, FiSend, FiHelpCircle, FiTrendingUp, FiDollarSign, FiMapPin, FiDatabase } = FiIcons

const AskAI = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [conversation, setConversation] = useState([])
  const [isAsking, setIsAsking] = useState(false)
  const [dataSource, setDataSource] = useState('live')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get live AI questions
      try {
        const data = await franchiseService.getAIQuestions()
        if (data && data.length > 0) {
          setQuestions(data)
          setDataSource('live')
          console.log(`✅ Loaded ${data.length} AI questions from database`)
        } else {
          setQuestions(mockQuestions)
          setDataSource('mock')
          console.log('⚠️ No AI questions in database, using mock data')
        }
      } catch (err) {
        console.log('⚠️ AI questions table not available, using mock data')
        setQuestions(mockQuestions)
        setDataSource('mock')
        setError('Using sample Q&A data - live database connection pending')
      }
    } catch (err) {
      setError(err.message)
      setQuestions(mockQuestions)
      setDataSource('mock')
    } finally {
      setLoading(false)
    }
  }

  const mockQuestions = [
    {
      id: 1,
      question: "What's the most profitable franchise type in 2024?",
      answer: "Technology services franchises are showing the highest ROI at 35% average, followed by fitness franchises at 28%. These sectors benefit from recurring revenue models and growing market demand.",
      category: "profitability",
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      question: "How much should I invest in my first franchise?",
      answer: "For first-time franchise owners, we recommend starting with investments between $100K-$250K. This range offers good opportunities while limiting risk. Consider your liquid capital, financing options, and local market conditions.",
      category: "investment",
      created_at: "2024-01-14T15:30:00Z"
    },
    {
      id: 3,
      question: "Which franchise sectors are growing fastest?",
      answer: "The fastest-growing sectors are: 1) Technology Services (40% growth), 2) Health & Wellness (35% growth), 3) Home Services (30% growth), and 4) Pet Services (25% growth). These align with demographic and lifestyle trends.",
      category: "trends",
      created_at: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      question: "What are the key factors for franchise success?",
      answer: "Success factors include: strong brand recognition, comprehensive training programs, ongoing support, favorable unit economics, protected territory, and alignment with local market needs. Location and operator commitment are also crucial.",
      category: "success",
      created_at: "2024-01-12T14:45:00Z"
    },
    {
      id: 5,
      question: "How do I evaluate franchise disclosure documents?",
      answer: "Focus on: financial performance representations, litigation history, franchisor experience, territory rights, ongoing fees, and exit clauses. Have a franchise attorney review the FDD before signing.",
      category: "legal",
      created_at: "2024-01-11T11:20:00Z"
    },
    {
      id: 6,
      question: "What financing options are available for franchises?",
      answer: "Common options include SBA loans (up to 90% financing), franchisor financing programs, equipment financing, rollover business startups (ROBS), and investor partnerships. Many franchisors have preferred lender relationships.",
      category: "financing",
      created_at: "2024-01-10T09:45:00Z"
    }
  ]

  const suggestedQuestions = [
    "What's the average ROI for food franchises?",
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

    // Simulate AI response with more sophisticated matching
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
    
    // Advanced response matching
    const responses = {
      'roi': "Based on our live franchise database, the average ROI varies significantly by industry: Technology Services lead at 35%, Fitness franchises at 28%, Food & Beverage at 22%, and Retail at 18%. However, individual results depend heavily on location, management quality, and market conditions. Would you like specific ROI data for any particular franchise category?",
      
      'cost': "Hidden costs in franchising often include: ongoing royalty fees (typically 5-7% of gross revenue), national marketing fees (2-3%), local advertising requirements, equipment maintenance and upgrades, insurance premiums, staff training costs, and territory development fees. I recommend budgeting an additional 15-20% beyond the initial franchise fee and startup costs.",
      
      'financing': "Current financing options include: SBA loans (up to 90% financing with favorable terms), franchisor-sponsored financing programs, equipment financing, ROBS (Rollover Business Startups), alternative lending, and investor partnerships. Many franchisors maintain relationships with preferred lenders who understand their business model.",
      
      'location': "Location is critical for most franchise types. Key factors include: foot traffic patterns, demographic alignment with target customers, competition density, accessibility and parking, lease terms and rent costs, and future development plans for the area. Food and retail franchises are particularly location-sensitive.",
      
      'evaluation': "When evaluating franchise opportunities, focus on: the Franchise Disclosure Document (FDD) review, franchisor's financial stability and track record, existing franchisee satisfaction surveys, territory protection and exclusivity, ongoing support and training programs, unit economics and profitability data, and your personal fit with the business model.",
      
      'timeline': "Typical franchise break-even timelines vary by industry: Fast-casual food (12-18 months), Fitness centers (18-24 months), Service-based franchises (6-12 months), Retail franchises (12-24 months). These timelines depend on initial investment, location quality, management effectiveness, and local market conditions.",
      
      'default': "That's an excellent question! Based on our comprehensive franchise database and industry insights, I'd recommend considering factors like market demand analysis, franchisor support quality, competitive landscape, and unit economics. Each franchise opportunity is unique, so thorough due diligence is essential. Would you like me to elaborate on any specific aspect of franchise evaluation?"
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
        <span className="ml-3 text-gray-600">Loading AI assistant...</span>
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
          Ask AI Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Get instant answers to your franchise questions powered by industry data
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
              ? `✅ AI powered by live database with ${questions.length} expert Q&As`
              : `⚠️ AI using sample knowledge base with ${questions.length} Q&As`
            }
          </span>
        </div>
      </motion.div>

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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiHelpCircle} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    👋 Hi! I'm your franchise AI assistant.
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
                    <span className="text-sm">Thinking...</span>
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
                  placeholder="Ask your franchise question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  disabled={isAsking}
                  rows="1"
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

        {/* Popular Questions & Stats */}
        <div className="space-y-6">
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

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-accent" />
                  <span className="text-sm text-gray-600">Avg ROI</span>
                </div>
                <span className="font-medium text-gray-900">26%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Avg Investment</span>
                </div>
                <span className="font-medium text-gray-900">$240K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Active Franchises</span>
                </div>
                <span className="font-medium text-gray-900">12K+</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AskAI