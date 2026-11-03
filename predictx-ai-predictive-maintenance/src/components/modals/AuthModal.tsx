import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Key, Mail, Lock, X } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { UserProfile } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'switch' | 'login'>('switch');

  const [emailInput, setEmailInput] = useState(user.email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');

  const demoProfiles: UserProfile[] = [
    {
      name: 'Dr. Michael Chen',
      email: 'm.chen@industria-predictx.com',
      role: 'Lead Reliability Engineer',
      avatarUrl: '/assets/avatar-placeholder.svg',
      plantId: 'Plant #4 - Stuttgart Automation Hub',
    },
    {
      name: 'Elena Rostova',
      email: 'e.rostova@industria-predictx.com',
      role: 'Plant Operations Director',
      avatarUrl: '/assets/avatar-placeholder.svg',
      plantId: 'Global Operations Headquarters',
    },
    {
      name: 'Marcus Vance',
      email: 'm.vance@industria-predictx.com',
      role: 'Maintenance Specialist',
      avatarUrl: '/assets/avatar-placeholder.svg',
      plantId: 'Zone D Heavy Stamping Shop',
    },
  ];

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      email: emailInput,
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">User Profile & Access Control</h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold my-4">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              activeTab === 'switch' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Switch Demo Role
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account Credentials
          </button>
        </div>

        {activeTab === 'switch' ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">
              Select an authorized engineering role to simulate operations, sign-offs, and permissions:
            </div>

            {demoProfiles.map((p) => {
              const isSelected = p.role === user.role;
              return (
                <div
                  key={p.role}
                  onClick={() => {
                    setUser(p);
                    setIsAuthModalOpen(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/30' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.avatarUrl} 
                      alt={p.name} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{p.role}</div>
                      <div className="text-[10px] text-slate-400">{p.plantId}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industrial Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-2xs mt-2"
            >
              Sign In to Supervisory Console
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 text-right">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
