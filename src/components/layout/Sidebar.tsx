'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/features/auth/authSlice';
import { 
  Shield, Users, Lock, LogOut, ChevronRight, 
  BarChart3, Settings, Search, Bell, User as UserIcon,
  Activity, Briefcase, ListTodo, Globe
} from 'lucide-react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { deleteCookie } from 'cookies-next';
import { useLogoutUserMutation } from '@/redux/features/auth/authApi';
import { baseApi } from '@/redux/api/baseApi';

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    path: '/dashboard',
    permission: 'view_dashboard'
  },
  {
    title: 'Users',
    icon: Users,
    path: '/users',
    permission: 'view_users'
  },
  {
    title: 'Leads',
    icon: Briefcase,
    path: '/leads',
    permission: 'view_leads'
  },
  {
    title: 'Tasks',
    icon: ListTodo,
    path: '/tasks',
    permission: 'manage_tasks'
  },
  {
    title: 'Reports',
    icon: BarChart3,
    path: '/reports',
    permission: 'view_reports'
  },
  {
    title: 'Audit Logs',
    icon: Activity,
    path: '/audit-logs',
    permission: 'view_audit_logs'
  },
  {
    title: 'Customer Portal',
    icon: Globe,
    path: '/customer-portal',
    permission: 'access_customer_portal'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
    permission: 'manage_settings'
  }
];

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
    } catch (e) {
      // Ignore network errors on logout
    }
    deleteCookie('accessToken');
    deleteCookie('userPermissions');
    deleteCookie('refreshToken'); // In case frontend has it, though it's typically httpOnly
    dispatch(logout());
    dispatch(baseApi.util.resetApiState()); // Clear the RTK query cache so /me doesn't Auto-redirect
    router.push('/login');
  };

  const filteredMenu = menuItems.filter(item => 
    !item.permission || user?.permissions?.includes(item.permission)
  );

  return (
    <div className="w-64 h-screen bg-[#F5F0EB] border-r border-[var(--border)] flex flex-col sticky top-0">
      <div className="p-6 flex items-center space-x-3 border-b border-[var(--border)]">
        <div className="w-8 h-8 bg-[var(--orange)] rounded-lg flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[var(--text-dark)] tracking-tight">AccessHub</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-5">
        <div className="text-[10px] font-semibold text-[var(--text-light)] uppercase tracking-wider px-2 pb-2">Main Menu</div>
        {filteredMenu.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group",
              pathname === item.path 
                ? "bg-[#EDE8E2] text-[var(--text-dark)] font-semibold shadow-sm" 
                : "text-[var(--text-mid)] hover:bg-[#EDE8E2] hover:text-[var(--text-dark)]"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", pathname === item.path ? "text-[var(--text-dark)]" : "text-[var(--text-light)] group-hover:text-[var(--text-dark)]")} />
            <span className="text-[14px]">{item.title}</span>
            {pathname === item.path && <ChevronRight className="w-4 h-4 ml-auto text-[var(--text-dark)]" />}
          </a>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-[var(--border)] bg-[#F5F0EB]">
        <div className="flex items-center space-x-3 p-3 bg-white border border-[var(--border)] rounded-xl mb-3 shadow-sm">
          <div className="w-9 h-9 bg-gradient-to-br from-[#F47B3A] to-[#EF5B25] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{user?.email[0].toUpperCase()}</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[13px] font-semibold text-[var(--text-dark)] truncate">{user?.email.split('@')[0]}</p>
            <p className="text-[10px] text-[var(--text-light)] uppercase tracking-widest truncate">{user?.role?.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--orange-btn)] text-white rounded-xl transition-all shadow-[0_4px_20px_rgba(242,101,34,0.25)] hover:opacity-90 active:translate-y-[1px]"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[13px] font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
}
