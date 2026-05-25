/**
 * Service to orchestrate AI generation tasks securely.
 * Calls edge functions to hide API keys (OpenAI/Gemini) and track token usage.
 */
import { apiClient } from '../lib/apiClient';

export const aiService = {
  async generateBio(context) {
    // In production, the edge function "ai-completion" processes the request using the provider fallback chain.
    const response = await apiClient.invokeFunction('ai-completion', { promptType: 'BIO_GENERATION', context });
    return response.result;
  },

  async optimizeLinkTitle(title) {
    const response = await apiClient.invokeFunction('ai-completion', { promptType: 'CTA_OPTIMIZATION', context: title });
    return response.result;
  }
};
