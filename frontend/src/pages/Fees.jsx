import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

export default function Fees() {
  const [fees, setFees] = useState([])
  const [feesPagination, setFeesPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [classes, setClasses] = useState([])
  const [showFeeForm, setShowFeeForm] = useState(false)
  const [form, setForm] = useState({ class_id: '', fee_type: '', amount: '', frequency: 'monthly' })

  const fetchFees = (page = 1) => {
    api.get(`/fees?page=${page}`).then(r => {
      setFees(r.data.data || [])
      setFeesPagination({
        current_page: r.data.current_page,
        last_page: r.data.last_page,
        total: r.data.total,
      })
    })
  }

  const fetchPayments = (page = 1) => {
    api.get(`/fee-payments?page=${page}`).then(r => {
      setPayments(r.data.data || [])
      setPagination({
        current_page: r.data.current_page,
        last_page: r.data.last_page,
        total: r.data.total,
      })
    })
  }

  useEffect(() => {
    fetchFees()
    fetchPayments()
    api.get('/classes').then(r => setClasses(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/fees', form)
    setShowFeeForm(false)
    setForm({ class_id: '', fee_type: '', amount: '', frequency: 'monthly' })
    toast.success('Fee structure added!')
    fetchFees(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fee Management</h2>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} payment records</p>
        </div>
        <button
          onClick={() => setShowFeeForm(!showFeeForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add Fee Structure
        </button>
      </div>

      {/* Add Fee Form */}
      {showFeeForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">New Fee Structure</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
              <label className="text-sm text-gray-600 font-medium">Fee Type</label>
              <input
                required
                value={form.fee_type}
                onChange={e => setForm(f => ({ ...f, fee_type: e.target.value }))}
                placeholder="e.g. Tuition, Transport"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Amount ($)</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Frequency</label>
              <select
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowFeeForm(false)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Structures Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="font-semibold text-gray-800">Fee Structures</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((f, idx) => (
                <tr key={f.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {(feesPagination.current_page - 1) * 10 + idx + 1}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{f.school_class?.name}</td>
                  <td className="px-5 py-3 text-gray-600">{f.fee_type}</td>
                  <td className="px-5 py-3 font-bold text-indigo-600">₹{f.amount}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      {f.frequency}
                    </span>
                  </td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No fee structures yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={feesPagination.current_page}
            lastPage={feesPagination.last_page}
            onPageChange={fetchFees}
          />
        </div>

        {/* Payments Table with Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Payments</h3>
            <span className="text-xs bg-white text-indigo-600 font-medium px-3 py-1 rounded-full shadow-sm">
              {pagination.total} records
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{p.student?.user?.name}</td>
                  <td className="px-5 py-3 font-bold text-indigo-600">₹{p.amount_paid}</td>
                  <td className="px-5 py-3 text-gray-500">{p.payment_date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : p.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={fetchPayments}
          />
        </div>
      </div>
    </div>
  )
}
