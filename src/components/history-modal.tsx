import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function HistoryModal() {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-headline">Historial de Canciones</DialogTitle>
        <DialogDescription>Las últimas canciones que han sonado en EstacionKusFM.</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p className="text-center text-muted-foreground">Esta función estará disponible próximamente.</p>
      </div>
    </DialogContent>
  );
}
