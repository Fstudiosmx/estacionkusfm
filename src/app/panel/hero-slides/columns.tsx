
"use client";

import { HeroSlide } from "@/lib/data";
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
    slide: HeroSlide;
    onEdit: (slide: HeroSlide) => void;
    onDelete: (slide: HeroSlide) => void;
};

const ColumnActions = ({ slide, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(slide)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(slide)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (slide: HeroSlide) => void; onDelete: (slide: HeroSlide) => void; }) => [
  {
    accessorKey: "order",
    header: "Orden",
     cell: ({ row }: { row: { original: HeroSlide }}) => {
        const slide = row.original;
        return <div className="font-bold text-center w-4">{slide.order}</div>
    }
  },
  {
    accessorKey: "imageUrl",
    header: "Imagen",
    cell: ({ row }: { row: { original: HeroSlide }}) => {
        const slide = row.original;
        return <Image src={slide.imageUrl} alt={slide.title} width={100} height={56} className="rounded-md object-cover" unoptimized />
    }
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }: { row: { original: HeroSlide }}) => {
        const slide = row.original;
        return <div className="font-medium">{slide.title}</div>
    }
  },
  {
    accessorKey: "buttonText",
    header: "Texto del Botón",
     cell: ({ row }: { row: { original: HeroSlide }}) => {
        const slide = row.original;
        return slide.buttonText || <span className="text-muted-foreground">-</span>
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: HeroSlide }}) => {
      const slide = row.original;
      return <ColumnActions slide={slide} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
