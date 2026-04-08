import React from 'react';
import { CheckCircle2, Circle, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

const mockRoadmap: RoadmapStep[] = [
  { id: '1', title: 'Cơ bản về HTML/CSS', description: 'Học về cấu trúc web và cách dàn trang cơ bản.', status: 'completed' },
  { id: '2', title: 'JavaScript Cơ bản', description: 'Biến, kiểu dữ liệu, vòng lặp và hàm trong JS.', status: 'current' },
  { id: '3', title: 'DOM Manipulation', description: 'Cách tương tác với các phần tử trên trang web.', status: 'upcoming' },
  { id: '4', title: 'React Fundamentals', description: 'Components, Props, State và Hooks.', status: 'upcoming' },
];

export default function Roadmap() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="text-emerald-400" /> Lộ trình học tập
        </h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Tiến độ: 25%
        </span>
      </div>

      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800" />

        {mockRoadmap.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative pl-14 p-5 rounded-2xl border transition-all",
              step.status === 'current' 
                ? "bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/20" 
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className={cn(
              "absolute left-4 top-6 w-5 h-5 rounded-full flex items-center justify-center z-10",
              step.status === 'completed' ? "bg-emerald-500" : 
              step.status === 'current' ? "bg-emerald-500 animate-pulse" : "bg-slate-800"
            )}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-3 h-3 text-white" />
              ) : (
                <Circle className={cn("w-2 h-2", step.status === 'current' ? "text-white fill-white" : "text-slate-600")} />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "font-semibold text-sm",
                  step.status === 'upcoming' ? "text-slate-400" : "text-slate-100"
                )}>
                  {step.title}
                </h3>
                {step.status === 'current' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    Đang học
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>

            {step.status === 'current' && (
              <button className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                Tiếp tục học <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
