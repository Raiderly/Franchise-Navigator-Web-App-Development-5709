import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import { likesService } from '../../lib/auth'

const { FiHeart } = FiIcons

const SaveButton = ({ franchiseId, onAuthRequired, className = '' }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && franchiseId) {
      checkSavedStatus()
    }
  }, [isAuthenticated, franchiseId])

  const checkSavedStatus = async () => {
    try {
      const saved = await likesService.isFranchiseSaved(franchiseId)
      setIsSaved(saved)
    } catch (err) {
      console.error('Failed to check saved status:', err)
    }
  }

  const handleToggleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        const result = await likesService.removeSavedFranchise(franchiseId)
        if (result.success) {
          setIsSaved(false)
        }
      } else {
        const result = await likesService.saveFranchise(franchiseId)
        if (result.success) {
          setIsSaved(true)
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isSaved 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!isLoading ? { scale: 1.1 } : {}}
      whileTap={!isLoading ? { scale: 0.9 } : {}}
      title={isSaved ? 'Remove from saved' : 'Save franchise'}
    >
      <SafeIcon 
        icon={FiHeart} 
        className={`w-4 h-4 transition-all duration-200 ${isSaved ? 'fill-current' : ''}`} 
      />
    </motion.button>
  )
}

export default SaveButton