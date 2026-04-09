import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import Attendance from './pages/Attendance'
import Exams from './pages/Exams'
import Fees from './pages/Fees'
import Notices from './pages/Notices'
import Timetable from './pages/Timetable'
import MyAttendance from './pages/MyAttendance'
import MyMarks from './pages/MyMarks'
import MyChildren from './pages/MyChildren'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div className="p-8 text-red-500">Access Denied</div>} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<ProtectedRoute roles={['admin','teacher']}><Students /></ProtectedRoute>} />
            <Route path="teachers" element={<ProtectedRoute roles={['admin']}><Teachers /></ProtectedRoute>} />
            <Route path="classes" element={<ProtectedRoute roles={['admin']}><Classes /></ProtectedRoute>} />
            <Route path="subjects" element={<ProtectedRoute roles={['admin','teacher']}><Subjects /></ProtectedRoute>} />
            <Route path="attendance" element={<ProtectedRoute roles={['admin','teacher']}><Attendance /></ProtectedRoute>} />
            <Route path="exams" element={<ProtectedRoute roles={['admin','teacher']}><Exams /></ProtectedRoute>} />
            <Route path="fees" element={<ProtectedRoute roles={['admin']}><Fees /></ProtectedRoute>} />
            <Route path="notices" element={<Notices />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="my-attendance" element={<ProtectedRoute roles={['student']}><MyAttendance /></ProtectedRoute>} />
            <Route path="my-marks" element={<ProtectedRoute roles={['student']}><MyMarks /></ProtectedRoute>} />
            <Route path="my-children" element={<ProtectedRoute roles={['parent']}><MyChildren /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
