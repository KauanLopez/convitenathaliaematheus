import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from './ui/Modal';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface RSVPModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal = ({ groupId, isOpen, onClose }: RSVPModalProps) => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (isOpen && groupId) {
      fetchFamily();
    }
  }, [isOpen, groupId]);

  const fetchFamily = async () => {
    setLoading(true);
    
    try {
      const [groupRes, guestsRes] = await Promise.all([
        supabase.from('groups').select('name').eq('id', groupId).single(),
        supabase.from('guests').select('*').eq('group_id', groupId).order('type', { ascending: true }) // Titular comes first
      ]);

      if (groupRes.error) throw groupRes.error;
      if (guestsRes.error) throw guestsRes.error;


      // Ensure local state reflects default 'pending' if it's null
      setGuests((guestsRes.data || []).map(g => ({
        ...g,
        confirmation_status: g.confirmation_status || 'pending'
      })));
    } catch (error) {
      console.error('Error fetching family:', error);
      toast.error('Erro ao buscar dados da família.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (guestId: string, status: 'confirmed' | 'declined') => {
    setGuests(prev => 
      prev.map(g => g.id === guestId ? { ...g, confirmation_status: status } : g)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = guests.map(g => ({
        id: g.id,
        confirmation_status: g.confirmation_status,
        confirmation_date: new Date().toISOString(),
        confirmation_source: 'site'
      }));

      // In Supabase, you can perform upsert or multiple updates. 
      // A simple loop works well for a few guests.
      for (const update of updates) {
        if (update.confirmation_status !== 'pending') {
          const { error } = await supabase
            .from('guests')
            .update({ 
              confirmation_status: update.confirmation_status,
              confirmation_date: update.confirmation_date,
              confirmation_source: update.confirmation_source
            })
            .eq('id', update.id);
            
          if (error) throw error;
        }
      }

      toast.success('Presença confirmada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error saving RSVP:', error);
      toast.error('Erro ao salvar confirmação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
          <p className="text-text-muted text-sm">Carregando família...</p>
        </div>
      ) : (
        <div>
          <h3 className="font-heading text-4xl text-accent mb-6 text-center">Confirmação de Presença</h3>

          <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
            {guests.map(guest => (
              <div key={guest.id} className="p-4 border border-border-light rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-secondary/30">
                <div>
                  <p className="font-medium text-text-main text-lg">
                    {guest.first_name} {guest.last_name || ''}
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(guest.id, 'confirmed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      guest.confirmation_status === 'confirmed' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-white text-text-muted border border-border-light hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                    }`}
                  >
                    <CheckCircle size={14} />
                    Confirmar presença
                  </button>
                  <button
                    onClick={() => handleStatusChange(guest.id, 'declined')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      guest.confirmation_status === 'declined' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-white text-text-muted border border-border-light hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    }`}
                  >
                    <XCircle size={14} />
                    Não Vou
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-border-light rounded-xl font-medium text-sm text-text-main hover:bg-bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-accent text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {saving ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
