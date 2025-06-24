import Link from 'next/link';
import { RadioWave } from '@/components/icons/radiowave';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const footerNavs = [
  { href: '/nosotros', label: 'About Us' },
  { href: '/programacion', label: 'Schedule' },
  { href: '/blog', label: 'Blog' },
  { href: '/unete', label: 'Join Us' },
  { href: '/contacto', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-secondary border-t mt-auto pb-24 sm:pb-28">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <RadioWave className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl font-headline">RadioWave</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your daily dose of sound. Music, talk shows, and the pulse of the city.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-headline">Quick Links</h3>
              <ul className="space-y-2">
                {footerNavs.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-headline">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                </li>
                 <li>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                </li>
                 <li>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-headline">Legal</h3>
              <ul className="space-y-2">
                 <li>
                  <Link href="/mision-vision-valores" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Mission & Vision
                  </Link>
                </li>
                 <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                 <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} RadioWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
