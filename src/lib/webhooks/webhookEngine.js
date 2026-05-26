import { logger } from '../logger.js';
import { queueManager } from '../queue/queueManager.js';

class WebhookEngine {
  /**
   * Queue a webhook for delivery
   * @param {string} url
   * @param {Object} payload
   * @param {string} secretKey (optional) for signing
   */
  async dispatch(url, payload, secretKey = null) {
    logger.info(`Queueing webhook delivery to ${url}`);

    // We enqueue this to the job system for retry-safe delivery
    await queueManager.enqueue('webhooks', 'deliver_webhook', {
      url,
      payload,
      secretKey, // In production, never store raw secrets in jobs table, use KMS/Vault or pass reference ID
      timestamp: Date.now()
    }, { max_retries: 5 });
  }

  /**
   * Actual delivery mechanism (called by worker)
   */
  async deliver(jobPayload) {
    const { url, payload, secretKey, timestamp } = jobPayload;

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Platform-Webhook-Engine/1.0',
      'X-Timestamp': timestamp.toString(),
    };

    if (secretKey) {
      // In a real implementation:
      // const signature = crypto.createHmac('sha256', secretKey).update(JSON.stringify(payload)).digest('hex');
      // headers['X-Signature'] = signature;
      headers['X-Signature'] = 'simulated-signature-hash';
    }

    try {
      logger.debug(`Sending POST request to ${url}`);
      // Using fetch for outbound HTTP request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        // Timeout handling is crucial for webhook delivery to prevent blocked workers
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}: ${response.statusText}`);
      }

      logger.info(`Webhook successfully delivered to ${url}`);
      return { success: true, status: response.status };

    } catch (error) {
      logger.error(`Webhook delivery failed for ${url}`, error);
      throw error; // Let the queue system handle retries
    }
  }
}

export const webhookEngine = new WebhookEngine();
