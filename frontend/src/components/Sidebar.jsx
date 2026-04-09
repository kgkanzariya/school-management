import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/students', label: 'Students', icon: '👨‍🎓' },
  { to: '/teachers', label: 'Teachers', icon: '👩‍🏫' },
  { to: '/classes', label: 'Classes', icon: '🏫' },
  { to: '/subjects', label: 'Subjects', icon: '📚' },
  { to: '/attendance', label: 'Attendance', icon: '📅' },
  { to: '/exams', label: 'Exams', icon: '📝' },
  { to: '/fees', label: 'Fees', icon: '💰' },
  { to: '/notices', label: 'Notices', icon: '📢' },
  { to: '/timetable', label: 'Timetable', icon: '🗓️' },
]

const teacherLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/students', label: 'Students', icon: '👨‍🎓' },
  { to: '/attendance', label: 'Attendance', icon: '📅' },
  { to: '/exams', label: 'Exams', icon: '📝' },
  { to: '/notices', label: 'Notices', icon: '📢' },
  { to: '/timetable', label: 'Timetable', icon: '🗓️' },
]

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/my-attendance', label: 'Attendance', icon: '📅' },
  { to: '/my-marks', label: 'My Marks', icon: '📝' },
  { to: '/notices', label: 'Notices', icon: '📢' },
  { to: '/timetable', label: 'Timetable', icon: '🗓️' },
]

const parentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/my-children', label: 'My Children', icon: '👨‍👩‍👧' },
  { to: '/notices', label: 'Notices', icon: '📢' },
]

const linksByRole = { admin: adminLinks, teacher: teacherLinks, student: studentLinks, parent: parentLinks }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const links = linksByRole[user?.role] || []

  return (
    <aside className="w-64 min-h-screen bg-indigo-900 text-white flex flex-col">
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-xl font-bold">🏫 SchoolMS</h1>
        <p className="text-indigo-300 text-sm mt-1 capitalize">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-indigo-300">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-sm text-indigo-300 hover:text-white hover:bg-indigo-800 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
