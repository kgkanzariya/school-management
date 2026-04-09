import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function MyMarks() {
  const [marks, setMarks] = useState([])
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-marks')
      .then(r => {
        setMarks(r.data)
        // derive unique exams from marks
        const uniqueExams = []
        const seen = new Set()
        r.data.forEach(m => {
          if (m.exam && !seen.has(m.exam.id)) {
            seen.add(m.exam.id)
            uniqueExams.push(m.exam)
          }
        })
        setExams(uniqueExams)
      })
      .catch(() => toast.error('Failed to load marks'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = selectedExam ? marks.filter(m => m.exam?.id === Number(selectedExam)) : marks

  const gradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-600'
    if (['A+', 'A'].includes(grade)) return 'bg-emerald-100 text-emerald-700'
    if (['B+', 'B'].includes(grade)) return 'bg-indigo-100 text-indigo-700'
    if (['C+', 'C'].includes(grade)) return 'bg-amber-100 text-amber-700'
    return 'bg-rose-100 text-rose-700'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Marks</h2>
        <p className="text-sm text-gray-500 mt-1">Your exam results</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <label className="text-sm font-medium text-gray-600">Filter by Exam</label>
        <select
          value={selectedExam}
          onChange={e => setSelectedExam(e.target.value)}
          className="mt-1 w-full sm:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Exams</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-semibold text-gray-800">Results</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Exam</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && filtered.map((m, i) => (
              <tr key={m.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-3 text-gray-500">{i + 1}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{m.exam?.name}</td>
                <td className="px-6 py-3 text-gray-600">{m.subject?.name}</td>
                <td className="px-6 py-3 font-bold text-indigo-600">
                  {m.marks_obtained}
                  {m.exam?.total_marks && <span className="text-gray-400 font-normal"> / {m.exam.total_marks}</span>}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${gradeColor(m.grade)}`}>
                    {m.grade || '—'}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No marks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
