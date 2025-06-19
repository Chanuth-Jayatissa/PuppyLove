import { supabase } from './supabase';

export async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(content: string, sender: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content, sender }]);
  if (error) throw error;
  return data;
}