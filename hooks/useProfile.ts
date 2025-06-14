import { useEffect, useState } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { useAuth } from './useAuth';

type UserProfile = Database['public']['Tables']['users']['Row'];
type DogAvatar = Database['public']['Tables']['dog_avatars']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];
type ProfilePrompt = Database['public']['Tables']['profile_prompts']['Row'];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dogAvatars, setDogAvatars] = useState<DogAvatar[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<ProfilePrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDogAvatars();
      fetchTags();
      fetchUserTags();
      fetchPrompts();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchDogAvatars = async () => {
    const { data, error } = await supabase
      .from('dog_avatars')
      .select('*')
      .order('label');

    if (error) {
      console.error('Error fetching dog avatars:', error);
    } else {
      setDogAvatars(data || []);
    }
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('label');

    if (error) {
      console.error('Error fetching tags:', error);
    } else {
      setTags(data || []);
    }
  };

  const fetchUserTags = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_tags')
      .select('tag_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user tags:', error);
    } else {
      setUserTags(data?.map(ut => ut.tag_id) || []);
    }
  };

  const fetchPrompts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profile_prompts')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching prompts:', error);
    } else {
      setPrompts(data || []);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    } else {
      setProfile(data);
      return data;
    }
  };

  const updateUserTags = async (tagIds: string[]) => {
    if (!user) return;

    // Delete existing tags
    await supabase
      .from('user_tags')
      .delete()
      .eq('user_id', user.id);

    // Insert new tags
    if (tagIds.length > 0) {
      const { error } = await supabase
        .from('user_tags')
        .insert(tagIds.map(tagId => ({ user_id: user.id, tag_id: tagId })));

      if (error) {
        console.error('Error updating user tags:', error);
        throw error;
      }
    }

    setUserTags(tagIds);
  };

  const updatePrompt = async (promptType: string, answer: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profile_prompts')
      .upsert({
        user_id: user.id,
        prompt_type: promptType as any,
        answer,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating prompt:', error);
      throw error;
    } else {
      // Update local state
      setPrompts(prev => {
        const existing = prev.find(p => p.prompt_type === promptType);
        if (existing) {
          return prev.map(p => p.prompt_type === promptType ? data : p);
        } else {
          return [...prev, data];
        }
      });
      return data;
    }
  };

  return {
    profile,
    dogAvatars,
    tags,
    userTags,
    prompts,
    loading,
    updateProfile,
    updateUserTags,
    updatePrompt,
    refetch: fetchProfile,
  };
}