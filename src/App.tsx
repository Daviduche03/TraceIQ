import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AllErrors } from './pages/AllErrors';
import { Projects } from './pages/Projects';
import { Integration } from './pages/Integration';
import { Settings } from './pages/Settings';
import { ToastContainer } from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { Auth } from './components/Auth';
import { useAuthStore } from './stores/useAuthStore';
import { supabase } from './lib/supabase';

function App() {
  const { toasts, addToast, removeToast } = useToast();
  const { user, setUser, setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#000000]">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/errors" element={<AllErrors />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;