import { useState } from 'react';
import toast from 'react-hot-toast';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Search, Loader2 } from 'lucide-react';
import { GuestService } from '../../services/GuestService';
import type { Guest, Group } from '../../services/GuestService';
import { Modal } from '../ui/Modal';

export const RSVPSection = () => {
  const [query, setQuery] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<(Guest & { group: Group })[]>([]);
  
  // Group confirmation states
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<Guest[]>([]);
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) {
      toast.error('Digite pelo menos 2 letras.');
      return;
    }
    
    setLoadingSearch(true);
    try {
      const results = await GuestService.searchGuests(query.trim());
      if (results.length === 0) {
        toast.error('Nome não encontrado. Verifique a grafia ou fale com os noivos.');
      } else {
        setSearchResults(results as any);
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error('Ocorreu um erro na busca. Tente novamente mais tarde.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectGuest = async (guest: Guest & { group: Group }) => {
    if (!guest.group_id) {
      toast.error('Este convidado não pertence a uma família.');
      return;
    }
    
    try {
      const members = await GuestService.getGroupMembers(guest.group_id);
      setSelectedGroup(guest.group);
      setGroupMembers(members);
      
      const initialIds = members
        .filter((m: any) => m.confirmation_status === 'confirmed' || guest.group.status === 'pending')
        .map((m: any) => m.id);
      setConfirmedIds(initialIds);
    } catch (error) {
      toast.error('Erro ao buscar a família.');
    }
  };

  const handleConfirm = async () => {
    if (!selectedGroup) return;
    setIsConfirming(true);
    try {
      await GuestService.confirmAttendance(selectedGroup.id, confirmedIds, notes);
      toast.success('Confirmação salva com sucesso! Obrigado.');
      setIsModalOpen(false);
      setSelectedGroup(null);
      setQuery('');
    } catch (error) {
      toast.error('Erro ao salvar sua confirmação. Tente novamente.');
    } finally {
      setIsConfirming(false);
    }
  };

  const toggleGuest = (id: string) => {
    if (confirmedIds.includes(id)) {
      setConfirmedIds(confirmedIds.filter(cid => cid !== id));
    } else {
      setConfirmedIds([...confirmedIds, id]);
    }
  };

  return (
    <Section id="rsvp" className="max-w-3xl">
      <div className="text-center mb-12">
        <h2 className="font-heading text-4xl md:text-5xl text-text-main mb-4">Confirme sua Presença</h2>
        <p className="text-text-muted text-sm tracking-widest uppercase mb-8">Digite seu nome ou sobrenome para buscar seu convite</p>

        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Matheus..."
            className="w-full bg-bg-secondary/50 border border-border-light py-4 pl-6 pr-16 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent transition-all text-text-main placeholder:text-text-muted/50 shadow-sm"
          />
          <button 
            type="submit" 
            disabled={loadingSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loadingSearch ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </form>

        <div className="mt-6">
          <a 
            href="https://wa.me/5544998030529?text=Ol%C3%A1!%20Recebi%20o%20convite%20de%20casamento%20e%20gostaria%20de%20confirmar%20presen%C3%A7a" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-sm text-text-muted hover:text-accent underline underline-offset-4 transition-colors"
          >
            Ou confirme pelo whatsapp
          </a>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedGroup(null); }}>
        {!selectedGroup ? (
          <div>
            <h3 className="font-heading text-3xl text-accent mb-2">Resultados</h3>
            <p className="text-text-muted text-sm mb-6">Selecione o seu nome na lista abaixo para confirmar a presença de sua família:</p>
            <div className="space-y-3">
              {searchResults.map(guest => (
                <button 
                  key={guest.id}
                  onClick={() => handleSelectGuest(guest)}
                  className="w-full text-left p-4 rounded-xl border border-border-light hover:border-accent hover:bg-bg-secondary transition-all flex justify-between items-center group shadow-sm"
                >
                  <div>
                    <p className="font-medium text-text-main">{guest.first_name} {guest.last_name}</p>
                    {guest.group && <p className="text-xs text-text-muted mt-1">{guest.group.name}</p>}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-heading text-3xl text-accent mb-2">Olá, {selectedGroup.name}</h3>
            <p className="text-text-muted text-sm mb-6">
              {selectedGroup.status === 'confirmed' && !selectedGroup.allow_new_confirmation 
                ? 'Sua presença já foi registrada. No momento você só pode visualizar.' 
                : 'Marque abaixo quem irá comparecer ao evento:'}
            </p>
            
            <div className="space-y-3 mb-6">
              {groupMembers.map(member => {
                const isLocked = selectedGroup.status === 'confirmed' && !selectedGroup.allow_new_confirmation;
                const isChecked = confirmedIds.includes(member.id);
                return (
                  <label key={member.id} className={`flex items-center gap-4 p-4 border rounded-xl transition-all shadow-sm ${isChecked ? 'border-accent bg-accent/5' : 'border-border-light bg-white'} ${isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:border-accent/50'}`}>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-accent cursor-pointer"
                        checked={isChecked}
                        disabled={isLocked}
                        onChange={() => toggleGuest(member.id)}
                      />
                    </div>
                    <span className="font-medium text-text-main">{member.first_name} {member.last_name}</span>
                  </label>
                )
              })}
            </div>

            {selectedGroup.status !== 'confirmed' || selectedGroup.allow_new_confirmation ? (
              <>
                <textarea 
                  placeholder="Alguma restrição alimentar ou mensagem para os noivos? (Opcional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-bg-secondary/50 border border-border-light rounded-xl p-4 mb-6 focus:outline-none focus:ring-1 focus:ring-accent resize-none h-24 text-sm placeholder:text-text-muted"
                />
                
                <div className="flex gap-3">
                  <Button className="w-full py-4 rounded-xl shadow-md" onClick={handleConfirm} disabled={isConfirming}>
                    {isConfirming ? 'Salvando...' : 'Confirmar Presença'}
                  </Button>
                </div>
              </>
            ) : (
              <Button className="w-full py-4 rounded-xl" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
            )}
          </div>
        )}
      </Modal>
    </Section>
  );
};
