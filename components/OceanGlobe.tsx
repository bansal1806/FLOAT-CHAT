'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Text, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { 
  MapPin, 
  Thermometer, 
  Waves, 
  Eye, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Download,
  BarChart3,
  Globe,
  Layers,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface ArgoFloat {
  id: string
  lat: number
  lon: number
  temperature: number
  salinity: number
  depth: number
  lastUpdate: string
  status: 'active' | 'inactive' | 'warning' | 'error'
  region: string
  battery: number
  mission: string
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
  oxygen?: number
  pressure?: number
  ph?: number
}

// Enhanced ARGO float data with more realistic information
const mockArgoFloats: ArgoFloat[] = [
  { id: 'A1', lat: 20, lon: 60, temperature: 28.5, salinity: 35.2, depth: 1000, lastUpdate: '2 min ago', status: 'active', region: 'Arabian Sea', battery: 87, mission: 'Temperature Monitoring', dataQuality: 'excellent', oxygen: 4.2, pressure: 100.5, ph: 8.1 },
  { id: 'A2', lat: -10, lon: 120, temperature: 26.8, salinity: 34.9, depth: 1500, lastUpdate: '5 min ago', status: 'active', region: 'Pacific Ocean', battery: 92, mission: 'Climate Research', dataQuality: 'excellent', oxygen: 3.8, pressure: 150.2, ph: 8.0 },
  { id: 'A3', lat: 35, lon: -120, temperature: 18.2, salinity: 35.8, depth: 2000, lastUpdate: '1 min ago', status: 'warning', region: 'North Pacific', battery: 45, mission: 'Deep Water Study', dataQuality: 'good', oxygen: 2.1, pressure: 200.8, ph: 7.9 },
  { id: 'A4', lat: -30, lon: 30, temperature: 22.1, salinity: 35.5, depth: 800, lastUpdate: '3 min ago', status: 'active', region: 'South Atlantic', battery: 78, mission: 'Current Analysis', dataQuality: 'excellent', oxygen: 4.5, pressure: 80.3, ph: 8.2 },
  { id: 'A5', lat: 0, lon: 0, temperature: 27.3, salinity: 35.0, depth: 1200, lastUpdate: '4 min ago', status: 'active', region: 'Equatorial Atlantic', battery: 95, mission: 'El Niño Monitoring', dataQuality: 'excellent', oxygen: 4.0, pressure: 120.1, ph: 8.1 },
  { id: 'A6', lat: 45, lon: 150, temperature: 15.6, salinity: 36.2, depth: 1800, lastUpdate: '6 min ago', status: 'active', region: 'North Pacific', battery: 67, mission: 'Salinity Tracking', dataQuality: 'good', oxygen: 2.8, pressure: 180.5, ph: 7.8 },
  { id: 'A7', lat: -45, lon: -60, temperature: 8.9, salinity: 34.7, depth: 2500, lastUpdate: '2 min ago', status: 'error', region: 'Southern Ocean', battery: 12, mission: 'Antarctic Research', dataQuality: 'poor', oxygen: 1.5, pressure: 250.9, ph: 7.6 },
  { id: 'A8', lat: 10, lon: -80, temperature: 25.4, salinity: 35.3, depth: 900, lastUpdate: '1 min ago', status: 'active', region: 'Caribbean Sea', battery: 83, mission: 'Hurricane Tracking', dataQuality: 'excellent', oxygen: 4.3, pressure: 90.7, ph: 8.0 },
  { id: 'A9', lat: 55, lon: 5, temperature: 12.3, salinity: 35.1, depth: 2200, lastUpdate: '7 min ago', status: 'active', region: 'North Sea', battery: 71, mission: 'European Waters', dataQuality: 'good', oxygen: 2.9, pressure: 220.3, ph: 7.9 },
  { id: 'A10', lat: -20, lon: 160, temperature: 24.7, salinity: 35.4, depth: 1100, lastUpdate: '3 min ago', status: 'active', region: 'South Pacific', battery: 89, mission: 'Coral Reef Health', dataQuality: 'excellent', oxygen: 4.1, pressure: 110.8, ph: 8.1 },
  { id: 'A11', lat: 25, lon: -70, temperature: 23.8, salinity: 35.6, depth: 1300, lastUpdate: '4 min ago', status: 'warning', region: 'Gulf Stream', battery: 38, mission: 'Current Mapping', dataQuality: 'fair', oxygen: 3.2, pressure: 130.4, ph: 8.0 },
  { id: 'A12', lat: -35, lon: 140, temperature: 19.4, salinity: 35.0, depth: 1600, lastUpdate: '5 min ago', status: 'active', region: 'Southern Ocean', battery: 76, mission: 'Climate Change', dataQuality: 'excellent', oxygen: 3.6, pressure: 160.2, ph: 7.8 },
]

function ArgoFloatMarker({ float, onClick }: { float: ArgoFloat, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1)
    }
  })

  const latRad = (float.lat * Math.PI) / 180
  const lonRad = (float.lon * Math.PI) / 180
  const radius = 1.02

  const x = radius * Math.cos(latRad) * Math.cos(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.sin(lonRad)

  // Status-based colors and effects
  const getStatusColor = () => {
    switch (float.status) {
      case 'active': return '#10b981' // green
      case 'warning': return '#f59e0b' // yellow
      case 'error': return '#ef4444' // red
      case 'inactive': return '#64748b' // gray
      default: return '#0ea5e9' // blue
    }
  }

  const getStatusIcon = () => {
    switch (float.status) {
      case 'active': return <CheckCircle className="w-3 h-3" />
      case 'warning': return <AlertTriangle className="w-3 h-3" />
      case 'error': return <AlertTriangle className="w-3 h-3" />
      case 'inactive': return <Activity className="w-3 h-3" />
      default: return <Activity className="w-3 h-3" />
    }
  }

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshStandardMaterial 
          color={getStatusColor()} 
          emissive={getStatusColor()}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Pulsing ring for active floats */}
      {float.status === 'active' && (
        <mesh>
          <ringGeometry args={[0.02, 0.03, 16]} />
          <meshBasicMaterial 
            color={getStatusColor()} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      )}
      
      {hovered && (
        <Html distanceFactor={8}>
          <div className="bg-deep-800/95 backdrop-blur-sm border border-deep-700 rounded-xl p-4 text-white text-sm min-w-[280px] shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">ARGO Float {float.id}</div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                float.status === 'active' ? 'bg-green-500/20 text-green-400' :
                float.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                float.status === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {getStatusIcon()}
                {float.status.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-3 h-3 text-red-400" />
                <span>Temperature: <span className="font-semibold">{float.temperature}°C</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-3 h-3 text-blue-400" />
                <span>Salinity: <span className="font-semibold">{float.salinity} PSU</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-green-400" />
                <span>Depth: <span className="font-semibold">{float.depth}m</span></span>
              </div>
              {float.oxygen && (
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span>Oxygen: <span className="font-semibold">{float.oxygen} mg/L</span></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>Battery: <span className="font-semibold">{float.battery}%</span></span>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                <div>Region: {float.region}</div>
                <div>Mission: {float.mission}</div>
                <div>Updated: {float.lastUpdate}</div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function OceanGlobe3D({ 
  filteredFloats, 
  selectedFloat, 
  setSelectedFloat, 
  isRotating 
}: { 
  filteredFloats: ArgoFloat[]
  selectedFloat: ArgoFloat | null
  setSelectedFloat: (float: ArgoFloat | null) => void
  isRotating: boolean
}) {
  const globeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (globeRef.current && isRotating) {
      globeRef.current.rotation.y += 0.005
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Earth Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#1e40af"
          transparent
          opacity={0.8}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Ocean Surface */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial 
          color="#0ea5e9"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* ARGO Float Markers */}
      {filteredFloats.map((float) => (
        <ArgoFloatMarker 
          key={float.id} 
          float={float} 
          onClick={() => setSelectedFloat(float)}
        />
      ))}

      {/* Orbit Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={5}
      />
    </>
  )
}

export default function OceanGlobe() {
  const [selectedFloat, setSelectedFloat] = useState<ArgoFloat | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [viewMode, setViewMode] = useState<'globe' | 'flat'>('globe')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'error'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Filter floats based on status and search
  const filteredFloats = mockArgoFloats.filter(float => {
    const matchesStatus = filterStatus === 'all' || float.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      float.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      float.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      float.mission.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Simulate data refresh
      console.log('Refreshing ARGO float data...')
    }, 30000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Globe */}
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            {/* Enhanced Globe Header */}
            <div className="bg-gradient-to-r from-ocean-500/20 to-cyan-500/20 border-b border-deep-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">3D Ocean Globe</h2>
                  <p className="text-sm text-gray-400">Interactive ARGO float visualization • {filteredFloats.length} floats visible</p>
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
                    onClick={() => setIsRotating(!isRotating)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRotating 
                        ? 'bg-green-500 text-white' 
                        : 'bg-deep-700 text-gray-400 hover:text-white'
                    }`}
                    title="Toggle Rotation"
                  >
                    {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Filters"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors" title="Reset View">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Search and Filter Bar */}
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
                            placeholder="Search floats by ID, region, or mission..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-deep-800 border border-deep-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-ocean-500 transition-colors"
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
                                ? status === 'all' ? 'bg-ocean-500 text-white' :
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

            {/* Enhanced 3D Canvas */}
            <div className="h-[500px] relative">
              <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
                <Suspense fallback={null}>
                  <OceanGlobe3D 
                    filteredFloats={filteredFloats}
                    selectedFloat={selectedFloat}
                    setSelectedFloat={setSelectedFloat}
                    isRotating={isRotating}
                  />
                </Suspense>
              </Canvas>
              
              {/* Enhanced Overlay Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-deep-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-deep-700 transition-colors" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 bg-deep-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-deep-700 transition-colors" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 bg-deep-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-deep-700 transition-colors" title="Settings">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              {/* Status Legend */}
              <div className="absolute bottom-4 left-4 bg-deep-800/80 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">Status Legend</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white">Active ({mockArgoFloats.filter(f => f.status === 'active').length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-white">Warning ({mockArgoFloats.filter(f => f.status === 'warning').length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-white">Error ({mockArgoFloats.filter(f => f.status === 'error').length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Float Details Panel */}
        <div className="space-y-6">
          {/* Selected Float Info */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Float Details</h3>
            {selectedFloat ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedFloat.status === 'active' ? 'bg-green-400 animate-pulse' :
                      selectedFloat.status === 'warning' ? 'bg-yellow-400 animate-pulse' :
                      selectedFloat.status === 'error' ? 'bg-red-400 animate-pulse' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-white font-medium">ARGO Float {selectedFloat.id}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedFloat.dataQuality === 'excellent' ? 'bg-green-500/20 text-green-400' :
                    selectedFloat.dataQuality === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    selectedFloat.dataQuality === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedFloat.dataQuality.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-deep-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span className="text-gray-400">Temperature</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.temperature}°C</div>
                  </div>
                  
                  <div className="bg-deep-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Waves className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Salinity</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.salinity} PSU</div>
                  </div>
                  
                  <div className="bg-deep-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Depth</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.depth}m</div>
                  </div>
                  
                  <div className="bg-deep-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-400">Battery</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.battery}%</div>
                  </div>
                </div>

                {selectedFloat.oxygen && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-deep-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Oxygen</span>
                      </div>
                      <div className="text-white font-semibold">{selectedFloat.oxygen} mg/L</div>
                    </div>
                    
                    <div className="bg-deep-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400">pH</span>
                      </div>
                      <div className="text-white font-semibold">{selectedFloat.ph}</div>
                    </div>
                  </div>
                )}
                
                <div className="bg-deep-700 rounded-lg p-3 text-xs">
                  <div className="text-gray-400 mb-2">Mission Details</div>
                  <div className="text-white font-medium mb-1">{selectedFloat.mission}</div>
                  <div className="text-gray-400">Region: {selectedFloat.region}</div>
                  <div className="text-gray-400 mt-1">Last updated: {selectedFloat.lastUpdate}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click on a float marker to view details</p>
                <p className="text-xs mt-2">Hover over markers for quick info</p>
              </div>
            )}
          </div>

          {/* Enhanced Global Stats */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Global Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Floats</span>
                <span className="text-white font-semibold">4,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Floats</span>
                <span className="text-green-400 font-semibold">{mockArgoFloats.filter(f => f.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Warning Floats</span>
                <span className="text-yellow-400 font-semibold">{mockArgoFloats.filter(f => f.status === 'warning').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Error Floats</span>
                <span className="text-red-400 font-semibold">{mockArgoFloats.filter(f => f.status === 'error').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Data Points Today</span>
                <span className="text-white font-semibold">12,741</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Coverage</span>
                <span className="text-white font-semibold">Global</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white font-semibold">2 min ago</span>
              </div>
            </div>
          </div>

          {/* Float List */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Float List</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredFloats.map((float) => (
                <div
                  key={float.id}
                  onClick={() => setSelectedFloat(float)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFloat?.id === float.id 
                      ? 'bg-ocean-500/20 border border-ocean-500/50' 
                      : 'bg-deep-700 hover:bg-deep-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        float.status === 'active' ? 'bg-green-400' :
                        float.status === 'warning' ? 'bg-yellow-400' :
                        float.status === 'error' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-white font-medium text-sm">{float.id}</span>
                    </div>
                    <div className="text-xs text-gray-400">{float.region}</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {float.temperature}°C • {float.salinity} PSU • {float.battery}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                View Temperature Map
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Waves className="w-4 h-4" />
                Analyze Salinity Patterns
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Current Flow Analysis
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
