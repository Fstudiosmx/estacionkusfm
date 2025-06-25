
"use client";

import * as React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JoinSubmission } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { deleteJoinSubmission, updateSubmissionStatus } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function JoinSubmissionsPage() {
  const [submissions, setSubmissions] = React.useState<JoinSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubmission, setSelectedSubmission] = React.useState<JoinSubmission | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const { toast } = useToast();

  const fetchSubmissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, "joinSubmissions");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as JoinSubmission)
      );
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleViewDetails = (submission: JoinSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };
  
  const handleDelete = (submission: JoinSubmission) => {
    setSelectedSubmission(submission);
  };

  const confirmDelete = async () => {
    if (!selectedSubmission) return;
    setIsDeleting(true);
    try {
      await deleteJoinSubmission(selectedSubmission.id);
      toast({ title: "Éxito", description: "La solicitud ha sido eliminada." });
      fetchSubmissions();
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsDeleting(false);
        setSelectedSubmission(null);
    }
  };
  
  const handleStatusChange = async (submission: JoinSubmission, newStatus: boolean) => {
    try {
      await updateSubmissionStatus(submission.id, newStatus);
      toast({
        title: "Estado Actualizado",
        description: `La solicitud de ${submission.name} ha sido marcada como ${newStatus ? 'revisada' : 'pendiente'}.`,
      });
      fetchSubmissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const dynamicColumns = columns({ 
    onView: handleViewDetails, 
    onDelete: handleDelete,
    onStatusChange: handleStatusChange 
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Solicitudes para Unirse al Equipo</h1>
            <p className="text-muted-foreground">Revisa y gestiona las aplicaciones de nuevos talentos.</p>
        </div>
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
            ) : submissions.length > 0 ? (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  {dynamicColumns.map((col: any) => (
                    <TableCell key={col.id || col.accessorKey}>
                      {col.cell ? col.cell({ row: { original: sub } }) : sub[col.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se han recibido solicitudes por el momento.
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

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedSubmission && (
            <>
                <DialogHeader>
                    <DialogTitle className="font-headline">Solicitud de {selectedSubmission.name}</DialogTitle>
                    <DialogDescription>
                        Enviada el {selectedSubmission.createdAt ? format(selectedSubmission.createdAt.toDate(), "d 'de' LLLL, yyyy 'a las' HH:mm", { locale: es }) : 'N/A'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p><strong>Email:</strong> <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">{selectedSubmission.email}</a></p>
                    <p><strong>Idea de Programa:</strong> {selectedSubmission.showIdea}</p>
                    {selectedSubmission.message && (
                        <div>
                            <strong>Mensaje Adicional:</strong>
                            <blockquote className="mt-2 pl-4 border-l-2 italic text-muted-foreground">
                                {selectedSubmission.message}
                            </blockquote>
                        </div>
                    )}
                </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!selectedSubmission && !isDetailsOpen} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la solicitud de {selectedSubmission?.name}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
