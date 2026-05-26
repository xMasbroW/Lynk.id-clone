/**
 * Service to orchestrate AI generation tasks securely using async queues.
 * AI tasks are moved off the main request thread to ensure scalability and retryability.
 */
import { apiClient } from '../lib/apiClient.js';
import { queueManager } from '../lib/queue/queueManager.js';
import { supabase } from '../lib/supabase.js';

export const aiService = {
  /**
   * Sync call for immediate, low-latency UI generation (kept for fallback/simplicity)
   */
  async generateBioSync(context) {
    const response = await apiClient.invokeFunction('ai-completion', { promptType: 'BIO_GENERATION', context });
    return response.result;
  },

  /**
   * Async queue call for heavy AI operations (workflows, batch generation)
   */
  async queueGeneration(promptType, context, userId, webhookUrl = null) {
    // 1. Create a tracking record in ai_execution_logs (simulated here with jobs table or specific table)
    const jobId = await queueManager.enqueue('ai_jobs', 'generate_content', {
      promptType,
      context,
      userId,
      webhookUrl
    }, { max_retries: 3 });

    return jobId;
  },

  /**
   * Worker processor function for the 'ai_jobs' queue
   */
  async processAiJob(jobPayload) {
    const { promptType, context, userId, webhookUrl } = jobPayload;

    // Call Edge Function to perform actual secure LLM call
    const response = await apiClient.invokeFunction('ai-completion', { promptType, context });

    // Log token usage (assuming edge function returns usage stats)
    if (response.usage) {
       await supabase.from('ai_execution_logs').insert({
         user_id: userId,
         prompt_type: promptType,
         tokens_used: response.usage.total_tokens || 0,
         model_used: response.model || 'unknown',
         status: 'success'
       });
    }

    // If a webhook was provided, dispatch result to webhook engine
    if (webhookUrl) {
       const { webhookEngine } = await import('../lib/webhooks/webhookEngine.js');
       await webhookEngine.dispatch(webhookUrl, {
         event: 'ai.generated',
         data: response.result
       });
    }

    // Dispatch system event
    const { dispatcher } = await import('../lib/events/eventDispatcher.js');
    const { EVENTS } = await import('../lib/events/eventRegistry.js');
    await dispatcher.dispatch(EVENTS.AI_GENERATED, { userId, promptType, result: response.result });

    return response.result;
  }
};
