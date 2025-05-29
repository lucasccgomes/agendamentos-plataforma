'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const publicRoutes = ['/login', '/register', '/']; // ajuste conforme necessário

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadingAuth } = useAuth();

  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loadingAuth && !user && !isPublic) {
      router.push('/login');
    }
  }, [user, loadingAuth, pathname]);

  if (!isPublic && (loadingAuth || !user)) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
