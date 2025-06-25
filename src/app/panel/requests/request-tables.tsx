
"use client";

import * as React from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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
import { UserSubmission } from "@/lib/data";
import { getColumns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { deleteSubmission } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RequestTablesProps {
    type: 'request' | 'shoutout';
}

export function RequestTables({ type }: RequestTablesProps) {
  const [submissions, setSubmissions] = React.useState<UserSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubmission, setSelectedSubmission] = React.useState<UserSubmission | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchSubmissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const submissionsCollection = collection(db, "userSubmissions");
      const q = query(
        submissionsCollection, 
        where("type", "==", type), 
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserSubmission)
      );
      setSubmissions(submissionsData);
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
      toast({
        title: "Error",
        description: `No se pudieron cargar las sumisiones.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, type]);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = (submission: UserSubmission) => {
    setSelectedSubmission(submission);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSubmission) return;
    setIsDeleting(true);
    try {
      await deleteSubmission(selectedSubmission.id);
      toast({
        title: "Éxito",
        description: "La sumisión ha sido eliminada.",
      });
      fetchSubmissions();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar la sumisión.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedSubmission(null);
    }
  };

  const dynamicColumns = getColumns(type, handleDelete);

  return (
    <Card>
        <CardContent className="p-0">
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    {dynamicColumns.map((col: any, index) => (
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
                    submissions.map((submission) => (
                        <TableRow key={submission.id}>
                        {dynamicColumns.map((col: any, index) => (
                            <TableCell key={index}>
                            {col.cell
                                ? col.cell({ row: { original: submission } })
                                : col.accessorKey ? submission[col.accessorKey as keyof UserSubmission] : null}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                         No hay {type === 'request' ? 'peticiones' : 'saludos'} por ahora.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la sumisión.
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
        </CardContent>
    </Card>
  );
}
