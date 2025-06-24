"use client";

import * as React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogPost } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { BlogPostForm } from "./blog-post-form";
import { deleteBlogPost } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function BlogManagementPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, "blogPosts");
      const q = query(postsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as BlogPost)
      );
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los artículos del blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    try {
      await deleteBlogPost(selectedPost.id);
      toast({
        title: "Éxito",
        description: "El artículo ha sido eliminado.",
      });
      fetchPosts(); // Re-fetch posts after deletion
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar el artículo.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedPost(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchPosts();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Blog</h1>
            <p className="text-muted-foreground">Crea, edita y elimina artículos del blog.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Post
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {dynamicColumns.map((col, index) => (
                <TableHead key={index}>{col.header as React.ReactNode}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {dynamicColumns.map((col, index) => (
                    <TableCell key={index}>
                        {(col.cell as Function)({ row: { original: post } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron artículos. <Button variant="link" onClick={handleCreateNew}>Crea uno nuevo</Button>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild>
            <Link href="/panel">Volver al Panel</Link>
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedPost ? "Editar Artículo" : "Crear Nuevo Artículo"}</DialogTitle>
            <DialogDescription>
              {selectedPost ? "Modifica los detalles de tu artículo." : "Rellena el formulario para publicar un nuevo artículo."}
            </DialogDescription>
          </DialogHeader>
          <BlogPostForm post={selectedPost} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo
                del blog de nuestros servidores.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continuar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
