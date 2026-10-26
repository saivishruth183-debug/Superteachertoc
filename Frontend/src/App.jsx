import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import UserHome from './Users/UserHome'
import Navbar from './Users/Navbar'
import Login from './Components/Login'
import UserCourses from './Users/UserCourses'
import CourseGrades from './Users/UserGrades'
import AdminHome from './Admin/AdminHome'
import AdminCourses from './Admin/AdminCourses'
import AdminGrades from './Admin/AdminGrades'
import AdminAddGrade from './Admin/AdminAddGrades'
import AdminAddCourse from './Admin/AdminAddCourse'

const hasAdminSession = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    return Boolean(localStorage.getItem("authToken") && user?.role === "admin")
  } catch {
    return false
  }
}

const AdminRoute = ({ children }) =>
  hasAdminSession() ? children : <Navigate to="/login" replace />

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/courses" element={<UserCourses />} />
        <Route path="/courses/:slug" element={<CourseGrades />} />
        <Route path="/adminhome" element={<AdminRoute><AdminHome /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
        <Route path="/admin/courses/add" element={<AdminRoute><AdminAddCourse /></AdminRoute>} />
        <Route path="/admin/courses/:slug/grades" element={<AdminRoute><AdminGrades /></AdminRoute>} />
        <Route path="/admin/courses/:slug/grades/add" element={<AdminRoute><AdminAddGrade /></AdminRoute>} />
      </Routes>
    </div>
  )
}

export default App