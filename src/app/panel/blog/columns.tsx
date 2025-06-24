"use client";

import { BlogPost } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type ColumnActionsProps = {
    post: BlogPost;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
};

const ColumnActions = ({ post, onEdit, onDelete }: ColumnActionsProps) => {
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
          <DropdownMenuItem onClick={() => onEdit(post)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(post)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export const columns = ({ onEdit, onDelete }: { onEdit: (post: BlogPost) => void; onDelete: (post: BlogPost) => void; }) => [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }: { row: { original: BlogPost }}) => {
        const post = row.original;
        return <div className="font-medium">{post.title}</div>
    }
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }: { row: { original: BlogPost }}) => {
        const post = row.original;
        return <Badge variant="outline">{post.category}</Badge>;
    }
  },
  {
    accessorKey: "author",
    header: "Autor",
  },
  {
    accessorKey: "publishDate",
    header: "Fecha",
    cell: ({ row }: { row: { original: BlogPost }}) => {
        const post = row.original;
        if (post.publishDate && typeof post.publishDate.toDate === 'function') {
            return <span>{format(post.publishDate.toDate(), "dd MMM yyyy", { locale: es })}</span>;
        }
        return <span>Fecha inválida</span>;
    }
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: BlogPost }}) => {
      const post = row.original;
      return <ColumnActions post={post} onEdit={onEdit} onDelete={onDelete} />
    },
  },
];
