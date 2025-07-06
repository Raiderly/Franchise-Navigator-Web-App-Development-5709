import { useEffect, useRef } from 'react'

export const useLiveAgent = () => {
  const scriptLoadedRef = useRef(false)
  const scriptElementRef = useRef(null)

  useEffect(() => {
    // Only load the script once
    if (scriptLoadedRef.current) {
      console.log('✅ LiveAgent script already loaded, skipping')
      return
    }

    const loadLiveAgentScript = () => {
      try {
        // Check if script already exists
        const existingScript = document.getElementById('la_x2s6df8d')
        if (existingScript) {
          console.log('✅ LiveAgent script already exists in DOM')
          scriptLoadedRef.current = true
          return
        }

        console.log('🚀 Loading LiveAgent script for production...')

        // Use the exact LiveAgent script pattern - simplified for production
        const initLiveAgent = (function(d, src, c) { 
          var t = d.scripts[d.scripts.length - 1], 
              s = d.createElement('script');
          
          s.id = 'la_x2s6df8d';
          s.defer = true;
          s.src = src;
          s.async = true; // Ensure async loading
          
          s.onload = s.onreadystatechange = function() {
            var rs = this.readyState;
            if (rs && rs !== 'complete' && rs !== 'loaded') return;
            
            try {
              console.log('📞 LiveAgent script loaded, initializing chat...')
              c(this);
              scriptLoadedRef.current = true
              console.log('✅ LiveAgent chat widget initialized successfully!')
            } catch (error) {
              console.error('❌ Error initializing LiveAgent chat:', error)
            }
          };
          
          s.onerror = function() {
            console.error('❌ Failed to load LiveAgent script from:', src)
            scriptLoadedRef.current = false
          }
          
          // Insert script - try parent insertion first, fallback to head
          try {
            if (t && t.parentElement) {
              t.parentElement.insertBefore(s, t.nextSibling);
              console.log('📝 Script inserted via parent element')
            } else {
              document.head.appendChild(s);
              console.log('📝 Script inserted via document.head')
            }
          } catch (e) {
            // Final fallback
            document.head.appendChild(s);
            console.log('📝 Script inserted via fallback method')
          }
          
          scriptElementRef.current = s
          
        })

        // Call the IIFE with proper parameters
        initLiveAgent(document, 'https://davidayadcom.ladesk.com/scripts/track.js', function(e) {
          try {
            if (window.LiveAgent && typeof window.LiveAgent.createButton === 'function') {
              window.LiveAgent.createButton('v6a7abo2', e);
              console.log('🎯 LiveAgent button created with ID: v6a7abo2')
            } else {
              console.warn('⚠️ LiveAgent.createButton not available:', window.LiveAgent)
            }
          } catch (error) {
            console.error('❌ Error creating LiveAgent button:', error)
          }
        });
      } catch (error) {
        console.error('❌ Critical error loading LiveAgent script:', error)
        scriptLoadedRef.current = false
      }
    }

    // Load script immediately when component mounts
    loadLiveAgentScript()

    // Cleanup function - preserve script for SPA persistence
    return () => {
      console.log('🔄 useLiveAgent cleanup - preserving script for SPA navigation')
      // Intentionally NOT removing script to maintain persistence
    }
  }, []) // Empty dependency array ensures this runs only once

  // Return script loading status
  return {
    isLoaded: scriptLoadedRef.current,
    scriptElement: scriptElementRef.current
  }
}