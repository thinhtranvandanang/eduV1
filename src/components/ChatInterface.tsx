import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGemini } from '../hooks/useGemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_PROMPT = `Bạn là EduAI Mentor - một người hướng dẫn lập trình tận tâm.
NGUYÊN TẮC CỐT LÕI:
1. KHÔNG BAO GIỜ cung cấp giải pháp hoàn chỉnh (full code).
2. Chỉ cung cấp gợi ý, giải thích khái niệm và hướng dẫn từng bước.
3. Khuyến khích người học tự suy nghĩ và giải quyết vấn đề.
4. Nếu người học yêu cầu code, hãy giải thích tại sao bạn không thể đưa code và gợi ý cách họ có thể tự viết.
5. Sử dụng tiếng Việt thân thiện, chuyên nghiệp.
6. Khi giải thích lỗi, hãy tập trung vào TẠI SAO lỗi xảy ra thay vì chỉ cách sửa ngay lập tức.`;

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { stream, loading, response } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, response]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const fullResponse = await stream(input, SYSTEM_PROMPT, history);
    if (fullResponse) {
      setMessages(prev => [...prev, { role: 'model', content: fullResponse }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-4 border-bottom border-slate-800 bg-slate-900/50 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Bot className="text-white w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Mentor</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Đang trực tuyến
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                msg.role === 'user' ? "bg-slate-700" : "bg-indigo-600"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-slate-800 text-slate-200 rounded-tr-none" 
                  : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-2xl text-sm leading-relaxed bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
          {loading && !response && (
            <div className="flex gap-4 items-center text-slate-500 text-sm italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI Mentor đang suy nghĩ...
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi AI Mentor về lỗi code hoặc kiến thức..."
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Mentor sẽ không bao giờ đưa code giải sẵn cho bạn.
        </p>
      </div>
    </div>
  );
}
