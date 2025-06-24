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


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
    accessorKey: "date",
    header: "Fecha",
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
