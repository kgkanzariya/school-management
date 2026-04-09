import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

export default function Exams() {
  const [exams, setExams] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', class_id: '', start_date: '', end_date: '', total_marks: 100, passing_marks: 40 })

  const fetchExams = (page = 1) => {
    api.get(`/exams?page=${page}`).then(r => {
      setExams(r.data.data)
      setPagination({
        current_page: r.data.current_page,
        last_page: r.data.last_page,
        total: r.data.total,
      })
    })
  }

  useEffect(() => {
    fetchExams()
    api.get('/classes').then(r => setClasses(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/exams', form)
    setShowForm(false)
    setForm({ name: '', class_id: '', start_date: '', end_date: '', total_marks: 100, passing_marks: 40 })
    toast.success('Exam created!')
    fetchExams(1)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this exam?')) return
    await api.delete(`/exams/${id}`)
    toast.success('Exam deleted.')
    fetchExams(pagination.current_page)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Exams</h2>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} exams scheduled</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Create Exam
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">New Exam</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Exam Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Midterm 2025"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Class</label>
              <select
                required
                value={form.class_id}
                onChange={e => setForm(f => ({ ...f, class_id: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Start Date</label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">End Date</label>
              <input
                type="date"
                required
                value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Total Marks</label>
              <input
                type="number"
                required
                value={form.total_marks}
                onChange={e => setForm(f => ({ ...f, total_marks: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Passing Marks</label>
              <input
                type="number"
                required
                value={form.passing_marks}
                onChange={e => setForm(f => ({ ...f, passing_marks: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-semibold text-gray-800">All Exams</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Class</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total Marks</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map((e, idx) => (
              <tr key={e.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                      {(pagination.current_page - 1) * 10 + idx + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{e.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {e.school_class?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{e.start_date}</td>
                <td className="px-6 py-4 text-gray-600">{e.end_date}</td>
                <td className="px-6 py-4 font-bold text-indigo-600">{e.total_marks}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-400 text-sm">No exams scheduled.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={fetchExams}
        />
      </div>
    </div>
  )
}
