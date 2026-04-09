import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function MyChildren() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/my-children')
      .then(r => setChildren(r.data))
      .catch(() => toast.error('Failed to load children data'))
      .finally(() => setLoading(false))
  }, [])

  const gradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-600'
    if (['A+', 'A'].includes(grade)) return 'bg-emerald-100 text-emerald-700'
    if (['B+', 'B'].includes(grade)) return 'bg-indigo-100 text-indigo-700'
    if (['C+', 'C'].includes(grade)) return 'bg-amber-100 text-amber-700'
    return 'bg-rose-100 text-rose-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Children</h2>
        <p className="text-sm text-gray-500 mt-1">{children.length} child{children.length !== 1 ? 'ren' : ''} enrolled</p>
      </div>

      {children.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-16 text-center">
          <div className="text-4xl mb-3">👨‍👩‍👧</div>
          <p className="text-gray-400 text-sm">No children linked to your account.</p>
        </div>
      )}

      {children.map(child => {
        const att = child.attendance_summary || {}
        const pct = att.total > 0 ? Math.round((att.present / att.total) * 100) : 0
        const isOpen = expanded === child.id

        return (
          <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Child Header */}
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-indigo-50/30 transition-colors"
              onClick={() => setExpanded(isOpen ? null : child.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold">
                  {child.user?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{child.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {child.schoolClass?.name}
                    {child.section?.name && ` · Section ${child.section.name}`}
                    {' · '}{child.admission_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center hidden sm:block">
                  <p className="font-bold text-indigo-600">{pct}%</p>
                  <p className="text-xs text-gray-400">Attendance</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="font-bold text-gray-700">{child.marks?.length || 0}</p>
                  <p className="text-xs text-gray-400">Results</p>
                </div>
                <span className="text-gray-400 text-lg">{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {isOpen && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-5">
                {/* Attendance Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Attendance (last 30 days)</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Total', value: att.total, color: 'bg-indigo-50 text-indigo-700' },
                      { label: 'Present', value: att.present, color: 'bg-emerald-50 text-emerald-700' },
                      { label: 'Absent', value: att.absent, color: 'bg-rose-50 text-rose-700' },
                      { label: 'Late', value: att.late, color: 'bg-amber-50 text-amber-700' },
                    ].map(card => (
                      <div key={card.label} className={`rounded-lg p-3 text-center ${card.color}`}>
                        <p className="text-xl font-bold">{card.value}</p>
                        <p className="text-xs font-medium mt-0.5">{card.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Attendance rate</span>
                      <span className="font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {pct < 75 && <p className="text-xs text-rose-500 mt-1">⚠️ Below 75% attendance</p>}
                  </div>
                </div>

                {/* Marks */}
                {child.marks?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Exam Results</h4>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Exam</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Subject</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Marks</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {child.marks.map(m => (
                          <tr key={m.id} className="hover:bg-indigo-50/20">
                            <td className="px-4 py-2 text-gray-700">{m.exam?.name}</td>
                            <td className="px-4 py-2 text-gray-600">{m.subject?.name}</td>
                            <td className="px-4 py-2 font-bold text-indigo-600">
                              {m.marks_obtained}
                              {m.exam?.total_marks && <span className="text-gray-400 font-normal"> / {m.exam.total_marks}</span>}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor(m.grade)}`}>
                                {m.grade || '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {child.marks?.length === 0 && (
                  <p className="text-sm text-gray-400">No exam results yet.</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
