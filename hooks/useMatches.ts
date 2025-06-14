import { useEffect, useState } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { useAuth } from './useAuth';

type Match = Database['public']['Tables']['matches']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
    } else {
      setMatches(data || []);
    }
    setLoading(false);
  };

  const getMessages = async (matchId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  };

  const sendMessage = async (matchId: string, content: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    return data;
  };

  const updateMatchStatus = async (matchId: string, status: Match['status']) => {
    const { data, error } = await supabase
      .from('matches')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) {
      console.error('Error updating match status:', error);
      throw error;
    }

    // Update local state
    setMatches(prev => prev.map(match => 
      match.id === matchId ? data : match
    ));

    return data;
  };

  const likeDog = async (matchId: string, dogId: string, liked: boolean) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('match_dog_likes')
      .upsert({
        match_id: matchId,
        user_id: user.id,
        dog_id: dogId,
        liked,
      })
      .select()
      .single();

    if (error) {
      console.error('Error liking dog:', error);
      throw error;
    }
    return data;
  };

  const createBooking = async (
    matchId: string, 
    dogId: string, 
    shelterId: string, 
    dateTime: string,
    notes?: string
  ) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        match_id: matchId,
        dog_id: dogId,
        shelter_id: shelterId,
        date_time: dateTime,
        notes: notes || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    return data;
  };

  const getBookings = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        dogs(*),
        shelters(*),
        matches(*)
      `)
      .in('match_id', matches.map(m => m.id))
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    return data || [];
  };

  return {
    matches,
    loading,
    getMessages,
    sendMessage,
    updateMatchStatus,
    likeDog,
    createBooking,
    getBookings,
    refetch: fetchMatches,
  };
}