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
import { Song } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { SongForm } from "./song-form";
import { deleteTopSong } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TopSongsManagementPage() {
  const [songs, setSongs] = React.useState<Song[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSong, setSelectedSong] = React.useState<Song | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchSongs = React.useCallback(async () => {
    setLoading(true);
    try {
      const songsCollection = collection(db, "topSongs");
      const q = query(songsCollection, orderBy("rank", "asc"));
      const querySnapshot = await getDocs(q);
      const songsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Song)
      );
      setSongs(songsData);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las canciones.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleEdit = (song: Song) => {
    setSelectedSong(song);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedSong(null);
    setIsFormOpen(true);
  };

  const handleDelete = (song: Song) => {
    setSelectedSong(song);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSong) return;
    setIsDeleting(true);
    try {
      await deleteTopSong(selectedSong.id);
      toast({
        title: "Éxito",
        description: "La canción ha sido eliminada.",
      });
      fetchSongs();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar la canción.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedSong(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchSongs();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Top 10 Canciones</h1>
            <p className="text-muted-foreground">Crea, edita y elimina canciones del ranking.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Canción
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
            ) : songs.length > 0 ? (
              songs.map((song) => (
                <TableRow key={song.id}>
                  {dynamicColumns.map((col, index) => (
                    <TableCell key={index}>
                        {(col.cell as Function)({ row: { original: song } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron canciones. <Button variant="link" onClick={handleCreateNew}>Añade una nueva</Button>.
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
            <DialogTitle className="font-headline">{selectedSong ? "Editar Canción" : "Añadir Nueva Canción"}</DialogTitle>
            <DialogDescription>
              {selectedSong ? "Modifica los detalles de la canción." : "Rellena el formulario para añadir una canción al ranking."}
            </DialogDescription>
          </DialogHeader>
          <SongForm song={selectedSong} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la canción.
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
