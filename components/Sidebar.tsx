'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Info,
  X,
  RefreshCw,
  Download,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Activity,
  Thermometer,
  Waves,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Wind
} from 'lucide-react'
import { realOceanDataService, RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface RealTimeSystemStatus {
  aiService: 'online' | 'offline' | 'maintenance'
  dataStream: 'active' | 'inactive' | 'error'
  argoFloats: number
  incoisStations: number
  dataPoints: number
  lastUpdate: string
  activeAlerts: number
}

interface RecentActivity {
  id: string
  type: 'data' | 'alert' | 'system' | 'prediction'
  message: string
  location: string
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'success'
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'hero', label: 'Home', icon: Globe, color: 'text-ocean-400', bgColor: 'bg-ocean-500/20' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-aqua-400', bgColor: 'bg-aqua-500/20' },
    { id: 'globe', label: '3D Ocean', icon: Globe, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { id: 'predictions', label: 'Predictions', icon: Brain, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  ]

  const quickActions = [
    { id: 'realtime', label: 'Real-time Data', icon: Zap, color: 'text-yellow-400', action: 'realtime' },
    { id: 'database', label: 'Data Sources', icon: Database, color: 'text-indigo-400', action: 'datasources' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400', action: 'settings' },
    { id: 'help', label: 'Help', icon: HelpCircle, color: 'text-gray-400', action: 'help' },
  ]

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [argoFloats, setArgoFloats] = useState<RealArgoFloat[]>([])
  const [incoisData, setIncoisData] = useState<IncoisOceanData[]>([])
  const [systemStatus, setSystemStatus] = useState<RealTimeSystemStatus>({
    aiService: 'online',
    dataStream: 'active',
    argoFloats: 0,
    incoisStations: 0,
    dataPoints: 0,
    lastUpdate: 'Connecting...',
    activeAlerts: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isRealtime, setIsRealtime] = useState(true)

  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    theme: 'ocean',
    language: 'en',
    alertLevel: 'medium'
  })

  // Real-time data subscription
  useEffect(() => {
    if (isRealtime) {
      realOceanDataService.start()

      const handleArgoUpdate = (data: RealArgoFloat[]) => {
        setArgoFloats(data)
        updateSystemStatus(data, incoisData)
        generateRecentActivity(data, 'argo')
      }

      const handleIncoisUpdate = (data: IncoisOceanData[]) => {
        setIncoisData(data)
        updateSystemStatus(argoFloats, data)
        generateRecentActivity(data, 'incois')
      }

      realOceanDataService.subscribe('argo_update', handleArgoUpdate)
      realOceanDataService.subscribe('incois_update', handleIncoisUpdate)

      // Initial data load
      const initialArgo = realOceanDataService.getArgoFloats()
      const initialIncois = realOceanDataService.getIncoisData()

      setArgoFloats(initialArgo)
      setIncoisData(initialIncois)
      updateSystemStatus(initialArgo, initialIncois)

      return () => {
        realOceanDataService.unsubscribe('argo_update', handleArgoUpdate)
        realOceanDataService.unsubscribe('incois_update', handleIncoisUpdate)
        realOceanDataService.stop()
      }
    }
  }, [isRealtime])

  const updateSystemStatus = (argo: RealArgoFloat[], incois: IncoisOceanData[]) => {
    const activeFloats = argo.filter(f => f.status === 'active').length
    const alertFloats = argo.filter(f => f.status === 'warning' || f.status === 'error').length
    
    setSystemStatus({
      aiService: 'online',
      dataStream: argo.length > 0 || incois.length > 0 ? 'active' : 'inactive',
      argoFloats: activeFloats,
      incoisStations: incois.length,
      dataPoints: argo.length * 24 + incois.length * 12, // Estimated daily measurements
      lastUpdate: new Date().toLocaleTimeString(),
      activeAlerts: alertFloats
    })
  }

  const generateRecentActivity = (data: any[], type: 'argo' | 'incois') => {
    const activities: RecentActivity[] = []
    const now = new Date()

    if (type === 'argo' && data.length > 0) {
      const argoData = data as RealArgoFloat[]
      
      // New data received
      activities.push({
        id: `argo_data_${Date.now()}`,
        type: 'data',
        message: `New ARGO data received from ${argoData.length} floats`,
        location: 'Global Ocean Network',
        timestamp: now.toLocaleTimeString(),
        severity: 'success'
      })

      // Temperature anomalies
      const hotFloats = argoData.filter(f => f.temperature > 32)
      if (hotFloats.length > 0) {
        activities.push({
          id: `temp_anomaly_${Date.now()}`,
          type: 'alert',
          message: `High temperature detected: ${hotFloats[0].temperature.toFixed(1)}°C`,
          location: hotFloats[0].region,
          timestamp: new Date(now.getTime() - 2 * 60 * 1000).toLocaleTimeString(),
          severity: 'warning'
        })
      }

      // Low oxygen alerts
      const lowOxygenFloats = argoData.filter(f => f.oxygen && f.oxygen < 2)
      if (lowOxygenFloats.length > 0) {
        activities.push({
          id: `oxygen_low_${Date.now()}`,
          type: 'alert',
          message: `Low oxygen levels detected`,
          location: lowOxygenFloats[0].region,
          timestamp: new Date(now.getTime() - 5 * 60 * 1000).toLocaleTimeString(),
          severity: 'error'
        })
      }

      // Quality updates
      const gradeAFloats = argoData.filter(f => f.dataQuality === 'A')
      if (gradeAFloats.length > argoData.length * 0.8) {
        activities.push({
          id: `quality_update_${Date.now()}`,
          type: 'system',
          message: `Data quality improved: ${Math.round(gradeAFloats.length / argoData.length * 100)}% Grade A`,
          location: 'Quality Control System',
          timestamp: new Date(now.getTime() - 10 * 60 * 1000).toLocaleTimeString(),
          severity: 'success'
        })
      }
    }

    if (type === 'incois' && data.length > 0) {
      const incoisRegions = data as IncoisOceanData[]
      
      activities.push({
        id: `incois_data_${Date.now()}`,
        type: 'data',
        message: `INCOIS stations updated`,
        location: `${incoisRegions.length} Indian Ocean regions`,
        timestamp: now.toLocaleTimeString(),
        severity: 'info'
      })

      // Strong current alerts
      const strongCurrents = incoisRegions.filter(r => r.currents.speed > 2.0)
      if (strongCurrents.length > 0) {
        activities.push({
          id: `current_strong_${Date.now()}`,
          type: 'alert',
          message: `Strong currents: ${strongCurrents[0].currents.speed.toFixed(2)} m/s`,
          location: strongCurrents[0].region,
          timestamp: new Date(now.getTime() - 3 * 60 * 1000).toLocaleTimeString(),
          severity: 'warning'
        })
      }
    }

    // Add prediction updates
    if (Math.random() > 0.7) {
      activities.push({
        id: `prediction_${Date.now()}`,
        type: 'prediction',
        message: 'ML model updated with new data',
        location: 'Forecasting System',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toLocaleTimeString(),
        severity: 'info'
      })
    }

    setRecentActivity(prev => {
      const combined = [...activities, ...prev]
      return combined.slice(0, 10) // Keep only latest 10 activities
    })
  }

  const handleQuickAction = (action: string) => {
    setActiveModal(action)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const updateSettings = (newSettings: any) => {
    setSettings({ ...settings, ...newSettings })
  }

  const getActivityIcon = (type: string, severity: string) => {
    switch (type) {
      case 'data':
        return <Database className="w-3 h-3 text-blue-400" />
      case 'alert':
        return severity === 'error' ? 
          <AlertTriangle className="w-3 h-3 text-red-400" /> :
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
      case 'prediction':
        return <Brain className="w-3 h-3 text-purple-400" />
      case 'system':
        return <CheckCircle className="w-3 h-3 text-green-400" />
      default:
        return <Activity className="w-3 h-3 text-gray-400" />
    }
  }

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto shadow-2xl">
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
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
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
                onClick={() => handleQuickAction(action.action)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm">{action.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Real-time System Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              System Status
            </h3>
            <button
              onClick={() => setIsRealtime(!isRealtime)}
              className={`p-1 rounded transition-colors ${
                isRealtime ? 'text-green-400' : 'text-gray-400'
              }`}
              title="Toggle real-time updates"
            >
              <Activity className={`w-3 h-3 ${isRealtime ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">AI Service</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus.aiService === 'online' ? 'bg-green-400 animate-pulse' :
                  systemStatus.aiService === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className={`text-xs ${
                  systemStatus.aiService === 'online' ? 'text-green-400' :
                  systemStatus.aiService === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {systemStatus.aiService}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Stream</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus.dataStream === 'active' ? 'bg-green-400 animate-pulse' :
                  systemStatus.dataStream === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`}></div>
                <span className={`text-xs ${
                  systemStatus.dataStream === 'active' ? 'text-green-400' :
                  systemStatus.dataStream === 'error' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {systemStatus.dataStream}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">ARGO Floats</span>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">{systemStatus.argoFloats.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">INCOIS Stations</span>
              <div className="flex items-center gap-1">
                <Waves className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400">{systemStatus.incoisStations}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Points</span>
              <span className="text-xs text-emerald-400">{systemStatus.dataPoints.toLocaleString()}</span>
            </div>
            
            {systemStatus.activeAlerts > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Active Alerts</span>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-400">{systemStatus.activeAlerts}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-sm text-gray-400">Last Update</span>
              <span className="text-xs text-gray-400">{systemStatus.lastUpdate}</span>
            </div>
          </div>
        </div>

        {/* Real-time Recent Activity */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Live Activity
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="text-xs">
                <div className="flex items-start gap-2 mb-1">
                  {getActivityIcon(activity.type, activity.severity)}
                  <div className="flex-1">
                    <span className="text-gray-300">{activity.message}</span>
                  </div>
                </div>
                <div className="text-gray-500 ml-5">
                  {activity.location} • {activity.timestamp}
                </div>
              </div>
            )) : (
              <div className="text-xs text-gray-500 text-center py-4">
                <Activity className="w-4 h-4 mx-auto mb-2 opacity-50" />
                <div>Waiting for real-time updates...</div>
              </div>
            )}
          </div>
        </div>

        {/* Live Data Summary */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Live Ocean Data
          </h3>
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">
                  {argoFloats.length > 0 
                    ? (argoFloats.reduce((sum, f) => sum + f.temperature, 0) / argoFloats.length).toFixed(1)
                    : '--'
                  }°C
                </div>
                <div className="text-gray-400">Avg Temp</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {argoFloats.length > 0 
                    ? (argoFloats.reduce((sum, f) => sum + f.salinity, 0) / argoFloats.length).toFixed(2)
                    : '--'
                  } PSU
                </div>
                <div className="text-gray-400">Avg Salinity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">
                  {argoFloats.filter(f => f.oxygen).length}
                </div>
                <div className="text-gray-400">Bio-ARGO</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {argoFloats.filter(f => f.dataQuality === 'A').length}
                </div>
                <div className="text-gray-400">Grade A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Real-time Mode</span>
          </div>
          <p className="text-xs text-gray-400">
            Connected to live ARGO and INCOIS ocean monitoring networks. 
            Data updates automatically every 5 minutes.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">
              {argoFloats.length + incoisData.length} active sources
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {activeModal === 'realtime' && (
                <RealtimeDataModal 
                  argoFloats={argoFloats} 
                  incoisData={incoisData}
                  systemStatus={systemStatus}
                  onClose={closeModal} 
                />
              )}
              {activeModal === 'datasources' && <DataSourcesModal onClose={closeModal} />}
              {activeModal === 'settings' && (
                <SettingsModal 
                  settings={settings} 
                  onUpdate={updateSettings} 
                  onClose={closeModal} 
                />
              )}
              {activeModal === 'help' && <HelpModal onClose={closeModal} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}

// Enhanced Real-time Data Modal
function RealtimeDataModal({ 
  argoFloats, 
  incoisData, 
  systemStatus, 
  onClose 
}: { 
  argoFloats: RealArgoFloat[]
  incoisData: IncoisOceanData[]
  systemStatus: RealTimeSystemStatus
  onClose: () => void 
}) {
  const activeFloats = argoFloats.filter(f => f.status === 'active').length
  const bioArgoFloats = argoFloats.filter(f => f.oxygen || f.ph).length
  const gradeAFloats = argoFloats.filter(f => f.dataQuality === 'A').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Live Ocean Data
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* ARGO Network Stats */}
        <div className="bg-gray-800/60 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            ARGO Network
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{activeFloats}</div>
              <div className="text-sm text-gray-400">Active Floats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{bioArgoFloats}</div>
              <div className="text-sm text-gray-400">Bio-ARGO</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{gradeAFloats}</div>
              <div className="text-sm text-gray-400">Grade A Quality</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{argoFloats.length}</div>
              <div className="text-sm text-gray-400">Total Sensors</div>
            </div>
          </div>
        </div>

        {/* INCOIS Regional Data */}
        <div className="bg-gray-800/60 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-400" />
            INCOIS Stations
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-400">{incoisData.length}</div>
              <div className="text-sm text-gray-400">Active Stations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400">
                {incoisData.length > 0 ? incoisData.length * 4 : 0}
              </div>
              <div className="text-sm text-gray-400">Parameters</div>
            </div>
          </div>
        </div>

        {/* Real-time Averages */}
        {argoFloats.length > 0 && (
          <div className="bg-gray-800/60 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Current Averages</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Temperature:</span>
                <span className="text-red-400 font-semibold">
                  {(argoFloats.reduce((sum, f) => sum + f.temperature, 0) / argoFloats.length).toFixed(2)}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Salinity:</span>
                <span className="text-blue-400 font-semibold">
                  {(argoFloats.reduce((sum, f) => sum + f.salinity, 0) / argoFloats.length).toFixed(3)} PSU
                </span>
              </div>
              {bioArgoFloats > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Oxygen:</span>
                  <span className="text-purple-400 font-semibold">
                    {argoFloats.filter(f => f.oxygen).reduce((sum, f) => sum + (f.oxygen || 0), 0) / bioArgoFloats || 0}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-800/60 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">System Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">{systemStatus.dataStream}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Last Update</span>
            <span className="text-sm text-cyan-400">{systemStatus.lastUpdate}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => {
              realOceanDataService.start()
              setTimeout(onClose, 1000)
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
          <button className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Data Sources Modal
function DataSourcesModal({ onClose }: { onClose: () => void }) {
  const dataSources = [
    { 
      name: 'ARGO GDAC', 
      type: 'NetCDF/FTP', 
      status: 'active', 
      url: 'ftp://ftp.ifremer.fr/ifremer/argo/',
      description: 'Global ARGO float data repository',
      lastSync: '2 min ago'
    },
    { 
      name: 'INCOIS Ocean Data', 
      type: 'REST API', 
      status: 'active', 
      url: 'https://incois.gov.in/OON/index.jsp',
      description: 'Indian Ocean observing network',
      lastSync: '5 min ago'
    },
    { 
      name: 'Ocean-OPS', 
      type: 'API', 
      status: 'active', 
      url: 'https://www.ocean-ops.org/',
      description: 'Global ocean observing system',
      lastSync: '10 min ago'
    },
    { 
      name: 'NOAA Ocean Data', 
      type: 'API', 
      status: 'maintenance', 
      url: 'https://data.nodc.noaa.gov/',
      description: 'NOAA oceanographic datasets',
      lastSync: '2 hours ago'
    },
    { 
      name: 'World Ocean Atlas', 
      type: 'NetCDF', 
      status: 'active', 
      url: 'https://www.ncei.noaa.gov/data/oceans/woa/',
      description: 'Climatological ocean data',
      lastSync: '1 day ago'
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-400" />
          Data Sources
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {dataSources.map((source, index) => (
          <div key={index} className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{source.name}</h4>
              <div className={`px-2 py-1 rounded-full text-xs border ${
                source.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    source.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                  }`}></div>
                  {source.status}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2">{source.description}</div>
            <div className="text-xs text-gray-500 mb-2">{source.type} • Last sync: {source.lastSync}</div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-cyan-400" />
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-cyan-400 hover:text-cyan-300 truncate"
              >
                {source.url}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enhanced Settings Modal
function SettingsModal({ 
  settings, 
  onUpdate, 
  onClose 
}: { 
  settings: any
  onUpdate: (settings: any) => void
  onClose: () => void 
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-400" />
          Settings
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-white">Auto Refresh Data</span>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => onUpdate({ autoRefresh: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
            />
          </label>
          <p className="text-xs text-gray-400">Automatically update ocean data</p>
        </div>
        
        <div>
          <label className="block text-white mb-2">Refresh Interval</label>
          <select
            value={settings.refreshInterval}
            onChange={(e) => onUpdate({ refreshInterval: parseInt(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-white">Real-time Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => onUpdate({ notifications: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
            />
          </label>
          <p className="text-xs text-gray-400">Get alerts for ocean anomalies</p>
        </div>

        <div>
          <label className="block text-white mb-2">Alert Level</label>
          <select
            value={settings.alertLevel}
            onChange={(e) => onUpdate({ alertLevel: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="all">All Alerts</option>
            <option value="medium">Medium & High</option>
            <option value="high">High Only</option>
            <option value="critical">Critical Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white mb-2">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => onUpdate({ theme: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="ocean">Ocean Blue</option>
            <option value="deep">Deep Sea</option>
            <option value="aqua">Aqua</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => onUpdate({ language: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button 
            onClick={() => {
              onUpdate({
                autoRefresh: true,
                refreshInterval: 30,
                notifications: true,
                theme: 'ocean',
                language: 'en',
                alertLevel: 'medium'
              })
            }}
            className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Help Modal
function HelpModal({ onClose }: { onClose: () => void }) {
  const helpSections = [
    { 
      title: 'Getting Started', 
      icon: BookOpen, 
      items: [
        'Platform Overview',
        'Real-time Data Sources', 
        'Navigation Guide',
        'First Ocean Analysis'
      ] 
    },
    { 
      title: 'Features', 
      icon: Video, 
      items: [
        'AI Ocean Chat',
        '3D Interactive Globe', 
        'Real-time Analytics',
        'Predictive Models'
      ] 
    },
    { 
      title: 'Data & API', 
      icon: FileText, 
      items: [
        'ARGO Float Network',
        'INCOIS Integration',
        'Data Export Formats',
        'API Documentation'
      ] 
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-gray-400" />
          Help & Support
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        {helpSections.map((section, index) => (
          <div key={index}>
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <section.icon className="w-5 h-5 text-cyan-400" />
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full text-left text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-4">Need more help?</div>
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              Contact Support
            </button>
            <button className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              View Documentation
            </button>
            <button className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
              Community Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
