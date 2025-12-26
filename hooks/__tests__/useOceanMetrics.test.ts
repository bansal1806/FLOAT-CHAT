// hooks/__tests__/useOceanMetrics.test.ts
import { renderHook } from '@testing-library/react'
import { useOceanMetrics } from '../useOceanMetrics'
import { RealArgoFloat } from '@/lib/realOceanData'

describe('useOceanMetrics', () => {
    const createMockFloat = (overrides?: Partial<RealArgoFloat>): RealArgoFloat => ({
        id: 'test-1',
        wmo_number: '39001',
        lat: 10,
        lon: 60,
        temperature: 25,
        salinity: 35,
        pressure: 100,
        depth: 100,
        lastUpdate: new Date().toISOString(),
        status: 'active',
        region: 'Arabian Sea',
        battery: 80,
        mission: 'Test Mission',
        dataQuality: 'A',
        platform_type: 'APEX',
        cycle_number: 1,
        positioning_system: 'ARGOS',
        profile_direction: 'A',
        ...overrides
    })

    it('should return zero metrics for empty array', () => {
        const { result } = renderHook(() => useOceanMetrics([]))

        expect(result.current.globalTemp).toBe(0)
        expect(result.current.globalSalinity).toBe(0)
        expect(result.current.activeFloats).toBe(0)
        expect(result.current.totalFloats).toBe(0)
    })

    it('should calculate correct global metrics', () => {
        const floats = [
            createMockFloat({ temperature: 20, salinity: 34 }),
            createMockFloat({ temperature: 30, salinity: 36 })
        ]

        const { result } = renderHook(() => useOceanMetrics(floats))

        expect(result.current.globalTemp).toBe(25) // (20 + 30) / 2
        expect(result.current.globalSalinity).toBe(35) // (34 + 36) / 2
        expect(result.current.totalFloats).toBe(2)
    })

    it('should count active floats correctly', () => {
        const floats = [
            createMockFloat({ status: 'active' }),
            createMockFloat({ status: 'inactive' }),
            createMockFloat({ status: 'active' })
        ]

        const { result } = renderHook(() => useOceanMetrics(floats))
        expect(result.current.activeFloats).toBe(2)
    })

    it('should count data quality A floats', () => {
        const floats = [
            createMockFloat({ dataQuality: 'A' }),
            createMockFloat({ dataQuality: 'B' }),
            createMockFloat({ dataQuality: 'A' })
        ]

        const { result } = renderHook(() => useOceanMetrics(floats))
        expect(result.current.dataQualityA).toBe(2)
    })

    it('should count Bio-ARGO floats', () => {
        const floats = [
            createMockFloat({ oxygen: 5.0 }),
            createMockFloat({ ph: 8.1 }),
            createMockFloat({}) // no bio sensors
        ]

        const { result } = renderHook(() => useOceanMetrics(floats))
        expect(result.current.bioArgoCount).toBe(2)
    })

    it('should calculate regional metrics', () => {
        const floats = [
            createMockFloat({ region: 'Arabian Sea', temperature: 28, salinity: 35.5 }),
            createMockFloat({ region: 'Arabian Sea', temperature: 30, salinity: 36.5 }),
            createMockFloat({ region: 'Bay of Bengal', temperature: 26, salinity: 34 })
        ]

        const { result } = renderHook(() => useOceanMetrics(floats))

        expect(result.current.regions['Arabian Sea']).toBeDefined()
        expect(result.current.regions['Arabian Sea'].floatCount).toBe(2)
        expect(result.current.regions['Arabian Sea'].avgTemp).toBe(29)
        expect(result.current.regions['Bay of Bengal']).toBeDefined()
        expect(result.current.regions['Bay of Bengal'].floatCount).toBe(1)
    })
})
