import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";
import Link from "next/link";

export default function RequestsPage() {
  return (
    <div className="container mx-auto py-10">
       <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Peticiones y Saludos</h1>
            <p className="text-muted-foreground">Revisa las interacciones de los oyentes.</p>
        </div>
      </div>

       <Card className="w-full max-w-2xl mx-auto mt-20">
        <CardHeader className="items-center text-center">
            <MessageSquareQuote className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Funcionalidad en Desarrollo</CardTitle>
            <CardDescription>
                La gestión de peticiones y saludos estará disponible aquí próximamente.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button asChild>
                <Link href="/panel">Volver al Panel</Link>
            </Button>
        </CardContent>
       </Card>
    </div>
  );
}
