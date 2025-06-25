
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const siteSettingsSchema = z.object({
    streamUrl: z.string().url("Debe ser una URL de streaming válida."),
    nowPlayingUrl: z.string().url("Debe ser una URL de API válida."),
    historyUrl: z.string().url("Debe ser una URL de API válida."),
    showDocsLink: z.boolean(),
});

export type SiteSettingsSchema = z.infer<typeof siteSettingsSchema>;

const defaultSettings: SiteSettingsSchema = {
    streamUrl: 'https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3',
    nowPlayingUrl: 'https://radio.trabullnetwork.pro/api/nowplaying/estacionkusfm',
    historyUrl: 'https://radio.trabullnetwork.pro/api/station/estacionkusfm/history',
    showDocsLink: true,
};

/**
 * Retrieves site settings from Firestore.
 * Returns default settings if no document is found.
 */
export async function getSiteSettings(): Promise<SiteSettingsSchema> {
  try {
    const docRef = doc(db, 'siteSettings', 'config');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultSettings, ...docSnap.data() } as SiteSettingsSchema;
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
export async function upsertSiteSettings(data: SiteSettingsSchema) {
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
