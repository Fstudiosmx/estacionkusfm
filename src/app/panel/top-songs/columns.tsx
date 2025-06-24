"use client";

import { Song } from "@/lib/data";
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
    song: Song;
    onEdit: (song: Song) => void;
    onDelete: (song: Song) => void;
};

const ColumnActions = ({ song, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(song)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(song)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (song: Song) => void; onDelete: (song: Song) => void; }) => [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }: { row: { original: Song }}) => {
        const song = row.original;
        return <div className="font-bold text-center w-4">{song.rank}</div>
    }
  },
   {
    accessorKey: "coverArt",
    header: "Carátula",
    cell: ({ row }: { row: { original: Song }}) => {
        const song = row.original;
        return <Image src={song.coverArt} alt={song.title} width={40} height={40} className="rounded-md" unoptimized />
    }
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }: { row: { original: Song }}) => {
        const song = row.original;
        return (
            <div>
                <div className="font-medium">{song.title}</div>
                <div className="text-sm text-muted-foreground">{song.artist}</div>
            </div>
        )
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: Song }}) => {
      const song = row.original;
      return <ColumnActions song={song} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
