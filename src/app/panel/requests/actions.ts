
"use server";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

/**
 * Deletes a submission from Firestore.
 * @param id The Firestore document ID of the submission to delete.
 */
export async function deleteSubmission(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID de documento para eliminar la sumisión.");
    }
    try {
        await deleteDoc(doc(db, "userSubmissions", id));
        revalidatePath("/panel/requests");
    } catch (error) {
        console.error("Error deleting submission:", error);
        throw new Error("No se pudo eliminar la sumisión.");
    }
}
