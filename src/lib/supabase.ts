import { createClient } from '@supabase/supabase-js';
import { UploadClient } from '@uploadcare/upload-client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize UploadCare client
const uploadClient = new UploadClient({
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
});

export interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  status: 'available' | 'rented' | 'unavailable';
  created_at: string;
  start_date: string;
  end_date: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const result = await uploadClient.uploadFile(file);
    if (!result.cdnUrl) {
      throw new Error('Failed to get CDN URL from upload');
    }
    return result.cdnUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const createItem = async (item: Omit<Item, 'created_at' | 'id' | 'user_id'>) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        ...item,
        user_id: userData.user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateItem = async (id: string, updates: Partial<Item>) => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getItems = async (filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  let query = supabase
    .from('items')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'available');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getItemById = async (id: string) => {
  const { data, error } = await supabase
    .from('items')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getUserItems = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};