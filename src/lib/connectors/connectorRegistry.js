import { logger } from '../logger.js';

class ConnectorRegistry {
  constructor() {
    this.connectors = new Map();
  }

  /**
   * Register a new connector
   * @param {string} id
   * @param {Object} connectorConfig
   */
  register(id, connectorConfig) {
    if (this.connectors.has(id)) {
      logger.warn(`Overwriting existing connector definition for ${id}`);
    }
    this.connectors.set(id, connectorConfig);
    logger.info(`Registered connector: ${id}`);
  }

  /**
   * Get a connector definition
   * @param {string} id
   */
  get(id) {
    return this.connectors.get(id);
  }

  /**
   * List all available connectors
   */
  getAll() {
    return Array.from(this.connectors.entries()).map(([id, config]) => ({ id, ...config }));
  }
}

export const connectorRegistry = new ConnectorRegistry();
