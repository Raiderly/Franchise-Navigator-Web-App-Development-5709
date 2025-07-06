import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import LiveChatProvider from '../LiveChat/LiveChatProvider'

const Layout = () => {
  useEffect(() => {
    console.log('🏗️ Layout mounted - LiveAgent should be initializing')
    
    // Add a global check for LiveAgent after a short delay
    const checkGlobalLiveAgent = () => {
      if (window.LiveAgent) {
        console.log('🌍 Global LiveAgent object detected:', window.LiveAgent)
      } else {
        console.log('❌ Global LiveAgent object not found')
      }
    }
    
    setTimeout(checkGlobalLiveAgent, 2000)
    setTimeout(checkGlobalLiveAgent, 5000)
    
  }, [])

  return (
    <LiveChatProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </LiveChatProvider>
  )
}

export default Layout