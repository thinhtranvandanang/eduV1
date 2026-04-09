import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, BookOpen, TrendingUp, Search, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AdminStats {
  totalUsers: number;
  totalRoadmaps: number;
  avgProgress: number;
}

interface UserListItem {
  id: string;
  name: string;
  email: string;
  goal: string;
  created_at: string;
  role: string;
}

export function AdminPanel() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalRoadmaps: 0, avgProgress: 0 });
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: roadmaps } = await supabase.from('roadmaps').select('progress');
      
      const totalRoadmaps = roadmaps?.length || 0;
      const avgProgress = totalRoadmaps > 0 
        ? Math.round(roadmaps!.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalRoadmaps)
        : 0;

      setStats({
        totalUsers: userCount || 0,
        totalRoadmaps,
        avgProgress
      });

      // Fetch users list
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, name, email, goal, created_at, role')
        .order('created_at', { ascending: false });

      if (usersData) {
        setUsers(usersData as UserListItem[]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6 text-blue-400" />}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
          label="Lộ trình đã tạo"
          value={stats.totalRoadmaps}
          color="indigo"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
          label="Tiến độ trung bình"
          value={`${stats.avgProgress}%`}
          color="emerald"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">Danh sách người dùng</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Người dùng</th>
                <th className="px-6 py-4 font-semibold">Mục tiêu</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                          <UserIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name || 'N/A'}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                        {user.goal || 'Chưa chọn'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md",
                        user.role === 'admin' ? "bg-red-500/10 text-red-400" : "bg-slate-500/10 text-slate-400"
                      )}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          color === 'blue' ? "bg-blue-500/10" : color === 'indigo' ? "bg-indigo-500/10" : "bg-emerald-500/10"
        )}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
