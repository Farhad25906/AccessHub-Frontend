'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function LeadsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">Leads</h1>
          <p className="text-[var(--text-mid)] mt-2">Manage your leads and opportunities here.</p>
        </div>
        <div className="bg-white border border-[var(--border)] p-8 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[var(--text-mid)]">Content coming soon...</p>
        </div>
      </div>
    </MainLayout>
  );
}
