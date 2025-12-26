// pages/api/ocean-data/incois.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@/lib/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // INCOIS doesn't have direct public API, so we'll simulate calls to their data endpoints
    // In production, you'd coordinate with INCOIS for API access

    const regions = [
      {
        id: 'arabian_sea',
        name: 'Arabian Sea',
        bounds: { lat: [10, 25], lon: [60, 75] }
      },
      {
        id: 'bay_of_bengal',
        name: 'Bay of Bengal',
        bounds: { lat: [5, 22], lon: [80, 95] }
      }
    ]

    // Simulate INCOIS data structure
    const incoisData = regions.map(region => ({
      region_name: region.name,
      sst: (26 + Math.random() * 6).toFixed(2),
      sss: (34.5 + Math.random()).toFixed(2),
      u_current: ((Math.random() - 0.5) * 2).toFixed(3),
      v_current: ((Math.random() - 0.5) * 2).toFixed(3),
      current_speed: (Math.random() * 1.5).toFixed(3),
      current_dir: (Math.random() * 360).toFixed(1),
      wave_height: (1 + Math.random() * 3).toFixed(2),
      wave_period: (6 + Math.random() * 6).toFixed(1),
      wave_dir: (Math.random() * 360).toFixed(1),
      timestamp: new Date().toISOString(),
      // Add depth profiles
      temp_profile: Array.from({ length: 20 }, (_, i) => (28 - i * 1.2 + Math.random() * 2).toFixed(2)),
      sal_profile: Array.from({ length: 20 }, (_, i) => (34.7 + Math.random() * 0.5).toFixed(2)),
      depths: Array.from({ length: 20 }, (_, i) => i * 50)
    }))

    res.status(200).json(incoisData)
  } catch (error) {
    logger.error('INCOIS API Error', error as Error, { endpoint: '/api/ocean-data/incois' })
    res.status(500).json({ error: 'Failed to fetch INCOIS data' })
  }
}

