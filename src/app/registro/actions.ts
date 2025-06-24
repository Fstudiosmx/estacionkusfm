"use server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc, Timestamp } from "firebase/firestore";

/**
 * Validates an invitation code against the database.
 * @param code The invitation code to validate.
 * @returns An object with `valid` status and a `message`.
 */
export async function validateCode(code: string) {
    if (!code) {
        return { valid: false, message: "El código de invitación no puede estar vacío." };
    }

    const codesRef = collection(db, "invitationCodes");
    const q = query(codesRef, where("code", "==", code));
    
    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { valid: false, message: "Código de invitación inválido." };
        }

        const codeData = querySnapshot.docs[0].data();

        if (codeData.used) {
            return { valid: false, message: "Este código de invitación ya ha sido utilizado." };
        }

        return { valid: true, message: "Código válido." };
    } catch (error) {
        console.error("Error validating code:", error);
        return { valid: false, message: "Error del servidor al validar el código. Revisa la consola." };
    }
}

/**
 * Marks an invitation code as used after a successful registration.
 * @param code The invitation code that was used.
 * @param email The email of the user who registered.
 */
export async function markCodeAsUsed(code: string, email: string) {
    const codesRef = collection(db, "invitationCodes");
    const q = query(codesRef, where("code", "==", code));
    
    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const codeDocRef = querySnapshot.docs[0].ref;
            await updateDoc(codeDocRef, {
                used: true,
                usedBy: email,
                usedAt: Timestamp.now()
            });
        }
    } catch (error) {
        console.error("Error marking code as used:", error);
        // This is a non-critical error, so we just log it. The user is already registered.
    }
}
