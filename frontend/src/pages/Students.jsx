import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

export default function Students() {
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', admission_number:'', class_id:'', section_id:'', gender:'', date_of_birth:'', address:'' })
  const [loading, setLoading] = useState(false)

  const fetchStudents = (page = 1) => {
    api.get(`/students?page=${page}`).then(r => {
      setStudents(r.data.data || [])
      setPagination({
        current_page: r.data.current_page,
        last_page: r.data.last_page,
        total: r.data.total
      })
    })
  }

  useEffect(() => {
    fetchStudents()
    api.get('/classes').then(r => setClasses(r.data))
  }, [])

  const onClassChange = (classId) => {
    setForm(f => ({ ...f, class_id: classId, section_id: '' }))
    api.get(`/sections?class_id=${classId}`).then(r => setSections(r.data))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/students', form)
      setShowForm(false)
      setForm({ name:'', email:'', password:'', admission_number:'', class_id:'', section_id:'', gender:'', date_of_birth:'', address:'' })
      fetchStudents(pagination.current_page)
      toast.success('Student added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding student')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    await api.delete(`/students/${id}`)
    fetchStudents(pagination.current_page)
    toast.success('Student deleted.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} students enrolled</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
          + Add Student
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">New Student</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['name','Name'],['email','Email'],['password','Password'],['admission_number','Admission No']].map(([k,l]) => (
              <div key={k}>
                <label className="text-sm text-gray-600 font-medium">{l}</label>
                <input type={k==='password'?'password':k==='email'?'email':'text'} required value={form[k]}
                  onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600 font-medium">Class</label>
              <select required value={form.class_id} onChange={e => onClassChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Section</label>
              <select required value={form.section_id} onChange={e => setForm(f => ({...f, section_id: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                <option value="">Select section</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({...f, date_of_birth: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
                {loading ? 'Saving...' : 'Save Student'}
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
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Admission No</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Class</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Section</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s, idx) => (
              <tr key={s.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 transition-colors">
                      {((pagination.current_page - 1) * 10) + idx + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{s.user?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{s.admission_number}</td>
                <td className="px-6 py-4 text-gray-600">{s.school_class?.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {s.section?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center">
                <div className="text-4xl mb-3">👨‍🎓</div>
                <p className="text-gray-400 text-sm">No students found.</p>
              </td></tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={fetchStudents}
        />
      </div>
    </div>
  )
}
