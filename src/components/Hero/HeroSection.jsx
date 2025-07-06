import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../UI/Button'

const { FiSearch, FiPlay } = FiIcons

const HeroSection = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedInvestment, setSelectedInvestment] = useState('')

  // Load Wistia script and initialize
  useEffect(() => {
    if (!isHome) return // Only load on homepage

    // Check if Wistia script is already loaded
    if (window.Wistia || document.getElementById('wistia-script')) {
      console.log('✅ Wistia already loaded')
      return
    }

    const script = document.createElement('script')
    script.id = 'wistia-script'
    script.src = 'https://fast.wistia.com/assets/external/E-v1.js'
    script.async = true
    script.onload = () => {
      console.log('✅ Wistia script loaded successfully')
      // Initialize Wistia queue
      window._wq = window._wq || []
      window._wq.push({
        id: "xjm8bzabrc",
        options: {
          autoPlay: false,
          popover: true
        }
      })
    }
    script.onerror = () => {
      console.error('❌ Failed to load Wistia script')
    }
    document.head.appendChild(script)
  }, [isHome])

  const handleWatchVideo = () => {
    console.log('🎬 Video play button clicked')
    
    // Try to launch Wistia popover
    if (window.Wistia && window.Wistia.api) {
      try {
        const video = window.Wistia.api('xjm8bzabrc')
        if (video && typeof video.popup === 'function') {
          video.popup()
          console.log('✅ Wistia video launched via popup')
          return
        }
      } catch (error) {
        console.error('❌ Wistia popup failed:', error)
      }
    }

    // Fallback: Use popover method
    if (window.Wistia && window.Wistia.popover) {
      try {
        window.Wistia.popover('xjm8bzabrc', {
          aspectRatio: 1.78,
          popoverAnimateThumbnail: true
        })
        console.log('✅ Wistia video launched via popover')
        return
      } catch (error) {
        console.error('❌ Wistia popover failed:', error)
      }
    }

    // Final fallback
    console.warn('⚠️ Wistia not ready yet')
    alert('Video is loading, please try again in a moment.')
  }

  const handleSearch = () => {
    console.log('🔍 Search triggered:', { searchTerm, selectedCategory, selectedLocation, selectedInvestment })
    // Navigate to browse page with filters
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedLocation) params.set('location', selectedLocation)
    if (selectedInvestment) params.set('investment', selectedInvestment)
    
    const queryString = params.toString()
    window.location.href = `/browse${queryString ? '?' + queryString : ''}`
  }

  const categories = [
    'Food & Beverage',
    'Retail',
    'Health & Fitness',
    'Education',
    'Home Services',
    'Technology',
    'Automotive',
    'Business Services'
  ]

  const locations = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'Western Australia',
    'South Australia',
    'Tasmania',
    'Northern Territory',
    'Australian Capital Territory'
  ]

  const investmentRanges = [
    'Under $50K',
    '$50K - $100K',
    '$100K - $250K',
    '$250K - $500K',
    '$500K - $1M',
    'Over $1M'
  ]

  // Only render hero section on homepage
  if (!isHome) {
    return null
  }

  return (
    <>
      {/* ✅ FIXED: Hero Section - Clean, no duplicates, play button INSIDE hero */}
      <section 
        className="relative w-full min-h-screen bg-[#5d20d6] overflow-hidden"
        style={{
          backgroundImage: `url('https://app1.sharemyimage.com/2025/07/06/Copy-of-franchisefinder.-1800-x-600-px-2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: '0',
          paddingTop: '64px' // Account for fixed nav height
        }}
      >
        {/* Content Container */}
        <div className="relative z-20 flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">
            {/* Main Heading - Higher z-index */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12 relative z-30"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Find the Right Franchise Opportunity in Australia
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium max-w-4xl mx-auto leading-relaxed">
                Search & compare franchises by industry, investment level, and location. Australia's most dynamic franchise directory.
              </p>
            </motion.div>

            {/* Search Interface - Below heading, above fold */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-30 max-w-5xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  {/* Main Search Bar */}
                  <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search franchises by name, brand, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d20d6] focus:border-transparent"
                    />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Select */}
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d20d6] focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Select */}
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d20d6] focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Investment Range Select */}
                    <div className="relative">
                      <select
                        value={selectedInvestment}
                        onChange={(e) => setSelectedInvestment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d20d6] focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">All Investment Ranges</option>
                        {investmentRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSearch}
                      size="lg"
                      className="bg-[#5d20d6] hover:bg-[#4a1ab8] text-white px-12 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <SafeIcon icon={FiSearch} className="w-5 h-5 mr-3" />
                      Search Franchises
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ✅ FIXED: Play Button - Now RELATIVE to hero container, not fixed to viewport */}
            <motion.div
              className="flex justify-center mt-16 relative z-30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                onClick={handleWatchVideo}
                className="w-20 h-20 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlay} className="w-8 h-8 text-[#5d20d6] ml-1 group-hover:scale-110 transition-transform duration-300" />
                
                {/* Pulse Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-[#5d20d6]/30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-[#5d20d6]/20 animate-ping" style={{ animationDelay: '1s' }}></div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hidden Wistia Embed - Required for Popover */}
      <div 
        className="wistia_embed wistia_async_xjm8bzabrc popover=true" 
        style={{ display: 'none' }}
      ></div>
    </>
  )
}

export default HeroSection