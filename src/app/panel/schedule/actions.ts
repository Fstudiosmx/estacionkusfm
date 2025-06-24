"use server";

import { z } from "zod";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import type { Program } from "@/lib/data";

export const programSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "El formato debe ser HH:MM - HH:MM"),
  title: z.string().min(2, "El título es requerido."),
  host: z.string().min(2, "El presentador es requerido."),
});

export async function updateDaySchedule(day: string, schedule: Program[]) {
  if (!day) {
    throw new Error("El día es requerido.");
  }

  // Validar cada programa en el array
  const validatedSchedule = z.array(programSchema).parse(schedule);

  try {
    const scheduleRef = doc(db, "weeklySchedule", day);
    await updateDoc(scheduleRef, { schedule: validatedSchedule });

    // Revalidate paths that use this data
    revalidatePath("/panel/schedule");
    revalidatePath("/programacion");
    revalidatePath("/"); // Home page also shows today's schedule
  } catch (error) {
    console.error(`Error updating schedule for ${day}:`, error);
    throw new Error(`No se pudo actualizar la programación para ${day}.`);
  }
}
