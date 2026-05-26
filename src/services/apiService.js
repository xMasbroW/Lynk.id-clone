import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

import { apiClient } from '../lib/apiClient';

export const apiService = {
  async getApiKeys(workspaceId) {
    return swrCache.fetch(`api_keys_${workspaceId}`, async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, last_used_at, created_at') // Note: key_hash is deliberately NOT selected
        .eq('workspace_id', workspaceId);

      if (error) throw error;
      return data;
    }, 15000);
  },

  async createApiKey(workspaceId, name) {
    // The key itself is generated on the server (Edge Function) and only ever returned ONCE.
    // The DB only stores the hash.
    const { rawKey, keyRecord } = await apiClient.invokeFunction('create-api-key', { workspaceId, name });
    swrCache.invalidate(`api_keys_${workspaceId}`);
    return { rawKey, keyRecord };
  },

  async revokeApiKey(keyId, workspaceId) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('workspace_id', workspaceId);

    if (error) throw error;

    swrCache.invalidate(`api_keys_${workspaceId}`);
    return true;
  }
};
