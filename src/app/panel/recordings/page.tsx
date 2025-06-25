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
import { RecordedShow } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { RecordingForm } from "./recording-form";
import { deleteRecording } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RecordingsManagementPage() {
  const [recordings, setRecordings] = React.useState<RecordedShow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedRecording, setSelectedRecording] = React.useState<RecordedShow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchRecordings = React.useCallback(async () => {
    setLoading(true);
    try {
      const recordingsCollection = collection(db, "recordedShows");
      const q = query(recordingsCollection, orderBy("publishDate", "desc"));
      const querySnapshot = await getDocs(q);
      const recordingsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RecordedShow)
      );
      setRecordings(recordingsData);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las grabaciones.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const handleEdit = (recording: RecordedShow) => {
    setSelectedRecording(recording);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedRecording(null);
    setIsFormOpen(true);
  };

  const handleDelete = (recording: RecordedShow) => {
    setSelectedRecording(recording);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecording) return;
    setIsDeleting(true);
    try {
      await deleteRecording(selectedRecording.id);
      toast({
        title: "Éxito",
        description: "La grabación ha sido eliminada.",
      });
      fetchRecordings();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar la grabación.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedRecording(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchRecordings();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Grabaciones</h1>
            <p className="text-muted-foreground">Crea, edita y elimina grabaciones y podcasts.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Grabación
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
            ) : recordings.length > 0 ? (
              recordings.map((recording) => (
                <TableRow key={recording.id}>
                  {dynamicColumns.map((col: any, index) => (
                    <TableCell key={index}>
                      {col.cell
                        ? col.cell({ row: { original: recording } })
                        : col.accessorKey ? recording[col.accessorKey as keyof RecordedShow] : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron grabaciones. <Button variant="link" onClick={handleCreateNew}>Crea una nueva</Button>.
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
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedRecording ? "Editar Grabación" : "Crear Nueva Grabación"}</DialogTitle>
            <DialogDescription>
              Rellena el formulario para publicar una nueva grabación.
            </DialogDescription>
          </DialogHeader>
          <RecordingForm recording={selectedRecording} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la grabación.
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
