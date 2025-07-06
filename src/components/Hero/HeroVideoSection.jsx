import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../UI/Button'

const { FiPlay, FiCompass, FiCheck } = FiIcons

const HeroVideoSection = () => {
  const wistiaPlayerRef = useRef(null)

  // Load Wistia E-v1.js script for popup functionality
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://fast.wistia.com/assets/external/E-v1.js'
    script.async = true
    script.onload = () => {
      console.log('✅ Wistia E-v1.js script loaded successfully')
    }
    script.onerror = () => {
      console.error('❌ Failed to load Wistia E-v1.js script')
    }
    document.body.appendChild(script)
    
    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePlayClick = () => {
    console.log('🎬 Play button clicked')
    
    // Method 1: Use Wistia API popup
    if (window.Wistia && window.Wistia.api) {
      try {
        const video = window.Wistia.api('xjm8bzabrc')
        if (video && typeof video.popup === 'function') {
          video.popup()
          console.log('✅ Wistia popup launched via API')
          return
        }
      } catch (error) {
        console.error('❌ Wistia API popup failed:', error)
      }
    }
    
    // Method 2: Use Wistia popover
    if (window.Wistia && window.Wistia.popover) {
      try {
        window.Wistia.popover('xjm8bzabrc', {
          aspectRatio: 1.78,
          popoverAnimateThumbnail: true
        })
        console.log('✅ Wistia popover launched')
        return
      } catch (error) {
        console.error('❌ Wistia popover failed:', error)
      }
    }
    
    // Method 3: Fallback - trigger hidden embed
    try {
      const hiddenEmbed = document.querySelector('.wistia_embed')
      if (hiddenEmbed) {
        hiddenEmbed.click()
        console.log('✅ Triggered via hidden embed')
        return
      }
    } catch (error) {
      console.error('❌ Hidden embed trigger failed:', error)
    }
    
    // Final fallback
    console.warn('⚠️ All Wistia methods failed - Wistia may not be loaded yet')
    alert('Video is loading, please try again in a moment.')
  }

  const bulletPoints = [
    { icon: FiCheck, text: 'Browse verified franchise offers' },
    { icon: FiCheck, text: 'No upsells, no commissions' },
    { icon: FiCheck, text: 'Instantly compare based on fees, ROI & more' }
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiCompass} className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-gray-900">
                Franchise Navigator
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Smarter{' '}
                <span className="text-primary">Franchise Opportunities</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Compare, analyse, and uncover franchises worth your time — without the fluff.
              </p>
            </motion.div>

            {/* Bullet Points */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {bulletPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={point.icon} className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{point.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/browse">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Exploring
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Video Play Area */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Background Illustration/Gradient */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Abstract Background Shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 rounded-full transform rotate-12"></div>
              <div className="absolute inset-4 bg-gradient-to-tl from-accent/15 via-primary/10 to-accent/5 rounded-full transform -rotate-6"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-12 left-8 w-20 h-20 bg-accent/15 rounded-full blur-2xl"></div>
              <div className="absolute top-1/3 left-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"></div>
              
              {/* Central Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  onClick={handlePlayClick}
                  className="group relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-primary/10 hover:border-primary/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0, type: "spring", bounce: 0.4 }}
                >
                  {/* Play Icon */}
                  <SafeIcon 
                    icon={FiPlay} 
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary ml-1 group-hover:scale-110 transition-transform duration-300" 
                  />
                  
                  {/* Pulse Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" 
                    style={{ animationDelay: '1s' }}
                  ></div>
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
                </motion.button>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-16 left-16 w-4 h-4 bg-primary rounded-full opacity-60"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-20 right-16 w-3 h-3 bg-accent rounded-full opacity-40"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute top-1/2 right-8 w-2 h-2 bg-primary rounded-full opacity-50"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            {/* Small Descriptive Text */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <p className="text-sm text-gray-500">
                2 min overview • No signup required
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hidden Wistia Embed for Popup Trigger */}
      <div
        className="wistia_embed wistia_async_xjm8bzabrc popover=true"
        style={{ display: 'none' }}
        ref={wistiaPlayerRef}
      />
    </section>
  )
}

export default HeroVideoSection