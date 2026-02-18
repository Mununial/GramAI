import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TractorBooking from './pages/TractorBooking';
import ServiceProviders from './pages/ServiceProviders';
import AICropScan from './pages/AICropScan';
import AIChatbot from './pages/AIChatbot';
import Wallet from './pages/Wallet';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import Pricing from './pages/Pricing';
import Register from './pages/Register';
import ProviderHub from './pages/ProviderHub';
import GovernmentSchemes from './pages/GovernmentSchemes';
import FinancialPlanning from './pages/FinancialPlanning';
import FarmCalculator from './pages/FarmCalculator';
import FarmingSolutions from './pages/FarmingSolutions';
import AgriMarket from './pages/AgriMarket';
import LandLease from './pages/LandLease';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

import React, { useState } from 'react';

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className={`relative flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 theme-${user?.role || 'guest'}`}>
        {user && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

        <div className="flex-1 flex flex-col min-w-0">
          {user && <Navbar setSidebarOpen={setSidebarOpen} />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 relative z-0">
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/tractors" element={
                <ProtectedRoute>
                  <TractorBooking />
                </ProtectedRoute>
              } />

              <Route path="/services" element={
                <ProtectedRoute>
                  <ServiceProviders />
                </ProtectedRoute>
              } />

              <Route path="/ai-scan" element={
                <ProtectedRoute>
                  <AICropScan />
                </ProtectedRoute>
              } />

              <Route path="/chatbot" element={
                <ProtectedRoute>
                  <AIChatbot />
                </ProtectedRoute>
              } />

              <Route path="/wallet" element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/admin/:tab" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/pricing" element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              } />

              <Route path="/provider-hub" element={
                <ProtectedRoute roles={['provider']}>
                  <ProviderHub />
                </ProtectedRoute>
              } />

              <Route path="/government-schemes" element={
                <ProtectedRoute>
                  <GovernmentSchemes />
                </ProtectedRoute>
              } />

              <Route path="/financial-planning" element={
                <ProtectedRoute>
                  <FinancialPlanning />
                </ProtectedRoute>
              } />

              <Route path="/farm-calculator" element={
                <ProtectedRoute>
                  <FarmCalculator />
                </ProtectedRoute>
              } />

              <Route path="/farming-solutions" element={
                <ProtectedRoute>
                  <FarmingSolutions />
                </ProtectedRoute>
              } />

              <Route path="/agri-market" element={
                <ProtectedRoute>
                  <AgriMarket />
                </ProtectedRoute>
              } />

              <Route path="/land-lease" element={
                <ProtectedRoute>
                  <LandLease />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
