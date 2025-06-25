import Link from 'next/link';
import { SiteLogo } from '@/components/icons/radiowave';
import { Facebook, Instagram, X } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';

const footerNavs = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/programacion', label: 'Programación' },
  { href: '/blog', label: 'Blog' },
  { href: '/unete', label: 'Únete' },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="w-full bg-secondary border-t mt-auto pb-24 sm:pb-28">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <SiteLogo className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl font-headline">EstacionKusFM</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Tu dosis diaria de sonido. Música, programas y el pulso de la ciudad.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-headline">Enlaces Rápidos</h3>
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
              <h3 className="font-semibold text-foreground mb-4 font-headline">Conecta</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://facebook.com/ekusfm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                </li>
                 <li>
                  <a href="https://x.com/estacionkusfm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <X className="w-4 h-4" /> X
                  </a>
                </li>
                 <li>
                  <a href="https://instagram.com/estacionkusfm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-headline">Legal y Recursos</h3>
              <ul className="space-y-2">
                 <li>
                  <Link href="/mision-vision-valores" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Misión y Visión
                  </Link>
                </li>
                 <li>
                  <Link href="/politica-de-privacidad" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Política de Privacidad
                  </Link>
                </li>
                 <li>
                  <Link href="/terminos-de-servicio" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Términos de Servicio
                  </Link>
                </li>
                {settings.showDocsLink && (
                  <li>
                    <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        Guía de Configuración
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} EstacionKusFM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
