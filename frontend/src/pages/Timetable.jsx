import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Timetable() {
  const { user } = useAuth()
  const isStudent = user?.role === 'student'

  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [timetable, setTimetable] = useState([])
  const [filter, setFilter] = useState({ class_id: '', section_id: '' })

  useEffect(() => {
    if (isStudent) {
      // auto-load timetable for the logged-in student
      api.get('/my-timetable').then(r => setTimetable(r.data))
    } else {
      api.get('/classes').then(r => setClasses(r.data))
    }
  }, [isStudent])

  const onClassChange = (classId) => {
    setFilter(f => ({ ...f, class_id: classId, section_id: '' }))
    api.get(`/sections?class_id=${classId}`).then(r => setSections(r.data))
  }

  const loadTimetable = () => {
    if (!filter.class_id) return
    api.get(`/timetables?class_id=${filter.class_id}&section_id=${filter.section_id}`)
      .then(r => setTimetable(r.data))
  }

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = timetable.filter(t => t.day === day)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Timetable</h2>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {!isStudent && (
          <div className="flex gap-4 items-end mb-6">
            <div>
              <label className="text-sm text-gray-600">Class</label>
              <select value={filter.class_id} onChange={e => onClassChange(e.target.value)}
                className="w-40 border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="">Select</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Section</label>
              <select value={filter.section_id} onChange={e => setFilter(f => ({...f, section_id: e.target.value}))}
                className="w-32 border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="">All</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button onClick={loadTimetable} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              Load
            </button>
          </div>
        )}

        {timetable.length > 0 && (
          <div className="space-y-4">
            {DAYS.map(day => byDay[day].length > 0 && (
              <div key={day}>
                <h3 className="font-semibold text-gray-700 mb-2">{day}</h3>
                <div className="flex flex-wrap gap-3">
                  {byDay[day].map(t => (
                    <div key={t.id} className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-sm">
                      <p className="font-medium text-indigo-800">{t.subject?.name}</p>
                      <p className="text-gray-500 text-xs">{t.start_time} – {t.end_time}</p>
                      <p className="text-gray-400 text-xs">{t.teacher?.user?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {timetable.length === 0 && filter.class_id && (
          <p className="text-gray-400 text-center py-8">No timetable entries found.</p>
        )}
      </div>
    </div>
  )
}
