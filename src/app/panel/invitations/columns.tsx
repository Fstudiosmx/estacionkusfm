"use client";

import { InvitationCode } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";


type ColumnActionsProps = {
    code: InvitationCode;
    onDelete: (code: InvitationCode) => void;
};

const ColumnActions = ({ code, onDelete }: ColumnActionsProps) => {
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code.code);
        toast({
            title: "Copiado",
            description: "El código de invitación ha sido copiado al portapapeles.",
        });
    }

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
          <DropdownMenuItem onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Código
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(code)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onDelete }: { onDelete: (code: InvitationCode) => void; }) => [
  {
    accessorKey: "code",
    header: "Código de Invitación",
    cell: ({ row }: { row: { original: InvitationCode }}) => {
        const code = row.original;
        return <div className="font-mono font-medium">{code.code}</div>
    }
  },
  {
    accessorKey: "used",
    header: "Estado",
    cell: ({ row }: { row: { original: InvitationCode }}) => {
        const code = row.original;
        return code.used 
            ? <Badge variant="secondary">Utilizado</Badge>
            : <Badge variant="default" className="bg-green-500 hover:bg-green-600">Activo</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }: { row: { original: InvitationCode }}) => {
        const code = row.original;
        if (code.createdAt && code.createdAt.toDate) {
            return <span>{format(code.createdAt.toDate(), "d 'de' LLLL, yyyy 'a las' HH:mm", { locale: es })}</span>;
        }
        return <span>Fecha inválida</span>;
    }
  },
   {
    accessorKey: "usedBy",
    header: "Utilizado Por",
    cell: ({ row }: { row: { original: InvitationCode }}) => {
        const code = row.original;
        return code.usedBy || <span className="text-muted-foreground">-</span>;
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: InvitationCode }}) => {
      const code = row.original;
      return <ColumnActions code={code} onDelete={onDelete} />
    },
  },
];
