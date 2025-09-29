// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   MessageCircle, 
//   Globe, 
//   Eye, 
//   BarChart3, 
//   Brain,
//   Zap,
//   Database,
//   Settings,
//   HelpCircle,
//   Info,
//   X,
//   RefreshCw,
//   Bell,
//   Palette,
//   Globe as Language,
//   Download,
//   ExternalLink,
//   BookOpen,
//   Video,
//   FileText,
//   ChevronRight
// } from 'lucide-react'

// interface SidebarProps {
//   activeTab: string
//   setActiveTab: (tab: string) => void
// }

// export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
//   const tabs = [
//     { id: 'hero', label: 'Home', icon: Globe, color: 'text-ocean-400', bgColor: 'bg-ocean-500/20' },
//     { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-aqua-400', bgColor: 'bg-aqua-500/20' },
//     { id: 'globe', label: '3D Ocean', icon: Globe, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
//     { id: 'ar-vr', label: 'AR/VR', icon: Eye, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-green-400', bgColor: 'bg-green-500/20' },
//     { id: 'predictions', label: 'Predictions', icon: Brain, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
//   ]

//   const quickActions = [
//     { id: 'realtime', label: 'Real-time Data', icon: Zap, color: 'text-yellow-400', action: 'realtime' },
//     { id: 'database', label: 'Data Sources', icon: Database, color: 'text-indigo-400', action: 'datasources' },
//     { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400', action: 'settings' },
//     { id: 'help', label: 'Help', icon: HelpCircle, color: 'text-gray-400', action: 'help' },
//   ]

//   const [activeModal, setActiveModal] = useState<string | null>(null)
//   const [realtimeData, setRealtimeData] = useState({
//     activeFloats: 3891,
//     dataPoints: 12741,
//     lastUpdate: '2 min ago',
//     status: 'active'
//   })
//   const [settings, setSettings] = useState({
//     autoRefresh: true,
//     refreshInterval: 30,
//     notifications: true,
//     theme: 'ocean',
//     language: 'en'
//   })
//   const [liveStats, setLiveStats] = useState({
//     activeFloats: 3891,
//     dataPoints: 12741,
//     lastUpdate: '2 min ago',
//     status: 'active'
//   })

//   const handleQuickAction = (action: string) => {
//     setActiveModal(action)
//   }

//   const closeModal = () => {
//     setActiveModal(null)
//   }

//   const updateSettings = (newSettings: any) => {
//     setSettings({ ...settings, ...newSettings })
//   }

//   // Real-time data updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLiveStats(prev => ({
//         activeFloats: prev.activeFloats + Math.floor(Math.random() * 3) - 1,
//         dataPoints: prev.dataPoints + Math.floor(Math.random() * 10),
//         lastUpdate: 'just now',
//         status: 'active'
//       }))
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <aside className="fixed left-0 top-20 bottom-0 w-64 bg-deep-900/50 backdrop-blur-sm border-r border-deep-700 overflow-y-auto">
//       <div className="p-4">
//         {/* Main Navigation */}
//         <div className="mb-8">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
//             Navigation
//           </h3>
//           <nav className="space-y-2">
//             {tabs.map((tab) => (
//               <motion.button
//                 key={tab.id}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
//                   activeTab === tab.id
//                     ? `${tab.bgColor} ${tab.color} border border-current/20`
//                     : 'text-gray-400 hover:text-white hover:bg-deep-800/50'
//                 }`}
//               >
//                 <tab.icon className="w-5 h-5" />
//                 <span className="font-medium">{tab.label}</span>
//                 {activeTab === tab.id && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="ml-auto w-2 h-2 bg-current rounded-full"
//                   />
//                 )}
//               </motion.button>
//             ))}
//           </nav>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
//             Quick Actions
//           </h3>
//           <div className="space-y-2">
//             {quickActions.map((action) => (
//               <motion.button
//                 key={action.id}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => handleQuickAction(action.action)}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-deep-800/50 rounded-lg transition-all duration-200 group"
//               >
//                 <action.icon className={`w-4 h-4 ${action.color}`} />
//                 <span className="text-sm">{action.label}</span>
//                 <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {/* System Status */}
//         <div className="mb-8">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
//             System Status
//           </h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-300">AI Service</span>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-green-400">Online</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-300">Data Stream</span>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-green-400">Active</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-300">ARGO Floats</span>
//               <span className="text-xs text-aqua-400">{liveStats.activeFloats.toLocaleString()}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-300">Data Points</span>
//               <span className="text-xs text-emerald-400">{liveStats.dataPoints.toLocaleString()}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-300">Last Update</span>
//               <span className="text-xs text-gray-400">{liveStats.lastUpdate}</span>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="mb-8">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
//             Recent Activity
//           </h3>
//           <div className="space-y-3">
//             <div className="text-xs text-gray-400">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-1.5 h-1.5 bg-aqua-400 rounded-full"></div>
//                 <span>New ARGO data received</span>
//               </div>
//               <div className="text-gray-500 ml-3.5">Indian Ocean - 2 min ago</div>
//             </div>
//             <div className="text-xs text-gray-400">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-1.5 h-1.5 bg-coral-400 rounded-full"></div>
//                 <span>Temperature anomaly detected</span>
//               </div>
//               <div className="text-gray-500 ml-3.5">Pacific Ocean - 5 min ago</div>
//             </div>
//             <div className="text-xs text-gray-400">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
//                 <span>ML model updated</span>
//               </div>
//               <div className="text-gray-500 ml-3.5">Forecasting system - 10 min ago</div>
//             </div>
//           </div>
//         </div>

//         {/* Info Panel */}
//         <div className="bg-deep-800/50 border border-deep-700 rounded-lg p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Info className="w-4 h-4 text-aqua-400" />
//             <span className="text-sm font-medium text-white">Demo Mode</span>
//           </div>
//           <p className="text-xs text-gray-400">
//             This is a demonstration prototype showcasing FloatChat's capabilities. 
//             All data is simulated for presentation purposes.
//           </p>
//         </div>
//       </div>

//       {/* Modals */}
//       <AnimatePresence>
//         {activeModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={closeModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-deep-800/95 backdrop-blur-sm border border-deep-700 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {activeModal === 'realtime' && <RealtimeDataModal data={realtimeData} onClose={closeModal} />}
//               {activeModal === 'datasources' && <DataSourcesModal onClose={closeModal} />}
//               {activeModal === 'settings' && <SettingsModal settings={settings} onUpdate={updateSettings} onClose={closeModal} />}
//               {activeModal === 'help' && <HelpModal onClose={closeModal} />}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </aside>
//   )
// }

// // Real-time Data Modal
// function RealtimeDataModal({ data, onClose }: { data: any, onClose: () => void }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-white flex items-center gap-2">
//           <Zap className="w-6 h-6 text-yellow-400" />
//           Real-time Data
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-deep-700/50 rounded-lg p-4">
//             <div className="text-2xl font-bold text-aqua-400">{data.activeFloats}</div>
//             <div className="text-sm text-gray-400">Active Floats</div>
//           </div>
//           <div className="bg-deep-700/50 rounded-lg p-4">
//             <div className="text-2xl font-bold text-emerald-400">{data.dataPoints}</div>
//             <div className="text-sm text-gray-400">Data Points Today</div>
//           </div>
//         </div>
        
//         <div className="bg-deep-700/50 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-400">Last Update</span>
//             <span className="text-sm text-aqua-400">{data.lastUpdate}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-400">Status</span>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span className="text-sm text-green-400 capitalize">{data.status}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex gap-2">
//           <button className="flex-1 bg-dual-tone text-white px-4 py-2 rounded-lg hover:shadow-aqua transition-all flex items-center justify-center gap-2">
//             <RefreshCw className="w-4 h-4" />
//             Refresh Data
//           </button>
//           <button className="flex-1 bg-deep-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-deep-600 transition-all flex items-center justify-center gap-2">
//             <Download className="w-4 h-4" />
//             Export
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Data Sources Modal
// function DataSourcesModal({ onClose }: { onClose: () => void }) {
//   const dataSources = [
//     { name: 'ARGO GDAC', type: 'NetCDF', status: 'active', url: 'ftp://ftp.ifremer.fr/ifremer/argo/' },
//     { name: 'NOAA Ocean Data', type: 'API', status: 'active', url: 'https://data.nodc.noaa.gov/' },
//     { name: 'OceanSITES', type: 'NetCDF', status: 'active', url: 'https://www.ocean-ops.org/' },
//     { name: 'World Ocean Atlas', type: 'NetCDF', status: 'active', url: 'https://www.ncei.noaa.gov/data/oceans/woa/' },
//     { name: 'IOOS Data Catalog', type: 'API', status: 'maintenance', url: 'https://data.ioos.us/' },
//   ]

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-white flex items-center gap-2">
//           <Database className="w-6 h-6 text-indigo-400" />
//           Data Sources
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="space-y-3">
//         {dataSources.map((source, index) => (
//           <div key={index} className="bg-deep-700/50 rounded-lg p-4">
//             <div className="flex items-center justify-between mb-2">
//               <h4 className="text-white font-medium">{source.name}</h4>
//               <div className={`px-2 py-1 rounded-full text-xs ${
//                 source.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
//               }`}>
//                 {source.status}
//               </div>
//             </div>
//             <div className="text-sm text-gray-400 mb-2">{source.type}</div>
//             <div className="flex items-center gap-2">
//               <ExternalLink className="w-4 h-4 text-aqua-400" />
//               <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-aqua-400 hover:text-aqua-300 truncate">
//                 {source.url}
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // Settings Modal
// function SettingsModal({ settings, onUpdate, onClose }: { settings: any, onUpdate: (settings: any) => void, onClose: () => void }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-white flex items-center gap-2">
//           <Settings className="w-6 h-6 text-gray-400" />
//           Settings
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="space-y-6">
//         <div>
//           <label className="flex items-center justify-between mb-2">
//             <span className="text-white">Auto Refresh</span>
//             <input
//               type="checkbox"
//               checked={settings.autoRefresh}
//               onChange={(e) => onUpdate({ autoRefresh: e.target.checked })}
//               className="w-4 h-4 text-aqua-500 bg-deep-700 border-deep-600 rounded focus:ring-aqua-500"
//             />
//           </label>
//         </div>
        
//         <div>
//           <label className="block text-white mb-2">Refresh Interval (seconds)</label>
//           <select
//             value={settings.refreshInterval}
//             onChange={(e) => onUpdate({ refreshInterval: parseInt(e.target.value) })}
//             className="w-full bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-white focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20"
//           >
//             <option value={10}>10 seconds</option>
//             <option value={30}>30 seconds</option>
//             <option value={60}>1 minute</option>
//             <option value={300}>5 minutes</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="flex items-center justify-between mb-2">
//             <span className="text-white">Notifications</span>
//             <input
//               type="checkbox"
//               checked={settings.notifications}
//               onChange={(e) => onUpdate({ notifications: e.target.checked })}
//               className="w-4 h-4 text-aqua-500 bg-deep-700 border-deep-600 rounded focus:ring-aqua-500"
//             />
//           </label>
//         </div>
        
//         <div>
//           <label className="block text-white mb-2">Theme</label>
//           <select
//             value={settings.theme}
//             onChange={(e) => onUpdate({ theme: e.target.value })}
//             className="w-full bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-white focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20"
//           >
//             <option value="ocean">Ocean</option>
//             <option value="deep">Deep</option>
//             <option value="aqua">Aqua</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-white mb-2">Language</label>
//           <select
//             value={settings.language}
//             onChange={(e) => onUpdate({ language: e.target.value })}
//             className="w-full bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-white focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20"
//           >
//             <option value="en">English</option>
//             <option value="es">Spanish</option>
//             <option value="fr">French</option>
//             <option value="de">German</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Help Modal
// function HelpModal({ onClose }: { onClose: () => void }) {
//   const helpSections = [
//     { title: 'Getting Started', icon: BookOpen, items: ['Platform Overview', 'First Steps', 'Basic Navigation'] },
//     { title: 'Features', icon: Video, items: ['AI Chat', '3D Ocean', 'AR/VR', 'Analytics'] },
//     { title: 'Documentation', icon: FileText, items: ['API Reference', 'Data Formats', 'Troubleshooting'] },
//   ]

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-white flex items-center gap-2">
//           <HelpCircle className="w-6 h-6 text-gray-400" />
//           Help & Support
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="space-y-6">
//         {helpSections.map((section, index) => (
//           <div key={index}>
//             <h4 className="text-white font-medium mb-3 flex items-center gap-2">
//               <section.icon className="w-5 h-5 text-aqua-400" />
//               {section.title}
//             </h4>
//             <div className="space-y-2">
//               {section.items.map((item, itemIndex) => (
//                 <button
//                   key={itemIndex}
//                   className="w-full text-left text-gray-400 hover:text-white hover:bg-deep-700/50 rounded-lg px-3 py-2 transition-colors"
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
        
//         <div className="pt-4 border-t border-deep-700">
//           <div className="text-sm text-gray-400 mb-2">Need more help?</div>
//           <div className="flex gap-2">
//             <button className="flex-1 bg-dual-tone text-white px-4 py-2 rounded-lg hover:shadow-aqua transition-all">
//               Contact Support
//             </button>
//             <button className="flex-1 bg-deep-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-deep-600 transition-all">
//               View Docs
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




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
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'hero', label: 'Home', icon: Globe, color: 'text-ocean-400', bgColor: 'bg-ocean-500/20' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-aqua-400', bgColor: 'bg-aqua-500/20' },
    { id: 'globe', label: '3D Ocean', icon: Globe, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    // { id: 'ar-vr', label: 'AR/VR', icon: Eye, color: 'text-purple-400', bgColor: 'bg-purple-500/20' }, // Commented out AR/VR
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
  const [realtimeData, setRealtimeData] = useState({
    activeFloats: 3891,
    dataPoints: 12741,
    lastUpdate: '2 min ago',
    status: 'active',
  })

  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    theme: 'ocean',
    language: 'en',
  })

  const [liveStats, setLiveStats] = useState({
    activeFloats: 3891,
    dataPoints: 12741,
    lastUpdate: '2 min ago',
    status: 'active',
  })

  const handleQuickAction = (action: string) => {
    setActiveModal(action)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const updateSettings = (newSettings: any) => {
    setSettings({ ...settings, ...newSettings })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeFloats: prev.activeFloats + Math.floor(Math.random() * 3) - 1,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 10),
        lastUpdate: 'just now',
        status: 'active',
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
                onClick={() => handleQuickAction(action.action)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-deep-800/50 rounded-lg transition-all duration-200 group"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm">{action.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <span className="text-xs text-aqua-400">{liveStats.activeFloats.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Points</span>
              <span className="text-xs text-emerald-400">{liveStats.dataPoints.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Last Update</span>
              <span className="text-xs text-gray-400">{liveStats.lastUpdate}</span>
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
                <div className="w-1.5 h-1.5 bg-aqua-400 rounded-full"></div>
                <span>New ARGO data received</span>
              </div>
              <div className="text-gray-500 ml-3.5">Indian Ocean - 2 min ago</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-coral-400 rounded-full"></div>
                <span>Temperature anomaly detected</span>
              </div>
              <div className="text-gray-500 ml-3.5">Pacific Ocean - 5 min ago</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>ML model updated</span>
              </div>
              <div className="text-gray-500 ml-3.5">Forecasting system - 10 min ago</div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-deep-800/50 border border-deep-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-aqua-400" />
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


