"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { nanoid } from 'nanoid';

/**
 * Generates a new unique invitation code and saves it to Firestore.
 */
export async function generateInvitationCode() {
    // Generates a code like "KUSFM-A1B2C3D4"
    const code = `KUSFM-${nanoid(8).toUpperCase()}`;
    try {
        await addDoc(collection(db, "invitationCodes"), {
            code: code,
            createdAt: Timestamp.now(),
            used: false,
            usedBy: null,
            usedAt: null
        });
        revalidatePath("/panel/invitations");
        return { success: true, code };
    } catch (error) {
        console.error("Error generating code:", error);
        throw new Error("No se pudo generar el código de invitación.");
    }
}

/**
 * Deletes an invitation code from Firestore.
 * @param id The Firestore document ID of the code to delete.
 */
export async function deleteInvitationCode(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID de documento para eliminar el código.");
    }
    try {
        await deleteDoc(doc(db, "invitationCodes", id));
        revalidatePath("/panel/invitations");
    } catch (error) {
        console.error("Error deleting code:", error);
        throw new Error("No se pudo eliminar el código.");
    }
}
