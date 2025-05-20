import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return <MainLayout>{children}</MainLayout>;
}

export function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/extensions" />;
  return <MainLayout>{children}</MainLayout>;
}
