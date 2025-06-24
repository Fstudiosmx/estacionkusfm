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
import { Sponsor } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { SponsorForm } from "./sponsor-form";
import { deleteSponsor } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SponsorsManagementPage() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSponsor, setSelectedSponsor] = React.useState<Sponsor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchSponsors = React.useCallback(async () => {
    setLoading(true);
    try {
      const sponsorsCollection = collection(db, "sponsors");
      const q = query(sponsorsCollection, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const sponsorsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Sponsor)
      );
      setSponsors(sponsorsData);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los patrocinadores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedSponsor(null);
    setIsFormOpen(true);
  };

  const handleDelete = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSponsor) return;
    setIsDeleting(true);
    try {
      await deleteSponsor(selectedSponsor.id);
      toast({
        title: "Éxito",
        description: "El patrocinador ha sido eliminado.",
      });
      fetchSponsors();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar el patrocinador.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedSponsor(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchSponsors();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Patrocinadores</h1>
            <p className="text-muted-foreground">Añade y edita los patrocinadores que se muestran en el sitio.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Patrocinador
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
            ) : sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  {dynamicColumns.map((col, index) => (
                    <TableCell key={index}>
                        {(col.cell as Function)({ row: { original: sponsor } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron patrocinadores. <Button variant="link" onClick={handleCreateNew}>Añade uno nuevo</Button>.
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
            <DialogTitle className="font-headline">{selectedSponsor ? "Editar Patrocinador" : "Añadir Nuevo Patrocinador"}</DialogTitle>
            <DialogDescription>
              {selectedSponsor ? "Modifica los detalles del patrocinador." : "Rellena el formulario para añadir un nuevo patrocinador."}
            </DialogDescription>
          </DialogHeader>
          <SponsorForm sponsor={selectedSponsor} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción eliminará permanentemente al patrocinador.
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
