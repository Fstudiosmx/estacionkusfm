import { cache } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SiteSettings } from '@/lib/data'

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const defaultSettings: SiteSettings = {
    streamUrl: 'https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3',
    nowPlayingUrl: 'https://radio.trabullnetwork.pro/api/nowplaying/estacionkusfm',
    historyUrl: 'https://radio.trabullnetwork.pro/api/station/estacionkusfm/history',
    showDocsLink: true,
  }

  try {
    const docRef = doc(db, 'siteSettings', 'config')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // Merge with defaults to ensure all keys are present even if some are missing from DB
      return { ...defaultSettings, ...docSnap.data() }
    } else {
      console.log('Site settings not found in Firestore, returning default settings.')
      return defaultSettings
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return defaultSettings
  }
})
