import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', employee_id:'', gender:'', qualification:'', joining_date:'' })
  const [loading, setLoading] = useState(false)

  const fetchTeachers = (page = 1) => {
    api.get(`/teachers?page=${page}`).then(r => {
      setTeachers(r.data.data || [])
      setPagination({
        current_page: r.data.current_page,
        last_page: r.data.last_page,
        total: r.data.total
      })
    })
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/teachers', form)
      setShowForm(false)
      setForm({ name:'', email:'', password:'', employee_id:'', gender:'', qualification:'', joining_date:'' })
      fetchTeachers(pagination.current_page)
      toast.success('Teacher added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this teacher?')) return
    await api.delete(`/teachers/${id}`)
    fetchTeachers(pagination.current_page)
    toast.success('Teacher deleted.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} teachers on staff</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
          + Add Teacher
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">New Teacher</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[['name','Name'],['email','Email'],['password','Password'],['employee_id','Employee ID'],['qualification','Qualification']].map(([k,l]) => (
              <div key={k}>
                <label className="text-sm text-gray-600 font-medium">{l}</label>
                <input type={k==='password'?'password':k==='email'?'email':'text'} required={['name','email','password','employee_id'].includes(k)}
                  value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600 font-medium">Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Joining Date</label>
              <input type="date" value={form.joining_date} onChange={e => setForm(f => ({...f, joining_date: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
                {loading ? 'Saving...' : 'Save Teacher'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Qualification</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((t, idx) => (
              <tr key={t.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                      {((pagination.current_page - 1) * 10) + idx + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{t.user?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {t.employee_id}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{t.user?.email}</td>
                <td className="px-6 py-4 text-gray-600">{t.qualification || '—'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center">
                <div className="text-4xl mb-3">👩‍🏫</div>
                <p className="text-gray-400 text-sm">No teachers found.</p>
              </td></tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={fetchTeachers}
        />
      </div>
    </div>
  )
}
