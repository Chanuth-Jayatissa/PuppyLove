import { useEffect, useState } from 'react';
import { supabase, Database } from '@/lib/supabase';

type Dog = Database['public']['Tables']['dogs']['Row'];
type Shelter = Database['public']['Tables']['shelters']['Row'];

export function useDogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDogs();
    fetchShelters();
  }, []);

  const fetchDogs = async () => {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dogs:', error);
    } else {
      setDogs(data || []);
    }
    setLoading(false);
  };

  const fetchShelters = async () => {
    const { data, error } = await supabase
      .from('shelters')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching shelters:', error);
    } else {
      setShelters(data || []);
    }
  };

  const getDogById = (id: string) => {
    return dogs.find(dog => dog.id === id);
  };

  const getShelterById = (id: string) => {
    return shelters.find(shelter => shelter.id === id);
  };

  return {
    dogs,
    shelters,
    loading,
    getDogById,
    getShelterById,
    refetch: fetchDogs,
  };
}