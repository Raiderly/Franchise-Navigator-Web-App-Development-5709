import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import { franchiseService } from '../lib/supabase'

const {
  FiSearch,
  FiBarChart3,
  FiMessageCircle,
  FiShield,
  FiTrendingUp,
  FiFileText,
  FiEye,
  FiChevronRight,
  FiChevronLeft,
  FiMail,
  FiCheck,
  FiClock,
  FiAward,
  FiUsers,
  FiTarget,
  FiAlertCircle,
  FiBook,
  FiDatabase,
  FiSettings
} = FiIcons

const Home = () => {
  const [emailSubscription, setEmailSubscription] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState(null)

  useEffect(() => {
    initializeConnection()
  }, [])

  const initializeConnection = async () => {
    try {
      const connectionResult = await franchiseService.testConnection()
      setConnectionStatus(connectionResult)
    } catch (err) {
      console.error('Connection test failed:', err)
    }
  }

  // Featured Franchise Data
  const featuredFranchises = [
    {
      id: 1,
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      name: 'Metro Coffee Co.',
      investmentRange: '$180K - $350K',
      tags: ['High Growth', 'Well-Documented'],
      description: 'Premium coffee franchise with strong urban presence'
    },
    {
      id: 2,
      logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
      name: 'FitZone Australia',
      investmentRange: '$120K - $280K',
      tags: ['Established', 'Health & Wellness'],
      description: '24/7 fitness centers with proven business model'
    },
    {
      id: 3,
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      name: 'QuickServe Meals',
      investmentRange: '$95K - $185K',
      tags: ['Fast ROI', 'Food Service'],
      description: 'Quick-service restaurant with streamlined operations'
    },
    {
      id: 4,
      logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop',
      name: 'EduCare Learning',
      investmentRange: '$75K - $150K',
      tags: ['Education', 'Recession-Proof'],
      description: 'After-school tutoring and educational services'
    },
    {
      id: 5,
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      name: 'HomeClean Pro',
      investmentRange: '$45K - $85K',
      tags: ['Low Entry', 'Service-Based'],
      description: 'Professional home cleaning services franchise'
    },
    {
      id: 6,
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
      name: 'TechRepair Hub',
      investmentRange: '$65K - $125K',
      tags: ['Technology', 'Growing Market'],
      description: 'Device repair and tech support services'
    }
  ]

  // Legal News & Updates
  const legalNews = [
    {
      id: 1,
      headline: 'ACCC Releases New Franchise Disclosure Guidelines',
      summary: 'Updated requirements for franchise disclosure documents take effect March 2024, emphasizing clearer financial performance representations.',
      date: '2024-01-15',
      category: 'Regulatory'
    },
    {
      id: 2,
      headline: 'Franchising Code Amendment Passes Parliament',
      summary: 'New provisions strengthen franchisee protections and introduce mandatory mediation processes for disputes.',
      date: '2024-01-10',
      category: 'Legislative'
    },
    {
      id: 3,
      headline: 'Federal Court Rules on Territory Rights Case',
      summary: 'Landmark decision clarifies exclusive territory boundaries and franchisor obligations in market protection.',
      date: '2024-01-08',
      category: 'Case Law'
    },
    {
      id: 4,
      headline: 'Franchise Disclosure Register Updates',
      summary: 'New search functionality and enhanced disclosure requirements now available on the official register.',
      date: '2024-01-05',
      category: 'Regulatory'
    }
  ]

  // Blog Posts
  const blogPosts = [
    {
      id: 1,
      title: 'How to Read a Franchise Disclosure Document',
      summary: 'A comprehensive guide to understanding the 23 key items in every FDD and what to look for.',
      tags: ['Legal', 'Due Diligence'],
      readTime: '8 min read',
      date: '2024-01-12'
    },
    {
      id: 2,
      title: 'Financial Due Diligence: Questions Every Franchisee Should Ask',
      summary: 'Essential financial metrics and red flags to identify before signing your franchise agreement.',
      tags: ['Financial', 'Strategy'],
      readTime: '12 min read',
      date: '2024-01-09'
    },
    {
      id: 3,
      title: 'Understanding Territory Rights in Australian Franchising',
      summary: 'Your comprehensive guide to exclusive territories, protected areas, and market development rights.',
      tags: ['Legal', 'Territory'],
      readTime: '6 min read',
      date: '2024-01-06'
    }
  ]

  // Explorer Tools
  const explorerTools = [
    {
      id: 1,
      icon: FiBarChart3,
      title: 'Compare Franchise Brands',
      subtitle: 'Side-by-side analysis of investment, fees, and performance',
      link: '/compare',
      available: true
    },
    {
      id: 2,
      icon: FiMessageCircle,
      title: 'Ask the AI',
      subtitle: 'Get instant answers to your franchising questions',
      link: '/ask-ai',
      available: true
    },
    {
      id: 3,
      icon: FiShield,
      title: 'Franchise Health Checklist',
      subtitle: 'Comprehensive due diligence framework',
      link: '#',
      available: false,
      comingSoon: true
    },
    {
      id: 4,
      icon: FiDatabase,
      title: 'Regulatory Watch Dashboard',
      subtitle: 'Track compliance and regulatory changes',
      link: '/insights',
      available: true
    }
  ]

  // User Testimonials
  const testimonials = [
    {
      id: 1,
      quote: "The compare tool helped me cut through the noise and focus on what really matters in franchise selection.",
      author: "User – NSW",
      rating: 5
    },
    {
      id: 2,
      quote: "I used this to prep for my first meeting with a franchisor. The due diligence checklist was invaluable.",
      author: "User – VIC",
      rating: 5
    },
    {
      id: 3,
      quote: "Finally, a platform that understands Australian franchising law. The legal updates section is brilliant.",
      author: "User – QLD",
      rating: 5
    },
    {
      id: 4,
      quote: "The AI assistant answered questions I didn't even know I should ask. Saved me hours of research.",
      author: "User – WA",
      rating: 5
    }
  ]

  // Testimonial Navigation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Email Subscription Handler
  const handleEmailSubscription = (e) => {
    e.preventDefault()
    if (emailSubscription.trim()) {
      setSubscribed(true)
      setEmailSubscription('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-6">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gray-900">
            Navigate Australian{' '}
            <span className="text-primary block">Franchising with Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional tools and expert insights to help you make informed franchise investment decisions. 
            Built for compliance with Australian Franchising Code requirements.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiSearch} className="mr-2" />
              Explore Franchises
            </Button>
          </Link>
          <Link to="/ask-ai">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <SafeIcon icon={FiMessageCircle} className="mr-2" />
              Ask the AI
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Featured Franchise Profiles */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Featured Franchise Profiles
          </h2>
          <p className="text-gray-600 text-lg">
            Carefully selected franchise opportunities with comprehensive documentation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFranchises.map((franchise, index) => (
            <motion.div
              key={franchise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <Card className="overflow-hidden h-full" hover>
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={franchise.logo}
                    alt={franchise.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                    {franchise.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                      {franchise.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {franchise.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment Range</span>
                      <span className="font-medium text-gray-900">
                        {franchise.investmentRange}
                      </span>
                    </div>
                  </div>
                  <Link to={`/franchise/${franchise.id}`}>
                    <Button className="w-full">
                      <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                      View Franchise Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/browse">
            <Button variant="secondary" size="lg">
              View All Franchises
              <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Franchise Explorer Tools */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Franchise Explorer Tools
          </h2>
          <p className="text-gray-600 text-lg">
            Professional-grade tools for franchise research and due diligence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {explorerTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              {tool.available ? (
                <Link to={tool.link}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer" hover>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={tool.icon} className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600">{tool.subtitle}</p>
                      </div>
                      <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className="p-6 h-full opacity-60 cursor-not-allowed">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={tool.icon} className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-heading text-xl font-semibold text-gray-500">
                          {tool.title}
                        </h3>
                        {tool.comingSoon && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">{tool.subtitle}</p>
                    </div>
                    <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Two Column Layout: Legal News & Blog */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Franchise News / Legal Updates */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Legal Updates & News
            </h2>
            <p className="text-gray-600">
              Stay informed about Australian franchising regulations and case law
            </p>
          </div>
          <div className="space-y-4">
            {legalNews.slice(0, 4).map((news, index) => (
              <Card key={news.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(news.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">
                      {news.headline}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {news.summary}
                    </p>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="secondary" className="w-full">
            View All Legal Updates
          </Button>
        </motion.section>

        {/* Blog / Thought Leadership */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Expert Insights & Guides
            </h2>
            <p className="text-gray-600">
              Professional guidance for franchise investors and operators
            </p>
          </div>
          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="secondary" className="w-full">
            View All Posts
          </Button>
        </motion.section>
      </div>

      {/* User Testimonials */}
      <motion.section
        className="bg-gray-50 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            What Our Users Say
          </h2>
          <p className="text-gray-600">
            Real feedback from franchise investors across Australia
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[120px]">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <blockquote className="text-lg text-gray-700 mb-4 font-medium">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiAward} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">
                  — {testimonials[currentTestimonial].author}
                </span>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Lead Magnet Email Opt-In */}
      <motion.section
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <SafeIcon icon={FiFileText} className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h2 className="font-heading text-2xl font-bold mb-4">
          Download Our Franchise Due Diligence Starter Pack
        </h2>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Get our comprehensive 25-page guide covering legal requirements, financial analysis, 
          and essential questions to ask before investing in a franchise.
        </p>
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center space-x-2 text-green-200"
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            <span>Thank you! Check your email for the download link.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleEmailSubscription} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
              <Button 
                type="submit" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-gray-50"
              >
                <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                Get Free Guide
              </Button>
            </div>
            <label className="flex items-center justify-center space-x-2 mt-3 text-sm opacity-90">
              <input type="checkbox" className="rounded" />
              <span>Subscribe to legal updates and franchise insights</span>
            </label>
          </form>
        )}
      </motion.section>

      {/* Trust & Compliance Footer */}
      <motion.section
        className="bg-white border border-gray-200 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">
              Built for Australian Franchising Code Compliance
            </h3>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Our platform is designed to help users navigate Australian franchising regulations and requirements. 
              All content is provided for educational purposes and should not be considered legal or financial advice.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="w-5 h-5" />
              <span className="text-sm font-medium">ACCC Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiDatabase} className="w-5 h-5" />
              <span className="text-sm font-medium">Official Register</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBook} className="w-5 h-5" />
              <span className="text-sm font-medium">Legal Framework</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>
              This platform provides educational resources and tools for franchise research. 
              Always consult with qualified legal and financial professionals before making investment decisions.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home