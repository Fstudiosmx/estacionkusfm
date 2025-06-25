"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { siteSettingsSchema, type SiteSettings } from "@/lib/data";

const defaultSettings: SiteSettings = {
    radioProvider: 'azuracast',
    streamUrl: 'https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3',
    azuracastBaseUrl: 'https://radio.trabullnetwork.pro',
    azuracastStationId: 'estacionkusfm',
    azuracastApiKey: '',
    zenoStationUuid: '',
    live365StationId: '',
    showDocsLink: true,
    hlsStreamUrl: '',
    streamServer: '',
    streamPort: '',
    streamPassword: '',
    learningSpaceAccessCode: 'KUSFMLAB'
};

/**
 * Retrieves site settings from Firestore.
 * Returns default settings if no document is found.
 */
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'config');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultSettings, ...docSnap.data() } as SiteSettings;
    } else {
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error getting site settings:", error);
    return defaultSettings;
  }
}


/**
 * Creates or updates the site settings in Firestore.
 * @param data The settings data to save.
 */
export async function upsertSiteSettings(data: SiteSettings) {
  const validatedData = siteSettingsSchema.parse(data);
  
  try {
    const settingsRef = doc(db, "siteSettings", "config");
    await setDoc(settingsRef, validatedData, { merge: true });

    revalidatePath("/", "layout");

  } catch (error) {
    console.error("Error upserting site settings:", error);
    throw new Error("No se pudo guardar la configuración en la base de datos.");
  }
}
