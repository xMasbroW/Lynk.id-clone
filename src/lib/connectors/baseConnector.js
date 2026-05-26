import { logger } from '../logger.js';

export class BaseConnector {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.version = config.version || '1.0.0';
    this.authType = config.authType || 'none'; // 'oauth2', 'api_key', 'none'
    this.actions = config.actions || {};
    this.triggers = config.triggers || {};
  }

  /**
   * Execute a specific action on this connector
   * @param {string} actionId
   * @param {Object} payload
   * @param {Object} authContext
   */
  async executeAction(actionId, payload, authContext) {
    if (!this.actions[actionId]) {
      throw new Error(`Action ${actionId} not found on connector ${this.id}`);
    }

    logger.debug(`Executing action ${actionId} on connector ${this.id}`);
    try {
      const result = await this.actions[actionId].handler(payload, authContext);
      return { success: true, data: result };
    } catch (error) {
      logger.error(`Connector execution error (${this.id}:${actionId})`, error);
      return {
        success: false,
        error: error.message || 'Execution failed',
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get metadata for UI builder
   */
  getMetadata() {
    return {
      id: this.id,
      name: this.name,
      authType: this.authType,
      actions: Object.keys(this.actions).map(key => ({
        id: key,
        name: this.actions[key].name,
        description: this.actions[key].description,
        schema: this.actions[key].schema
      }))
    };
  }
}
