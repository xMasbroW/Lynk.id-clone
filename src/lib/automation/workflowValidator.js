import { nodeRegistry } from './nodeRegistry.js';

export class WorkflowValidator {
  /**
   * Validate a workflow definition schema
   * @param {Object} definition
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  static validate(definition) {
    const errors = [];

    if (!definition || typeof definition !== 'object') {
      return { isValid: false, errors: ['Workflow definition must be an object'] };
    }

    if (!definition.startNode) {
      errors.push('Missing startNode');
    }

    if (!definition.nodes || typeof definition.nodes !== 'object') {
      errors.push('Missing or invalid nodes object');
      return { isValid: false, errors };
    }

    // Validate individual nodes
    for (const [nodeId, node] of Object.entries(definition.nodes)) {
      if (!node.type) {
        errors.push(`Node ${nodeId} is missing a type`);
        continue;
      }

      const registeredNode = nodeRegistry.get(node.type);
      if (!registeredNode) {
        errors.push(`Node ${nodeId} has unknown type: ${node.type}`);
        continue;
      }

      // Basic schema validation for node config
      if (registeredNode.schema) {
        for (const [key, prop] of Object.entries(registeredNode.schema)) {
          if (prop.required && (node.config === undefined || node.config[key] === undefined)) {
            errors.push(`Node ${nodeId} is missing required config property: ${key}`);
          }
        }
      }

      // Check next node references
      if (node.next && !definition.nodes[node.next]) {
        errors.push(`Node ${nodeId} references non-existent next node: ${node.next}`);
      }

      if (node.branches) {
        for (const branchNextId of Object.values(node.branches)) {
          if (!definition.nodes[branchNextId]) {
            errors.push(`Node ${nodeId} branch references non-existent node: ${branchNextId}`);
          }
        }
      }
    }

    // Check if startNode exists
    if (definition.startNode && !definition.nodes[definition.startNode]) {
      errors.push(`startNode ${definition.startNode} does not exist in nodes`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
