import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export default function MisionVisionValoresPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Our Guiding Principles
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          The core beliefs that shape our sound and our community.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Target className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    To be the leading voice in online radio by delivering diverse, high-quality audio content that entertains, informs, and inspires our global community of listeners.
                </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Eye className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    To create a world where every voice has a platform and every listener can find their community. We envision a future where radio transcends boundaries and connects people through shared stories and sounds.
                </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
                 <ul className="text-muted-foreground space-y-2 text-left">
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Authenticity:</strong> We stay true to ourselves and our listeners.</li>
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Diversity:</strong> We celebrate a wide range of voices, genres, and perspectives.</li>
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Community:</strong> We foster a sense of belonging among our listeners and creators.</li>
                     <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Innovation:</strong> We embrace new technologies to enhance the listening experience.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
