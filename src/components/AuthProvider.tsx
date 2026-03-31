'use client';

import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { setUser } from '@/redux/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: meData, isLoading, isError } = useGetMeQuery(undefined, {});
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!token || meData?.success;

  useEffect(() => {
    if (meData?.success && !user) {
      dispatch(setUser({ user: meData.data, token: token }));
    }
  }, [meData, dispatch, user, token]);

  // Route protection logic
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <Loader2 className="w-10 h-10 text-[var(--orange)] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
