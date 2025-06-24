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
import { InvitationCode } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { generateInvitationCode, deleteInvitationCode } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InvitationsManagementPage() {
  const [codes, setCodes] = React.useState<InvitationCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedCode, setSelectedCode] = React.useState<InvitationCode | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchCodes = React.useCallback(async () => {
    setLoading(true);
    try {
      const codesCollection = collection(db, "invitationCodes");
      const q = query(codesCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const codesData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as InvitationCode)
      );
      setCodes(codesData);
    } catch (error) {
      console.error("Error fetching codes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los códigos de invitación.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInvitationCode();
      if (result.success) {
        toast({
          title: "Código Generado",
          description: `Se ha creado el nuevo código: ${result.code}`,
        });
        fetchCodes();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (code: InvitationCode) => {
    setSelectedCode(code);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCode) return;
    setIsDeleting(true);
    try {
      await deleteInvitationCode(selectedCode.id);
      toast({
        title: "Éxito",
        description: "El código de invitación ha sido eliminado.",
      });
      fetchCodes();
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedCode(null);
    }
  };

  const dynamicColumns = columns({ onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Invitaciones</h1>
            <p className="text-muted-foreground">Genera y administra códigos para registrar nuevos usuarios.</p>
        </div>
        <Button onClick={handleGenerateCode} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          Generar Código
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
            ) : codes.length > 0 ? (
              codes.map((code) => (
                <TableRow key={code.id}>
                  {dynamicColumns.map((col, index) => (
                    <TableCell key={index}>
                        {(col.cell as Function)({ row: { original: code } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron códigos. <Button variant="link" onClick={handleGenerateCode}>Genera uno nuevo</Button>.
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
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este código?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. El código será eliminado permanentemente y no podrá ser utilizado.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirmar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
