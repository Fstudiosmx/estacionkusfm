
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Program } from "@/lib/data";
import { programSchema } from "./actions";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProgramFormProps {
  program?: Program | null;
  onSubmit: (data: Program) => void;
  isSaving: boolean;
}

export function ProgramForm({ program, onSubmit, isSaving }: ProgramFormProps) {
  const defaultValues: Program = program || {
    time: "12:00 - 13:00",
    title: "",
    host: "",
  };

  const form = useForm<Program>({
    resolver: zodResolver(programSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [program, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario (HH:MM - HH:MM)</FormLabel>
              <FormControl>
                <Input placeholder="08:00 - 10:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Programa</FormLabel>
              <FormControl>
                <Input placeholder="Morning Commute" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentador</FormLabel>
              <FormControl>
                <Input placeholder="Alex Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Programa
        </Button>
      </form>
    </Form>
  );
}
