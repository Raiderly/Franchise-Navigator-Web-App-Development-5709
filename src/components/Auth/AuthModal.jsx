import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../UI/Button'
import LoadingSpinner from '../UI/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

const { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff } = FiIcons

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signin') {
        const result = await signIn(formData.email, formData.password)
        if (result.success) {
          setMessage('Welcome back!')
          setTimeout(() => onClose(), 1000)
        } else {
          setError(result.error)
        }
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        
        const result = await signUp(formData.email, formData.password, {
          fullName: formData.fullName
        })
        
        if (result.success) {
          setMessage('Account created successfully! Please check your email to verify your account.')
          setTimeout(() => onClose(), 2000)
        } else {
          setError(result.error)
        }
      } else if (mode === 'reset') {
        const result = await resetPassword(formData.email)
        if (result.success) {
          setMessage('Password reset email sent! Check your inbox.')
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    })
    setError('')
    setMessage('')
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-8 w-full max-w-md relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-gray-600">
              {mode === 'signin' && 'Sign in to save your favorite franchises'}
              {mode === 'signup' && 'Join to start saving franchise opportunities'}
              {mode === 'reset' && 'Enter your email to reset your password'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                    minLength="6"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Email'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => switchMode('reset')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthModal