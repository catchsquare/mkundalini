export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          created_by: string | null
          dentist_id: string | null
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          start_time: string
          status: string | null
          treatment_type: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          created_by?: string | null
          dentist_id?: string | null
          end_time: string
          id?: string
          notes?: string | null
          patient_id: string
          start_time: string
          status?: string | null
          treatment_type: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          created_by?: string | null
          dentist_id?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string
          start_time?: string
          status?: string | null
          treatment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: Json | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          og_image: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          block_key: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_visible: boolean | null
          link_label: string | null
          link_url: string | null
          metadata: Json | null
          page_slug: string
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_visible?: boolean | null
          link_label?: string | null
          link_url?: string | null
          metadata?: Json | null
          page_slug: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_visible?: boolean | null
          link_label?: string | null
          link_url?: string | null
          metadata?: Json | null
          page_slug?: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dentists: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          license_number: string | null
          profile_id: string | null
          specialization: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          license_number?: string | null
          profile_id?: string | null
          specialization?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          license_number?: string | null
          profile_id?: string | null
          specialization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dentists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_visible: boolean | null
          page_slug: string | null
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_slug?: string | null
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_slug?: string | null
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          after_image: string
          before_image: string
          category_id: string | null
          consent_obtained: boolean | null
          created_at: string
          dentist_id: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_visible: boolean | null
          patient_id: string | null
          sort_order: number | null
          tags: string[] | null
          title: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          after_image: string
          before_image: string
          category_id?: string | null
          consent_obtained?: boolean | null
          created_at?: string
          dentist_id?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          patient_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          after_image?: string
          before_image?: string
          category_id?: string | null
          consent_obtained?: boolean | null
          created_at?: string
          dentist_id?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          patient_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      global_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          setting_group: string | null
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_group?: string | null
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_group?: string | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "global_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          badge_text: string | null
          created_at: string
          cta_label: string | null
          cta_link: string | null
          description: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_visible: boolean | null
          page_slug: string
          secondary_cta_label: string | null
          secondary_cta_link: string | null
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_visible?: boolean | null
          page_slug: string
          secondary_cta_label?: string | null
          secondary_cta_link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_visible?: boolean | null
          page_slug?: string
          secondary_cta_label?: string | null
          secondary_cta_link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category_id: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          location: string | null
          min_stock_level: number | null
          name: string
          quantity: number | null
          sku: string | null
          supplier: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          min_stock_level?: number | null
          name: string
          quantity?: number | null
          sku?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          min_stock_level?: number | null
          name?: string
          quantity?: number | null
          sku?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          notes: string | null
          quantity: number
          reference: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          notes?: string | null
          quantity: number
          reference?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          reference?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number | null
          total: number
          treatment_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number | null
          total: number
          treatment_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          total?: number
          treatment_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          appointment_id: string | null
          created_at: string
          created_by: string | null
          discount: number | null
          id: string
          invoice_number: string
          notes: string | null
          patient_id: string
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          discount?: number | null
          id?: string
          invoice_number: string
          notes?: string | null
          patient_id: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          discount?: number | null
          id?: string
          invoice_number?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          lead_id: string
          next_follow_up: string | null
          outcome: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id: string
          next_follow_up?: string | null
          outcome?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string
          next_follow_up?: string | null
          outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          converted_patient_id: string | null
          created_at: string
          email: string | null
          form_type: string | null
          id: string
          message: string | null
          metadata: Json | null
          name: string
          phone: string | null
          priority: string | null
          source: string | null
          status: string | null
          treatment_interest: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          converted_patient_id?: string | null
          created_at?: string
          email?: string | null
          form_type?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          treatment_interest?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          converted_patient_id?: string | null
          created_at?: string
          email?: string | null
          form_type?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          treatment_interest?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_patient_id_fkey"
            columns: ["converted_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          last_updated: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          last_updated?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          last_updated?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean | null
          label: string
          location: string
          page_id: string | null
          parent_id: string | null
          sort_order: number | null
          target: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label: string
          location: string
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number | null
          target?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label?: string
          location?: string
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number | null
          target?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          badge_text: string | null
          created_at: string
          cta_label: string | null
          cta_link: string | null
          description: string | null
          end_date: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          sort_order: number | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          is_visible: boolean | null
          page_id: string
          section_type: string
          settings: Json | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id: string
          section_type: string
          settings?: Json | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id?: string
          section_type?: string
          settings?: Json | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          canonical_url: string | null
          content: Json | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          og_image: string | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string | null
          template: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string | null
          template?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          template?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          blood_group: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          is_international: boolean | null
          last_name: string
          medical_history: string | null
          notes: string | null
          patient_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          is_international?: boolean | null
          last_name: string
          medical_history?: string | null
          notes?: string | null
          patient_id: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_international?: boolean | null
          last_name?: string
          medical_history?: string | null
          notes?: string | null
          patient_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          received_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          received_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          received_by?: string | null
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_packages: {
        Row: {
          category: string | null
          comparison_price: string | null
          created_at: string
          cta_label: string | null
          cta_link: string | null
          currency: string | null
          description: string | null
          features: string[] | null
          id: string
          is_popular: boolean | null
          is_visible: boolean | null
          name: string
          period: string | null
          price: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          comparison_price?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_popular?: boolean | null
          is_visible?: boolean | null
          name: string
          period?: string | null
          price: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          comparison_price?: string | null
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_popular?: boolean | null
          is_visible?: boolean | null
          name?: string
          period?: string | null
          price?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          highlight: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          highlight?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          highlight?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          body_content: string | null
          category_id: string | null
          comparison_price: string | null
          created_at: string
          duration: string | null
          faqs: Json | null
          features: string[] | null
          hero_badge: string | null
          hero_description: string | null
          hero_image_url: string | null
          hero_title: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          og_image: string | null
          price: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number | null
          title: string
          tourism_friendly: boolean | null
          updated_at: string
        }
        Insert: {
          body_content?: string | null
          category_id?: string | null
          comparison_price?: string | null
          created_at?: string
          duration?: string | null
          faqs?: Json | null
          features?: string[] | null
          hero_badge?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          og_image?: string | null
          price?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          title: string
          tourism_friendly?: boolean | null
          updated_at?: string
        }
        Update: {
          body_content?: string | null
          category_id?: string | null
          comparison_price?: string | null
          created_at?: string
          duration?: string | null
          faqs?: Json | null
          features?: string[] | null
          hero_badge?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          og_image?: string | null
          price?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          tourism_friendly?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean | null
          label: string
          page_slug: string
          sort_order: number | null
          suffix: string | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label: string
          page_slug: string
          sort_order?: number | null
          suffix?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label?: string
          page_slug?: string
          sort_order?: number | null
          suffix?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string
          experience_years: number | null
          full_name: string
          id: string
          is_featured: boolean | null
          languages: string[] | null
          photo_alt: string | null
          photo_url: string | null
          qualifications: string[] | null
          role: string
          role_type: string
          sort_order: number | null
          specialties: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          full_name: string
          id?: string
          is_featured?: boolean | null
          languages?: string[] | null
          photo_alt?: string | null
          photo_url?: string | null
          qualifications?: string[] | null
          role: string
          role_type?: string
          sort_order?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_featured?: boolean | null
          languages?: string[] | null
          photo_alt?: string | null
          photo_url?: string | null
          qualifications?: string[] | null
          role?: string
          role_type?: string
          sort_order?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          display_date: string | null
          external_id: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          patient_avatar: string | null
          patient_id: string | null
          patient_location: string | null
          patient_name: string
          rating: number | null
          source: string | null
          status: string | null
          treatment_type: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          display_date?: string | null
          external_id?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          patient_avatar?: string | null
          patient_id?: string | null
          patient_location?: string | null
          patient_name: string
          rating?: number | null
          source?: string | null
          status?: string | null
          treatment_type?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          display_date?: string | null
          external_id?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          patient_avatar?: string | null
          patient_id?: string | null
          patient_location?: string | null
          patient_name?: string
          rating?: number | null
          source?: string | null
          status?: string | null
          treatment_type?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          base_price: number
          category: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      working_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string | null
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean | null
          notes: string | null
          open_time: string | null
          updated_at: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          notes?: string | null
          open_time?: string | null
          updated_at?: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          notes?: string | null
          open_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      gallery_items_public: {
        Row: {
          after_image: string | null
          before_image: string | null
          category_id: string | null
          consent_obtained: boolean | null
          created_at: string | null
          dentist_id: string | null
          description: string | null
          id: string | null
          is_featured: boolean | null
          is_visible: boolean | null
          sort_order: number | null
          tags: string[] | null
          title: string | null
          treatment_id: string | null
          updated_at: string | null
        }
        Insert: {
          after_image?: string | null
          before_image?: string | null
          category_id?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          dentist_id?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          after_image?: string | null
          before_image?: string | null
          category_id?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          dentist_id?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_cms_access: { Args: { _user_id: string }; Returns: boolean }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "receptionist"
        | "dentist"
        | "content_editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "manager",
        "receptionist",
        "dentist",
        "content_editor",
      ],
    },
  },
} as const
