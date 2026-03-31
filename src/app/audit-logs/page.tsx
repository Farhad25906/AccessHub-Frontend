'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useGetAuditLogsQuery } from '@/redux/features/permission/permissionApi';
import { Activity, Clock, User as UserIcon, Shield } from 'lucide-react';

export default function AuditLogsPage() {
  const { data: logsData, isLoading } = useGetAuditLogsQuery(undefined);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-dark)]">System Audit Trail</h1>
          <p className="text-[var(--text-mid)] mt-1">Append-only record of all security-sensitive operations.</p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-[24px] shadow-sm p-6 lg:p-10">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--border)]">
            {logsData?.data?.map((log: any, i: number) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] bg-white text-[var(--text-mid)] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                  <Activity className="w-5 h-5 text-[var(--orange)] group-hover:text-[var(--orange-lt)] transition-colors" />
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-[var(--border)] bg-[#FAFAF8] shadow-sm hover:border-[var(--orange-lt)] transition-all">
                  <div className="flex items-center justify-between space-x-2 mb-2">
                    <div className="font-bold text-[var(--text-dark)] flex items-center text-sm">
                      <UserIcon className="w-3.5 h-3.5 mr-2 text-[var(--orange)]" />
                      {log.user?.email || 'System'}
                    </div>
                    <time className="text-[11px] font-bold text-[var(--orange)] flex items-center bg-[var(--orange)]/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                  <div className="text-[var(--text-mid)] text-[13px] font-medium leading-relaxed">{log.action}</div>
                  <div className="text-[10px] text-[var(--text-light)] mt-3 font-bold uppercase tracking-widest flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-[var(--orange)]" />
                    Verified Trace
                  </div>
                </div>
              </div>
            ))}
            
            {!isLoading && logsData?.data?.length === 0 && (
              <div className="text-[var(--text-mid)] text-center py-24 italic font-medium">
                No system activity recorded yet.
              </div>
            )}
            
            {isLoading && (
               <div className="p-24 flex justify-center w-full">
                  <div className="w-8 h-8 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
