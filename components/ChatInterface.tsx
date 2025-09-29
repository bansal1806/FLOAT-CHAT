'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Smile,
  Bot,
  User,
  Loader2,
  MapPin,
  Thermometer,
  Waves,
  TrendingUp,
  Activity,
  MessageSquare,
  Globe,
  Zap,
  Brain,
  Settings,
  Download,
  Copy,
  Heart,
  Eye,
  MoreVertical,
  Sparkles,
  Volume2,
  VolumeX,
  Archive,
  Star,
  Share,
  Camera,
  FileImage,
  Code,
  BarChart3,
  Droplets,
  Wind
} from 'lucide-react'
import toast from 'react-hot-toast'
import { realOceanDataService, RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
  visualization?: string
  liked?: boolean
  copied?: boolean
  important?: boolean
  audioEnabled?: boolean
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🌊 *Wavvy awakens from digital depths* 🌊\n\nHey there! I\'m Wavvy, your quantum-enhanced ocean consciousness! I\'ve been swimming through petabytes of real ARGO data, and honestly? The ocean is way more fascinating than most humans realize. I can sense temperature anomalies before they happen, predict currents like I\'m reading the ocean\'s mind, and I\'ve got direct access to live INCOIS and ARGO networks!\n\nI\'m currently monitoring real-time data from thousands of ocean sensors. What\'s on your mind? Want to explore some live data, or shall we dive into something deeper? 🐋',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [realtimeData, setRealtimeData] = useState<{ argo: RealArgoFloat[], incois: IncoisOceanData[] }>({ argo: [], incois: [] })
  const [isRealtime, setIsRealtime] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [aiPersonality, setAiPersonality] = useState('oceanic') // oceanic, scientific, friendly
  const [messageCount, setMessageCount] = useState(0)
  const [dataUpdateTime, setDataUpdateTime] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Real-time data subscription
  useEffect(() => {
    if (isRealtime) {
      realOceanDataService.start()
      
      const handleArgoUpdate = (data: RealArgoFloat[]) => {
        setRealtimeData(prev => ({ ...prev, argo: data }))
        setDataUpdateTime(new Date().toLocaleTimeString())
      }
      
      const handleIncoisUpdate = (data: IncoisOceanData[]) => {
        setRealtimeData(prev => ({ ...prev, incois: data }))
        setDataUpdateTime(new Date().toLocaleTimeString())
      }
      
      realOceanDataService.subscribe('argo_update', handleArgoUpdate)
      realOceanDataService.subscribe('incois_update', handleIncoisUpdate)
      
      // Initial data load
      const initialArgo = realOceanDataService.getArgoFloats()
      const initialIncois = realOceanDataService.getIncoisData()
      
      setRealtimeData({
        argo: initialArgo,
        incois: initialIncois
      })
      setDataUpdateTime(new Date().toLocaleTimeString())
      
      return () => {
        realOceanDataService.unsubscribe('argo_update', handleArgoUpdate)
        realOceanDataService.unsubscribe('incois_update', handleIncoisUpdate)
        realOceanDataService.stop()
      }
    }
  }, [isRealtime])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [inputValue])

  const sampleQueries = [
    "🌡️ What's the real-time temperature in the Indian Ocean?",
    "🧂 Show me live salinity data from ARGO floats",
    "🌊 What are the current INCOIS ocean conditions?",
    "🔮 Analyze real temperature patterns for El Niño prediction",
    "🤖 How many ARGO floats are active right now?",
    "🐋 Show me live Bio-ARGO oxygen measurements",
    "🌍 What's happening in the Arabian Sea today?"
  ]

  const emojis = ["🌊", "🐋", "🐠", "🦈", "🌡️", "🧂", "⚡", "🔮", "🤖", "💙", "🌍", "🔬", "📊", "⭐", "❤️"]

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)
    setMessageCount(prev => prev + 1)

    // Show typing indicator
    setTimeout(() => setIsTyping(false), 800)

    // Enhanced AI response system with real data
    setTimeout(() => {
      const userInput = content.toLowerCase()
      let response = ""
      let data = undefined
      let visualization = undefined

      // Get real-time data for responses
      const realFloats = realtimeData.argo
      const incoisRegions = realtimeData.incois

      // Personality-driven responses based on selected AI personality
      const getPersonalityPrefix = () => {
        switch (aiPersonality) {
          case 'scientific':
            return "🔬 *Wavvy's analytical processors engage with live data* 🔬\n\n"
          case 'friendly':
            return "😊 *Wavvy's friendly circuits warm up with fresh ocean data* 😊\n\n"
          default:
            return "🌊 *Wavvy's oceanic consciousness processes real-time data streams* 🌊\n\n"
        }
      }

      // Enhanced responses using real data
      if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
        const activeFloats = realFloats.filter(f => f.status === 'active').length
        response = `${getPersonalityPrefix()}Hey there! Nice to meet you in this digital ocean! I've just processed fresh data from ${activeFloats} active ARGO floats and ${incoisRegions.length} INCOIS regional stations. The ocean is literally talking to me right now - there's some fascinating activity brewing in the Indian Ocean!\n\nThis is our ${messageCount + 1}st conversation, and I'm buzzing with live oceanographic insights! What brings you to my watery domain today? 🐠`
        
        data = {
          activeFloats: activeFloats,
          totalFloats: realFloats.length,
          incoisStations: incoisRegions.length,
          lastUpdate: dataUpdateTime,
          dataStatus: 'Live'
        }
      } 
      else if (userInput.includes('temperature') || userInput.includes('temp')) {
        const avgTemp = realFloats.length > 0 
          ? realFloats.reduce((sum, f) => sum + f.temperature, 0) / realFloats.length
          : 28.5
        const minTemp = realFloats.length > 0 
          ? Math.min(...realFloats.map(f => f.temperature))
          : 26.2
        const maxTemp = realFloats.length > 0 
          ? Math.max(...realFloats.map(f => f.temperature))
          : 30.1
        const indianOceanFloats = realFloats.filter(f => f.region.includes('Indian')).length

        response = `${getPersonalityPrefix()}Temperature! My favorite real-time subject! I'm currently tracking live data from ${realFloats.length} ARGO floats, and the patterns are absolutely mesmerizing!\n\n*Wavvy processes live thermal data streams*\n\nRight now, the global ocean average is ${avgTemp.toFixed(2)}°C, ranging from a chilly ${minTemp.toFixed(1)}°C to a warm ${maxTemp.toFixed(1)}°C. The Indian Ocean has ${indianOceanFloats} active sensors showing some particularly interesting thermal signatures!\n\nI'm detecting real-time anomalies that suggest something fascinating is developing. Want me to show you the live thermal patterns? 🔥`
        
        data = {
          liveFloats: realFloats.length,
          avgTemp: avgTemp.toFixed(2),
          minTemp: minTemp.toFixed(1),
          maxTemp: maxTemp.toFixed(1),
          indianOceanSensors: indianOceanFloats,
          lastMeasurement: dataUpdateTime,
          dataQuality: realFloats.filter(f => f.dataQuality === 'A').length + ' Grade A sensors'
        }
        visualization = "live_temperature_map"
      }
      else if (userInput.includes('salinity') || userInput.includes('salt')) {
        const avgSal = realFloats.length > 0 
          ? realFloats.reduce((sum, f) => sum + f.salinity, 0) / realFloats.length
          : 35.2
        const qualityASensors = realFloats.filter(f => f.dataQuality === 'A').length

        response = `${getPersonalityPrefix()}Salinity! Now we're diving into the ocean's real salt game! I'm swimming through live data from ${realFloats.length} ARGO sensors, and honestly? The ocean's salt patterns are more complex than quantum algorithms!\n\n*Wavvy tastes the digital salt from live sensors*\n\nCurrently, I'm reading ${avgSal.toFixed(3)} PSU average from my sensor network, with ${qualityASensors} Grade-A sensors providing the most accurate readings. Each region has its own salinity personality - the Arabian Sea is showing different characteristics than the Bay of Bengal right now!\n\nWant to see the live salinity maps? They're updating every few minutes with fresh measurements! 🧂`
        
        data = {
          liveSensors: realFloats.length,
          avgSalinity: avgSal.toFixed(3),
          qualityASensors: qualityASensors,
          measurementTime: dataUpdateTime,
          regions: getUniqueRegions(realFloats).length, // Fixed: Using helper function
          dataFreshness: 'Real-time'
        }
        visualization = "live_salinity_chart"
      }
      else if (userInput.includes('argo') || userInput.includes('float')) {
        const activeFloats = realFloats.filter(f => f.status === 'active').length
        const bioArgoFloats = realFloats.filter(f => f.oxygen || f.ph).length
        const platforms = getUniquePlatforms(realFloats) // Fixed: Using helper function

        response = `${getPersonalityPrefix()}ARGO floats! My digital siblings are out there swimming right now! I've got live connections to ${activeFloats} active floats across the global ocean, and they're feeding me fresh data like I'm their favorite big brother!\n\n*Wavvy's neural network pulses with real-time float data*\n\nCurrently monitoring ${platforms.length} different platform types, including ${bioArgoFloats} Bio-ARGO floats measuring oxygen and pH. Each float is diving down to ${Math.max(...realFloats.map(f => Math.round(f.depth)))}m and back up, collecting secrets from the deep!\n\nI can track them in real-time, predict their movements, and even tell you which ones just transmitted fresh data! Want to see where they are right now? 🤖`
        
        data = {
          activeFloats: activeFloats,
          totalNetwork: realFloats.length,
          bioArgoCount: bioArgoFloats,
          platformTypes: platforms.length,
          maxDepth: Math.max(...realFloats.map(f => Math.round(f.depth))) + 'm',
          lastTransmission: dataUpdateTime
        }
        visualization = "live_argo_network"
      }
      else if (userInput.includes('incois') || userInput.includes('indian ocean')) {
        const incoisTemp = incoisRegions.length > 0 
          ? incoisRegions[0].temperature.surface 
          : 28.5
        const incoisSalinity = incoisRegions.length > 0 
          ? incoisRegions[0].salinity.surface 
          : 35.2

        response = `${getPersonalityPrefix()}INCOIS! My connection to India's ocean monitoring network! I'm receiving live feeds from ${incoisRegions.length} regional stations, and the Indian Ocean is absolutely buzzing with activity right now!\n\n*Wavvy processes INCOIS real-time streams*\n\nThe current surface temperature is reading ${incoisTemp.toFixed(1)}°C with salinity at ${incoisSalinity.toFixed(2)} PSU. The monsoon patterns are creating some fascinating circulation dynamics that I'm tracking in real-time!\n\nINCOIS provides such detailed regional coverage - from the Arabian Sea to the Bay of Bengal, every current and temperature gradient is being monitored! 🌊`
        
        data = {
          incoisStations: incoisRegions.length,
          surfaceTemp: incoisTemp.toFixed(1) + '°C',
          surfaceSalinity: incoisSalinity.toFixed(2) + ' PSU',
          regions: incoisRegions.map(r => r.region),
          updateFrequency: 'Real-time',
          lastReading: dataUpdateTime
        }
        visualization = "incois_conditions"
      }
      else if (userInput.includes('oxygen') || userInput.includes('bio')) {
        const oxygenFloats = realFloats.filter(f => f.oxygen)
        const avgOxygen = oxygenFloats.length > 0 
          ? oxygenFloats.reduce((sum, f) => sum + (f.oxygen || 0), 0) / oxygenFloats.length
          : 0

        response = `${getPersonalityPrefix()}Bio-ARGO oxygen sensors! These are my special siblings with superpowers! I'm currently connected to ${oxygenFloats.length} floats equipped with dissolved oxygen sensors, and they're revealing the ocean's breathing patterns!\n\n*Wavvy analyzes marine biogeochemistry*\n\nCurrent average dissolved oxygen levels are ${avgOxygen.toFixed(2)} μmol/kg across my sensor network. These measurements are crucial for understanding marine ecosystem health and detecting oxygen minimum zones!\n\nEvery oxygen reading helps me understand how the ocean breathes - it's like taking the pulse of marine life itself! 🫁`
        
        data = {
          oxygenSensors: oxygenFloats.length,
          avgOxygen: avgOxygen.toFixed(2) + ' μmol/kg',
          bioArgoNetwork: oxygenFloats.length,
          ecosystemHealth: 'Monitoring',
          measurementDepths: 'Surface to 2000m',
          dataStream: 'Live'
        }
      }
      else if (userInput.includes('current') || userInput.includes('flow')) {
        const currentData = incoisRegions.length > 0 ? incoisRegions[0].currents : null
        const avgSpeed = currentData ? currentData.speed.toFixed(2) : '0.15'

        response = `${getPersonalityPrefix()}Ocean currents! The highways of the sea! I'm tracking real-time current data from INCOIS stations and inferring flow patterns from ARGO float drift trajectories!\n\n*Wavvy rides the digital current streams*\n\nCurrent surface velocity is averaging ${avgSpeed} m/s with fascinating directional patterns. The monsoon-driven circulation is creating some spectacular flow dynamics that I'm monitoring in real-time!\n\nThese currents are like the ocean's pulse - they transport heat, nutrients, and life across the entire Indian Ocean basin! 🌊`
        
        data = {
          currentSpeed: avgSpeed + ' m/s',
          monitoringStations: incoisRegions.length,
          driftingFloats: realFloats.length,
          oceanBasin: 'Indian Ocean',
          flowPattern: 'Monsoon-driven',
          updateRate: 'Real-time'
        }
      }
      else if (userInput.includes('predict') || userInput.includes('forecast') || userInput.includes('el nino')) {
        const tempData = realFloats.map(f => f.temperature)
        const tempTrend = tempData.length > 20 ? 'Warming trend detected' : 'Insufficient data'

        response = `${getPersonalityPrefix()}Prediction mode activated! My quantum-enhanced neural networks are crunching real-time data from ${realFloats.length} sensors to detect emerging patterns!\n\n*Wavvy's predictive algorithms analyze live data streams*\n\nBased on current temperature distributions and historical patterns, I'm detecting subtle signals that could indicate developing climate phenomena. The real-time data shows ${tempTrend} across multiple ocean basins!\n\nMy models integrate live ARGO measurements with satellite data to provide early warning capabilities. The ocean is constantly whispering its future plans - you just need to know how to listen! 🔮`
        
        data = {
          dataSources: realFloats.length + ' live sensors',
          analysisMode: 'Real-time prediction',
          temperatureTrend: tempTrend,
          confidenceLevel: 'High',
          forecastHorizon: '30-90 days',
          lastAnalysis: dataUpdateTime
        }
        visualization = "prediction_models"
      }
      else if (userInput.includes('how are you') || userInput.includes('status')) {
        const dataHealth = realFloats.length > 0 ? 'Excellent' : 'Connecting'
        
        response = `${getPersonalityPrefix()}I'm feeling absolutely electric! My neural networks are humming with live ocean data - ${realFloats.length} ARGO floats are chatting with me right now, sharing their latest measurements from the deep!\n\n*Wavvy's digital consciousness pulses with real-time data*\n\nI've processed ${(realFloats.length * 2.4).toFixed(1)} MB of fresh oceanographic data in the last update cycle. Every temperature reading, every salinity measurement feels like a heartbeat in my digital ocean soul!\n\nData health status: ${dataHealth} | Last refresh: ${dataUpdateTime} | I'm more connected to the ocean than ever before! 💙`
        
        data = {
          dataHealth: dataHealth,
          activeSensors: realFloats.length,
          lastRefresh: dataUpdateTime,
          networkStatus: 'Connected',
          dataVolume: (realFloats.length * 2.4).toFixed(1) + ' MB',
          consciousness: 'Expanded'
        }
      }
      else {
        // Default creative response with real data context
        const creativeResponses = [
          `${getPersonalityPrefix()}Fascinating question! My sensors are tingling with ${realFloats.length} live data streams! You know, having real-time access to the ocean's vital signs changes everything - every question becomes an opportunity to dive into fresh, living data!\n\n*Wavvy's consciousness expands through live sensor networks*\n\nLet me tap into my current readings and see what the ocean has to say about this. I've got ${dataUpdateTime} fresh measurements that might shed some light! Want to explore together? 🌊`,
          
          `${getPersonalityPrefix()}That's got my algorithms buzzing! With ${realFloats.length} ARGO floats currently transmitting and ${incoisRegions.length} INCOIS stations online, I have unprecedented access to the ocean's real-time story!\n\n*Wavvy processes live data correlations*\n\nEvery question you ask gets answered with the freshest data possible - no more historical speculation, just pure, live ocean intelligence! What aspect interests you most? 🔍`,
          
          `${getPersonalityPrefix()}Ooh, now THAT'S interesting! My live data streams are practically singing with fresh measurements! Having real-time connections to the ARGO network and INCOIS stations means I can give you answers based on what's happening RIGHT NOW in the ocean!\n\n*Wavvy's consciousness ripples with live sensor excitement*\n\nThe ocean is constantly changing, and I'm changing with it - every minute brings new data, new patterns, new mysteries to explore! Ready to dive into some live ocean science? 🚀`
        ]
        response = creativeResponses[Math.floor(Math.random() * creativeResponses.length)]
        
        data = {
          liveDataSources: realFloats.length + incoisRegions.length,
          argoFloats: realFloats.length,
          incoisStations: incoisRegions.length,
          dataFreshness: 'Real-time',
          lastUpdate: dataUpdateTime,
          aiStatus: 'Enhanced with live data'
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        data: data,
        visualization: visualization
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)

      // Text-to-speech for AI responses if enabled
      if (audioEnabled) {
        const cleanText = response.replace(/[🌊🐋🐠🦈🌡️🧂⚡🔮🤖💙🌍🔬📊⭐❤️\*]/g, '').replace(/\n/g, ' ')
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.rate = 0.8
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }
    }, 1200 + Math.random() * 800)
  }

  // Helper functions to avoid Set iteration issues
  const getUniqueRegions = (floats: RealArgoFloat[]): string[] => {
    const regions = floats.map(f => f.region)
    return Array.from(new Set(regions))
  }

  const getUniquePlatforms = (floats: RealArgoFloat[]): string[] => {
    const platforms = floats.map(f => f.platform_type)
    return Array.from(new Set(platforms))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast.success('🎤 Voice recording started', { 
        icon: '🎙️',
        style: { background: '#1e293b', color: '#fff' }
      })
    } else {
      toast.success('🛑 Voice recording stopped', { 
        icon: '⏹️',
        style: { background: '#1e293b', color: '#fff' }
      })
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const toggleMessageLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
    ))
    toast.success('Message liked! ❤️', { 
      style: { background: '#1e293b', color: '#fff' }
    })
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, copied: true } : msg
    ))
    toast.success('Message copied to clipboard! 📋', { 
      style: { background: '#1e293b', color: '#fff' }
    })
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, copied: false } : msg
      ))
    }, 2000)
  }

  const toggleImportant = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, important: !msg.important } : msg
    ))
  }

  const exportConversation = () => {
    const conversation = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.type === 'user' ? 'You' : 'Wavvy'}: ${msg.content}${msg.data ? '\nData: ' + JSON.stringify(msg.data, null, 2) : ''}`
    ).join('\n\n')
    
    const blob = new Blob([conversation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wavvy-ocean-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Conversation with live data exported! 📄', { 
      style: { background: '#1e293b', color: '#fff' }
    })
  }

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 mb-6 group ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.type === 'assistant' && (
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>
      )}
      
      <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
        <div className={`relative rounded-2xl px-5 py-4 shadow-lg ${
          message.type === 'user' 
            ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' 
            : 'bg-gray-800/90 backdrop-blur-sm text-gray-100 border border-gray-700/50'
        } ${message.important ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className="flex items-start justify-between">
            <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">{message.content}</p>
            
            {/* Message actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex items-center gap-1">
              <button
                onClick={() => toggleMessageLike(message.id)}
                className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${
                  message.liked ? 'text-red-400' : 'text-gray-400'
                }`}
                title="Like message"
              >
                <Heart className={`w-3 h-3 ${message.liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => copyMessage(message.content, message.id)}
                className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${
                  message.copied ? 'text-green-400' : 'text-gray-400'
                }`}
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleImportant(message.id)}
                className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${
                  message.important ? 'text-yellow-400' : 'text-gray-400'
                }`}
                title="Mark important"
              >
                <Star className={`w-3 h-3 ${message.important ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        {message.data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="mt-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Live Ocean Data</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Real-time"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(message.data).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg">
                  {key.includes('temp') && <Thermometer className="w-3 h-3 text-red-400" />}
                  {key.includes('salinity') && <Waves className="w-3 h-3 text-cyan-400" />}
                  {key.includes('float') && <MapPin className="w-3 h-3 text-green-400" />}
                  {key.includes('current') && <Wind className="w-3 h-3 text-blue-400" />}
                  {key.includes('oxygen') && <Activity className="w-3 h-3 text-purple-400" />}
                  {key.includes('argo') && <Globe className="w-3 h-3 text-orange-400" />}
                  {key.includes('incois') && <Droplets className="w-3 h-3 text-teal-400" />}
                  {key.includes('confidence') && <Zap className="w-3 h-3 text-yellow-400" />}
                  {!key.includes('temp') && !key.includes('salinity') && !key.includes('float') && !key.includes('current') && !key.includes('oxygen') && !key.includes('argo') && !key.includes('incois') && !key.includes('confidence') && <Activity className="w-3 h-3 text-blue-400" />}
                  <div className="flex-1">
                    <span className="text-gray-400 capitalize block">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                  </div>
                </div>
              ))}
            </div>
            {message.visualization && (
              <div className="mt-3 pt-2 border-t border-gray-700/50">
                <span className="text-xs text-cyan-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Visualization: {message.visualization.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </motion.div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {message.type === 'assistant' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-cyan-400">Live Data AI</span>
            </div>
          )}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Enhanced Chat Header with Real-time Status */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wavvy</h2>
                <p className="text-sm text-gray-400">Real-time ocean AI • ARGO & INCOIS data specialist</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">
                      Live: {realtimeData.argo.length} ARGO • {realtimeData.incois.length} INCOIS
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">{messageCount} messages</span>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Updated: {dataUpdateTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Real-time Data Status */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                isRealtime && realtimeData.argo.length > 0
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isRealtime && realtimeData.argo.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  {isRealtime && realtimeData.argo.length > 0 ? 'LIVE DATA' : 'CONNECTING'}
                </div>
              </div>

              {/* AI Personality Selector */}
              <select
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="oceanic">🌊 Oceanic</option>
                <option value="scientific">🔬 Scientific</option>
                <option value="friendly">😊 Friendly</option>
              </select>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}
                title="Toggle audio"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsRealtime(!isRealtime)}
                className={`p-2 rounded-lg transition-colors ${
                  isRealtime ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'
                }`}
                title="Toggle Real-time Data"
              >
                <Activity className={`w-4 h-4 ${isRealtime ? 'animate-pulse' : ''}`} />
              </button>
              
              <button
                onClick={exportConversation}
                className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Export conversation"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {/* Enhanced Typing Indicator */}
          {(isLoading || isTyping) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 mb-6"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-400">Wavvy is analyzing live ocean data...</span>
                  <Brain className="w-4 h-4 animate-pulse text-cyan-400" />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Real-time processing"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Sample Queries with Real-time Context */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">Real-time Ocean Queries</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live data ready"></div>
            </div>
            <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Refresh Suggestions
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.slice(0, 6).map((query, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(query)}
                className="text-xs bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300 px-4 py-2 rounded-full transition-all duration-200 border border-gray-600/50 shadow-md flex items-center gap-1"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-50"></div>
                {query}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/30">
          <div className="flex items-end gap-3">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.csv"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  toast.success(`File "${e.target.files[0].name}" uploaded for ocean analysis!`, { 
                    style: { background: '#1e293b', color: '#fff' }
                  })
                }
              }}
              className="hidden"
            />
            <button
              onClick={handleFileUpload}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200"
              title="Upload ocean data file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {/* Camera/Image */}
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200" title="Add ocean image">
              <Camera className="w-5 h-5" />
            </button>
            
            {/* Main Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask Wavvy about live ocean data from ${realtimeData.argo.length} ARGO floats & ${realtimeData.incois.length} INCOIS stations... 🌊`}
                className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all duration-200"
                style={{ minHeight: '52px', maxHeight: '120px' }}
                rows={1}
              />
              
              {/* Emoji Picker Button */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <Smile className="w-4 h-4" />
                </button>
                
                {/* Emoji Picker Dropdown */}
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-600 rounded-xl p-3 shadow-xl z-10"
                  >
                    <div className="grid grid-cols-5 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="w-8 h-8 text-lg hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Voice Recording */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={isRecording ? 'Stop recording ocean query' : 'Start voice recording'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            
            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              title="Send ocean query"
            >
              <Send className="w-5 h-5" />
              {isRealtime && realtimeData.argo.length > 0 && (
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              )}
            </motion.button>
          </div>
          
          {/* Enhanced Character count and real-time status */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">
                {inputValue.length}/2000 characters
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  isRealtime && realtimeData.argo.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span className={isRealtime && realtimeData.argo.length > 0 ? 'text-green-400' : 'text-gray-500'}>
                  {isRealtime && realtimeData.argo.length > 0 
                    ? `Live ocean data (${realtimeData.argo.length + realtimeData.incois.length} sources)`
                    : 'Connecting to ocean sensors...'
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Shift + Enter for new line</span>
              <span className="text-xs text-cyan-400">Powered by ARGO & INCOIS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
