import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { RoadmapView } from './components/RoadmapView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Onboarding } from './components/Onboarding';
import { AdminPanel } from './components/AdminPanel';
import { SubjectTips } from './components/SubjectTips';
import { UserProfile, Roadmap, Task } from './types';
import { useGemini } from './hooks/useGemini';
import { Loader2, Sparkles, X, Database, ShieldCheck, Trophy } from 'lucide-react';
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
  const [showOnboarding, setShowOnboarding] = useState(false);
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
        const mappedProfile: UserProfile = {
          name: profileData.name,
          email: profileData.email,
          goal: profileData.goal,
          level: profileData.level,
          learningTime: profileData.learning_time,
          role: profileData.role,
          updatedAt: profileData.updated_at
        };
        setUserProfile(mappedProfile);
        // Chỉ đánh dấu hoàn thành onboarding nếu đã có mục tiêu (goal)
        if (mappedProfile.goal) {
          setOnboardingComplete(true);
        } else {
          console.log("Profile exists but no goal set, showing onboarding.");
          setOnboardingComplete(false);
        }
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
      } else if (profileData && profileData.goal) {
        // Nếu có profile (có goal) nhưng chưa có roadmap -> Tự động tạo
        console.log("Profile exists but no roadmap, generating...");
        const mappedProfile: UserProfile = {
          name: profileData.name,
          email: profileData.email,
          goal: profileData.goal,
          level: profileData.level,
          learningTime: profileData.learning_time,
          role: profileData.role,
          updatedAt: profileData.updated_at
        };
        handleOnboardingComplete(mappedProfile);
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
        name: finalProfile.name,
        email: finalProfile.email,
        goal: finalProfile.goal,
        level: finalProfile.level,
        learning_time: finalProfile.learningTime,
        role: finalProfile.role || 'user'
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

  const handleResetRoadmap = async () => {
    if (!user) return;
    
    // Xóa roadmap cũ trong DB
    await supabase.from('roadmaps').delete().eq('user_id', user.id);
    
    // Reset state
    setRoadmap(null);
    
    // Cập nhật profile để xóa goal cũ, buộc người dùng chọn lại goal mới
    if (userProfile) {
      const updatedProfile = { ...userProfile, goal: '' as any };
      setUserProfile(updatedProfile);
      await supabase.from('profiles').update({ goal: '' }).eq('id', user.id);
    }
    
    setShowOnboarding(true);
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

  // Nếu chưa đăng nhập và chưa hoàn thành onboarding (khách), hiện onboarding
  if ((!user && !onboardingComplete) || showOnboarding) {
    return <Onboarding onComplete={(p) => {
      handleOnboardingComplete(p);
      setShowOnboarding(false);
    }} initialProfile={userProfile} />;
  }

  // Nếu đã đăng nhập nhưng chưa có mục tiêu, chúng ta vẫn cho vào Dashboard 
  // nhưng có thể hiển thị thông báo hoặc tự động chuyển sang tab roadmap để họ tạo.
  
  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} role={userProfile?.role} />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-8">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                Chào mừng, <span className="text-indigo-400">{userProfile?.name}</span>!
              </h1>
              <p className="text-slate-400 flex items-center gap-2">
                {userProfile?.goal 
                  ? <>Hôm nay là một ngày tuyệt vời để học <span className="text-indigo-400 font-medium">{userProfile.goal}</span>.</>
                  : "Hãy thiết lập mục tiêu học tập để bắt đầu hành trình của bạn."
                }
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
                <ProgressDashboard roadmap={roadmap} userProfile={userProfile} />
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
                  <div className="space-y-6">
                    <RoadmapView roadmap={roadmap} onTaskClick={setSelectedTask} />
                    
                    {roadmap.progress === 100 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center"
                      >
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Chúc mừng! Bạn đã hoàn thành lộ trình!</h3>
                        <p className="text-slate-400 mb-6">Bạn đã xuất sắc chinh phục mục tiêu {roadmap.goal}. Bạn đã sẵn sàng cho thử thách tiếp theo chưa?</p>
                        <button 
                          onClick={handleResetRoadmap}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto"
                        >
                          <Sparkles className="w-5 h-5" />
                          Bắt đầu lộ trình mới
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có lộ trình học tập</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                      Hãy để AI Mentor giúp bạn thiết kế một lộ trình tối ưu dựa trên mục tiêu của bạn.
                    </p>
                    <button 
                      onClick={() => {
                        if (userProfile?.goal) {
                          handleOnboardingComplete(userProfile);
                        } else {
                          setShowOnboarding(true);
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                      {userProfile?.goal ? 'Tạo lộ trình ngay' : 'Thiết lập mục tiêu'}
                    </button>
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

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SubjectTips />
              </motion.div>
            )}

            {activeTab === 'admin' && userProfile?.role === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdminPanel />
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
