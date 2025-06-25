
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/data";

export const siteSettingsSchema = z.object({
    radioProvider: z.enum(["azuracast", "zenofm", "live365"]),
    streamUrl: z.string().url("Debe ser una URL de streaming válida.").or(z.literal('')),
    
    azuracastBaseUrl: z.string().url("Debe ser una URL base válida.").optional().or(z.literal('')),
    azuracastStationId: z.string().optional().or(z.literal('')),
    azuracastApiKey: z.string().optional().or(z.literal('')),

    zenoStationUuid: z.string().optional().or(z.literal('')),
    live365StationId: z.string().optional().or(z.literal('')),

    showDocsLink: z.boolean(),

    hlsStreamUrl: z.string().url("Debe ser una URL HLS válida.").optional().or(z.literal('')),
    streamServer: z.string().optional().or(z.literal('')),
    streamPort: z.string().optional().or(z.literal('')),
    streamPassword: z.string().optional().or(z.literal('')),
    learningSpaceAccessCode: z.string().min(4, "El código debe tener al menos 4 caracteres").optional().or(z.literal('')),
});

export type SiteSettingsSchema = z.infer<typeof siteSettingsSchema>;

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
