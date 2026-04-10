import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Info, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

export function EnglishTipsContent() {
  return (
    <div className="bg-[#faf9f7] text-[#1c1c1a] font-serif p-4 md:p-10 rounded-3xl shadow-sm border border-[#e2e0db] max-w-5xl mx-auto">
      {/* Header */}
      <header className="border-b-2 border-[#1c1c1a] pb-6 mb-10">
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-[#6b6760] mb-2">
          Phiên bản bổ sung v2 · Tiếng Anh Thực Hành · FPT University
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
          Quy Trình Chuyển Câu <em className="not-italic text-[#1a6b3a]">Việt → Anh</em>
        </h1>
        <div className="font-mono text-xs text-[#6b6760]">
          // 5 tầng quyết định · trợ động từ · 9 loại câu · thì & trạng thái hành động · động từ khiếm khuyết · lỗi phổ biến · mẹo nhớ
        </div>
      </header>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-[#e2e0db] rounded-lg overflow-hidden mb-12 bg-white">
        {[
          { step: '01', label: 'Loại câu', hint: 'Khẳng định? Hỏi? Phủ định? Điều kiện?' },
          { step: '02', label: 'Chủ ngữ', hint: 'Ai? I/He/She? Đừng bỏ như tiếng Việt!' },
          { step: '03', label: 'Xác định thì', hint: 'Khi nào? Đang/Đơn/Xong?' },
          { step: '04', label: 'Chọn công thức', hint: 'Loại câu + Thì → 1 công thức duy nhất' },
          { step: '05', label: 'Điền & kiểm tra', hint: 'Chia V, a/an/the, trật tự S→V→O' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 border-r border-[#e2e0db] last:border-r-0 relative group hover:bg-[#f5f4f1] transition-colors">
            <span className="block font-mono text-[10px] text-[#6b6760] mb-1 tracking-wider uppercase">TẦNG {item.step}</span>
            <span className="block text-sm font-bold mb-1">{item.label}</span>
            <span className="block text-[10px] text-[#6b6760] leading-tight">{item.hint}</span>
            {idx < 4 && <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#e2e0db] text-[10px]">▶</div>}
          </div>
        ))}
      </div>

      {/* SWIFT Mnemonic */}
      <div className="bg-[#1c1c1a] text-[#faf9f7] p-8 rounded-xl mb-12">
        <div className="font-mono text-[10px] tracking-[3px] opacity-60 mb-6 uppercase">// MẸO NHỚ — CÔNG THỨC SWIFT</div>
        <div className="space-y-4">
          {[
            { l: 'S', w: 'Subject', d: 'Ai? Cái gì? → I / She / They / He…' },
            { l: 'W', w: 'When', d: 'Khi nào? → Xác định thì (hiện tại / quá khứ / tương lai)' },
            { l: 'I', w: 'Inflect', d: 'Chia động từ đúng thì và chủ ngữ' },
            { l: 'F', w: 'Fill in', d: 'Thêm tân ngữ / bổ ngữ / thông tin còn thiếu' },
            { l: 'T', w: 'Time word', d: 'Thêm trạng từ thời gian: yesterday / now / already…' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-4">
              <span className="font-mono text-3xl font-bold opacity-30 w-8 shrink-0">{item.l}</span>
              <span className="font-bold text-lg w-24 shrink-0">{item.w}</span>
              <span className="text-sm opacity-70">{item.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-[#f0f5f0] border border-[#c5d9c5] p-6 md:p-8 rounded-2xl mb-12">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#1a6b3a] mb-6">// Ví dụ áp 5 tầng thực tế</div>
        <div className="space-y-8">
          {[
            {
              viet: 'Hôm qua anh ấy không đến trường.',
              steps: ['01 Loại: Phủ định', '02 S: He', '03 Thì: hôm qua → Past Simple', '04 CT: S + didn\'t + V', '05 Điền: go to school yesterday'],
              result: 'He didn\'t go to school yesterday.'
            },
            {
              viet: 'Bạn đã từng đến Hà Nội chưa?',
              steps: ['01 Loại: Hỏi Yes/No', '02 S: You', '03 Thì: đã từng/chưa → Present Perfect', '04 CT: Have/Has + S + ever + V3?', '05 Điền: been to Hanoi'],
              result: 'Have you ever been to Hanoi?'
            }
          ].map((item, idx) => (
            <div key={idx} className="border-b border-[#c5d9c5] last:border-0 pb-6 last:pb-0">
              <div className="italic text-[#6b6760] mb-4">「 {item.viet} 」</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.steps.map((s, sIdx) => (
                  <span key={sIdx} className="font-mono text-[10px] px-2 py-1 bg-white border border-[#e2e0db] rounded text-[#6b6760]">
                    {s}
                  </span>
                ))}
              </div>
              <div className="font-mono text-xl font-bold text-[#1a6b3a]">{item.result}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: Types */}
      <section className="mb-12">
        <div className="flex items-baseline gap-4 border-b border-[#e2e0db] pb-2 mb-6">
          <span className="font-mono text-[10px] bg-[#1c1c1a] text-[#faf9f7] px-2 py-1 tracking-wider">TẦNG 01</span>
          <h2 className="text-xl font-bold">Xác định Loại Câu — 9 Kiểu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'Câu Khẳng Định', f: 'S + V + O + (Place) + (Time)', ex: 'She studies English every day.', c: '#1a6b3a' },
            { t: 'Câu Phủ Định', f: 'S + don\'t/doesn\'t/didn\'t + V', ex: 'He doesn\'t like coffee.', c: '#c94a2a', tr: 'Nhận biết: "không, chưa, chẳng"' },
            { t: 'Câu Hỏi Yes/No', f: 'Trợ ĐT + S + V(bare) + ...?', ex: 'Do you like it? / Has she left?', c: '#2a5ca8', tr: 'Đảo trợ động từ lên đầu!' },
            { t: 'Câu Hỏi Wh-', f: 'Wh- + Trợ ĐT + S + V + ...?', ex: 'What are you doing?', c: '#2a5ca8', tr: 'What, Where, When, Why, How' },
          ].map((type, idx) => (
            <div key={idx} className="bg-white border border-[#e2e0db] p-4 rounded-lg border-t-4" style={{ borderTopColor: type.c }}>
              <div className="font-mono text-[10px] uppercase text-[#6b6760] mb-1">TYPE {idx + 1}</div>
              <div className="font-bold mb-2">{type.t}</div>
              {type.tr && <div className="text-[11px] text-[#c94a2a] mb-2">{type.tr}</div>}
              <div className="font-mono text-[11px] bg-[#f5f4f1] p-2 rounded mb-2 text-[#2a5ca8]">{type.f}</div>
              <div className="text-xs italic text-[#6b6760]"><span className="text-[#1a6b3a] font-semibold not-italic">{type.ex}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Subjects */}
      <section className="mb-12">
        <div className="flex items-baseline gap-4 border-b border-[#e2e0db] pb-2 mb-6">
          <span className="font-mono text-[10px] bg-[#1c1c1a] text-[#faf9f7] px-2 py-1 tracking-wider">TẦNG 02</span>
          <h2 className="text-xl font-bold">Xác định Chủ Ngữ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1c1c1a] text-[#faf9f7] font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">Tiếng Việt</th>
                <th className="p-3">Tiếng Anh</th>
                <th className="p-3">Hiện tại đơn</th>
                <th className="p-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e0db]">
              {[
                { v: 'tôi, mình', e: 'I', h: 'I go / I am', n: 'Luôn viết hoa' },
                { v: 'bạn, anh, chị', e: 'You', h: 'You go / You are', n: 'Số ít & nhiều' },
                { v: 'anh ấy, ông ấy', e: 'He', h: 'He goes / He is', n: '→ V thêm s/es!', w: true },
                { v: 'cô ấy, bà ấy', e: 'She', h: 'She goes / She is', n: '→ V thêm s/es!', w: true },
                { v: 'chúng tôi', e: 'We', h: 'We go / We are', n: 'V nguyên thể' },
                { v: 'họ, chúng nó', e: 'They', h: 'They go / They are', n: 'V nguyên thể' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f5f4f1] transition-colors">
                  <td className="p-3 text-[#6b6760]">{row.v}</td>
                  <td className="p-3 font-bold font-mono">{row.e}</td>
                  <td className="p-3">{row.h}</td>
                  <td className="p-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono",
                      row.w ? "bg-[#fdf0ed] text-[#c94a2a]" : "bg-[#eef4f0] text-[#1a6b3a]"
                    )}>
                      {row.n}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-[#fdf8ed] text-[#c94a2a] text-xs italic border-l-4 border-[#b87a00]">
          ⚠ Tiếng Việt hay BỎ chủ ngữ → Tiếng Anh PHẢI thêm vào! Ví dụ: "Đi học rồi" → I have gone to school.
        </div>
      </section>

      {/* Section 3: Tenses */}
      <section className="mb-12">
        <div className="flex items-baseline gap-4 border-b border-[#e2e0db] pb-2 mb-6">
          <span className="font-mono text-[10px] bg-[#1c1c1a] text-[#faf9f7] px-2 py-1 tracking-wider">TẦNG 03</span>
          <h2 className="text-xl font-bold">Xác định Thì</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#f5f4f1] border-l-4 border-[#1a6b3a] p-4 rounded-r-lg">
            <div className="font-mono text-xs font-bold text-[#1a6b3a] mb-2 uppercase">① Việc này xảy ra KHI NÀO?</div>
            <div className="flex flex-wrap gap-2">
              {['Đang → Hiện tại', 'Đã xong → Quá khứ', 'Sẽ → Tương lai'].map(t => (
                <span key={t} className="text-[11px] px-2 py-1 bg-white border border-[#e2e0db] rounded-full">{t}</span>
              ))}
            </div>
          </div>
          <div className="bg-[#f5f4f1] border-l-4 border-[#1a6b3a] p-4 rounded-r-lg">
            <div className="font-mono text-xs font-bold text-[#1a6b3a] mb-2 uppercase">② Có đang diễn ra NGAY LÚC NÓI?</div>
            <div className="flex flex-wrap gap-2">
              {['CÓ → Thêm -ing', 'KHÔNG → Dùng Simple'].map(t => (
                <span key={t} className="text-[11px] px-2 py-1 bg-white border border-[#e2e0db] rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1c1c1a] text-[#faf9f7] font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">Từ tín hiệu</th>
                <th className="p-3">Thì</th>
                <th className="p-3">Công thức</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e0db]">
              {[
                { s: ['thường', 'luôn', 'mỗi ngày'], t: 'Present Simple', f: 'S + V(s/es)', b: '#1a6b3a' },
                { s: ['đang', 'lúc này', 'now'], t: 'Present Continuous', f: 'S + am/is/are + V-ing', b: '#1a6b3a' },
                { s: ['đã từng', 'vừa', 'chưa'], t: 'Present Perfect', f: 'S + have/has + V3', b: '#b87a00' },
                { s: ['hôm qua', 'trước đây', 'ago'], t: 'Past Simple', f: 'S + V2/ed', b: '#c94a2a' },
                { s: ['sẽ', 'tomorrow'], t: 'Future Simple', f: 'S + will + V', b: '#2a5ca8' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f5f4f1] transition-colors">
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {row.s.map(s => <span key={s} className="bg-[#eef4f0] text-[#1a6b3a] font-mono text-[10px] px-1.5 py-0.5 rounded">{s}</span>)}
                    </div>
                  </td>
                  <td className="p-3 font-bold border-l-4" style={{ borderLeftColor: row.b }}>{row.t}</td>
                  <td className="p-3 font-mono text-[#2a5ca8] font-bold">{row.f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Errors */}
      <section className="mb-12">
        <div className="flex items-baseline gap-4 border-b border-[#e2e0db] pb-2 mb-6">
          <span className="font-mono text-[10px] bg-[#1c1c1a] text-[#faf9f7] px-2 py-1 tracking-wider uppercase">LỖI PHỔ BIẾN</span>
          <h2 className="text-xl font-bold">8 Lỗi Hay Mắc Khi Chuyển Câu</h2>
        </div>
        <div className="space-y-3">
          {[
            { w: 'Đi học rồi. → Go to school.', c: 'I have gone to school.', r: 'Tiếng Việt bỏ chủ ngữ → Tiếng Anh BẮT BUỘC có S' },
            { w: 'What you are doing?', c: 'What are you doing?', r: 'Câu hỏi Wh- → đảo trợ động từ lên TRƯỚC S' },
            { w: 'I don\'t know where does she live.', c: 'I don\'t know where she lives.', r: 'Câu hỏi lồng nhau (embedded) → S+V thẳng, KHÔNG đảo' },
          ].map((err, idx) => (
            <div key={idx} className="bg-white border border-[#e2e0db] border-l-4 border-l-[#c94a2a] p-4 rounded-r-lg">
              <div className="font-mono text-xs text-[#c94a2a] mb-1">❌ {err.w}</div>
              <div className="font-mono text-xs text-[#1a6b3a] mb-2">✅ {err.c}</div>
              <div className="text-[11px] italic text-[#6b6760]">{err.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e0db] pt-4 mt-12 flex justify-between font-mono text-[10px] text-[#6b6760]">
        <span>Vietnamese → English Complete Guide v4</span>
        <span>FPT University · EduAI Assistant</span>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
