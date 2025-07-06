import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../UI/Button'
import ChatButton from '../UI/ChatButton'
import AuthModal from '../Auth/AuthModal'
import { useAuth } from '../../contexts/AuthContext'

const { FiCompass, FiHome, FiSearch, FiBarChart3, FiHeart, FiMessageCircle, FiUser, FiLogOut, FiMenu, FiX } = FiIcons

const Header = () => {
  const location = useLocation()
  const { user, signOut, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/browse', label: 'Browse', icon: FiSearch },
    { path: '/compare', label: 'Compare', icon: FiBarChart3 },
    { path: '/insights', label: 'Insights', icon: FiBarChart3 },
    { path: '/saved', label: 'Saved', icon: FiHeart },
    { path: '/ask-ai', label: 'Ask AI', icon: FiMessageCircle },
  ]

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <SafeIcon icon={FiCompass} className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">
              Franchise Navigator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-3">
            {/* Live Chat Button */}
            <div className="hidden sm:block">
              <ChatButton variant="ghost" size="sm">
                Support
              </ChatButton>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link
                      to="/saved"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <SafeIcon icon={FiHeart} className="w-4 h-4" />
                      <span>Saved Franchises</span>
                    </Link>
                    <hr className="my-2" />
                    <div className="px-4 py-2">
                      <ChatButton variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-sm">
                        Live Support
                      </ChatButton>
                    </div>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                size="sm"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={showMobileMenu ? FiX : FiMenu} className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Chat Button */}
              <div className="px-3 py-2">
                <ChatButton variant="ghost" size="sm" className="w-full justify-start">
                  Live Support
                </ChatButton>
              </div>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}

export default Header