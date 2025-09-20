'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Text, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { 
  Smartphone, 
  Eye, 
  Hand, 
  MapPin, 
  Thermometer, 
  Waves,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Camera,
  Video,
  Download,
  Zap,
  Globe,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  Layers,
  Brain,
  Database,
  Wifi,
  Battery,
  Signal,
  Compass,
  Navigation,
  Target,
  Scan,
  Focus,
  EyeOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Share,
  Bookmark,
  Star,
  Heart,
  MessageCircle,
  Users,
  Clock,
  Calendar,
  Map,
  Layers3,
  Grid3X3,
  Maximize2,
  Minimize2,
  RotateCw,
  Move,
  Grip,
  MousePointer,
  Touchpad,
  Gamepad2,
  Headphones,
  Monitor,
  Tablet,
  Smartphone as Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ARDataPoint {
  id: string
  lat: number
  lon: number
  temperature: number
  salinity: number
  depth: number
  distance: number
  status: 'active' | 'warning' | 'error' | 'inactive'
  region: string
  mission: string
  battery: number
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
  oxygen?: number
  pressure?: number
  ph?: number
  lastUpdate: string
  speed?: number
  direction?: number
  waveHeight?: number
  currentSpeed?: number
  visibility?: number
  weather?: string
  timestamp: number
}

interface ARSession {
  id: string
  startTime: number
  duration: number
  dataPoints: number
  mode: 'ar' | 'vr'
  recording: boolean
  screenshots: number
  notes: string[]
}

interface VREnvironment {
  type: 'ocean' | 'lab' | 'space' | 'underwater'
  lighting: 'day' | 'night' | 'aurora' | 'bioluminescent'
  weather: 'calm' | 'stormy' | 'foggy' | 'clear'
  depth: 'surface' | 'shallow' | 'deep' | 'abyssal'
}

export default function ARVRInterface() {
  const [mode, setMode] = useState<'ar' | 'vr'>('ar')
  const [isActive, setIsActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedData, setSelectedData] = useState<ARDataPoint | null>(null)
  const [arData, setArData] = useState<ARDataPoint[]>([])
  const [currentSession, setCurrentSession] = useState<ARSession | null>(null)
  const [vrEnvironment, setVrEnvironment] = useState<VREnvironment>({
    type: 'ocean',
    lighting: 'day',
    weather: 'calm',
    depth: 'surface'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'error'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [gestureMode, setGestureMode] = useState(false)
  const [handTracking, setHandTracking] = useState(false)
  const [eyeTracking, setEyeTracking] = useState(false)
  const [voiceCommands, setVoiceCommands] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Enhanced AR data points with real-time simulation
  const mockARData: ARDataPoint[] = [
    { 
      id: 'AR1', lat: 20.5, lon: 60.2, temperature: 28.5, salinity: 35.2, depth: 1000, distance: 150,
      status: 'active', region: 'Arabian Sea', mission: 'Temperature Monitoring', battery: 87,
      dataQuality: 'excellent', oxygen: 4.2, pressure: 100.5, ph: 8.1, lastUpdate: '2 min ago',
      speed: 0.3, direction: 45, waveHeight: 1.2, currentSpeed: 0.1, visibility: 10, weather: 'Clear',
      timestamp: Date.now()
    },
    { 
      id: 'AR2', lat: 20.3, lon: 60.1, temperature: 27.8, salinity: 35.1, depth: 1200, distance: 200,
      status: 'warning', region: 'Indian Ocean', mission: 'Climate Research', battery: 45,
      dataQuality: 'good', oxygen: 3.8, pressure: 120.2, ph: 8.0, lastUpdate: '5 min ago',
      speed: 0.2, direction: 30, waveHeight: 0.8, currentSpeed: 0.05, visibility: 8, weather: 'Partly Cloudy',
      timestamp: Date.now()
    },
    { 
      id: 'AR3', lat: 20.7, lon: 60.3, temperature: 29.1, salinity: 35.3, depth: 800, distance: 100,
      status: 'active', region: 'Persian Gulf', mission: 'Salinity Tracking', battery: 92,
      dataQuality: 'excellent', oxygen: 4.5, pressure: 80.3, ph: 8.2, lastUpdate: '1 min ago',
      speed: 0.4, direction: 60, waveHeight: 0.5, currentSpeed: 0.15, visibility: 12, weather: 'Clear',
      timestamp: Date.now()
    },
    { 
      id: 'AR4', lat: 20.4, lon: 60.0, temperature: 26.9, salinity: 34.8, depth: 1500, distance: 250,
      status: 'active', region: 'Arabian Sea', mission: 'Deep Water Study', battery: 78,
      dataQuality: 'good', oxygen: 2.9, pressure: 150.8, ph: 7.9, lastUpdate: '3 min ago',
      speed: 0.1, direction: 15, waveHeight: 1.5, currentSpeed: 0.08, visibility: 6, weather: 'Foggy',
      timestamp: Date.now()
    },
    { 
      id: 'AR5', lat: 20.6, lon: 60.4, temperature: 30.2, salinity: 35.6, depth: 600, distance: 80,
      status: 'error', region: 'Persian Gulf', mission: 'Surface Monitoring', battery: 12,
      dataQuality: 'poor', oxygen: 3.2, pressure: 60.1, ph: 7.8, lastUpdate: '10 min ago',
      speed: 0.0, direction: 0, waveHeight: 0.3, currentSpeed: 0.02, visibility: 4, weather: 'Stormy',
      timestamp: Date.now()
    }
  ]

  // Real-time data simulation
  useEffect(() => {
    if (isActive && autoRefresh) {
      const interval = setInterval(() => {
        setArData(prevData => 
          prevData.map(point => ({
            ...point,
            temperature: point.temperature + (Math.random() - 0.5) * 0.2,
            salinity: point.salinity + (Math.random() - 0.5) * 0.1,
            battery: Math.max(0, point.battery - Math.random() * 0.1),
            lastUpdate: 'Just now',
            timestamp: Date.now(),
            waveHeight: point.waveHeight! + (Math.random() - 0.5) * 0.3,
            currentSpeed: point.currentSpeed! + (Math.random() - 0.5) * 0.02,
            visibility: point.visibility! + (Math.random() - 0.5) * 1
          }))
        )
      }, 5000) // Update every 5 seconds
      
      return () => clearInterval(interval)
    }
  }, [isActive, autoRefresh])

  // Session management
  useEffect(() => {
    if (isActive && !currentSession) {
      const newSession: ARSession = {
        id: `session_${Date.now()}`,
        startTime: Date.now(),
        duration: 0,
        dataPoints: arData.length,
        mode,
        recording: isRecording,
        screenshots: 0,
        notes: []
      }
      setCurrentSession(newSession)
    }
  }, [isActive, currentSession, arData.length, mode, isRecording])

  // Session duration tracking
  useEffect(() => {
    if (currentSession && isActive) {
      const interval = setInterval(() => {
        setCurrentSession(prev => prev ? {
          ...prev,
          duration: Date.now() - prev.startTime
        } : null)
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [currentSession, isActive])

  // Filter data based on status and search
  const filteredData = arData.filter(point => {
    const matchesStatus = filterStatus === 'all' || point.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      point.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.mission.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const startAR = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: micEnabled
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setArData(mockARData)
        setIsActive(true)
        toast.success('🌊 AR mode activated! Point your camera at the ocean to see real-time data overlay.')
      } else {
        toast.error('Camera access not available')
      }
    } catch (error) {
      toast.error('Failed to access camera')
    }
  }

  const startVR = () => {
    setArData(mockARData)
    setIsActive(true)
    toast.success('🥽 VR mode activated! Put on your VR headset to dive into ocean data.')
  }

  const stopSession = () => {
    setIsActive(false)
    setIsRecording(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setCurrentSession(null)
    toast.success('Session stopped and saved')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, recording: !isRecording } : null)
    }
    toast.success(isRecording ? 'Recording stopped' : 'Recording started')
  }

  const takeScreenshot = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, screenshots: prev.screenshots + 1 } : null)
    }
    toast.success('Screenshot captured!')
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const AROverlay = () => (
    <div className="absolute inset-0 pointer-events-none">
      {/* AR Data Points with Enhanced Visuals */}
      {filteredData.map((point, index) => {
        const getStatusColor = () => {
          switch (point.status) {
            case 'active': return 'from-green-500 to-emerald-500'
            case 'warning': return 'from-yellow-500 to-orange-500'
            case 'error': return 'from-red-500 to-pink-500'
            default: return 'from-blue-500 to-cyan-500'
          }
        }

        return (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, scale: 0, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
            className="absolute"
            style={{
              left: `${15 + (index % 3) * 30}%`,
              top: `${25 + Math.floor(index / 3) * 25}%`,
            }}
          >
            <div className="relative">
              {/* Enhanced Data Point Marker */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-12 h-12 bg-gradient-to-r ${getStatusColor()} rounded-full flex items-center justify-center border-3 border-white shadow-2xl backdrop-blur-sm`}
              >
                <MapPin className="w-6 h-6 text-white drop-shadow-lg" />
              </motion.div>
              
              {/* Pulsing Ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${getStatusColor()} rounded-full`}
                style={{ zIndex: -1 }}
              />
              
              {/* Enhanced Data Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md text-white p-4 rounded-xl min-w-[280px] border border-white/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold">ARGO Float {point.id}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    point.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    point.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    point.status === 'error' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {point.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span className="font-semibold">{point.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold">{point.salinity.toFixed(1)} PSU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="font-semibold">{point.depth}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold">{point.battery.toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>{point.region}</span>
                    <span>{point.distance}m away</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {point.weather} • {point.visibility?.toFixed(0) || 'N/A'}km visibility
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
      
      {/* Enhanced AR Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 text-white border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">AR Mode Active</span>
          </div>
          <div className="text-xs text-gray-300">
            {filteredData.length} data points • {currentSession ? formatDuration(currentSession.duration) : '00:00:00'}
          </div>
          {currentSession && (
            <div className="text-xs text-gray-400 mt-1">
              Recording: {currentSession.recording ? 'ON' : 'OFF'} • Screenshots: {currentSession.screenshots}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all ${
              isRecording ? 'bg-red-500 shadow-red-500/50' : 'bg-white/20 hover:bg-white/30'
            } text-white backdrop-blur-sm shadow-lg`}
          >
            {isRecording ? <Pause className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <button 
            onClick={takeScreenshot}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm shadow-lg transition-all"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm shadow-lg transition-all"
          >
            {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Real-time Data Stream */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md rounded-xl p-3 text-white border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-sm font-semibold">Live Data Stream</span>
        </div>
        <div className="text-xs text-gray-300">
          <div>Updates: Every 5s</div>
          <div>Quality: {filteredData.filter(p => p.dataQuality === 'excellent').length}/{filteredData.length} Excellent</div>
        </div>
      </div>
    </div>
  )

  // 3D VR Components
  const VRDataPoint = ({ point, position }: { point: ARDataPoint, position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      }
    })

    const getStatusColor = () => {
      switch (point.status) {
        case 'active': return '#10b981'
        case 'warning': return '#f59e0b'
        case 'error': return '#ef4444'
        default: return '#0ea5e9'
      }
    }

    return (
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color={getStatusColor()}
            emissive={getStatusColor()}
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {hovered && (
          <Html distanceFactor={10}>
            <div className="bg-black/90 backdrop-blur-md text-white p-4 rounded-xl min-w-[300px] border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-bold">ARGO Float {point.id}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  point.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  point.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  point.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {point.status.toUpperCase()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="font-semibold">{point.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">{point.salinity.toFixed(1)} PSU</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="font-semibold">{point.depth}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold">{point.battery.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-300">
                <div>Region: {point.region}</div>
                <div>Mission: {point.mission}</div>
                <div>Weather: {point.weather}</div>
              </div>
            </div>
          </Html>
        )}
      </group>
    )
  }

  const VROceanEnvironment = () => {
    const oceanRef = useRef<THREE.Mesh>(null)
    const [selectedPoint, setSelectedPoint] = useState<ARDataPoint | null>(null)

    useFrame((state) => {
      if (oceanRef.current) {
        oceanRef.current.rotation.y += 0.001
      }
    })

    return (
      <>
        {/* Ocean Sphere */}
        <mesh ref={oceanRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            color="#0ea5e9"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Ocean Surface */}
        <mesh>
          <sphereGeometry args={[2.01, 64, 64]} />
          <meshStandardMaterial 
            color="#0ea5e9"
            transparent
            opacity={0.2}
            roughness={0.05}
            metalness={0.05}
          />
        </mesh>

        {/* VR Data Points */}
        {filteredData.map((point, index) => {
          const angle = (index / filteredData.length) * Math.PI * 2
          const radius = 2.1
          const x = Math.cos(angle) * radius
          const y = Math.sin(index * 0.5) * 0.5
          const z = Math.sin(angle) * radius
          
          return (
            <VRDataPoint 
              key={point.id} 
              point={point} 
              position={[x, y, z]} 
            />
          )
        })}

        {/* Environment Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#0ea5e9" />
      </>
    )
  }

  const VRScene = () => (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* 3D VR Environment */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <VROceanEnvironment />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* VR Overlay Controls */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-xl p-4 text-white border border-white/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">VR Mode Active</span>
        </div>
        <div className="text-xs text-gray-300">
          Environment: {vrEnvironment.type} • {vrEnvironment.lighting} • {vrEnvironment.weather}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {filteredData.length} data points • {currentSession ? formatDuration(currentSession.duration) : '00:00:00'}
        </div>
      </div>

      {/* VR Hand Tracking */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md rounded-xl p-3 text-white border border-white/20">
        <div className="flex items-center gap-2">
          <Hand className="w-4 h-4 text-green-400" />
          <span className="text-sm">Hand tracking: {handTracking ? 'ON' : 'OFF'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm">Eye tracking: {eyeTracking ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* VR Environment Controls */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md rounded-xl p-3 text-white border border-white/20">
        <div className="text-xs text-gray-300 mb-2">Environment</div>
        <div className="flex gap-2">
          <button 
            onClick={() => setVrEnvironment(prev => ({ ...prev, lighting: 'day' }))}
            className={`px-2 py-1 rounded text-xs ${vrEnvironment.lighting === 'day' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            Day
          </button>
          <button 
            onClick={() => setVrEnvironment(prev => ({ ...prev, lighting: 'night' }))}
            className={`px-2 py-1 rounded text-xs ${vrEnvironment.lighting === 'night' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            Night
          </button>
          <button 
            onClick={() => setVrEnvironment(prev => ({ ...prev, lighting: 'aurora' }))}
            className={`px-2 py-1 rounded text-xs ${vrEnvironment.lighting === 'aurora' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            Aurora
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main AR/VR Display */}
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-deep-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">AR/VR Ocean Explorer</h2>
                  <p className="text-sm text-gray-400">
                    {mode === 'ar' ? 'Augmented Reality' : 'Virtual Reality'} ocean data visualization • {filteredData.length} data points
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-300">
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`p-2 rounded-lg transition-colors ${
                        autoRefresh 
                          ? 'bg-green-500 text-white' 
                          : 'bg-deep-700 text-gray-400 hover:text-white'
                      }`}
                      title="Auto Refresh"
                    >
                      <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                      title="Filters"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowStats(!showStats)}
                      className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                      title="Statistics"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Search and Filter Bar */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-deep-700"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search ARGO floats by ID, region, or mission..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-deep-800 border border-deep-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {['all', 'active', 'warning', 'error'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              filterStatus === status
                                ? status === 'all' ? 'bg-purple-500 text-white' :
                                  status === 'active' ? 'bg-green-500 text-white' :
                                  status === 'warning' ? 'bg-yellow-500 text-white' :
                                  'bg-red-500 text-white'
                                : 'bg-deep-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced AR/VR Viewport */}
            <div className={`relative ${fullscreen ? 'h-screen' : 'h-[600px]'} bg-black`}>
              {!isActive ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    >
                      {mode === 'ar' ? <Smartphone className="w-10 h-10 text-white" /> : <Eye className="w-10 h-10 text-white" />}
                    </motion.div>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-semibold text-white mb-3"
                    >
                      {mode === 'ar' ? 'AR Mode Ready' : 'VR Mode Ready'}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-400 mb-8 max-w-md mx-auto"
                    >
                      {mode === 'ar' 
                        ? 'Point your camera at the ocean to see real-time data overlay with 3D visualizations'
                        : 'Put on your VR headset to dive into immersive ocean data environments'
                      }
                    </motion.p>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={mode === 'ar' ? startAR : startVR}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/25"
                    >
                      <Play className="w-6 h-6 inline mr-3" />
                      Start {mode === 'ar' ? 'AR' : 'VR'} Experience
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  {mode === 'ar' ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <AROverlay />
                    </div>
                  ) : (
                    <VRScene />
                  )}
                </>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="p-4 border-t border-deep-700">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('ar')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      mode === 'ar' 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-deep-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline mr-2" />
                    AR Mode
                  </button>
                  <button
                    onClick={() => setMode('vr')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      mode === 'vr' 
                        ? 'bg-purple-500 text-white shadow-lg' 
                        : 'bg-deep-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    VR Mode
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {isActive && (
                    <>
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2 rounded-lg transition-colors ${
                          soundEnabled ? 'bg-green-500 text-white' : 'bg-deep-700 text-gray-400'
                        }`}
                        title="Sound"
                      >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`p-2 rounded-lg transition-colors ${
                          micEnabled ? 'bg-blue-500 text-white' : 'bg-deep-700 text-gray-400'
                        }`}
                        title="Microphone"
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="Fullscreen"
                      >
                        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                  
                  {isActive && (
                    <button
                      onClick={stopSession}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Pause className="w-4 h-4 inline mr-2" />
                      Stop Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Control Panel */}
        <div className="space-y-6">
          {/* Session Info */}
          {currentSession && (
            <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Session Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{formatDuration(currentSession.duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Data Points</span>
                  <span className="text-white font-semibold">{currentSession.dataPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Recording</span>
                  <span className={`font-semibold ${currentSession.recording ? 'text-red-400' : 'text-gray-400'}`}>
                    {currentSession.recording ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Screenshots</span>
                  <span className="text-white font-semibold">{currentSession.screenshots}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode Features */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {mode === 'ar' ? 'AR Features' : 'VR Features'}
            </h3>
            <div className="space-y-3">
              {mode === 'ar' ? (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Real-time camera overlay</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">GPS-based data positioning</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Hand className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Touch interaction</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Video className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Session recording</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300">Real-time data updates</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Immersive 3D environment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Hand className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Hand tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Maximize className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">360° data exploration</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RotateCcw className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300">Gesture controls</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300">3D ocean visualization</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Data Points List */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Data Points ({filteredData.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredData.map((point) => (
                <div
                  key={point.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedData?.id === point.id 
                      ? 'bg-purple-500/20 border border-purple-500/50' 
                      : 'bg-deep-700 hover:bg-deep-600'
                  }`}
                  onClick={() => setSelectedData(point)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        point.status === 'active' ? 'bg-green-400' :
                        point.status === 'warning' ? 'bg-yellow-400' :
                        point.status === 'error' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-semibold text-white">Float {point.id}</span>
                    </div>
                    <span className="text-xs text-gray-400">{point.distance}m</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      <span className="text-gray-300">{point.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Waves className="w-3 h-3 text-blue-400" />
                      <span className="text-gray-300">{point.salinity.toFixed(1)} PSU</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-orange-400" />
                      <span className="text-gray-300">{point.battery.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-400" />
                      <span className="text-gray-300">{point.depth}m</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {point.region} • {point.weather}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Data Details */}
          {selectedData && (
            <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Selected Float Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="text-white font-semibold">{selectedData.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-semibold ${
                    selectedData.status === 'active' ? 'text-green-400' :
                    selectedData.status === 'warning' ? 'text-yellow-400' :
                    selectedData.status === 'error' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {selectedData.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Region</span>
                  <span className="text-white font-semibold">{selectedData.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mission</span>
                  <span className="text-white font-semibold text-sm">{selectedData.mission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Data Quality</span>
                  <span className={`font-semibold ${
                    selectedData.dataQuality === 'excellent' ? 'text-green-400' :
                    selectedData.dataQuality === 'good' ? 'text-blue-400' :
                    selectedData.dataQuality === 'fair' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedData.dataQuality.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={takeScreenshot}
                className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Screenshot
              </button>
              <button 
                onClick={toggleRecording}
                className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Session
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Share className="w-4 h-4" />
                Share Session
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Save Session
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Auto Refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoRefresh ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Sound</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Microphone</span>
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    micEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    micEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {mode === 'vr' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Hand Tracking</span>
                    <button
                      onClick={() => setHandTracking(!handTracking)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        handTracking ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        handTracking ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Eye Tracking</span>
                    <button
                      onClick={() => setEyeTracking(!eyeTracking)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        eyeTracking ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        eyeTracking ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
