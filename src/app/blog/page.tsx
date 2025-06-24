import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
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
                Por {post.author} el {post.date}
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
    </div>
  );
}
