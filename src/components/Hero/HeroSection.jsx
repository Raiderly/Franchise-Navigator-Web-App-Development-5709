import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const HeroSection = () => {
  // Load Wistia script only once globally
  useEffect(() => {
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
    }
    script.onerror = () => {
      console.error('❌ Failed to load Wistia script')
    }
    document.head.appendChild(script)
  }, [])

  const handleWatchVideo = () => {
    console.log('🎬 Watch button clicked')
    
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

  return (
    <>
      <section 
        className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://app1.sharemyimage.com/2025/07/06/Copy-of-franchisefinder.-1800-x-600-px-2.png')`
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Main Heading */}
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Perfect Franchise
            </motion.h1>
            
            {/* Subheading */}
            <motion.p 
              className="text-xl md:text-2xl lg:text-2xl font-medium opacity-90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Compare franchise systems. Understand your investment. Discover your path forward.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4"
            >
              <button
                onClick={handleWatchVideo}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
              >
                <span className="mr-3 text-xl">▶</span>
                Watch How It Works
              </button>
            </motion.div>
          </motion.div>
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