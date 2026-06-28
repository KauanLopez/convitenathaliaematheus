import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('Credenciais inválidas. Tente novamente.');
    } else {
      toast.success('Bem-vindo ao Painel!');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center items-center font-body p-4 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-subtle border border-border-light text-center relative z-10">
        <h1 className="font-heading text-4xl text-accent mb-2">Painel Admin</h1>
        <p className="text-text-muted text-sm mb-8">Faça login para gerenciar seu casamento</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1.5 ml-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all text-text-main"
              placeholder="noivos@exemplo.com"
            />
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1.5 ml-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all text-text-main"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3.5 rounded-xl font-medium tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-70 mt-6 shadow-md"
          >
            {loading ? 'Entrando...' : 'Acessar o Painel'}
          </button>
        </form>
      </div>
    </div>
  );
};
