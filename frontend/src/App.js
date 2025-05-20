import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import TodoListPage from './TodoListPage';
import AdminPostsPage from './AdminPostsPage';
import AdminExtensionsPage from './AdminExtensionsPage';
import UserExtensionsPage from './UserExtensionsPage';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <AdminPostsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/extensions"
          element={
            <AdminRoute>
              <AdminExtensionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/extensions"
          element={
            <ProtectedRoute>
              <UserExtensionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
