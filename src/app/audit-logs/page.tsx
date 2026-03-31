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
          <h1 className="text-3xl font-bold text-white">System Audit Trail</h1>
          <p className="text-slate-400 mt-1">Append-only record of all security-sensitive operations.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {logsData?.data?.map((log: any, i: number) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Activity className="w-5 h-5 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-800 bg-slate-800/20 backdrop-blur shadow-sm hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-100 flex items-center">
                      <UserIcon className="w-3 h-3 mr-2 text-slate-500" />
                      {log.user?.email || 'System'}
                    </div>
                    <time className="text-xs font-mono font-medium text-blue-500/80 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                  <div className="text-slate-400 text-sm leading-relaxed">{log.action}</div>
                  <div className="text-[10px] text-slate-600 mt-2 font-mono uppercase tracking-widest flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Trace
                  </div>
                </div>
              </div>
            ))}
            
            {!isLoading && logsData?.data?.length === 0 && (
              <div className="text-slate-500 text-center py-20 italic">
                No system activity recorded yet.
              </div>
            )}
            
            {isLoading && (
               <div className="p-20 flex justify-center w-full">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
