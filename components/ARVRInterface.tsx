'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { realtimeDataService, ArgoFloatData } from '@/lib/realtimeData'
import {
  MapPin,
  Thermometer,
  Waves,
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  RotateCcw,
  RefreshCw,
  Filter,
  Search,
  Pause,
  Play,
  Download
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

// Sample/mock floats data for fallback
const mockArgoFloats: ArgoFloat[] = [
  { id: 'A1', lat: 20, lon: 60, temperature: 28.5, salinity: 35.2, depth: 1000, lastUpdate: '2 min ago', status: 'active', region: 'Arabian Sea', battery: 87, mission: 'Temperature Monitoring', dataQuality: 'excellent', oxygen: 4.2, pressure: 100.5, ph: 8.1 },
  { id: 'A2', lat: -10, lon: 120, temperature: 26.8, salinity: 34.9, depth: 1500, lastUpdate: '5 min ago', status: 'active', region: 'Pacific Ocean', battery: 92, mission: 'Climate Research', dataQuality: 'excellent', oxygen: 3.8, pressure: 150.2, ph: 8.0 },
  { id: 'A3', lat: 35, lon: -120, temperature: 18.2, salinity: 35.8, depth: 2000, lastUpdate: '1 min ago', status: 'warning', region: 'North Pacific', battery: 45, mission: 'Deep Water Study', dataQuality: 'good', oxygen: 2.1, pressure: 200.8, ph: 7.9 },
  // more floats...
]

function ArgoFloatMarker({ float, onClick }: { float: ArgoFloat, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1)
    }
  })

  // Convert lat/lon to 3D globe coordinates
  const latRad = (float.lat * Math.PI) / 180
  const lonRad = (float.lon * Math.PI) / 180
  const radius = 1.02

  const x = radius * Math.cos(latRad) * Math.cos(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.sin(lonRad)

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

  useFrame(() => {
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

export default function ARInterface() {
  const [selectedFloat, setSelectedFloat] = useState<ArgoFloat | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'error'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [realtimeFloats, setRealtimeFloats] = useState<ArgoFloatData[]>([])
  const [isRealtime, setIsRealtime] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Real-time subscription for floats
  useEffect(() => {
    if (isRealtime) {
      realtimeDataService.start()

      const handleArgoUpdate = (data: ArgoFloatData[]) => {
        setRealtimeFloats(data)
      }

      realtimeDataService.subscribe('argo', handleArgoUpdate)

      setRealtimeFloats(realtimeDataService.getArgoFloats())

      return () => {
        realtimeDataService.unsubscribe('argo', handleArgoUpdate)
        realtimeDataService.stop()
      }
    }
  }, [isRealtime])

  // Convert real-time data to ArgoFloat format
  const convertToArgoFloat = (data: ArgoFloatData): ArgoFloat => ({
    id: data.id,
    lat: data.lat,
    lon: data.lon,
    temperature: data.temperature,
    salinity: data.salinity,
    depth: data.depth,
    lastUpdate: data.lastUpdate,
    status: data.status,
    region: data.region,
    battery: data.battery,
    mission: data.mission,
    dataQuality: data.dataQuality,
    oxygen: data.oxygen,
    pressure: data.pressure,
    ph: data.ph
  })

  const currentFloats = isRealtime && realtimeFloats.length > 0 
    ? realtimeFloats.map(convertToArgoFloat)
    : mockArgoFloats

  // Filter floats by status and search query
  const filteredFloats = currentFloats.filter(float => {
    const matchesStatus = filterStatus === 'all' || float.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      float.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      float.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      float.mission.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Auto refresh data every 60 seconds
  useEffect(() => {
    if (!autoRefresh || !isRealtime) return

    const interval = setInterval(() => {
      // Could insert logic for refreshing data here if needed
    }, 60000)

    return () => clearInterval(interval)
  }, [autoRefresh, isRealtime])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Globe Display */}
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-ocean-500/20 to-aqua-500/20 border-b border-deep-700 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">3D Ocean Globe</h2>
                <p className="text-sm text-gray-400">
                  Interactive ARGO float visualization • {filteredFloats.length} floats visible
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsRealtime(!isRealtime)}
                  className={`p-2 rounded-lg transition-colors ${isRealtime ? 'bg-aqua-500 text-white' : 'bg-deep-700 text-gray-400 hover:text-white'}`}
                  title="Real-time Data"
                >
                  <Activity className={`w-4 h-4 ${isRealtime ? 'animate-pulse' : ''}`} />
                </button>

                <button 
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${autoRefresh ? 'bg-green-500 text-white' : 'bg-deep-700 text-gray-400 hover:text-white'}`}
                  title="Auto Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-2 rounded-lg transition-colors ${isRotating ? 'bg-green-500 text-white' : 'bg-deep-700 text-gray-400 hover:text-white'}`}
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

            {/* Search and Filters */}
            {showFilters && (
              <div className="p-4 border-t border-deep-700 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Search floats by ID, region, or mission..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-deep-800 border border-aqua-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  {['all', 'active', 'warning', 'error'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? status === 'all' ? 'bg-dual-tone text-white' :
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
            )}

            {/* 3D Canvas */}
            <div style={{ height: '600px' }}>
              <Canvas>
                <Suspense fallback={null}>
                  <OceanGlobe3D 
                    filteredFloats={filteredFloats}
                    selectedFloat={selectedFloat}
                    setSelectedFloat={setSelectedFloat}
                    isRotating={isRotating}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>

        {/* Float Detail Panel */}
        <div className="space-y-6">
          {selectedFloat ? (
            <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4 text-white overflow-y-auto max-h-[600px]">
              <h3 className="text-xl font-semibold mb-3">ARGO Float Details</h3>
              <p><strong>ID:</strong> {selectedFloat.id}</p>
              <p><strong>Location:</strong> {selectedFloat.lat.toFixed(2)}, {selectedFloat.lon.toFixed(2)}</p>
              <p><strong>Region:</strong> {selectedFloat.region}</p>
              <p><strong>Status:</strong> {selectedFloat.status.toUpperCase()}</p>
              <p><strong>Temperature:</strong> {selectedFloat.temperature} °C</p>
              <p><strong>Salinity:</strong> {selectedFloat.salinity} PSU</p>
              <p><strong>Depth:</strong> {selectedFloat.depth} m</p>
              <p><strong>Battery:</strong> {selectedFloat.battery} %</p>
              <p><strong>Last Updated:</strong> {selectedFloat.lastUpdate}</p>
              <p><strong>Mission:</strong> {selectedFloat.mission}</p>
              {selectedFloat.oxygen && <p><strong>Oxygen:</strong> {selectedFloat.oxygen} mg/L</p>}
              {selectedFloat.pressure && <p><strong>Pressure:</strong> {selectedFloat.pressure} dBar</p>}
              {selectedFloat.ph && <p><strong>pH Level:</strong> {selectedFloat.ph}</p>}
            </div>
          ) : (
            <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4 text-gray-400 flex items-center justify-center min-h-[600px]">
              <p>Select a float marker to see detailed information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
