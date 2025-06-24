"use client";

import { Sponsor } from "@/lib/data";
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
import { Badge } from "@/components/ui/badge";

type ColumnActionsProps = {
    sponsor: Sponsor;
    onEdit: (sponsor: Sponsor) => void;
    onDelete: (sponsor: Sponsor) => void;
};

const ColumnActions = ({ sponsor, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(sponsor)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(sponsor)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (sponsor: Sponsor) => void; onDelete: (sponsor: Sponsor) => void; }) => [
  {
    accessorKey: "order",
    header: "Orden",
     cell: ({ row }: { row: { original: Sponsor }}) => {
        const sponsor = row.original;
        return <div className="font-bold text-center w-4">{sponsor.order}</div>
    }
  },
  {
    accessorKey: "imageUrl",
    header: "Logo",
    cell: ({ row }: { row: { original: Sponsor }}) => {
        const sponsor = row.original;
        return <Image src={sponsor.imageUrl} alt={sponsor.name} width={80} height={40} className="rounded-md object-contain" unoptimized />
    }
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }: { row: { original: Sponsor }}) => {
        const sponsor = row.original;
        return <div className="font-medium">{sponsor.name}</div>
    }
  },
  {
    accessorKey: "level",
    header: "Nivel",
    cell: ({ row }: { row: { original: Sponsor }}) => {
        const sponsor = row.original;
        const variant = sponsor.level === 'platinum' ? 'default' : sponsor.level === 'gold' ? 'secondary' : 'outline';
        return <Badge variant={variant} className={`capitalize ${sponsor.level === 'gold' ? 'bg-yellow-400 text-black' : ''}`}>{sponsor.level}</Badge>;
    }
  },
   {
    accessorKey: "websiteUrl",
    header: "Sitio Web",
     cell: ({ row }: { row: { original: Sponsor }}) => {
        const sponsor = row.original;
        return <a href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">{sponsor.websiteUrl}</a>
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: Sponsor }}) => {
      const sponsor = row.original;
      return <ColumnActions sponsor={sponsor} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
