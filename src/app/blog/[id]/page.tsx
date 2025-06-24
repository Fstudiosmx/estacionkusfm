import { blogPosts } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id.toString() === params.id);

  if (!post) {
    notFound();
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
