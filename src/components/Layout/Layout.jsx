import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import LiveChatProvider from '../LiveChat/LiveChatProvider'

const Layout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

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
        {/* Homepage gets zero top padding, other pages get standard nav spacing */}
        <main className={isHome ? 'pt-0' : 'pt-16'}>
          <Outlet />
        </main>
      </div>
    </LiveChatProvider>
  )
}

export default Layout