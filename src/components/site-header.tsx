"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SiteLogo } from '@/components/icons/radiowave';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/programacion', label: 'Programación' },
  { href: '/grabaciones', label: 'Grabaciones' },
  { href: '/blog', label: 'Blog' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/unete', label: 'Únete' },
  { href: '/login', label: 'Login' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <Link
      href={href}
      onClick={() => setSheetOpen(false)}
      className={cn(
        "transition-colors hover:text-foreground",
        pathname === href ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <SiteLogo className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">
              EstacionKusFM
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} className="text-sm font-medium">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <SiteLogo className="h-6 w-6 text-primary" />
                  <span className="font-headline">EstacionKusFM</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
