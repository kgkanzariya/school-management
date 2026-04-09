import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Notices() {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', target_role: 'all', publish_date: new Date().toISOString().split('T')[0] })

  useEffect(() => { api.get('/notices').then(r => setNotices(r.data)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/notices', form)
    setNotices(n => [data, ...n])
    setShowForm(false)
    setForm({ title: '', content: '', target_role: 'all', publish_date: new Date().toISOString().split('T')[0] })
    toast.success('Notice posted!')
  }

  const handleDelete = async (id) => {
    await api.delete(`/notices/${id}`)
    setNotices(n => n.filter(x => x.id !== id))
    toast.success('Notice deleted.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notice Board</h2>
          <p className="text-sm text-gray-500 mt-1">{notices.length} active notices</p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Post Notice
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">New Notice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Title</label>
              <input
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Content</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium">Target Audience</label>
                <select
                  value={form.target_role}
                  onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="parent">Parents</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Publish Date</label>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={e => setForm(f => ({ ...f, publish_date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
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
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notices.map((n, idx) => (
          <div key={n.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{n.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        📅 {n.publish_date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="capitalize px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                        For: {n.target_role}
                      </span>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{n.content}</p>
              </div>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">📢</div>
            <p className="text-gray-400 text-sm">No notices yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
