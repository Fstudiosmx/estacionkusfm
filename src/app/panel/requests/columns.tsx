
"use client";

import { UserSubmission } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type ColumnActionsProps = {
    submission: UserSubmission;
    onDelete: (submission: UserSubmission) => void;
};

const ColumnActions = ({ submission, onDelete }: ColumnActionsProps) => {
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
            <DropdownMenuItem
                onClick={() => onDelete(submission)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
            </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const getColumns = (type: 'request' | 'shoutout', onDelete: (submission: UserSubmission) => void) => {
    const baseColumns = [
        {
            accessorKey: "createdAt",
            header: "Fecha",
            cell: ({ row }: { row: { original: UserSubmission }}) => {
                const sub = row.original;
                if (sub.createdAt && sub.createdAt.toDate) {
                    return <span>{format(sub.createdAt.toDate(), "d MMM, HH:mm", { locale: es })}</span>;
                }
                return <span>Fecha inválida</span>;
            }
        },
        {
            accessorKey: "name",
            header: "De",
        },
    ];

    if (type === 'request') {
        baseColumns.push({
            accessorKey: "song",
            header: "Canción",
            cell: ({ row }: { row: { original: UserSubmission }}) => {
                const sub = row.original;
                return (
                    <div>
                        <p className="font-medium">{sub.songTitle}</p>
                        <p className="text-sm text-muted-foreground">{sub.songArtist}</p>
                    </div>
                );
            }
        });
    }

    baseColumns.push({
        accessorKey: "message",
        header: "Mensaje",
        cell: ({ row }: { row: { original: UserSubmission }}) => {
            const sub = row.original;
            return <p className="text-sm italic text-muted-foreground">"{sub.message || '-'}"</p>;
        }
    });
    
    baseColumns.push({
        id: "actions",
        header: "Acciones",
        cell: ({ row }: { row: { original: UserSubmission }}) => {
          const sub = row.original;
          return <ColumnActions submission={sub} onDelete={onDelete} />
        },
    });

    return baseColumns;
};
