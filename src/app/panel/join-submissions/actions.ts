
"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function updateSubmissionStatus(id: string, isReviewed: boolean) {
    if (!id) {
        throw new Error("Se requiere un ID de documento.");
    }
    try {
        const submissionRef = doc(db, "joinSubmissions", id);
        await updateDoc(submissionRef, { isReviewed });
        revalidatePath("/panel/join-submissions");
    } catch (error) {
        console.error("Error updating submission status:", error);
        throw new Error("No se pudo actualizar el estado de la solicitud.");
    }
}

export async function deleteJoinSubmission(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID de documento para eliminar la solicitud.");
    }
    try {
        await deleteDoc(doc(db, "joinSubmissions", id));
        revalidatePath("/panel/join-submissions");
    } catch (error) {
        console.error("Error deleting submission:", error);
        throw new Error("No se pudo eliminar la solicitud.");
    }
}
