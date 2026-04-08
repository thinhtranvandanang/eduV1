import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Roadmap, Task } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onTaskClick: (task: Task) => void;
}

export function RoadmapView({ roadmap, onTaskClick }: RoadmapViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Lộ trình học tập</h2>
          <p className="text-slate-400">Mục tiêu: <span className="text-indigo-400 font-medium">{roadmap.goal}</span></p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-400">{roadmap.progress}%</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Hoàn thành</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800" />
        
        <div className="space-y-6">
          {roadmap.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTaskClick(task)}
              className={cn(
                "relative pl-12 cursor-pointer group",
                task.status === 'completed' ? "opacity-60" : "opacity-100"
              )}
            >
              <div className={cn(
                "absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300",
                task.status === 'completed' 
                  ? "bg-green-500 border-green-500 text-white" 
                  : task.status === 'in-progress'
                    ? "bg-indigo-600 border-indigo-600 text-white animate-pulse"
                    : "bg-[#0f172a] border-slate-700 text-slate-500 group-hover:border-indigo-500"
              )}>
                {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>

              <div className={cn(
                "p-5 rounded-2xl border transition-all duration-300",
                task.status === 'in-progress'
                  ? "bg-indigo-600/5 border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={cn(
                      "font-semibold text-lg mb-1",
                      task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-100"
                    )}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      task.difficulty === 'easy' ? "bg-green-500/10 text-green-400" :
                      task.difficulty === 'medium' ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    )}>
                      {task.difficulty}
                    </span>
                    {task.status === 'in-progress' && (
                      <span className="flex items-center gap-1 text-xs text-indigo-400 font-medium">
                        Đang học <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
