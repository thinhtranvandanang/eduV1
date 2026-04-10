import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Languages, Calculator, FlaskConical, Globe, Palette, ChevronRight, Search, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import { EnglishTipsContent } from './EnglishTipsContent';

type Subject = 'english' | 'math' | 'science' | 'history' | 'art';

interface SubjectInfo {
  id: Subject;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const subjects: SubjectInfo[] = [
  { id: 'english', label: 'Tiếng Anh', icon: Languages, color: 'text-emerald-500', description: 'Mẹo học ngữ pháp, từ vựng và quy trình dịch thuật.' },
  { id: 'math', label: 'Toán học', icon: Calculator, color: 'text-blue-500', description: 'Công thức nhanh và mẹo giải các dạng bài tập phổ biến.' },
  { id: 'science', label: 'Khoa học', icon: FlaskConical, color: 'text-purple-500', description: 'Kiến thức cốt lõi về Vật lý, Hóa học và Sinh học.' },
  { id: 'history', label: 'Lịch sử & Địa lý', icon: Globe, color: 'text-orange-500', description: 'Cách nhớ mốc thời gian và kiến thức địa lý tự nhiên.' },
  { id: 'art', label: 'Nghệ thuật', icon: Palette, color: 'text-pink-500', description: 'Cảm thụ văn học và các mẹo sáng tạo nội dung.' },
];

export function SubjectTips() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('english');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar for Subjects */}
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Tìm môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredSubjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group text-left",
                selectedSubject === subject.id 
                  ? "bg-indigo-600/10 border border-indigo-500/20 ring-1 ring-indigo-500/20" 
                  : "bg-slate-900/30 border border-transparent hover:bg-slate-800/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                selectedSubject === subject.id ? "bg-indigo-500/20" : "bg-slate-800"
              )}>
                <subject.icon className={cn("w-5 h-5", selectedSubject === subject.id ? subject.color : "text-slate-500")} />
              </div>
              <div className="flex-1">
                <div className={cn(
                  "font-bold text-sm",
                  selectedSubject === subject.id ? "text-white" : "text-slate-400"
                )}>
                  {subject.label}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{subject.description}</div>
              </div>
              {selectedSubject === subject.id && (
                <ChevronRight className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Bạn có biết?</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Học theo mẹo và quy trình giúp não bộ ghi nhớ thông tin lâu hơn 40% so với việc học thuộc lòng máy móc.
          </p>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {selectedSubject === 'english' ? (
              <EnglishTipsContent />
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center px-6">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                  <Book className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Đang cập nhật nội dung</h3>
                <p className="text-slate-400 max-w-sm">
                  Mẹo cho môn {subjects.find(s => s.id === selectedSubject)?.label} đang được đội ngũ giáo viên EduAI biên soạn. Hãy quay lại sau nhé!
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
