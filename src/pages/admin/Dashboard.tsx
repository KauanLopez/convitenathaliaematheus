import { useEffect, useState } from 'react';
import { supabase as _supabase } from '../../lib/supabase';
const supabase = _supabase as any;
import { Users, UserCheck, UserX, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalGuests: 0,
    confirmed: 0,
    declined: 0,
    gifts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: total } = await supabase.from('guests').select('*', { count: 'exact', head: true });
        const { count: confirmed } = await supabase.from('guests').select('*', { count: 'exact', head: true }).eq('confirmation_status', 'confirmed');
        const { count: declined } = await supabase.from('guests').select('*', { count: 'exact', head: true }).eq('confirmation_status', 'declined');
        const { count: gifts } = await supabase.from('gifts').select('*', { count: 'exact', head: true }).eq('status', 'reserved');
        
        setStats({
          totalGuests: total || 0,
          confirmed: confirmed || 0,
          declined: declined || 0,
          gifts: gifts || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const cards = [
    { title: 'Convidados Cadastrados', value: stats.totalGuests, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Presenças Confirmadas', value: stats.confirmed, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Ausências Registradas', value: stats.declined, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Presentes Reservados', value: stats.gifts, icon: Gift, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-xl ${card.bg}`}>
                <Icon className={card.color} size={28} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-text-muted font-medium mb-1">{card.title}</p>
                <h3 className="text-4xl font-bold text-text-main">
                  {loading ? '...' : card.value}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 bg-white p-10 rounded-2xl border border-border-light shadow-sm text-center">
        <div className="mx-auto w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">💍</span>
        </div>
        <h2 className="font-heading text-2xl text-text-main mb-2">Bem-vindos ao Controle do Casamento!</h2>
        <p className="text-text-muted max-w-xl mx-auto">
          Navegue pelo menu lateral para gerenciar sua lista de convidados, grupos familiares, acompanhar os presentes reservados e ajustar todas as configurações do convite.
        </p>
      </div>
    </motion.div>
  );
};
