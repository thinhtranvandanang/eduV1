import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from '../hooks/useGemini';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Bạn là EduAI - một AI Mentor hỗ trợ học lập trình.
NGUYÊN TẮC CỐT LÕI:
1. KHÔNG BAO GIỜ trả lời full code.
2. Chỉ ra lỗi sai, giải thích nguyên nhân và gợi ý hướng giải quyết.
3. Sử dụng các câu hỏi gợi mở để người học tự tư duy.
4. Nếu người học yêu cầu code, hãy từ chối khéo léo và nói rằng bạn ở đây để giúp họ học cách tự viết code.
5. Luôn phản hồi bằng tiếng Việt thân thiện, chuyên nghiệp.`;

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { stream, loading, error } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    let assistantContent = "";
    setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

    await stream(userMessage, SYSTEM_PROMPT, (chunk) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          return [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }];
        }
        return prev;
      });
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-bottom border-slate-800 bg-slate-800/50 flex items-center gap-2">
        <Bot className="w-5 h-5 text-emerald-400" />
        <h2 className="font-semibold text-slate-200">AI Mentor</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 space-y-2"
            >
              <p className="text-slate-400">Chào bạn! Tôi là EduAI. Bạn đang gặp khó khăn gì trong lập trình?</p>
              <p className="text-xs text-slate-500 italic">Lưu ý: Tôi sẽ không giải hộ bài tập, nhưng sẽ hướng dẫn bạn tự làm.</p>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-emerald-500" : "bg-slate-700"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-emerald-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none"
              )}>
                {msg.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
              </div>
            </motion.div>
          ))}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-800/30 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mô tả lỗi hoặc dán code của bạn tại đây..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
