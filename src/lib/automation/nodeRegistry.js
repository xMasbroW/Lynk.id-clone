import { logger } from '../logger.js';

export const NODE_TYPES = {
  TRIGGER_WEBHOOK: 'trigger.webhook',
  TRIGGER_SCHEDULE: 'trigger.schedule',
  ACTION_SEND_EMAIL: 'action.send_email',
  ACTION_HTTP_REQUEST: 'action.http_request',
  ACTION_AI_GENERATE: 'action.ai_generate',
  CONDITION_IF_ELSE: 'condition.if_else',
  DELAY: 'delay'
};

class NodeRegistry {
  constructor() {
    this.nodes = new Map();
  }

  register(type, definition) {
    if (this.nodes.has(type)) {
      logger.warn(`Overwriting existing node definition for ${type}`);
    }
    this.nodes.set(type, definition);
    logger.info(`Registered automation node: ${type}`);
  }

  get(type) {
    return this.nodes.get(type);
  }

  getAll() {
    return Array.from(this.nodes.entries()).map(([type, def]) => ({ type, ...def }));
  }
}

export const nodeRegistry = new NodeRegistry();

// Example Registrations
nodeRegistry.register(NODE_TYPES.ACTION_HTTP_REQUEST, {
  name: 'HTTP Request',
  description: 'Make an external HTTP request',
  schema: {
    url: { type: 'string', required: true },
    method: { type: 'string', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
    headers: { type: 'object', default: {} },
    body: { type: 'object', default: {} }
  },
  execute: async () => {
    // Implementation placeholder
    return { success: true, status: 200, data: {} };
  }
});

nodeRegistry.register(NODE_TYPES.DELAY, {
  name: 'Delay',
  description: 'Wait for a specified amount of time',
  schema: {
    durationMs: { type: 'number', required: true }
  },
  execute: async (config) => {
    // Return PENDING or PAUSED status with delay config
    // The engine handles the actual delay via the scheduler/queue
    return { status: 'paused', delayMs: config.durationMs };
  }
});
