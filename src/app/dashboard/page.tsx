'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  Users, Shield, Activity, Lock, 
  ArrowUpRight, ArrowDownRight, TrendingUp,
  UserCheck, ShieldCheck, Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'blue', trend: '+12%', up: true },
    { label: 'Permissions', value: '24', icon: Shield, color: 'indigo', trend: '+2', up: true },
    { label: 'System Logs', value: '45.2k', icon: Activity, color: 'emerald', trend: '-3%', up: false },
    { label: 'Security Score', value: '98%', icon: Lock, color: 'amber', trend: 'Optimal', up: true },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">System Overview</h1>
          <p className="text-[var(--text-mid)] mt-2">Welcome back, <span className="text-[var(--orange)] font-semibold">{user?.email}</span>. Here's what's happening with the RBAC system.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-white border border-[var(--border)] p-6 rounded-2xl relative overflow-hidden group hover:border-[var(--orange-lt)] transition-all shadow-[0_4px_40px_rgba(0,0,0,0.04)]"
            >
              <div className={`p-3 bg-${stat.color}-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <h3 className="text-[var(--text-mid)] text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-[var(--text-dark)] mt-1">{stat.value}</p>
              
              <div className={`mt-3 flex items-center text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.up ? <TrendingUp className="w-4 h-4 mr-1" /> : <Activity className="w-4 h-4 mr-1" />}
                {stat.trend}
              </div>

              {/* Grid backgrounds */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-[var(--orange)]/5 to-transparent rounded-full blur-2xl"></div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-dark)] flex items-center">
              <ShieldCheck className="w-5 h-5 mr-3 text-[var(--orange)]" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Create New User', permission: 'create_users', icon: UserCheck },
                { label: 'Modify Permissions', permission: 'edit_users', icon: Shield },
                { label: 'Audit System Logs', permission: 'view_audit_logs', icon: Database },
              ].map((action) => (
                <button
                  key={action.label}
                  disabled={!user?.permissions.includes(action.permission)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                    user?.permissions.includes(action.permission)
                      ? 'bg-white border-[var(--border)] hover:border-[var(--orange-lt)] text-[var(--text-dark)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                      : 'bg-[#F5F0EB] border-[var(--border)] opacity-60 grayscale cursor-not-allowed text-[var(--text-mid)]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg">
                      <action.icon className="w-5 h-5 text-[var(--orange)]" />
                    </div>
                    <span className="font-semibold text-sm">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-light)]" />
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed Placeholder */}
          <div className="lg:col-span-2 bg-white border border-[var(--border)] h-[400px] rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
            <div className="w-16 h-16 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mb-6 border border-[var(--border)]">
              <Activity className="w-8 h-8 text-[var(--orange)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-dark)]">Live Activity Feed</h3>
            <p className="text-[var(--text-mid)] max-w-sm mt-3 text-sm">Advanced real-time monitoring of all system events and permission changes will appear here.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
