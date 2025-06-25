
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeroSlide } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { SlideForm } from "./slide-form";
import { deleteSlide } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function HeroSlidesManagementPage() {
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSlide, setSelectedSlide] = React.useState<HeroSlide | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchSlides = React.useCallback(async () => {
    setLoading(true);
    try {
      const slidesCollection = collection(db, "heroSlides");
      const q = query(slidesCollection, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as HeroSlide)
      );
      setSlides(data);
    } catch (error) {
      console.error("Error fetching slides:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las diapositivas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleEdit = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedSlide(null);
    setIsFormOpen(true);
  };

  const handleDelete = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSlide) return;
    setIsDeleting(true);
    try {
      await deleteSlide(selectedSlide.id);
      toast({
        title: "Éxito",
        description: "La diapositiva ha sido eliminada.",
      });
      fetchSlides();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar la diapositiva.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedSlide(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchSlides();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Slideshow</h1>
            <p className="text-muted-foreground">Crea y edita las diapositivas del carrusel de inicio.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Diapositiva
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {dynamicColumns.map((col: any) => (
                <TableHead key={col.id || col.accessorKey}>{col.header}</TableHead>
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
            ) : slides.length > 0 ? (
              slides.map((slide) => (
                <TableRow key={slide.id}>
                  {dynamicColumns.map((col: any) => (
                    <TableCell key={col.id || col.accessorKey}>
                      {col.cell ? col.cell({ row: { original: slide } }) : slide[col.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron diapositivas. <Button variant="link" onClick={handleCreateNew}>Crea una nueva</Button>.
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedSlide ? "Editar Diapositiva" : "Crear Nueva Diapositiva"}</DialogTitle>
            <DialogDescription>
              Rellena el formulario para configurar esta diapositiva.
            </DialogDescription>
          </DialogHeader>
          <SlideForm slide={selectedSlide} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la diapositiva.
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
