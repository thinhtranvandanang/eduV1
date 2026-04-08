import React, { useState } from 'react';
import { Target, BookOpen, Clock, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface ProfileData {
  goal: string;
  level: string;
  time: string;
}

export default function ProfileForm({ onComplete }: { onComplete: (data: ProfileData) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProfileData>({
    goal: '',
    level: 'beginner',
    time: '2 hours/day'
  });

  const next = () => setStep(s => s + 1);

  const handleFinish = async (finalData: ProfileData) => {
    setLoading(true);
    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            goal: finalData.goal,
            level: finalData.level,
            study_time: finalData.time,
            full_name: user.user_metadata?.full_name
          });
        }
      }
      onComplete(finalData);
    } catch (error) {
      console.error('Error saving profile:', error);
      onComplete(finalData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          ))}
        </div>
        <span className="text-xs text-slate-500 font-mono">STEP 0{step} / 03</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="text-emerald-400" /> Mục tiêu của bạn?
              </h2>
              <p className="text-slate-400 text-sm">Bạn muốn trở thành lập trình viên mảng nào?</p>
            </div>
            <div className="space-y-3">
              {['Web Frontend', 'Web Backend', 'Mobile App', 'Data Science'].map(goal => (
                <button
                  key={goal}
                  onClick={() => { setData({ ...data, goal }); next(); }}
                  className="w-full p-4 text-left rounded-2xl border border-slate-800 bg-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-800 transition-all group flex justify-between items-center"
                >
                  <span className="text-slate-200">{goal}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-emerald-400" /> Trình độ hiện tại?
              </h2>
              <p className="text-slate-400 text-sm">Hãy thành thật để EduAI có thể hỗ trợ tốt nhất.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'beginner', label: 'Mới bắt đầu', desc: 'Chưa biết gì về lập trình' },
                { id: 'intermediate', label: 'Đã biết cơ bản', desc: 'Hiểu biến, vòng lặp, hàm' },
                { id: 'advanced', label: 'Đã có kinh nghiệm', desc: 'Muốn nâng cao kỹ năng' }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => { setData({ ...data, level: level.id }); next(); }}
                  className="w-full p-4 text-left rounded-2xl border border-slate-800 bg-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
                >
                  <div className="text-slate-200 font-medium">{level.label}</div>
                  <div className="text-slate-500 text-xs">{level.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="text-emerald-400" /> Thời gian học tập?
              </h2>
              <p className="text-slate-400 text-sm">Bạn có thể dành bao nhiêu thời gian mỗi ngày?</p>
            </div>
            <div className="space-y-3">
              {['1 hour/day', '2 hours/day', '4 hours/day', 'Full-time'].map(time => (
                <button
                  key={time}
                  disabled={loading}
                  onClick={() => { 
                    const finalData = { ...data, time };
                    setData(finalData);
                    handleFinish(finalData);
                  }}
                  className="w-full p-4 text-left rounded-2xl border border-slate-800 bg-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-800 transition-all flex justify-between items-center disabled:opacity-50"
                >
                  <span className="text-slate-200">{time}</span>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
