
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogIn, LogOut, UserCircle, Video, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SiteLogo } from '@/components/icons/radiowave';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/programacion', label: 'Programación' },
  { href: '/grabaciones', label: 'Grabaciones' },
  { href: '/campanas', label: 'Campañas' },
  { href: '/blog', label: 'Blog' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/unete', label: 'Únete' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Sesión Cerrada" });
      router.push('/login');
    } catch (error) {
      toast({ title: "Error al cerrar sesión", variant: "destructive" });
    }
  };
  
  const NavLink = ({ href, children, className, onClick }: { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <Link
      href={href}
      onClick={() => {
        setSheetOpen(false);
        onClick?.();
      }}
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

        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} className="text-sm font-medium">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end space-x-2 md:space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/video">
                <Video className="h-5 w-5 md:mr-2"/>
                <span className="hidden md:inline">Venos en Video</span>
              </Link>
            </Button>

            {!loading && (
              <div className="hidden md:block">
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <UserCircle className="mr-2 h-5 w-5" />
                        Panel
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/panel')}>
                        Ir al Panel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild size="sm">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            )}
            
            <ThemeToggle />


          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
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
                  <div className="border-t pt-6">
                    {user ? (
                      <>
                        <NavLink href="/panel" className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5" /> Panel
                        </NavLink>
                        <button onClick={() => { handleLogout(); setSheetOpen(false); }} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground w-full text-left">
                           <LogOut className="h-5 w-5" /> Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <NavLink href="/login" className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" /> Login
                      </NavLink>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
