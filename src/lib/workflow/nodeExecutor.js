import { logger } from '../logger.js';
import { NODE_STATUS } from './constants.js';

class NodeExecutor {
  constructor(nodeRegistry) {
    this.registry = nodeRegistry;
  }

  /**
   * Execute a single node in the workflow
   * @param {Object} node
   * @param {Object} executionContext (e.g. results of previous nodes, input data)
   * @returns {Object} result and next steps
   */
  async execute(node, executionContext) {
    logger.debug(`Executing node ${node.id} of type ${node.type}`);

    try {
      const handler = this.registry[node.type];

      if (!handler) {
        throw new Error(`Unknown node type: ${node.type}`);
      }

      // Execute node logic
      const result = await handler(node.config, executionContext);

      return {
        status: NODE_STATUS.COMPLETED,
        result,
        nextNodeId: this.determineNextNode(node, result)
      };
    } catch (error) {
      logger.error(`Failed to execute node ${node.id}`, error);
      return {
        status: NODE_STATUS.FAILED,
        error: error.message || String(error)
      };
    }
  }

  determineNextNode(node, result) {
    // Basic linear next node
    if (node.next) {
      return node.next;
    }

    // Branching logic based on node type and result
    if (node.branches && result && result.branch) {
      return node.branches[result.branch];
    }

    return null;
  }
}

export const createNodeExecutor = (registry) => new NodeExecutor(registry);
