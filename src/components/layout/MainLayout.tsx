'use client';

import Sidebar from './Sidebar';
import { Search, Bell, User as UserIcon, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <>{children}</>;

  return (
    <div className="flex bg-[var(--cream)] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4 bg-[var(--sidebar-bg)] px-4 py-2 rounded-lg border border-[var(--border)] w-96">
            <Search className="w-4 h-4 text-[var(--text-light)]" />
            <input 
              type="text" 
              placeholder="Search components, users, or logs..." 
              className="bg-transparent border-none focus:outline-none text-sm text-[var(--text-dark)] w-full placeholder:text-[var(--text-light)]"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative w-10 h-10 bg-orange-500 text-white rounded-[10px] flex items-center justify-center shadow-md hover:opacity-90 transition-all active:translate-y-[1px]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border border-orange-500"></span>
            </button>
            
            <div className="h-8 w-px bg-[var(--border)]"></div>

            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-[var(--text-dark)]">{user.email.split('@')[0]}</span>
                <span className="text-[10px] uppercase text-[var(--orange)] font-bold tracking-tighter flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role?.name}
                </span>
              </div>
              <div className="w-10 h-10 bg-[var(--orange-btn)] rounded-lg flex items-center justify-center shadow-md">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
