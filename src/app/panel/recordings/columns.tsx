"use client";

import { RecordedShow } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

type ColumnActionsProps = {
    recording: RecordedShow;
    onEdit: (recording: RecordedShow) => void;
    onDelete: (recording: RecordedShow) => void;
};

const ColumnActions = ({ recording, onEdit, onDelete }: ColumnActionsProps) => {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(recording)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(recording)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (recording: RecordedShow) => void; onDelete: (recording: RecordedShow) => void; }) => [
  {
    accessorKey: "imageUrl",
    header: "Imagen",
    cell: ({ row }: { row: { original: RecordedShow }}) => {
        const recording = row.original;
        return <Image src={recording.imageUrl} alt={recording.title} width={40} height={40} className="rounded-md object-cover" />
    }
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }: { row: { original: RecordedShow }}) => {
        const recording = row.original;
        return <div className="font-medium">{recording.title}</div>
    }
  },
  {
    accessorKey: "host",
    header: "Presentador",
  },
  {
    accessorKey: "date",
    header: "Fecha",
  },
   {
    accessorKey: "duration",
    header: "Duración",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: RecordedShow }}) => {
      const recording = row.original;
      return <ColumnActions recording={recording} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
