import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import ProfileForm from './components/ProfileForm';
import Roadmap from './components/Roadmap';
import { LogOut, LayoutDashboard, MessageSquare, BookOpen, Settings, User as UserIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'roadmap'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    // Mock login for demo if Supabase is not configured
    if (!supabase) {
      setUser({ email: 'demo@eduai.com', user_metadata: { full_name: 'Demo User' } });
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">EduAI</h1>
            <p className="text-slate-400">AI Mentor cá nhân hóa cho hành trình lập trình của bạn.</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleLogin}
            className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Đăng nhập bằng Google
          </motion.button>
          
          <p className="text-xs text-slate-500">Bằng cách đăng nhập, bạn đồng ý với Điều khoản sử dụng của EduAI.</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <ProfileForm onComplete={() => setHasProfile(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduAI</span>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'chat', label: 'AI Mentor', icon: MessageSquare },
              { id: 'roadmap', label: 'Lộ trình', icon: BookOpen },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-800 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Settings className="w-5 h-5" />
              Cài đặt
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email}</p>
              <p className="text-xs text-slate-500">Học viên</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" />
              ) : (
                <UserIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/10">
                      <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại, {user.user_metadata?.full_name?.split(' ')[0] || 'bạn'}!</h2>
                      <p className="opacity-90 text-sm">Hôm nay bạn có 3 task mới cần hoàn thành. Hãy bắt đầu ngay nhé!</p>
                      <button 
                        onClick={() => setActiveTab('roadmap')}
                        className="mt-6 px-6 py-2 bg-white text-emerald-600 font-bold rounded-xl text-sm hover:bg-slate-100 transition-colors"
                      >
                        Xem Roadmap
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Thời gian học</p>
                        <p className="text-2xl font-bold text-white">12.5 Giờ</p>
                        <p className="text-emerald-400 text-[10px] mt-1">+2.4h tuần này</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Task hoàn thành</p>
                        <p className="text-2xl font-bold text-white">8 / 32</p>
                        <p className="text-slate-500 text-[10px] mt-1">Tiến độ 25%</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-sm">Task hôm nay</h3>
                        <button className="text-xs text-emerald-400 hover:underline">Xem tất cả</button>
                      </div>
                      <div className="p-4 space-y-3">
                        {[
                          'Ôn tập Array Methods (map, filter)',
                          'Thực hành Fetch API với JSONPlaceholder',
                          'Tóm tắt nội dung buổi học hôm qua'
                        ].map((task, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                            <div className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center shrink-0">
                              <div className="w-3 h-3 bg-emerald-500 rounded-sm opacity-0" />
                            </div>
                            <span className="text-sm text-slate-300">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <h3 className="font-bold text-sm mb-4">AI Mentor Tip</h3>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "Thay vì copy code từ StackOverflow, hãy thử tự giải thích từng dòng code đó cho chính mình. Đó là cách tốt nhất để ghi nhớ."
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <h3 className="font-bold text-sm mb-4">Ghi chú gần đây</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                          <p className="text-xs font-medium text-slate-200">Cách dùng useEffect</p>
                          <p className="text-[10px] text-slate-500 mt-1">2 giờ trước</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                          <p className="text-xs font-medium text-slate-200">Link tài liệu CSS Grid</p>
                          <p className="text-[10px] text-slate-500 mt-1">Hôm qua</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Chat />
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl mx-auto"
                >
                  <Roadmap />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
