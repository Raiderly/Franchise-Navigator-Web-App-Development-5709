import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiCompass, FiHome, FiSearch, FiBarChart3, FiHeart, FiMessageCircle, FiSettings } = FiIcons

const Header = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/browse', label: 'Browse', icon: FiSearch },
    { path: '/compare', label: 'Compare', icon: FiBarChart3 },
    { path: '/insights', label: 'Insights', icon: FiBarChart3 },
    { path: '/saved', label: 'Saved', icon: FiHeart },
    { path: '/ask-ai', label: 'Ask AI', icon: FiMessageCircle },
  ]

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

          {/* Navigation */}
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

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header