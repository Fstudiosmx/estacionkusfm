"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  author: z.string().min(2, "El autor debe tener al menos 2 caracteres."),
  publishDate: z.date({
    required_error: "La fecha de publicación es requerida.",
  }),
  excerpt: z.string().min(10, "El extracto debe tener al menos 10 caracteres."),
  content: z.string().min(20, "El contenido debe tener al menos 20 caracteres."),
  imageUrl: z.string().url("Debe ser una URL válida."),
  category: z.string().min(2, "La categoría debe tener al menos 2 caracteres."),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

export async function upsertBlogPost(data: BlogPostFormValues) {
  const validatedData = formSchema.parse(data);
  
  const { id, ...postData } = validatedData;

  const dataToSave = {
    ...postData,
    publishDate: Timestamp.fromDate(postData.publishDate),
  };

  try {
    if (id) {
      const postRef = doc(db, "blogPosts", id);
      await updateDoc(postRef, dataToSave);
    } else {
      await addDoc(collection(db, "blogPosts"), dataToSave);
    }
    revalidatePath("/panel/blog");
    revalidatePath("/blog");
    revalidatePath("/");
  } catch (error) {
    console.error("Error upserting blog post:", error);
    throw new Error("No se pudo guardar el artículo en la base de datos.");
  }
}

export async function deleteBlogPost(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar el artículo.");
    }

    try {
        const postRef = doc(db, "blogPosts", id);
        await deleteDoc(postRef);
        
        revalidatePath("/panel/blog");
        revalidatePath("/blog");
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting blog post:", error);
        throw new Error("No se pudo eliminar el artículo de la base de datos.");
    }
}
