import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Guest = Database['public']['Tables']['guests']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];

export const GuestService = {
  // Busca inteligente de convidados pelo nome ou sobrenome
  async searchGuests(query: string) {
    const searchTerm = `%${query}%`;
    const { data, error } = await supabase
      .from('guests')
      .select('*, group:groups(*)')
      .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  // Retorna todos os integrantes de uma mesma família/grupo
  async getGroupMembers(groupId: string) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('group_id', groupId);
    
    if (error) throw error;
    return data;
  },

  // Realiza a confirmação em lote da família
  async confirmAttendance(groupId: string, confirmedGuestIds: string[], notes?: string) {
    // 1. Marca o grupo como confirmado
    const { error: groupError } = await supabase
      .from('groups')
      .update({ status: 'confirmed', notes })
      .eq('id', groupId);
      
    if (groupError) throw groupError;

    const now = new Date().toISOString();

    // 2. Por padrão, marca todos do grupo como recusados primeiro
    await supabase
      .from('guests')
      .update({ 
        confirmation_status: 'declined', 
        confirmation_date: now,
        confirmation_source: 'site' 
      })
      .eq('group_id', groupId);

    // 3. Atualiza os selecionados como confirmados
    if (confirmedGuestIds.length > 0) {
      const { error: guestsError } = await supabase
        .from('guests')
        .update({ confirmation_status: 'confirmed' })
        .in('id', confirmedGuestIds);
        
      if (guestsError) throw guestsError;
    }
  }
};
