import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Envelope } from './components/Envelope';
import { Home } from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { playMusic } from './utils/audio';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminLayout } from './pages/admin/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Guests } from './pages/admin/Guests';

function MainSite() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    playMusic();
    setIsOpen(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <Envelope key="envelope" onOpen={handleOpen} />
      ) : (
        <Home key="home" />
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<MainSite />} />
        
        {/* Módulo Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/guests" replace />} />
          <Route path="guests" element={<Guests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
