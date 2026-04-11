import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts'

function StatCard({ label, value, icon, gradient, change }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70 uppercase tracking-wider">{label}</p>
          <p className="text-4xl font-bold mt-2">{value ?? '—'}</p>
          {change && (
            <p className="text-xs text-white/60 mt-2">{change}</p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
      {/* decorative circle */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  )
}

const ATTENDANCE_COLORS = {
  Present: '#6366f1',
  Absent: '#f43f5e',
  Late: '#f59e0b',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }} className="font-medium">
            {p.value} students
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Grade badge colors
const gradeBadge = (grade) => {
  const map = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A':  'bg-green-100 text-green-700',
    'B':  'bg-blue-100 text-blue-700',
    'C':  'bg-yellow-100 text-yellow-700',
    'D':  'bg-orange-100 text-orange-700',
    'F':  'bg-red-100 text-red-700',
  }
  return map[grade] || 'bg-gray-100 text-gray-600'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get(`/dashboard/${user.role}`).then((r) => setData(r.data)).catch(() => {})
  }, [user.role])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  /* ─── ADMIN DASHBOARD ─── */
  if (user.role === 'admin') {
    const attendanceChart = [
      { name: 'Present', count: data.today_attendance?.present ?? 0 },
      { name: 'Absent',  count: data.today_attendance?.absent  ?? 0 },
      { name: 'Late',    count: data.today_attendance?.late    ?? 0 },
    ]

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user.name} 👋</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Students" value={data.total_students} icon="👨‍🎓"
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            change="Enrolled this year" />
          <StatCard label="Total Teachers" value={data.total_teachers} icon="👩‍🏫"
            gradient="bg-gradient-to-br from-violet-500 to-violet-700"
            change="Active staff" />
          <StatCard label="Total Classes" value={data.total_classes} icon="🏫"
            gradient="bg-gradient-to-br from-sky-500 to-sky-700"
            change="Across all grades" />
          <StatCard label="Fee Collected" value={`₹${Number(data.fee_collected_this_month).toLocaleString('en-IN')}`} icon="💰"
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
            change="This month" />
        </div>

        {/* Charts + Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Attendance Chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Today's Attendance</h3>
                <p className="text-gray-400 text-xs mt-0.5">Live overview for today</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceChart} barSize={52}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5ff', radius: 8 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {attendanceChart.map((entry) => (
                    <Cell key={entry.name} fill={ATTENDANCE_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex gap-6 mt-4 justify-center">
              {attendanceChart.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: ATTENDANCE_COLORS[item.name] }} />
                  {item.name}: <span className="font-semibold text-gray-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800 text-lg">Recent Notices</h3>
              <span className="text-xs bg-amber-50 text-amber-600 font-medium px-3 py-1 rounded-full">
                {data.recent_notices?.length} new
              </span>
            </div>
            <ul className="space-y-3 flex-1 overflow-auto">
              {data.recent_notices?.map((n, i) => (
                <li key={n.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.publish_date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: 'Present Today', value: data.today_attendance?.present ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
            { label: 'Absent Today',  value: data.today_attendance?.absent  ?? 0, color: 'text-red-500',     bg: 'bg-red-50',     icon: '❌' },
            { label: 'Late Today',    value: data.today_attendance?.late    ?? 0, color: 'text-amber-500',   bg: 'bg-amber-50',   icon: '⏰' },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-2xl p-5 flex items-center gap-4`}>
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ─── STUDENT DASHBOARD ─── */
  if (user.role === 'student') {
    const total   = Object.values(data.attendance_summary ?? {}).reduce((a, b) => a + b, 0)
    const present = data.attendance_summary?.present ?? 0
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user.name} 👋</p>
        </div>

        {/* Attendance Summary - Matching Theme Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Present', value: data.attendance_summary?.present ?? 0, gradient: 'from-indigo-500 to-indigo-700',   icon: '✅' },
            { label: 'Absent',  value: data.attendance_summary?.absent  ?? 0, gradient: 'from-rose-500 to-red-700',        icon: '❌' },
            { label: 'Late',    value: data.attendance_summary?.late    ?? 0, gradient: 'from-amber-400 to-yellow-600',    icon: '⏰' },
          ].map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} gradient={`bg-gradient-to-br ${item.gradient}`} />
          ))}
        </div>

        {/* Attendance % */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Attendance Rate</h3>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${pct >= 75 ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-600'}`}>
              {pct}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-indigo-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Minimum 75% required</p>
        </div>

        {/* Recent Marks - Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Recent Marks</h3>
                <p className="text-xs text-gray-500 mt-0.5">Your latest exam performance</p>
              </div>
              <span className="text-xs bg-white text-indigo-600 font-medium px-3 py-1.5 rounded-full shadow-sm">
                {data.recent_marks?.length} exams
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Exam
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Marks Obtained</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recent_marks?.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-800">{m.exam?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-medium">{m.subject?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px] bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                            style={{ width: `${m.marks_obtained}%` }} 
                          />
                        </div>
                        <span className="text-gray-800 font-bold text-base min-w-[3rem]">{m.marks_obtained}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${gradeBadge(m.grade)}`}>
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.recent_marks?.length && (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-gray-400 text-sm">No marks available yet</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─── TEACHER / PARENT DASHBOARD ─── */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Welcome back, {user.name} 👋</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-lg">📢 Notices</h3>
          <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full">
            {data.notices?.length} notices
          </span>
        </div>
        <ul className="divide-y divide-gray-50">
          {data.notices?.map((n) => (
            <li key={n.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.publish_date} · For: <span className="capitalize">{n.target_role}</span></p>
              </div>
            </li>
          ))}
          {!data.notices?.length && (
            <li className="px-6 py-10 text-center text-gray-400 text-sm">No notices available.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
