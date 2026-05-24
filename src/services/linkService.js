import { supabase } from '../lib/supabase';

export const linkService = {
  async getLinks(userId) {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addLink(userId, linkData) {
    const { data, error } = await supabase
      .from('links')
      .insert([{ ...linkData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLink(linkId, userId, updates) {
    const { data, error } = await supabase
      .from('links')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', linkId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLink(linkId, userId) {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  async reorderLinks(userId, linkIds) {
    // Expected linkIds to be an ordered array of link ids
    const updates = linkIds.map((id, index) => ({
      id,
      user_id: userId,
      order_index: index,
      updated_at: new Date(),
    }));

    const { data, error } = await supabase
      .from('links')
      .upsert(updates)
      .select();

    if (error) throw error;
    return data;
  }
};
