import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLiveAgent } from '../../hooks/useLiveAgent'

const LiveChatContext = createContext({})

export const useLiveChat = () => {
  const context = useContext(LiveChatContext)
  if (!context) {
    throw new Error('useLiveChat must be used within a LiveChatProvider')
  }
  return context
}

const LiveChatProvider = ({ children }) => {
  const { isLoaded, scriptElement } = useLiveAgent()
  const [chatReady, setChatReady] = useState(false)

  // Check if LiveAgent is ready periodically
  useEffect(() => {
    const checkLiveAgent = () => {
      if (window.LiveAgent && isLoaded) {
        setChatReady(true)
        console.log('✅ LiveAgent is ready for production use')
        return true
      }
      return false
    }

    // Check immediately
    if (checkLiveAgent()) return

    // Check every 500ms for up to 10 seconds
    const interval = setInterval(() => {
      if (checkLiveAgent()) {
        clearInterval(interval)
      }
    }, 500)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      console.warn('⚠️ LiveAgent initialization timeout after 10 seconds')
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isLoaded])

  const value = {
    isLoaded,
    chatReady,
    scriptElement,
    // Helper function to manually trigger chat
    openChat: () => {
      try {
        if (window.LiveAgent) {
          // Try multiple methods to open chat
          if (typeof window.LiveAgent.openChat === 'function') {
            window.LiveAgent.openChat()
            console.log('📞 LiveAgent chat opened via openChat()')
          } else if (typeof window.LiveAgent.showWidget === 'function') {
            window.LiveAgent.showWidget()
            console.log('📞 LiveAgent chat opened via showWidget()')
          } else if (typeof window.LiveAgent.show === 'function') {
            window.LiveAgent.show()
            console.log('📞 LiveAgent chat opened via show()')
          } else {
            console.warn('⚠️ No LiveAgent open method available')
          }
        } else {
          console.warn('⚠️ LiveAgent not available on window object')
        }
      } catch (error) {
        console.error('❌ Error opening LiveAgent chat:', error)
      }
    },
    // Helper function to check if chat is available
    isChatAvailable: () => {
      const available = !!(window.LiveAgent && (isLoaded || chatReady))
      if (available) {
        console.log('✅ LiveAgent chat is available')
      } else {
        console.log('❌ LiveAgent chat is NOT available')
      }
      return available
    }
  }

  return (
    <LiveChatContext.Provider value={value}>
      {children}
    </LiveChatContext.Provider>
  )
}

export default LiveChatProvider