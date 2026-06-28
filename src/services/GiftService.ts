import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Gift = Database['public']['Tables']['gifts']['Row'];

export const GiftService = {
  // Lista todos os presentes
  async getGifts() {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Reserva um presente para um convidado
  async reserveGift(giftId: string, guestName: string, phone: string) {
    // 1. Insere a transação
    const { error: txError } = await supabase
      .from('gift_transactions')
      .insert({ 
        gift_id: giftId, 
        guest_name: guestName, 
        phone, 
        payment_status: 'pending' 
      });
      
    if (txError) throw txError;

    // 2. Atualiza o status do presente para reservado
    const { error: giftError } = await supabase
      .from('gifts')
      .update({ status: 'reserved' })
      .eq('id', giftId);
      
    if (giftError) throw giftError;
  }
};
