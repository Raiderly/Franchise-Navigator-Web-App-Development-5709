import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from './Button'
import { useLiveChat } from '../LiveChat/LiveChatProvider'

const { FiMessageCircle, FiHelpCircle } = FiIcons

const ChatButton = ({ variant = 'primary', size = 'md', className = '', children }) => {
  const { isChatAvailable, openChat } = useLiveChat()

  const handleClick = () => {
    console.log('🖱️ Chat button clicked')
    if (isChatAvailable()) {
      openChat()
    } else {
      console.warn('⚠️ Live chat is not available when button was clicked')
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={!isChatAvailable()}
    >
      <SafeIcon 
        icon={isChatAvailable() ? FiMessageCircle : FiHelpCircle} 
        className="w-4 h-4 mr-2" 
      />
      {children || (isChatAvailable() ? 'Chat with Support' : 'Chat Loading...')}
    </Button>
  )
}

export default ChatButton