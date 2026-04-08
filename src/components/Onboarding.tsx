import React, { useState } from 'react';
import { Target, Clock, GraduationCap, ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { loginWithGoogle } from '../lib/supabase';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0); // 0 is Login step
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    goal: '',
    learningTime: '',
    level: 'beginner'
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const goals = [
    { id: 'frontend', label: 'Frontend Developer', desc: 'React, Tailwind, Next.js' },
    { id: 'backend', label: 'Backend Developer', desc: 'Node.js, Express, Databases' },
    { id: 'data', label: 'Data Science', desc: 'Python, SQL, Machine Learning' },
  ];

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        setProfile(prev => ({ 
          ...prev, 
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '', 
          email: user.email || '' 
        }));
        setStep(2); // Move to goal selection
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Đăng nhập thất bại: " + (error instanceof Error ? error.message : "Lỗi không xác định"));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Chào mừng bạn đến với EduAI</h1>
          <p className="text-slate-400">Hãy cho chúng tôi biết mục tiêu của bạn để tạo lộ trình cá nhân hóa.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <motion.div 
              className="h-full bg-indigo-600"
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Bắt đầu hành trình của bạn</h3>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                Đăng nhập bằng Google
              </button>
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors underline underline-offset-4"
                >
                  Tiếp tục mà không đăng nhập
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-xl font-semibold text-white mb-6">Bạn tên là gì?</h3>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Nhập tên của bạn..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-xl font-semibold text-white mb-6">Mục tiêu học tập của bạn?</h3>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setProfile({ ...profile, goal: g.id as any })}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-200",
                      profile.goal === g.id 
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" 
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    )}
                  >
                    <div className="font-semibold">{g.label}</div>
                    <div className="text-xs opacity-60">{g.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-xl font-semibold text-white mb-6">Thời gian học mỗi ngày?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['30 phút', '1 giờ', '2 giờ', '4 giờ+'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setProfile({ ...profile, learningTime: t })}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      profile.learningTime === t 
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" 
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    )}
                  >
                    <Clock className="w-5 h-5 mb-2 mx-auto" />
                    <div className="text-sm font-medium">{t}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step > 0 && (
            <button
              onClick={handleNext}
              disabled={(step === 1 && !profile.name) || (step === 2 && !profile.goal) || (step === 3 && !profile.learningTime)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-8 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {step === 3 ? 'Bắt đầu ngay' : 'Tiếp tục'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
