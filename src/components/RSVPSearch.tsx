import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RSVPModal } from './RSVPModal';
import toast from 'react-hot-toast';

export const RSVPSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        performSearch();
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Create a search pattern: %term%
      const term = `%${searchTerm.trim()}%`;
      
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          first_name,
          last_name,
          group_id,
          group:groups(name)
        `)
        .or(`first_name.ilike.${term},last_name.ilike.${term}`)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        toast.error('Erro ao buscar nome.');
      } else {
        setResults(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectGuest = (groupId: string) => {
    setSelectedGroupId(groupId);
    // Optional: reset search
    // setSearchTerm('');
    // setResults([]);
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <div className="relative w-full flex items-center border-b border-border-light focus-within:border-text-main transition-colors py-1 group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite seu nome para buscar..." 
          className="w-full bg-transparent py-2 pl-2 pr-10 focus:outline-none placeholder:text-text-muted/50 text-sm text-text-main"
        />
        <div className="absolute right-2 text-text-muted transition-colors">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-text-main" />
          ) : (
            <Search className="w-4 h-4 group-focus-within:text-text-main" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {searchTerm.trim().length >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-light rounded-lg shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-4 text-center text-sm text-text-muted">
                Buscando...
              </div>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-border-light">
                {results.map((guest) => (
                  <li 
                    key={guest.id}
                    onClick={() => guest.group_id && handleSelectGuest(guest.group_id)}
                    className="p-3 hover:bg-bg-secondary cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium text-text-main">
                      {guest.first_name} {guest.last_name || ''}
                    </p>
                  </li>
                ))}
              </ul>
            ) : hasSearched ? (
              <div className="p-4 text-center text-sm text-text-muted">
                <p>Nome não encontrado.</p>
                <p className="text-xs mt-1">Tente apenas o primeiro nome ou sobrenome.</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RSVP Modal */}
      {selectedGroupId && (
        <RSVPModal 
          groupId={selectedGroupId} 
          isOpen={!!selectedGroupId} 
          onClose={() => setSelectedGroupId(null)} 
        />
      )}
    </div>
  );
};
