import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Lộ trình', icon: Map },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Code2 className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">EduAI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
