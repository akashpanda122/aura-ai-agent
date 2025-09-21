/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GeminiConfig, GKEConfig, MCPConfig, A2AConfig } from '../types/agentic';

// Default Gemini configuration
export const defaultGeminiConfig: GeminiConfig = {
  model: 'gemini-1.5-pro',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.8,
  topK: 40
};

// Default GKE configuration
export const defaultGKEConfig: GKEConfig = {
  clusterName: 'aura-ai-cluster',
  namespace: 'agentic-bots',
  serviceAccount: 'aura-ai-sa',
  resources: {
    requests: { cpu: '200m', memory: '512Mi' },
    limits: { cpu: '1000m', memory: '1Gi' }
  },
  autoscaling: {
    minReplicas: 2,
    maxReplicas: 20,
    targetCPUUtilization: 70
  }
};

// Example MCP configuration
export const exampleMCPConfig: MCPConfig = {
  serverUrl: 'https://your-gke-cluster/mcp',
  apiVersion: 'v1',
  authentication: {
    type: 'service-account',
    credentials: process.env.GCP_SERVICE_ACCOUNT_KEY || ''
  },
  microserviceRegistry: {
    'user-service': {
      endpoint: '/api/users',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      schema: {}
    },
    'analytics-service': {
      endpoint: '/api/analytics',
      methods: ['GET', 'POST'],
      schema: {}
    },
    'notification-service': {
      endpoint: '/api/notifications',
      methods: ['POST'],
      schema: {}
    }
  }
};

// Example A2A configuration
export const exampleA2AConfig: A2AConfig = {
  orchestratorEndpoint: 'https://your-gke-cluster/a2a',
  agentRegistry: ['aura-main', 'aura-analyst', 'aura-executor'],
  workflowDefinitions: {
    'user-onboarding': {
      steps: [
        { agentId: 'aura-main', action: 'greet_user', parameters: {} },
        { agentId: 'aura-analyst', action: 'analyze_preferences', parameters: {} },
        { agentId: 'aura-executor', action: 'setup_profile', parameters: {} }
      ]
    },
    'complex-query': {
      steps: [
        { agentId: 'aura-analyst', action: 'break_down_query', parameters: {} },
        { agentId: 'aura-executor', action: 'execute_tasks', parameters: {} },
        { agentId: 'aura-main', action: 'synthesize_response', parameters: {} }
      ]
    }
  }
};