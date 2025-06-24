"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ServerCrash, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScheduleDay, Program } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { ProgramForm } from './program-form';
import { updateDaySchedule } from './actions';

const dayTranslations: { [key: string]: string } = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
};

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleManagementPage() {
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(dayOrder[0]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<{ program: Program; index: number } | null>(null);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setFirebaseError(null);
    try {
        const scheduleCollection = collection(db, 'weeklySchedule');
        const querySnapshot = await getDocs(scheduleCollection);
        const scheduleData = querySnapshot.docs.map(doc => ({
            day: doc.id,
            ...doc.data()
        } as ScheduleDay));
        scheduleData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
        setWeeklySchedule(scheduleData);
    } catch (error) {
        console.error("Firebase fetch error:", error);
        setFirebaseError("No se pudo cargar la programación desde la base de datos.");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleAddProgram = (day: ScheduleDay) => {
    setSelectedDay(day);
    setSelectedProgram(null);
    setIsFormOpen(true);
  };

  const handleEditProgram = (day: ScheduleDay, program: Program, index: number) => {
    setSelectedDay(day);
    setSelectedProgram({ program, index });
    setIsFormOpen(true);
  };

  const handleDeleteProgram = (day: ScheduleDay, index: number) => {
    setSelectedDay(day);
    setProgramToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const onFormSubmit = async (program: Program) => {
    if (!selectedDay) return;
    setIsSaving(true);
    const newSchedule = [...(selectedDay.schedule || [])];
    if (selectedProgram !== null) { // Editing
      newSchedule[selectedProgram.index] = program;
    } else { // Adding
      newSchedule.push(program);
    }
    
    try {
      await updateDaySchedule(selectedDay.day, newSchedule);
      toast({ title: "Éxito", description: `Programación del ${dayTranslations[selectedDay.day]} actualizada.` });
      fetchSchedule(); // Re-fetch to get updated data
      setIsFormOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDay || programToDelete === null) return;
    setIsDeleting(true);
    const newSchedule = selectedDay.schedule.filter((_, i) => i !== programToDelete);
    try {
      await updateDaySchedule(selectedDay.day, newSchedule);
      toast({ title: "Éxito", description: `Programa eliminado.` });
      fetchSchedule();
    } catch (error: any) {
       toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProgramToDelete(null);
    }
  };

  const renderContent = () => {
    if (loading) {
       return <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>;
    }
    if (firebaseError) {
        return <div className="text-center p-8 text-destructive">{firebaseError}</div>;
    }
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 mb-8">
            {weeklySchedule.map((day) => (
                <TabsTrigger key={day.day} value={day.day}>
                {dayTranslations[day.day] || day.day}
                </TabsTrigger>
            ))}
            </TabsList>
            {weeklySchedule.map((day) => (
                <TabsContent key={day.day} value={day.day}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center justify-between gap-2">
                                <span>Programación del {dayTranslations[day.day]}</span>
                                <Button size="sm" onClick={() => handleAddProgram(day)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Añadir Programa
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {day.schedule && day.schedule.length > 0 ? (
                                <ul className="space-y-2">
                                    {day.schedule.map((program, index) => (
                                        <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                            <div>
                                                <p className="font-semibold">{program.title} <span className="font-normal text-muted-foreground text-sm">({program.time})</span></p>
                                                <p className="text-sm text-muted-foreground">con {program.host}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" onClick={() => handleEditProgram(day, program, index)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteProgram(day, index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                           ) : (
                             <p className="text-muted-foreground text-center py-8">
                                No hay programas agendados para este día.
                            </p>
                           )}
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Programación Semanal</h1>
            <p className="text-muted-foreground">Añade, edita y elimina programas para cada día.</p>
        </div>
      </div>
      
      {renderContent()}

      <div className="mt-8">
        <Button variant="outline" asChild>
            <Link href="/panel">Volver al Panel</Link>
        </Button>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline">{selectedProgram ? 'Editar Programa' : 'Añadir Nuevo Programa'}</DialogTitle>
                <DialogDescription>
                    Rellena los detalles para el programa del {selectedDay ? dayTranslations[selectedDay.day] : ''}.
                </DialogDescription>
            </DialogHeader>
            <ProgramForm 
                program={selectedProgram?.program} 
                onSubmit={onFormSubmit}
                isSaving={isSaving}
            />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción eliminará el programa de la parrilla de este día.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Eliminar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
