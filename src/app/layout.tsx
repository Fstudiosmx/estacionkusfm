
import type { Metadata } from 'next';
import { Belleza, Alegreya } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { RadioPlayer } from '@/components/radio-player';
import Script from 'next/script';
import { getSiteSettings } from '@/lib/settings';
import { CookieBanner } from '@/components/cookie-banner';

const belleza = Belleza({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-belleza',
  display: 'swap',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-alegreya',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EstacionKusFM - Tu Radio Online',
  description: 'La mejor música y programas, en vivo 24/7.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* 
          TODO: Reemplaza "ca-pub-XXXXXXXXXXXXXXXX" con tu ID de cliente de Google AdSense.
          Puedes encontrarlo en tu cuenta de AdSense.
        */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          belleza.variable,
          alegreya.variable
        )}
        suppressHydrationWarning={true}
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <RadioPlayer streamUrl={settings.streamUrl} />
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
