import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ServerCrash } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

async function getBlogPosts(): Promise<BlogPost[] | null> {
  try {
    const postsCollection = collection(db, 'blogPosts');
    const q = query(postsCollection, orderBy('publishDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return null;
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          El Blog de EstacionKusFM
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Noticias, entrevistas, reseñas musicales e historias de nuestro mundo al tuyo.
        </p>
      </div>

      {!blogPosts ? (
        <div className="max-w-2xl mx-auto text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                     <ServerCrash className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle>Error de Conexión con Firebase</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No se pudieron cargar las publicaciones del blog. Por favor, verifica que tus credenciales de Firebase en <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">src/lib/firebase.ts</code> son correctas y que la colección <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">'blogPosts'</code> existe en Firestore.</p>
                    <Button asChild className="mt-4">
                        <Link href="/docs">Ver Guía de Configuración</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <Link href={`/blog/${post.id}`}>
                  <Image
                    src={post.imageUrl}
                    data-ai-hint={post.category === 'Entrevistas' ? 'portrait microphone' : 'music lifestyle'}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="font-headline text-xl mb-2 flex-1">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  Por {post.author} el {post.publishDate ? format(post.publishDate.toDate(), "dd 'de' MMMM, yyyy", { locale: es }) : ''}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {post.excerpt}
                </p>
                <Button asChild variant="link" className="p-0 justify-start mt-auto self-start">
                  <Link href={`/blog/${post.id}`}>
                    Leer Más <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
