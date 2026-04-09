import React from 'react';
import { 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { Roadmap, UserProfile } from '../types';

interface ProgressDashboardProps {
  roadmap: Roadmap | null;
  userProfile: UserProfile | null;
}

export function ProgressDashboard({ roadmap, userProfile }: ProgressDashboardProps) {
  const completedTasks = roadmap?.tasks.filter(t => t.status === 'completed').length || 0;
  const totalTasks = roadmap?.tasks.length || 0;
  
  const stats = [
    { label: 'Tiến độ tổng thể', value: `${roadmap?.progress || 0}%`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Bài tập hoàn thành', value: `${completedTasks}/${totalTasks}`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Mục tiêu hiện tại', value: userProfile?.goal || 'N/A', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Trình độ', value: userProfile?.level || 'N/A', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className="text-2xl font-bold text-white mb-1 uppercase">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Chi tiết các bước
          </h3>
          <div className="space-y-4">
            {roadmap?.tasks.slice(0, 5).map((task, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={cn(
                    "text-slate-300",
                    task.status === 'completed' && "line-through opacity-50"
                  )}>{task.title}</span>
                  <span className="text-indigo-400 font-medium">
                    {task.status === 'completed' ? '100%' : task.status === 'in-progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: task.status === 'completed' ? '100%' : task.status === 'in-progress' ? '50%' : '0%' }}
                    className={cn(
                      "h-full rounded-full",
                      task.status === 'completed' ? "bg-emerald-500" : "bg-indigo-600"
                    )}
                  />
                </div>
              </div>
            )) || (
              <p className="text-slate-500 text-center py-8">Chưa có dữ liệu lộ trình.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Lịch sử học tập
          </h3>
          <div className="flex gap-2 h-32 items-end">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-indigo-600/20 border-t-2 border-indigo-500 rounded-t-lg hover:bg-indigo-600/40 transition-all cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">T{i+2}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
