export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          name: string
          type: string
          notes: string | null
          status: string
          allow_new_confirmation: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          notes?: string | null
          status?: string
          allow_new_confirmation?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          notes?: string | null
          status?: string
          allow_new_confirmation?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          id: string
          first_name: string
          last_name: string | null
          phone: string | null
          email: string | null
          group_id: string | null
          type: string | null
          notes: string | null
          can_bring_companions: boolean
          max_companions: number
          confirmation_status: string
          confirmation_date: string | null
          confirmation_source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name?: string | null
          phone?: string | null
          email?: string | null
          group_id?: string | null
          type?: string | null
          notes?: string | null
          can_bring_companions?: boolean
          max_companions?: number
          confirmation_status?: string
          confirmation_date?: string | null
          confirmation_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string | null
          phone?: string | null
          email?: string | null
          group_id?: string | null
          type?: string | null
          notes?: string | null
          can_bring_companions?: boolean
          max_companions?: number
          confirmation_status?: string
          confirmation_date?: string | null
          confirmation_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          }
        ]
      }
      gifts: {
        Row: {
          id: string
          title: string
          description: string | null
          image: string | null
          price: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image?: string | null
          price: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image?: string | null
          price?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          id: string
          gift_id: string | null
          guest_name: string
          phone: string | null
          payment_status: string | null
          reserved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          gift_id?: string | null
          guest_name: string
          phone?: string | null
          payment_status?: string | null
          reserved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          gift_id?: string | null
          guest_name?: string
          phone?: string | null
          payment_status?: string | null
          reserved_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          }
        ]
      }
      pix_settings: {
        Row: {
          id: string
          owner_name: string
          pix_key: string
          pix_type: string
          qr_code: string | null
          enabled: boolean
        }
        Insert: {
          id?: string
          owner_name: string
          pix_key: string
          pix_type: string
          qr_code?: string | null
          enabled?: boolean
        }
        Update: {
          id?: string
          owner_name?: string
          pix_key?: string
          pix_type?: string
          qr_code?: string | null
          enabled?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          bride: string
          groom: string
          wedding_date: string
          music: string | null
          countdown: boolean
          verse: string | null
          hero_image: string | null
          cover_image: string | null
          footer_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bride: string
          groom: string
          wedding_date: string
          music?: string | null
          countdown?: boolean
          verse?: string | null
          hero_image?: string | null
          cover_image?: string | null
          footer_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bride?: string
          groom?: string
          wedding_date?: string
          music?: string | null
          countdown?: boolean
          verse?: string | null
          hero_image?: string | null
          cover_image?: string | null
          footer_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
