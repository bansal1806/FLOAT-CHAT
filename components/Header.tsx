'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Settings, 
  User, 
  Bell, 
  Search,
  Zap,
  Globe,
  Database,
  Waves
} from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-ocean-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FloatChat</h1>
            <p className="text-xs text-gray-400">AI Ocean Data Platform</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 max-w-md mx-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ocean data, ask questions..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:border-white/40 transition-colors backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {/* Live Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300">Live</span>
          </div>

          {/* Data Sources */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Database className="w-4 h-4" />
            <span>4,247 ARGO Floats</span>
          </div>

          {/* Global Coverage */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
            <User className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/30 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-ocean-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">FloatChat</span>
              </div>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
                  AI Chat
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
                  3D Ocean
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
                  AR/VR
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm">
                  Analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
