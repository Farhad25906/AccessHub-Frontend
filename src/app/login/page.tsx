'use client';

import { useState } from 'react';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      const token = result.data.accessToken;
      const permissions = result.data.permissions || [];
      const decodedUser: any = jwtDecode(token);
      
      // Store in cookies for server middleware
      setCookie('accessToken', token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie('userPermissions', JSON.stringify(permissions), { maxAge: 60 * 60 * 24 * 7 });
      
      dispatch(setUser({ user: { id: decodedUser.userId, email, role: { name: decodedUser.role }, permissions }, token }));
      
      toast.success('Login Successful!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--cream)] overflow-hidden">
      {/* ══ LEFT – LOGIN ══ */}
      <div className="flex flex-col px-8 py-10 md:p-12 relative bg-[var(--cream)]">
        <div className="flex items-center gap-2.5 font-bold text-xl text-[var(--text-dark)] tracking-tight mb-auto">
          <div className="w-10 h-10 bg-[var(--orange)] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          AccessHub
        </div>

        <div className="bg-white rounded-[24px] p-8 md:p-11 pb-10 shadow-[0_4px_40px_rgba(0,0,0,0.07)] w-full max-w-[420px] mx-auto md:-mt-8">
          <h1 className="text-[28px] font-bold text-center text-[var(--text-dark)] tracking-tight mb-1.5">Login</h1>
          <p className="text-center text-[var(--text-mid)] text-sm mb-8">Enter your details to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] text-sm text-[var(--text-dark)] bg-white outline-none focus:border-[var(--orange)] transition-colors placeholder:text-[var(--text-light)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-10 border-[1.5px] border-[var(--border)] rounded-[10px] text-sm text-[var(--text-dark)] bg-white outline-none focus:border-[var(--orange)] transition-colors placeholder:text-[var(--text-light)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--text-mid)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 pt-1">
              <label className="flex items-center gap-2 text-[13px] text-[var(--text-mid)] cursor-pointer select-none group">
                <input type="checkbox" className="peer hidden" />
                <div className="w-4 h-4 border-[1.5px] border-[#D0CCC8] rounded box-border flex items-center justify-center transition-all bg-white peer-checked:bg-[var(--orange)] peer-checked:border-[var(--orange)]">
                  <span className="opacity-0 peer-checked:opacity-100 text-white text-[10px] font-bold">✓</span>
                </div>
                Remember me
              </label>
              <span className="text-[13px] font-medium text-[var(--orange)] cursor-pointer hover:underline">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[var(--orange-btn)] border-none rounded-[10px] text-white text-[15px] font-semibold tracking-wide cursor-pointer shadow-[0_6px_24px_rgba(242,101,34,0.35)] hover:opacity-90 active:translate-y-[1px] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Log in
            </button>
          </form>

          <p className="text-center mt-7 text-[13.5px] text-[var(--text-mid)]">
            Don't have an account? <span className="text-[var(--text-dark)] font-bold cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </div>

      {/* ══ RIGHT – BG + OVERLAY ══ */}
      <div className="hidden md:block relative overflow-hidden rounded-[24px] m-[18px] ml-0 shadow-lg">
        {/* Animated wavy bg */}
        <div className="bg-canvas">
          <div className="wave w1"></div>
          <div className="wave w2"></div>
          <div className="wave w3"></div>
          <div className="wave w4"></div>
          <div className="wave w5"></div>
          <div className="wave w6"></div>
        </div>

        {/* Overlay sidebar window */}
        <div className="overlay-window absolute right-[-10px] top-1/2 -translate-y-1/2 w-[340px] bg-[var(--sidebar-bg)] rounded-l-[18px] shadow-[-8px_0_48px_rgba(0,0,0,0.18)] flex overflow-hidden h-[78%] max-h-[520px]">
          
          {/* Sidebar nav */}
          <div className="w-[148px] min-w-[148px] bg-[#F5F0EB] border-r border-[var(--border)] flex flex-col py-3.5">
            <div className="flex items-center gap-2 px-3 pb-3 border-b border-[var(--border)] mb-2">
              <div className="w-[26px] h-[26px] rounded-lg bg-gradient-to-br from-[#F47B3A] to-[#EF5B25] text-white text-[10px] font-bold flex items-center justify-center shrink-0">JW</div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-semibold text-[var(--text-dark)] whitespace-nowrap overflow-hidden text-ellipsis">John's workspace</div>
                <div className="text-[8px] text-[var(--text-light)]">#WC12446875</div>
              </div>
            </div>

            <div className="px-2 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
                Leads
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Opportunities
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] bg-[#EDE8E2] text-[var(--text-dark)] font-semibold cursor-pointer transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Tasks
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 ml-auto"><polyline points="18 15 12 9 6 15"/></svg>
              </div>
              <div className="pl-5 space-y-0.5 mt-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors">Assignments</div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors">Calendar</div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors">Reminders</div>
              </div>
            </div>

            <div className="text-[8px] font-semibold text-[var(--text-light)] uppercase tracking-wider px-3.5 pt-2.5 pb-1">Users</div>
            <div className="px-2 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                Contacts <span className="ml-auto text-xs text-[var(--text-light)]">+</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Messages <span className="ml-auto text-[9px] text-[var(--text-light)]">6</span>
              </div>
            </div>

            <div className="text-[8px] font-semibold text-[var(--text-light)] uppercase tracking-wider px-3.5 pt-2.5 pb-1">Other</div>
            <div className="px-2 space-y-0.5 mb-auto">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
                Configuration
              </div>
            </div>

            <div className="mt-auto px-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10.5px] text-[var(--text-mid)] cursor-pointer hover:bg-[#EDE8E2] hover:text-[var(--text-dark)] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Help center
              </div>
            </div>
          </div>

          {/* Tasks panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="px-3.5 pt-3.5 pb-2.5 border-b border-[var(--border)] flex items-center gap-2">
              <div className="w-[22px] h-[22px] rounded-md bg-[var(--cream)] border border-[var(--border)] flex items-center justify-center cursor-pointer text-[var(--text-mid)] text-[11px]">←</div>
              <h3 className="text-[13px] font-bold text-[var(--text-dark)]">Tasks</h3>
            </div>

            <div className="mx-2.5 mt-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--cream)] rounded-lg border border-[var(--border)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[11px] h-[11px] text-[var(--text-light)] shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search table" className="border-none bg-transparent text-[10px] text-[var(--text-mid)] outline-none w-full placeholder:text-[var(--text-light)]" />
            </div>

            <div className="tasks-scroll overflow-y-auto flex-1 mt-2 pb-2">
              <div className="px-2.5 py-1"><div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5B5FDE] rounded-md text-[10px] font-bold text-white">● Group 1</div></div>
              
              <div className="flex items-start gap-2 px-2.5 py-1.5 border-b border-[#F5F3F0] hover:bg-[#FAFAF8] cursor-pointer">
                <div className="w-[13px] h-[13px] border-[1.5px] border-[#D0CCC8] rounded-[3px] shrink-0 mt-[1px]"></div>
                <div className="text-[10px] text-[var(--text-dark)] leading-[1.4] flex-1">Title</div>
              </div>
              <div className="flex items-start gap-2 px-2.5 py-1.5 border-b border-[#F5F3F0] hover:bg-[#FAFAF8] cursor-pointer">
                <div className="w-[13px] h-[13px] border-[1.5px] border-[#D0CCC8] rounded-[3px] shrink-0 mt-[1px]"></div>
                <div className="text-[10px] text-[var(--text-dark)] leading-[1.4] flex-1">Call about proposal</div>
              </div>
              <div className="flex items-start gap-2 px-2.5 py-1.5 border-b border-[#F5F3F0] hover:bg-[#FAFAF8] cursor-pointer">
                <div className="w-[13px] h-[13px] bg-[var(--orange)] border-[1.5px] border-[var(--orange)] rounded-[3px] shrink-0 mt-[1px] flex items-center justify-center"><span className="text-white text-[8px] font-bold">✓</span></div>
                <div className="text-[10px] text-[var(--text-light)] line-through leading-[1.4] flex-1">Follow up with Mira</div>
              </div>

              <div className="px-2.5 py-1 mt-2"><div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E05A2B] rounded-md text-[10px] font-bold text-white">● Group 2</div></div>
              
              <div className="flex flex-col gap-1 px-2.5 py-1.5 hover:bg-[#FAFAF8] cursor-pointer">
                <div className="flex items-start gap-2 w-full">
                  <div className="w-[13px] h-[13px] border-[1.5px] border-[#D0CCC8] rounded-[3px] shrink-0 mt-[2px]"></div>
                  <div className="flex-1">
                    <div className="text-[10px] text-[var(--text-dark)]">Prepare pitch deck</div>
                    <div className="flex flex-col gap-[2px] mt-[2px]">
                      <div className="text-[8px] text-[var(--text-light)]">Client name · Tech Ltd.</div>
                      <div className="mt-[2px]"><span className="inline-flex items-center px-1.5 py-[1px] bg-[#FF4D4D] text-white rounded font-semibold text-[8px]">🔴 Urgent</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
