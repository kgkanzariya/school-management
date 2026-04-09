import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', grade_level: '' })

  useEffect(() => { api.get('/classes').then(r => setClasses(r.data)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/classes', form)
    setClasses(c => [...c, data])
    setShowForm(false)
    setForm({ name: '', grade_level: '' })
    toast.success('Class created!')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return
    await api.delete(`/classes/${id}`)
    setClasses(c => c.filter(x => x.id !== id))
    toast.success('Class deleted.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Classes</h2>
          <p className="text-sm text-gray-500 mt-1">{classes.length} classes available</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">New Class</h3>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Class Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Grade 1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Grade Level</label>
              <input
                type="number"
                required
                value={form.grade_level}
                onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}
                placeholder="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
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
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                  {c.grade_level}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Grade {c.grade_level}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">Sections</span>
              <span className="font-semibold text-indigo-600">{c.sections?.length || 0}</span>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">🏫</div>
            <p className="text-gray-400 text-sm">No classes found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
