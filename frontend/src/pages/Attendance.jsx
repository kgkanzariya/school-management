import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Attendance() {
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [filter, setFilter] = useState({ class_id: '', section_id: '', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get('/classes').then(r => setClasses(r.data)) }, [])

  const onClassChange = (classId) => {
    setFilter(f => ({ ...f, class_id: classId, section_id: '' }))
    setSections([])
    setStudents([])
    if (classId) api.get(`/sections?class_id=${classId}`).then(r => setSections(r.data))
  }

  const loadStudents = async () => {
    if (!filter.class_id) return toast.error('Please select a class')
    try {
      // per_page=-1 fetches ALL students (no pagination) for attendance marking
      const params = new URLSearchParams({ class_id: filter.class_id, per_page: -1 })
      if (filter.section_id) params.append('section_id', filter.section_id)

      const [studRes, attRes] = await Promise.all([
        api.get(`/students?${params}`),
        api.get(`/attendance?class_id=${filter.class_id}&date=${filter.date}`),
      ])

      const studs = studRes.data.data || []
      setStudents(studs)

      const map = {}
      attRes.data.forEach(a => { map[a.student_id] = a.status })
      studs.forEach(s => { if (!map[s.id]) map[s.id] = 'present' })
      setAttendance(map)
    } catch {
      toast.error('Failed to load students')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.post('/attendance', {
        class_id: filter.class_id,
        date: filter.date,
        attendance: students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'present' })),
      })
      toast.success('Attendance saved!')
    } catch { toast.error('Failed to save.') }
    finally { setLoading(false) }
  }

  const statusConfig = {
    present: { active: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300', dot: 'bg-emerald-500' },
    absent:  { active: 'bg-rose-100 text-rose-700 ring-1 ring-rose-300',     dot: 'bg-rose-500'    },
    late:    { active: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',   dot: 'bg-amber-500'   },
  }

  const counts = students.reduce((acc, s) => {
    const st = attendance[s.id] || 'present'
    acc[st] = (acc[st] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">Mark and manage daily attendance</p>
        </div>
        {students.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Present: {counts.present || 0}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Absent: {counts.absent || 0}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Late: {counts.late || 0}
            </span>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</label>
            <select
              value={filter.class_id}
              onChange={e => onClassChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</label>
            <select
              value={filter.section_id}
              onChange={e => setFilter(f => ({ ...f, section_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All sections</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={filter.date}
              onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadStudents}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm font-medium"
            >
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Student List
              <span className="ml-2 text-xs font-normal text-gray-500">({students.length} students)</span>
            </h3>
            <span className="text-xs text-gray-500 font-medium">{filter.date}</span>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Student
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s, i) => (
                <tr key={s.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.user?.name}</p>
                        <p className="text-xs text-gray-400">{s.schoolClass?.name} {s.section?.name && `· ${s.section.name}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {s.admission_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {['present', 'absent', 'late'].map(status => (
                        <button
                          key={status}
                          onClick={() => setAttendance(a => ({ ...a, [s.id]: status }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                            attendance[s.id] === status
                              ? statusConfig[status].active
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm font-medium"
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}

      {students.length === 0 && filter.class_id && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-16 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400 text-sm">Click "Load Students" to begin marking attendance.</p>
        </div>
      )}
    </div>
  )
}
