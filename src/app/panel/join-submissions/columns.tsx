
"use client";

import { JoinSubmission } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type ColumnActionsProps = {
    submission: JoinSubmission;
    onView: (submission: JoinSubmission) => void;
    onDelete: (submission: JoinSubmission) => void;
};

const ColumnActions = ({ submission, onView, onDelete }: ColumnActionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView(submission)}>
                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <a href={`mailto:${submission.email}`}><Mail className="mr-2 h-4 w-4" /> Contactar</a>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onDelete(submission)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ 
    onView, 
    onDelete, 
    onStatusChange 
}: { 
    onView: (submission: JoinSubmission) => void; 
    onDelete: (submission: JoinSubmission) => void;
    onStatusChange: (submission: JoinSubmission, newStatus: boolean) => void;
}) => [
    {
        accessorKey: "isReviewed",
        header: "Revisado",
        cell: ({ row }: { row: { original: JoinSubmission }}) => {
            const sub = row.original;
            return <Switch checked={sub.isReviewed} onCheckedChange={(checked) => onStatusChange(sub, checked)} aria-label="Marcar como revisado" />;
        }
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: { original: JoinSubmission }}) => {
            const sub = row.original;
            return (
                <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "showIdea",
        header: "Idea del Programa",
        cell: ({ row }: { row: { original: JoinSubmission }}) => {
            const sub = row.original;
            return <p className="truncate max-w-xs">{sub.showIdea}</p>
        }
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de Envío",
        cell: ({ row }: { row: { original: JoinSubmission }}) => {
            const sub = row.original;
            if (sub.createdAt && sub.createdAt.toDate) {
                return <span>{format(sub.createdAt.toDate(), "d MMM, yyyy HH:mm", { locale: es })}</span>;
            }
            return <span>Fecha inválida</span>;
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }: { row: { original: JoinSubmission }}) => {
          const sub = row.original;
          return <ColumnActions submission={sub} onView={onView} onDelete={onDelete} />
        },
    },
];
