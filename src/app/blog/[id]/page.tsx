import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ServerCrash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Combine id from document with data
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    // This indicates a configuration or permissions issue with Firebase.
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // Firestore document IDs are strings, so we use the param directly.
  // The original numeric ID from data.ts is now just a field within the document.
  const post = await getBlogPost(params.id);

  if (!post) {
    // If the post is null either because it doesn't exist or Firebase failed,
    // we can show notFound or a more specific error page.
    // For simplicity, we'll use notFound for both cases here.
    notFound();
  }

  // A simple check for a valid post object before rendering.
  if (!post.title) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <Card>
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                         <ServerCrash className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle>Error de Conexión con Firebase</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No se pudo cargar el artículo del blog. Por favor, verifica que tus credenciales de Firebase en <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">src/lib/firebase.ts</code> son correctas y que la colección <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">'blogPosts'</code> existe en Firestore.</p>
                        <Button asChild className="mt-4">
                            <Link href="/docs">Ver Guía de Configuración</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>
        </div>

        <article>
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="outline">{post.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-muted-foreground text-sm space-x-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
            </div>
          </header>

          <Image
            src={post.imageUrl}
            alt={post.title}
            data-ai-hint={post.category === 'Entrevistas' ? 'portrait microphone' : 'music lifestyle'}
            width={1200}
            height={675}
            className="w-full h-auto rounded-lg object-cover mb-8"
          />

          <div className="text-foreground text-lg leading-relaxed space-y-6">
            <p className="font-semibold text-xl">{post.excerpt}</p>
            <p>{post.content}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
