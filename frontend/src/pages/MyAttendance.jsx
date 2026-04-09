import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function MyAttendance() {
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, late: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-attendance')
      .then(r => {
        setRecords(r.data.records)
        setSummary(r.data.summary)
      })
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false))
  }, [])

  const pct = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
        <p className="text-sm text-gray-500 mt-1">Your attendance record</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Days', value: summary.total, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Present', value: summary.present, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Absent', value: summary.absent, color: 'bg-rose-50 text-rose-700' },
          { label: 'Late', value: summary.late, color: 'bg-amber-50 text-amber-700' },
        ].map(card => (
          <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm font-medium mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance % bar */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
          <span className="text-sm font-bold text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct < 75 && (
          <p className="text-xs text-rose-500 mt-2">⚠️ Attendance below 75%</p>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-semibold text-gray-800">Attendance Records</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && records.map((r, i) => (
              <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-3 text-gray-500">{i + 1}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{r.date}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'absent'  ? 'bg-rose-100 text-rose-700' :
                                             'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && records.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400">No attendance records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
