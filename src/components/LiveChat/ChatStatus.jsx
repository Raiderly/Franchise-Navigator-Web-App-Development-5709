import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useLiveChat } from './LiveChatProvider'

const { FiMessageCircle, FiCheckCircle, FiAlertCircle, FiLoader } = FiIcons

const ChatStatus = ({ className = '' }) => {
  const { isLoaded, chatReady, isChatAvailable, openChat } = useLiveChat()

  // Show loading state
  if (!isLoaded && !chatReady) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
        <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
        <span>Loading chat...</span>
      </div>
    )
  }

  // Show unavailable state
  if (!isChatAvailable()) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
        <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
        <span>Chat unavailable</span>
      </div>
    )
  }

  // Show available state with click handler
  return (
    <motion.button
      onClick={openChat}
      className={`flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
      <span>Live Chat Available</span>
    </motion.button>
  )
}

export default ChatStatus