'use client';

import { createClient } from '@/supabase-clients/client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`text-sm font-medium hover:underline underline-offset-4 hover:bg-accent/70 ${className}`}
    >
      <span className="max-w-[100px] opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
        Logout
      </span>
    </Button>
  );
}
