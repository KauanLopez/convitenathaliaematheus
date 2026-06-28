import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Escuta mudanças de auth (ex: logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => authListener.subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado com sucesso.');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-muted">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary font-body">
      {/* Header Simplificado */}
      <header className="bg-white border-b border-border-light shadow-sm py-4 px-6 md:px-10 flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl text-accent">Nathália & Matheus</h2>
          <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Gestão de Convidados</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sair do Painel
        </button>
      </header>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
