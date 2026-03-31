'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function CustomerPortalPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">Customer Portal</h1>
          <p className="text-[var(--text-mid)] mt-2">Access your dedicated customer portal here.</p>
        </div>
        <div className="bg-white border border-[var(--border)] p-8 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[var(--text-mid)]">Content coming soon...</p>
        </div>
      </div>
    </MainLayout>
  );
}
