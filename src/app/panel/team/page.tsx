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
import { TeamMember } from "@/lib/data";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { TeamMemberForm } from "./team-member-form";
import { deleteTeamMember } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TeamManagementPage() {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { toast } = useToast();

  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const membersCollection = collection(db, "teamMembers");
      const q = query(membersCollection, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const membersData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TeamMember)
      );
      setMembers(membersData);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros del equipo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      await deleteTeamMember(selectedMember.id);
      toast({
        title: "Éxito",
        description: "El miembro del equipo ha sido eliminado.",
      });
      fetchMembers();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo eliminar el miembro del equipo.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setSelectedMember(null);
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchMembers();
  }

  const dynamicColumns = columns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Equipo</h1>
            <p className="text-muted-foreground">Crea, edita y elimina miembros del equipo.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Miembro
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
            ) : members.length > 0 ? (
              members.map((member) => (
                <TableRow key={member.id}>
                  {dynamicColumns.map((col, index) => (
                    <TableCell key={index}>
                        {(col.cell as Function)({ row: { original: member } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No se encontraron miembros del equipo. <Button variant="link" onClick={handleCreateNew}>Añade uno nuevo</Button>.
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
            <DialogTitle className="font-headline">{selectedMember ? "Editar Miembro" : "Añadir Nuevo Miembro"}</DialogTitle>
            <DialogDescription>
              {selectedMember ? "Modifica los detalles del miembro." : "Rellena el formulario para añadir un nuevo miembro al equipo."}
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm member={selectedMember} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente al miembro del equipo.
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
