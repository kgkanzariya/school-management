import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

export default function Subjects() {
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', description: '' })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async (page = 1) => {
    try {
      const { data } = await api.get(`/subjects?page=${page}`)

      setSubjects(data.data) // actual records
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      })
    } catch (error) {
      toast.error('Failed to load subjects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/subjects', form)
    setShowForm(false)
    setForm({ name: '', code: '', description: '' })
    toast.success('Subject created!')
    fetchSubjects(1)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return
    await api.delete(`/subjects/${id}`)
    toast.success('Subject deleted.')
    fetchSubjects(pagination.current_page)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
          <p className="text-sm text-gray-500 mt-1">{subjects.length} subjects available</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add Subject
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">New Subject</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-gray-600 font-medium">Subject Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Code</label>
              <input
                required
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-semibold text-gray-800">All Subjects</h3>
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
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((s, idx) => (
              <tr key={s.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                      {(pagination.current_page - 1) * 10 + idx + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {s.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-gray-400 text-sm">No subjects found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={fetchSubjects}
        />
      </div>
    </div>
  )
}
