import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import MastersPage from './pages/MastersPage';
import WorkersPage from './pages/WorkersPage';
import MachinesPage from './pages/MachinesPage';
import MaintenancePage from './pages/MaintenancePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const dispatch = useDispatch();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Защищенные маршруты */}
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          <Route path="/masters" element={
            <PrivateRoute>
              <MastersPage />
            </PrivateRoute>
          } />
          
          <Route path="/workers" element={
            <PrivateRoute>
              <WorkersPage />
            </PrivateRoute>
          } />
          
          <Route path="/machines" element={
            <PrivateRoute>
              <MachinesPage />
            </PrivateRoute>
          } />
          
          <Route path="/maintenance" element={
            <PrivateRoute>
              <MaintenancePage />
            </PrivateRoute>
          } />
          
          {/* Админские маршруты (только для роли admin) */}
          <Route path="/admin/*" element={
            <PrivateRoute roles={['admin']}>
              {/* Админские страницы можно добавить позже */}
              <div>Админская панель</div>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;