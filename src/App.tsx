import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { RoadmapView } from './components/RoadmapView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Onboarding } from './components/Onboarding';
import { UserProfile, Roadmap, Task } from './types';
import { useGemini } from './hooks/useGemini';
import { Loader2, Sparkles, X, Database, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, logout } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { cn } from './lib/utils';

const ROADMAP_PROMPT = (profile: UserProfile) => `Hãy tạo một lộ trình học tập (roadmap) chi tiết cho người học có mục tiêu là ${profile.goal}.
Thông tin người học:
- Tên: ${profile.name}
- Thời gian học mỗi ngày: ${profile.learningTime}
- Trình độ: ${profile.level}

Yêu cầu output là một JSON object có cấu trúc:
{
  "goal": "Tên mục tiêu học tập",
  "tasks": [
    {
      "id": "string",
      "title": "Tên task",
      "description": "Mô tả chi tiết task",
      "status": "todo",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}
Hãy tạo khoảng 8-10 task quan trọng nhất để bắt đầu.`;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { ask, loading } = useGemini();

  useEffect(() => {
    // Xử lý OAuth Callback trên Client (Dành cho Vercel và môi trường tĩnh)
    if (window.location.pathname === '/auth/callback' || window.location.pathname === '/auth/callback/') {
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'SUPABASE_AUTH_SUCCESS',
          url: window.location.href 
        }, '*');
        // Hiển thị thông báo trước khi đóng
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#0f172a;color:white;">Đang xác thực... Cửa sổ này sẽ tự đóng.</div>';
        setTimeout(() => window.close(), 500);
      } else {
        window.location.href = '/';
      }
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        loadUserData(session.user.id);
      }
      setIsAuthReady(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setRoadmap(null);
        setOnboardingComplete(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    console.log("Loading data for user:", userId);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.warn("Profile not found or error:", profileError);
      }

      if (profileData) {
        console.log("Profile found:", profileData);
        setUserProfile(profileData);
        setOnboardingComplete(true);
      } else {
        console.log("No profile found, staying on onboarding.");
      }

      const { data: roadmapData } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (roadmapData) {
        console.log("Roadmap found:", roadmapData);
        setRoadmap({
          goal: roadmapData.goal,
          tasks: roadmapData.tasks,
          progress: roadmapData.progress
        });
      }
    } catch (error) {
      console.error("Error loading user data", error);
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    const finalProfile = {
      ...profile,
      email: user?.email || profile.email || '',
      updatedAt: new Date().toISOString()
    };
    
    setUserProfile(finalProfile);
    setOnboardingComplete(true);
    
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        ...finalProfile
      });
    }
    
    // Generate roadmap
    const response = await ask(ROADMAP_PROMPT(finalProfile), "Bạn là chuyên gia tư vấn lộ trình học lập trình. Hãy trả về JSON duy nhất.");
    if (response) {
      try {
        const jsonStr = response.replace(/```json|```/g, '').trim();
        const data = JSON.parse(jsonStr);
        const newRoadmap = {
          ...data,
          userId: user?.id || 'anonymous',
          progress: 0,
          updatedAt: new Date().toISOString()
        };
        setRoadmap(newRoadmap);

        if (user) {
          await supabase.from('roadmaps').upsert({
            user_id: user.id,
            goal: newRoadmap.goal,
            tasks: newRoadmap.tasks,
            progress: 0
          });
        }
      } catch (e) {
        console.error("Failed to parse roadmap JSON", e);
      }
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!roadmap) return;
    
    const updatedTasks = roadmap.tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    );
    
    const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
    
    const updatedRoadmap = {
      ...roadmap,
      tasks: updatedTasks,
      progress: newProgress,
      updatedAt: new Date().toISOString()
    };
    
    setRoadmap(updatedRoadmap);

    if (user) {
      await supabase.from('roadmaps').update({
        tasks: updatedTasks,
        progress: newProgress
      }).eq('user_id', user.id);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-8">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                Chào mừng, <span className="text-indigo-400">{userProfile?.name}</span>!
              </h1>
              <p className="text-slate-400 flex items-center gap-2">
                Hôm nay là một ngày tuyệt vời để học <span className="text-indigo-400 font-medium">{userProfile?.goal}</span>.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn(
                "px-4 py-2 rounded-full flex items-center gap-2 text-sm border bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              )}>
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">{user ? 'Đã xác thực' : 'Khách'}</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-slate-300">AI Mentor đang sẵn sàng</span>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProgressDashboard />
              </motion.div>
            )}

            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {loading && !roadmap ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-400 animate-pulse">Đang tạo lộ trình cá nhân hóa cho bạn...</p>
                  </div>
                ) : roadmap ? (
                  <RoadmapView roadmap={roadmap} onTaskClick={setSelectedTask} />
                ) : (
                  <div className="text-center py-20 text-slate-500">
                    Không tìm thấy lộ trình. Hãy thử tải lại trang.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'mentor' && (
              <motion.div
                key="mentor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-200px)]"
              >
                <ChatInterface />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTask(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-md mb-2 inline-block">
                        {selectedTask.difficulty}
                      </span>
                      <h2 className="text-3xl font-bold text-white">{selectedTask.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {selectedTask.description}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setActiveTab('mentor');
                        setSelectedTask(null);
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Hỏi AI Mentor về bài này
                    </button>
                    <button 
                      onClick={() => {
                        handleTaskComplete(selectedTask.id);
                        setSelectedTask(null);
                      }}
                      className="px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      Đánh dấu hoàn thành
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
