
"use client";

import { Campaign } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, Gift, Mic, Trophy } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type ColumnActionsProps = {
    campaign: Campaign;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
};

const iconMap: { [key: string]: React.ElementType } = {
  Calendar: Calendar,
  Gift: Gift,
  Trophy: Trophy,
  Mic: Mic,
};

const ColumnActions = ({ campaign, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(campaign)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(campaign)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (campaign: Campaign) => void; onDelete: (campaign: Campaign) => void; }) => [
  {
    accessorKey: "icon",
    header: "Icono",
    cell: ({ row }: { row: { original: Campaign }}) => {
        const campaign = row.original;
        const Icon = iconMap[campaign.icon] || Calendar;
        return <Icon className="h-5 w-5 text-muted-foreground" />
    }
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }: { row: { original: Campaign }}) => {
        const campaign = row.original;
        return <div className="font-medium">{campaign.title}</div>
    }
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }: { row: { original: Campaign }}) => {
        const campaign = row.original;
        if (campaign.date && typeof campaign.date.toDate === 'function') {
            return <span>{format(campaign.date.toDate(), "dd MMM yyyy", { locale: es })}</span>;
        }
        return <span>Fecha inválida</span>;
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: Campaign }}) => {
      const campaign = row.original;
      return <ColumnActions campaign={campaign} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
