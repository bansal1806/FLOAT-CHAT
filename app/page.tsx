'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Globe, 
  Zap, 
  Brain, 
  Eye, 
  Database,
  ArrowRight,
  Play,
  BarChart3,
  MapPin,
  Thermometer,
  Waves,
  ChevronDown,
  Sparkles,
  Shield,
  Cpu
} from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'
import OceanGlobe from '@/components/OceanGlobe'
import ARVRInterface from '@/components/ARVRInterface'
import DataVisualization from '@/components/DataVisualization'
import PredictiveAnalytics from '@/components/PredictiveAnalytics'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [activeTab, setActiveTab] = useState('hero')
  const [isLoading, setIsLoading] = useState(true)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    { id: 'hero', label: 'Home', icon: Globe, color: 'text-blue-400' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-blue-400' },
    { id: 'globe', label: '3D Ocean', icon: Globe, color: 'text-cyan-400' },
    { id: 'ar-vr', label: 'AR/VR', icon: Eye, color: 'text-purple-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-green-400' },
    { id: 'predictions', label: 'Predictions', icon: Brain, color: 'text-orange-400' },
  ]

  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat',
      description: 'Ask questions about ocean data in natural language',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: '3D Visualization',
      description: 'Explore ocean data in immersive 3D environments',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: Eye,
      title: 'AR/VR Support',
      description: 'Dive into ocean data with augmented and virtual reality',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Brain,
      title: 'Predictive AI',
      description: 'Forecast ocean conditions with advanced ML models',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Database,
      title: 'Real-time Data',
      description: 'Live ARGO float data from 4,000+ autonomous sensors',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Blockchain Security',
      description: 'Immutable data integrity and global collaboration',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-deep flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-white mb-2">FloatChat</h1>
            <p className="text-ocean-300">Loading AI-Powered Ocean Data Platform...</p>
          </div>
        </motion.div>
      </div>
    )
  }

          const HeroSection = () => {
            const [videoLoaded, setVideoLoaded] = useState(false)
            const [videoError, setVideoError] = useState(false)

            return (
              <div className="relative min-h-screen overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 w-full h-full">
                  {!videoError && (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`w-full h-full object-cover transition-opacity duration-1000 ${
                        videoLoaded ? 'opacity-40' : 'opacity-0'
                      }`}
                      onLoadedData={() => setVideoLoaded(true)}
                      onError={() => setVideoError(true)}
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJvY2VhbiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA0wNjQ7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA2NkNDO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDQwNjQ7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNvY2VhbikiLz4KPC9zdmc+"
                    >
                      <source src="/ocean.mp4" type="video/mp4" />
                      <source src="/ocean.webm" type="video/webm" />
                      {/* Fallback: Create a simple animated gradient background */}
                      <div className="w-full h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900" />
                    </video>
                  )}
                  
                  {/* Minimal overlay for video visibility */}
                  <div className={`absolute inset-0 bg-gradient-to-b from-deep-900/20 via-deep-800/10 to-deep-900/20 ${
                    videoError ? 'opacity-100' : 'opacity-0'
                  }`}>
                  </div>
                </div>

              {/* Minimal overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-deep-900/30 via-transparent to-deep-900/30">
              </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-400 via-cyan-400 to-teal-400">
              FloatChat
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionary AI-powered conversational interface for ARGO ocean data discovery and visualization
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {[
              { icon: Brain, text: "AI-Powered" },
              { icon: Globe, text: "3D Visualization" },
              { icon: Eye, text: "AR/VR Ready" },
              { icon: Shield, text: "Blockchain Secured" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-2 bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-full px-4 py-2"
              >
                <feature.icon className="w-4 h-4 text-ocean-400" />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('chat')}
                      className="bg-gradient-to-r from-ocean-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 shadow-2xl hover:shadow-ocean-500/25 transition-all duration-300"
                    >
                      <Play className="w-6 h-6" />
                      Start Exploring
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('globe')}
                      className="border-2 border-ocean-500 text-ocean-400 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 hover:bg-ocean-500/10 transition-all duration-300"
                    >
                      <Globe className="w-6 h-6" />
                      View 3D Ocean
                    </motion.button>
                  </motion.div>

                  {/* Navigation Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-3 mb-6"
                  >
                    {[
                      { id: 'chat', label: 'AI Chat', icon: MessageCircle },
                      { id: 'globe', label: '3D Ocean', icon: Globe },
                      { id: 'ar-vr', label: 'AR/VR', icon: Eye },
                      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                      { id: 'predictions', label: 'Predictions', icon: Brain }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.id)}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </motion.button>
                    ))}
                  </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: MapPin, value: "4,247", label: "ARGO Floats", color: "text-ocean-400" },
              { icon: Thermometer, value: "Real-time", label: "Data Processing", color: "text-cyan-400" },
              { icon: Brain, value: "95%", label: "AI Accuracy", color: "text-green-400" },
              { icon: Globe, value: "Global", label: "Coverage", color: "text-purple-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-deep-800/30 backdrop-blur-sm border border-deep-700/50 rounded-xl p-4 text-center hover:border-ocean-500/50 transition-all duration-300"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
  }

  return (
    <div className="min-h-screen relative">
      {/* Transparent Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Full Screen Hero Section */}
      {activeTab === 'hero' && <HeroSection />}

      {/* Tab Content - Only show when not on hero */}
      {activeTab !== 'hero' && (
        <div className="min-h-screen bg-gradient-deep pt-20">
          <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="flex-1 ml-64">
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'chat' && <ChatInterface />}
                    {activeTab === 'globe' && <OceanGlobe />}
                    {activeTab === 'ar-vr' && <ARVRInterface />}
                    {activeTab === 'analytics' && <DataVisualization />}
                    {activeTab === 'predictions' && <PredictiveAnalytics />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}
