import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  role_type: string;
  qualifications: string[] | null;
  experience_years: number | null;
  bio: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  photo_url: string | null;
  photo_alt: string | null;
  achievements: string[] | null;
  is_featured: boolean;
  status: string;
  sort_order: number;
}

export function useTeamMembers(roleType?: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, [roleType]);

  const fetchTeamMembers = async () => {
    try {
      let query = supabase
        .from('team_members')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      if (roleType) {
        query = query.eq('role_type', roleType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get featured member (usually Dr. Nitin Aryal)
  const featuredMember = members.find(m => m.is_featured);

  return { members, loading, featuredMember, refetch: fetchTeamMembers };
}
