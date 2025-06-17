'use client';

import { LogoutButton } from '@/components/Auth/LogoutButton';
import { Logo } from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createClient } from '@/supabase-clients/client';
import { User } from '@supabase/supabase-js';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ExternalNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading auth session');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const renderActionButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="p-0" variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pathname === '/dashboard' ? (
            <DropdownMenuItem className="!bg-clip-text !text-transparent !bg-gradient-to-r from-blue-500 to-purple-500 font-medium !cursor-default hover:!bg-transparent focus:!bg-transparent">
              Discrepancies
            </DropdownMenuItem>
          ) : (
            <Link href="/dashboard" className="w-full">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
          )}

          {pathname === '/results' ? (
            <DropdownMenuItem className="!bg-clip-text !text-transparent !bg-gradient-to-r from-blue-500 to-purple-500 font-medium !cursor-default hover:!bg-transparent focus:!bg-transparent">
              Results
            </DropdownMenuItem>
          ) : (
            <Link href="/results" className="w-full">
              <DropdownMenuItem>Results</DropdownMenuItem>
            </Link>
          )}

          {pathname === '/faq' ? (
            <DropdownMenuItem className="!bg-clip-text !text-transparent !bg-gradient-to-r from-blue-500 to-purple-500 font-medium !cursor-default hover:!bg-transparent focus:!bg-transparent">
              FAQ
            </DropdownMenuItem>
          ) : (
            <Link href="/faq" className="w-full">
              <DropdownMenuItem>FAQ</DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="container px-2 h-14 flex items-center">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {isLoading ? null : user ? (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.user_metadata?.picture}
                    alt={user?.email ?? ''}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <div className="flex flex-col">
                  <div className="px-3 py-2 text-sm">{user.email}</div>
                  <div className="border-t border-border">
                    <LogoutButton className="w-full justify-start rounded-none px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/login"
          >
            <span className="max-w-0 sm:max-w-[100px] opacity-0 sm:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
              Login
            </span>
          </Link>
        )}
        {renderActionButton()}
      </nav>
    </header>
  );
}
