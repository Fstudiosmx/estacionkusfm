
"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción es requerida."),
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
  icon: z.enum(["Calendar", "Gift", "Trophy", "Mic"]),
});

export type CampaignFormValues = z.infer<typeof formSchema>;

export async function upsertCampaign(data: CampaignFormValues) {
  const validatedData = formSchema.parse(data);
  const { id, ...campaignData } = validatedData;
  
  const dataToSave = {
    ...campaignData,
    date: Timestamp.fromDate(campaignData.date),
  };

  try {
    if (id) {
      const campaignRef = doc(db, "campaigns", id);
      await updateDoc(campaignRef, dataToSave);
    } else {
      await addDoc(collection(db, "campaigns"), dataToSave);
    }
    revalidatePath("/panel/campaigns");
    revalidatePath("/campanas");
  } catch (error) {
    console.error("Error upserting campaign:", error);
    throw new Error("No se pudo guardar la campaña en la base de datos.");
  }
}

export async function deleteCampaign(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar la campaña.");
    }
    try {
        const campaignRef = doc(db, "campaigns", id);
        await deleteDoc(campaignRef);
        revalidatePath("/panel/campaigns");
        revalidatePath("/campanas");
    } catch (error) {
        console.error("Error deleting campaign:", error);
        throw new Error("No se pudo eliminar la campaña de la base de datos.");
    }
}
