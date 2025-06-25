
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, MessageSquare, Music } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTables } from "./request-tables";

export default function RequestsManagementPage() {
  const { toast } = useToast();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Peticiones y Saludos</h1>
            <p className="text-muted-foreground">Revisa las interacciones de los oyentes.</p>
        </div>
      </div>

       <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">
                <Music className="mr-2 h-4 w-4" />
                Peticiones de Canciones
            </TabsTrigger>
            <TabsTrigger value="shoutouts">
                <MessageSquare className="mr-2 h-4 w-4" />
                Saludos al Aire
            </TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
            <RequestTables type="request" />
        </TabsContent>
        <TabsContent value="shoutouts">
            <RequestTables type="shoutout" />
        </TabsContent>
        </Tabs>
      
      <div className="mt-8">
        <Button variant="outline" asChild>
            <Link href="/panel">Volver al Panel</Link>
        </Button>
      </div>
    </div>
  );
}
