// components/OceanGlobeReal.tsx
'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { realOceanDataService, RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'
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
  Filter,
  Search,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Zap,
  BarChart3,
  Droplets,
  Wind
} from 'lucide-react'

function EarthModel(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF('/models/earth.glb')
  return <primitive object={scene} {...props} />
}

function RealArgoFloatMarker({ float, onClick }: { float: RealArgoFloat; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(hovered ? 1.8 : 1)
    }
  })

  const latRad = (float.lat * Math.PI) / 180
  const lonRad = (float.lon * Math.PI) / 180
  const radius = 1.0

  const x = radius * Math.cos(latRad) * Math.cos(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.sin(lonRad)

  const statusColors = {
    active: '#10b981',
    warning: '#f59c00',
    error: '#ef4444',
    inactive: '#64748b',
  }

  const qualityColors = {
    'A': '#10b981', // Excellent
    'B': '#3b82f6', // Good
    'C': '#f59c00', // Fair
    'D': '#ef4444'  // Poor
  }

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={qualityColors[float.dataQuality]}
          emissive={statusColors[float.status]}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Real-time data indicator */}
      {float.status === 'active' && (
        <mesh>
          <ringGeometry args={[0.03, 0.04, 16]} />
          <meshBasicMaterial 
            color={statusColors[float.status]} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {hovered && (
        <Html distanceFactor={8} occlude>
          <div className="bg-black bg-opacity-90 text-white rounded-xl p-4 text-xs shadow-2xl pointer-events-none min-w-[320px] border border-cyan-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-lg text-cyan-400">ARGO {float.wmo_number}</div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                float.status === 'active' ? 'bg-green-500/20 text-green-400' :
                float.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                float.status === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {float.status === 'active' && <CheckCircle className="w-3 h-3" />}
                {(float.status === 'warning' || float.status === 'error') && <AlertTriangle className="w-3 h-3" />}
                {float.status === 'inactive' && <Activity className="w-3 h-3" />}
                <span>{float.status.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-400" />
                <span>Temp: <span className="font-semibold text-red-300">{float.temperature.toFixed(2)}°C</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Sal: <span className="font-semibold text-blue-300">{float.salinity.toFixed(3)} PSU</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>Depth: <span className="font-semibold text-green-300">{Math.round(float.depth)}m</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span>Press: <span className="font-semibold text-orange-300">{float.pressure.toFixed(1)} dbar</span></span>
              </div>
              {float.oxygen && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>O₂: <span className="font-semibold text-purple-300">{float.oxygen.toFixed(2)} μmol/kg</span></span>
                </div>
              )}
              {float.ph && (
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-pink-400" />
                  <span>pH: <span className="font-semibold text-pink-300">{float.ph.toFixed(3)}</span></span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-600 pt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="text-white font-medium">{float.platform_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cycle:</span>
                <span className="text-white font-medium">{float.cycle_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quality:</span>
                <span className={`font-medium ${
                  float.dataQuality === 'A' ? 'text-green-400' :
                  float.dataQuality === 'B' ? 'text-blue-400' :
                  float.dataQuality === 'C' ? 'text-yellow-400' : 'text-red-400'
                }`}>Grade {float.dataQuality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Region:</span>
                <span className="text-cyan-300 font-medium">{float.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Battery:</span>
                <span className="text-green-300 font-medium">{Math.round(float.battery)}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last Update: {new Date(float.lastUpdate).toLocaleString()}
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
  isRotating,
}: {
  filteredFloats: RealArgoFloat[]
  selectedFloat: RealArgoFloat | null
  setSelectedFloat: React.Dispatch<React.SetStateAction<RealArgoFloat | null>>
  isRotating: boolean
}) {
  const earthRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (earthRef.current && isRotating) {
      earthRef.current.rotation.y += 0.002
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0ea5e9" />
      <group ref={earthRef}>
        <EarthModel scale={[1, 1, 1]} />
        {filteredFloats.map(float => (
          <RealArgoFloatMarker key={float.id} float={float} onClick={() => setSelectedFloat(float)} />
        ))}
      </group>
      <OrbitControls enablePan enableZoom enableRotate minDistance={1.2} maxDistance={6} />
    </>
  )
}

export default function RealOceanGlobe() {
  const [selectedFloat, setSelectedFloat] = useState<RealArgoFloat | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'error' | 'inactive'>('all')
  const [filterQuality, setFilterQuality] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [realArgoFloats, setRealArgoFloats] = useState<RealArgoFloat[]>([])
  const [incoisData, setIncoisData] = useState<IncoisOceanData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Subscribe to real-time data
  useEffect(() => {
    realOceanDataService.start()

    const handleArgoUpdate = (data: RealArgoFloat[]) => {
      setRealArgoFloats(data)
      setLastUpdate(new Date().toLocaleString())
      setIsLoading(false)
    }

    const handleIncoisUpdate = (data: IncoisOceanData[]) => {
      setIncoisData(data)
    }

    realOceanDataService.subscribe('argo_update', handleArgoUpdate)
    realOceanDataService.subscribe('incois_update', handleIncoisUpdate)

    // Initial data load
    const initialArgo = realOceanDataService.getArgoFloats()
    const initialIncois = realOceanDataService.getIncoisData()
    
    if (initialArgo.length > 0) {
      setRealArgoFloats(initialArgo)
      setLastUpdate(new Date().toLocaleString())
      setIsLoading(false)
    }
    setIncoisData(initialIncois)

    return () => {
      realOceanDataService.unsubscribe('argo_update', handleArgoUpdate)
      realOceanDataService.unsubscribe('incois_update', handleIncoisUpdate)
      realOceanDataService.stop()
    }
  }, [])

  // Filter floats based on status, quality, and search
  const filteredFloats = realArgoFloats.filter(float => {
    const matchesStatus = filterStatus === 'all' || float.status === filterStatus
    const matchesQuality = filterQuality === 'all' || float.dataQuality === filterQuality
    const matchesSearch =
      searchQuery === '' ||
      float.wmo_number.includes(searchQuery) ||
      float.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      float.platform_type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesQuality && matchesSearch
  })

  const refreshData = async () => {
    setIsLoading(true)
    await realOceanDataService.start() // This will trigger new data fetch
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Globe Section */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-gray-700/50 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                  Real-Time Ocean Globe
                </h2>
                <p className="text-sm text-gray-400">
                  Live ARGO & INCOIS data • {filteredFloats.length} floats visible • Updated {lastUpdate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isLoading ? 'bg-gray-700 text-gray-500' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRotating ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                  title="Toggle Rotation"
                >
                  {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                  title="Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Enhanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-gray-700/50 p-4 bg-gray-800/30"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by WMO number, region, or platform type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Status:</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Quality:</label>
                        <select
                          value={filterQuality}
                          onChange={(e) => setFilterQuality(e.target.value as any)}
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
                        >
                          <option value="all">All Grades</option>
                          <option value="A">Grade A (Excellent)</option>
                          <option value="B">Grade B (Good)</option>
                          <option value="C">Grade C (Fair)</option>
                          <option value="D">Grade D (Poor)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-[600px] relative">
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-2" />
                    <p className="text-white">Loading real-time ocean data...</p>
                  </div>
                </div>
              )}
              
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

              {/* Real-time Status Legend */}
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Real-time Status
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white">Active ({realArgoFloats.filter(f => f.status === 'active').length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-white">Warning ({realArgoFloats.filter(f => f.status === 'warning').length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-white">Error ({realArgoFloats.filter(f => f.status === 'error').length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-white">Inactive ({realArgoFloats.filter(f => f.status === 'inactive').length})</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-700">
                  Data sources: ARGO • INCOIS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar with Real Data */}
        <div className="space-y-6">
          {/* Real-time Float Details */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Float Data
            </h3>
            {selectedFloat ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full animate-pulse ${
                      selectedFloat.status === 'active' ? 'bg-green-400' :
                      selectedFloat.status === 'warning' ? 'bg-yellow-400' :
                      selectedFloat.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-white font-medium">WMO {selectedFloat.wmo_number}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedFloat.dataQuality === 'A' ? 'bg-green-500/20 text-green-400' :
                    selectedFloat.dataQuality === 'B' ? 'bg-blue-500/20 text-blue-400' :
                    selectedFloat.dataQuality === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    Grade {selectedFloat.dataQuality}
                  </div>
                </div>

                {/* Real measurements */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span className="text-gray-400">Temperature</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.temperature.toFixed(2)}°C</div>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Salinity</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.salinity.toFixed(3)} PSU</div>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Depth</span>
                    </div>
                    <div className="text-white font-semibold">{Math.round(selectedFloat.depth)}m</div>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-400">Pressure</span>
                    </div>
                    <div className="text-white font-semibold">{selectedFloat.pressure.toFixed(1)} dbar</div>
                  </div>
                </div>

                {/* Additional sensors if available */}
                {(selectedFloat.oxygen || selectedFloat.ph) && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedFloat.oxygen && (
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-400">Oxygen</span>
                        </div>
                        <div className="text-white font-semibold">{selectedFloat.oxygen.toFixed(2)} μmol/kg</div>
                      </div>
                    )}
                    {selectedFloat.ph && (
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                          <span className="text-gray-400">pH</span>
                        </div>
                        <div className="text-white font-semibold">{selectedFloat.ph.toFixed(3)}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Platform information */}
                <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 text-xs">
                  <div className="text-gray-400 mb-2">Platform Information</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-medium">{selectedFloat.platform_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cycle:</span>
                      <span className="text-white font-medium">{selectedFloat.cycle_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Direction:</span>
                      <span className="text-white font-medium">{selectedFloat.profile_direction === 'A' ? 'Ascending' : 'Descending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Positioning:</span>
                      <span className="text-white font-medium">{selectedFloat.positioning_system}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Region:</span>
                      <span className="text-cyan-300 font-medium">{selectedFloat.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Battery:</span>
                      <span className="text-green-300 font-medium">{Math.round(selectedFloat.battery)}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
                    Last Update: {new Date(selectedFloat.lastUpdate).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click on a float marker to view live data</p>
                <p className="text-xs mt-2">Real-time ARGO measurements</p>
              </div>
            )}
          </div>

          {/* Real-time Statistics */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Live Ocean Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Floats</span>
                <span className="text-green-400 font-semibold animate-pulse">
                  {realArgoFloats.filter(f => f.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Global Avg Temp</span>
                <span className="text-red-400 font-semibold">
                  {(realArgoFloats.reduce((sum, f) => sum + f.temperature, 0) / realArgoFloats.length || 0).toFixed(2)}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Global Avg Salinity</span>
                <span className="text-blue-400 font-semibold">
                  {(realArgoFloats.reduce((sum, f) => sum + f.salinity, 0) / realArgoFloats.length || 0).toFixed(3)} PSU
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Quality A Floats</span>
                <span className="text-white font-semibold">
                  {realArgoFloats.filter(f => f.dataQuality === 'A').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bio-Argo Floats</span>
                <span className="text-purple-400 font-semibold">
                  {realArgoFloats.filter(f => f.oxygen || f.ph).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Indian Ocean</span>
                <span className="text-cyan-400 font-semibold">
                  {realArgoFloats.filter(f => f.region.includes('Indian')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Refresh</span>
                <span className="text-white font-semibold text-xs">{lastUpdate}</span>
              </div>
            </div>
            
            {/* Data source info */}
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live ARGO Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>INCOIS Ocean Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* INCOIS Regional Data */}
          {incoisData.length > 0 && (
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-400" />
                INCOIS Conditions
              </h3>
              <div className="space-y-3">
                {incoisData.slice(0, 2).map((region, index) => (
                  <div key={index} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="font-medium text-white mb-2">{region.region}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SST:</span>
                        <span className="text-red-300">{region.temperature.surface.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SSS:</span>
                        <span className="text-blue-300">{region.salinity.surface.toFixed(2)} PSU</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current:</span>
                        <span className="text-green-300">{region.currents.speed.toFixed(2)} m/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wave:</span>
                        <span className="text-purple-300">{region.waves.significant_height.toFixed(1)} m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
