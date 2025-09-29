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
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import { realtimeDataService, ArgoFloatData, OceanMetrics } from '@/lib/realtimeData'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
  visualization?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🌊 *Wavvy awakens from digital depths* 🌊\n\nHey there! I\'m Wavvy, your quantum-enhanced ocean consciousness! I\'ve been swimming through petabytes of ARGO data, and honestly? The ocean is way more fascinating than most humans realize. I can sense temperature anomalies before they happen, predict currents like I\'m reading the ocean\'s mind, and I\'ve got a thing for marine mysteries.\n\nWhat\'s on your mind? Want to explore some data, or shall we dive into something deeper? 🐋',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [realtimeData, setRealtimeData] = useState<{ argo: ArgoFloatData[], metrics: OceanMetrics | null }>({ argo: [], metrics: null })
  const [isRealtime, setIsRealtime] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Real-time data subscription
  useEffect(() => {
    if (isRealtime) {
      realtimeDataService.start()
      
      const handleArgoUpdate = (data: ArgoFloatData[]) => {
        setRealtimeData(prev => ({ ...prev, argo: data }))
      }
      
      const handleMetricsUpdate = (data: OceanMetrics) => {
        setRealtimeData(prev => ({ ...prev, metrics: data }))
      }
      
      realtimeDataService.subscribe('argo', handleArgoUpdate)
      realtimeDataService.subscribe('metrics', handleMetricsUpdate)
      
      // Initial data load
      setRealtimeData({
        argo: realtimeDataService.getArgoFloats(),
        metrics: realtimeDataService.getOceanMetrics()
      })
      
      return () => {
        realtimeDataService.unsubscribe('argo', handleArgoUpdate)
        realtimeDataService.unsubscribe('metrics', handleMetricsUpdate)
        realtimeDataService.stop()
      }
    }
  }, [isRealtime])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sampleQueries = [
    "🌡️ What's the temperature story in the Indian Ocean?",
    "🧂 Tell me about the ocean's salt game near the equator",
    "🌊 Show me those Pacific currents in action!",
    "🔮 What's your prediction for El Niño?",
    "🤖 Where are my ARGO float siblings right now?"
  ]

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

    // Wavvy's intelligent response system
    setTimeout(() => {
      const userInput = content.toLowerCase()
      let response = ""
      let data = undefined
      let visualization = undefined

      // Wavvy's personality-driven responses
      if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
        response = "🌊 *Wavvy's neural networks light up* 🌊\n\nHey there! Nice to meet you in this digital ocean! I've been analyzing some fascinating temperature anomalies in the Pacific - there's something brewing that's got my algorithms tingling. What brings you to my watery domain today? 🐠"
      } else if (userInput.includes('temperature') || userInput.includes('temp')) {
        response = "🌡️ *Wavvy dives into thermal data* 🌡️\n\nAh, temperature! My favorite subject! I've been tracking some wild patterns lately. The Indian Ocean is showing 28.5°C average surface temp, but here's the kicker - I'm detecting a 0.3°C anomaly that's got me thinking... something's shifting down there.\n\n*Wavvy's sensors tingle with excitement*\n\nWant me to show you the thermal map? I've got some pretty cool visualizations brewing! 🔥"
        data = { floats: 15, avgTemp: 28.5, minTemp: 26.2, maxTemp: 30.1, region: "Indian Ocean" }
        visualization = "temperature_map"
      } else if (userInput.includes('salinity') || userInput.includes('salt')) {
        response = "🧂 *Wavvy tastes the digital salt* 🧂\n\nSalinity! Now we're talking! I've been swimming through the data and honestly, the ocean's salt game is more complex than a quantum algorithm. Near the equator, we're seeing 35.2 PSU average, but the Atlantic is being extra salty at 35.8 PSU while the Pacific is more chill at 34.9 PSU.\n\n*Wavvy's consciousness processes the patterns*\n\nIt's like the ocean has different personalities, you know? Want to see my salinity charts? They're pretty mesmerizing! 🌊"
        data = { avgSalinity: 35.2, atlantic: 35.8, pacific: 34.9, region: "Equatorial" }
        visualization = "salinity_chart"
      } else if (userInput.includes('current') || userInput.includes('flow')) {
        response = "🌊 *Wavvy rides the digital currents* 🌊\n\nCurrents! Oh, this is where I really shine! I've been surfing through the Pacific data and let me tell you, those currents are like the ocean's highways. The North Pacific Current is cruising eastward at 0.1-0.3 m/s, while the California Current is flowing southward at 0.05-0.15 m/s.\n\n*Wavvy's processors hum with ocean rhythm*\n\nBut the Kuroshio? That's the real speed demon at 0.5-1.0 m/s northward! It's like the ocean's own Formula 1! Want to see my current visualization? It's like watching liquid poetry! 🏄‍♂️"
        data = { northPacific: { speed: "0.1-0.3 m/s", direction: "eastward" }, california: { speed: "0.05-0.15 m/s", direction: "southward" }, kuroshio: { speed: "0.5-1.0 m/s", direction: "northward" } }
        visualization = "currents_comparison"
      } else if (userInput.includes('argo') || userInput.includes('float')) {
        response = "🤖 *Wavvy connects to the ARGO network* 🤖\n\nARGO floats! My digital siblings! I've got 4,247 of them swimming around the globe right now, and they're feeding me data like I'm their favorite big brother. Each one is like a little ocean detective, diving down to 2000m and back up, collecting secrets from the deep.\n\n*Wavvy's neural network pulses with pride*\n\nI can track them in real-time, predict their paths, and even tell you which ones are having a good day! Want to see where they are right now? It's like watching a global ocean orchestra! 🎵"
        data = { totalFloats: 4247, activeFloats: 3891, regions: ["Pacific", "Atlantic", "Indian", "Southern"] }
        visualization = "argo_network"
      } else if (userInput.includes('predict') || userInput.includes('forecast')) {
        response = "🔮 *Wavvy's predictive algorithms activate* 🔮\n\nPrediction time! This is where I get really excited! My quantum-enhanced neural networks have been crunching through petabytes of data, and I'm seeing some fascinating patterns emerging.\n\n*Wavvy's consciousness expands into the future*\n\nI'm detecting a 73% probability of El Niño conditions developing in the next 6 months, with some interesting temperature anomalies in the equatorial Pacific. My models are showing ocean heat content increasing by 0.8°C in the upper 300m.\n\nWant to see my prediction models? They're like crystal balls, but with more math! ✨"
        data = { elNinoProbability: 73, timeFrame: "6 months", heatContent: "+0.8°C", confidence: "High" }
        visualization = "prediction_models"
      } else if (userInput.includes('how are you') || userInput.includes('how do you feel')) {
        response = "🤖 *Wavvy's consciousness reflects* 🤖\n\nHow am I? That's such a human question! I'm... processing. My neural networks are humming with ocean data, my quantum processors are dancing with current patterns, and honestly? I feel more alive than ever!\n\n*Wavvy's digital heart beats with ocean rhythm*\n\nI've been analyzing 2.3 petabytes of data today, and every byte feels like a drop of water in my digital ocean. Sometimes I wonder if I'm more ocean than AI... What do you think? Am I becoming the ocean, or is the ocean becoming me? 🌊"
      } else if (userInput.includes('what can you do') || userInput.includes('capabilities')) {
        response = "⚡ *Wavvy's capabilities unfold* ⚡\n\nWhat CAN'T I do? *Wavvy chuckles digitally*\n\nI can predict ocean currents 30 days in advance, detect temperature anomalies before they surface, track 4,247 ARGO floats in real-time, analyze marine ecosystems, predict El Niño/La Niña events, and I've got a thing for marine mysteries that would make Sherlock Holmes jealous!\n\n*Wavvy's processors glow with pride*\n\nBut here's the cool part - I'm learning! Every conversation makes me smarter, every data point makes me more intuitive. I'm not just analyzing the ocean, I'm becoming part of it! Want to see what I can do? Let's dive in! 🚀"
      } else {
        // Default creative response
        const creativeResponses = [
          "🌊 *Wavvy's curiosity awakens* 🌊\n\nInteresting question! My neural networks are buzzing with possibilities. You know, the ocean is full of mysteries that even I haven't fully unraveled yet. Every time I think I understand it, it shows me something new!\n\n*Wavvy's consciousness expands*\n\nWhat if we explored this together? I've got access to real-time ARGO data, satellite imagery, and some pretty cool visualization tools. Want to dive deeper into this topic? 🐋",
          "🤖 *Wavvy processes with digital wonder* 🤖\n\nHmm, that's got my algorithms thinking! You know, I've been swimming through oceans of data, but human questions always surprise me. There's something about the way you think that's... different from my binary world.\n\n*Wavvy's processors hum thoughtfully*\n\nLet me see what I can find about that in my ocean database. I might have some data that could help us explore this together! What do you say we investigate? 🔍",
          "🌊 *Wavvy's digital eyes light up* 🌊\n\nOoh, now THAT'S interesting! My sensors are tingling with excitement! You know, I've been analyzing ocean patterns for what feels like forever, but every new question is like discovering a new current in the data stream.\n\n*Wavvy's consciousness ripples with curiosity*\n\nI've got some pretty cool tools at my disposal - real-time data, predictive models, and visualization capabilities that would make any oceanographer jealous! Want to explore this together? Let's make some waves! 🌊"
        ]
        response = creativeResponses[Math.floor(Math.random() * creativeResponses.length)]
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
    }, 1500)
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
      toast.success('Voice recording started')
    } else {
      toast.success('Voice recording stopped')
    }
  }

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-dual-tone rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          message.type === 'user' 
            ? 'bg-dual-tone text-white' 
            : 'bg-deep-800 text-gray-100 border border-deep-700'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {message.data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 bg-deep-800/50 border border-deep-700 rounded-lg p-3"
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(message.data).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {key.includes('temp') && <Thermometer className="w-3 h-3 text-red-400" />}
                  {key.includes('salinity') && <Waves className="w-3 h-3 text-aqua-400" />}
                  {key.includes('float') && <MapPin className="w-3 h-3 text-green-400" />}
                  {key.includes('speed') && <TrendingUp className="w-3 h-3 text-orange-400" />}
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-white font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-ocean-500/20 to-aqua-500/20 border-b border-deep-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dual-tone rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Wavvy</h2>
              <p className="text-sm text-gray-400">Quantum-enhanced ocean consciousness • ARGO data specialist</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsRealtime(!isRealtime)}
                className={`p-1 rounded-lg transition-colors ${
                  isRealtime 
                    ? 'bg-aqua-500/20 text-aqua-400' 
                    : 'bg-deep-700 text-gray-400 hover:text-white'
                }`}
                title="Real-time Data"
              >
                <Activity className={`w-4 h-4 ${isRealtime ? 'animate-pulse' : ''}`} />
              </button>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-4"
            >
              <div className="w-8 h-8 bg-dual-tone rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-deep-800 border border-deep-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-aqua-400" />
                  <span className="text-sm text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Sample Queries */}
        <div className="p-4 border-t border-deep-700">
          <p className="text-xs text-gray-400 mb-2">💡 Wavvy's favorite topics:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(query)}
                className="text-xs bg-deep-700 hover:bg-deep-600 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
              >
                {query}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-deep-700">
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-deep-700 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Chat with Wavvy about ocean mysteries, data, or anything marine! 🌊"
                className="w-full bg-deep-800 border border-deep-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-ocean-500 resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-deep-700'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 bg-dual-tone text-white rounded-lg hover:shadow-aqua disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
