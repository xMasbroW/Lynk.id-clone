import { supabase } from '../supabase.js';
import { logger } from '../logger.js';
import { WORKFLOW_STATUS, NODE_STATUS } from './constants.js';
import { createNodeExecutor } from './nodeExecutor.js';
import { dispatcher } from '../events/eventDispatcher.js';
import { EVENTS } from '../events/eventRegistry.js';

class WorkflowEngine {
  constructor(nodeRegistry = {}) {
    this.nodeExecutor = createNodeExecutor(nodeRegistry);
  }

  /**
   * Start a new workflow execution
   */
  async startExecution(workflowId, triggerPayload) {
    logger.info(`Starting execution for workflow ${workflowId}`);

    // 1. Fetch workflow definition
    const { data: workflow, error: wfError } = await supabase
      .from('automation_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (wfError || !workflow) {
      logger.error(`Failed to fetch workflow ${workflowId}`, wfError);
      return null;
    }

    // 2. Create execution record
    const { data: execution, error: execError } = await supabase
      .from('automation_runs')
      .insert({
        workflow_id: workflowId,
        status: WORKFLOW_STATUS.RUNNING,
        context: { trigger: triggerPayload, nodes: {} }
      })
      .select('*')
      .single();

    if (execError) {
      logger.error('Failed to create workflow execution record', execError);
      return null;
    }

    // 3. Begin async execution of nodes (could be delegated to job queue)
    // For simplicity in engine, we'll return execution ID and let a worker pick it up
    return execution.id;
  }

  /**
   * Process a running execution. This is typically called by a worker
   * executing from a job queue to keep it resumable.
   */
  async processExecution(executionId) {
    // 1. Fetch current execution state and workflow definition
    const { data: execution, error } = await supabase
      .from('automation_runs')
      .select('*, automation_workflows(definition)')
      .eq('id', executionId)
      .single();

    if (error || !execution) {
      logger.error(`Execution ${executionId} not found`);
      return;
    }

    if (execution.status !== WORKFLOW_STATUS.RUNNING) {
      logger.debug(`Execution ${executionId} is not running (${execution.status})`);
      return;
    }

    const definition = execution.automation_workflows.definition;
    const context = execution.context || { nodes: {} };

    // Find next node to execute.
    // Simplified: Find first node not in context, or specifically track current_node_id
    let currentNodeId = execution.current_node_id || definition.startNode;

    while (currentNodeId) {
      const nodeDef = definition.nodes[currentNodeId];
      if (!nodeDef) {
        logger.error(`Node ${currentNodeId} not found in workflow definition`);
        await this.failExecution(executionId, `Node ${currentNodeId} not found`);
        return;
      }

      // Execute node
      const result = await this.nodeExecutor.execute(nodeDef, context);

      // Update context
      context.nodes[currentNodeId] = {
        status: result.status,
        result: result.result,
        error: result.error
      };

      if (result.status === NODE_STATUS.FAILED) {
        // Stop execution on failure
        await this.failExecution(executionId, result.error, context, currentNodeId);
        return;
      }

      if (result.status === NODE_STATUS.PAUSED || result.status === NODE_STATUS.PENDING) {
        // Workflow is waiting (e.g. delay node or human approval)
        await this.pauseExecution(executionId, context, currentNodeId);
        return;
      }

      // Move to next node
      currentNodeId = result.nextNodeId;

      // Save state snapshot after each node for resumability
      await supabase
        .from('automation_runs')
        .update({ context, current_node_id: currentNodeId })
        .eq('id', executionId);
    }

    // No more nodes, complete execution
    await this.completeExecution(executionId, context);
  }

  async failExecution(executionId, error, context, nodeId) {
    await supabase
      .from('automation_runs')
      .update({
        status: WORKFLOW_STATUS.FAILED,
        error: error,
        context,
        current_node_id: nodeId,
        completed_at: new Date().toISOString()
      })
      .eq('id', executionId);

    await dispatcher.dispatch(EVENTS.WORKFLOW_FAILED, { executionId, error });
  }

  async pauseExecution(executionId, context, nodeId) {
    await supabase
      .from('automation_runs')
      .update({
        status: WORKFLOW_STATUS.PAUSED,
        context,
        current_node_id: nodeId
      })
      .eq('id', executionId);
  }

  async completeExecution(executionId, context) {
    await supabase
      .from('automation_runs')
      .update({
        status: WORKFLOW_STATUS.COMPLETED,
        context,
        completed_at: new Date().toISOString(),
        current_node_id: null
      })
      .eq('id', executionId);

    await dispatcher.dispatch(EVENTS.WORKFLOW_COMPLETED, { executionId });
  }
}

export const workflowEngine = new WorkflowEngine();
