'use client'

import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Globe, 
  Eye, 
  BarChart3, 
  Brain,
  Zap,
  Database,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'hero', label: 'Home', icon: Globe, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'globe', label: '3D Ocean', icon: Globe, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    { id: 'ar-vr', label: 'AR/VR', icon: Eye, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { id: 'predictions', label: 'Predictions', icon: Brain, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  ]

  const quickActions = [
    { id: 'realtime', label: 'Real-time Data', icon: Zap, color: 'text-yellow-400' },
    { id: 'database', label: 'Data Sources', icon: Database, color: 'text-indigo-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
    { id: 'help', label: 'Help', icon: HelpCircle, color: 'text-gray-400' },
  ]

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-deep-900/50 backdrop-blur-sm border-r border-deep-700 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </h3>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${tab.bgColor} ${tab.color} border border-current/20`
                    : 'text-gray-400 hover:text-white hover:bg-deep-800/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-current rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-deep-800/50 rounded-lg transition-all duration-200"
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">AI Service</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Stream</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">ARGO Floats</span>
              <span className="text-xs text-blue-400">4,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Last Update</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>New ARGO data received</span>
              </div>
              <div className="text-gray-500 ml-3.5">Indian Ocean - 2 min ago</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Temperature anomaly detected</span>
              </div>
              <div className="text-gray-500 ml-3.5">Pacific Ocean - 5 min ago</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <span>ML model updated</span>
              </div>
              <div className="text-gray-500 ml-3.5">Forecasting system - 10 min ago</div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-deep-800/50 border border-deep-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Demo Mode</span>
          </div>
          <p className="text-xs text-gray-400">
            This is a demonstration prototype showcasing FloatChat's capabilities. 
            All data is simulated for presentation purposes.
          </p>
        </div>
      </div>
    </aside>
  )
}
