"use client";

import { TeamMember } from "@/lib/data";
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
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (member: TeamMember) => void;
};

const ColumnActions = ({ member, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(member)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(member)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (member: TeamMember) => void; onDelete: (member: TeamMember) => void; }) => [
  {
    accessorKey: "order",
    header: "Orden",
     cell: ({ row }: { row: { original: TeamMember }}) => {
        const member = row.original;
        return <div className="font-bold text-center w-4">{member.order}</div>
    }
  },
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }: { row: { original: TeamMember }}) => {
        const member = row.original;
        return <Image src={member.image} alt={member.name} width={40} height={40} className="rounded-full object-cover" unoptimized />
    }
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }: { row: { original: TeamMember }}) => {
        const member = row.original;
        return <div className="font-medium">{member.name}</div>
    }
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: TeamMember }}) => {
      const member = row.original;
      return <ColumnActions member={member} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
