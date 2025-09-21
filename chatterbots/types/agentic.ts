/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Enhanced agent capabilities with Google Cloud integration
export interface AgenticCapabilities {
    gkeIntegration: boolean;
    geminiModel: string;
    adkEnabled: boolean;
    mcpServerEndpoint?: string;
    a2aProtocolEnabled: boolean;
    kubectlAiEnabled: boolean;
    geminiCliEnabled: boolean;
  }
  
  export interface EnhancedAgent extends Agent {
    capabilities: AgenticCapabilities;
    microserviceEndpoints?: string[];
    kubernetesNamespace?: string;
    agentId: string;
  }
  
  // Google AI Model configuration
  export interface GeminiConfig {
    model: 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-2.0-flash-exp';
    temperature: number;
    maxTokens: number;
    topP: number;
    topK: number;
  }
  
  // MCP (Model Context Protocol) configuration for microservice communication
  export interface MCPConfig {
    serverUrl: string;
    apiVersion: string;
    authentication: {
      type: 'bearer' | 'oauth' | 'service-account';
      credentials: string;
    };
    microserviceRegistry: {
      [serviceName: string]: {
        endpoint: string;
        methods: string[];
        schema: object;
      };
    };
  }
  
  // Agent2Agent protocol configuration
  export interface A2AConfig {
    orchestratorEndpoint: string;
    agentRegistry: string[];
    workflowDefinitions: {
      [workflowId: string]: {
        steps: Array<{
          agentId: string;
          action: string;
          parameters: object;
        }>;
      };
    };
  }
  
  // GKE deployment configuration
  export interface GKEConfig {
    clusterName: string;
    namespace: string;
    serviceAccount: string;
    resources: {
      requests: { cpu: string; memory: string };
      limits: { cpu: string; memory: string };
    };
    autoscaling: {
      minReplicas: number;
      maxReplicas: number;
      targetCPUUtilization: number;
    };
  }
  
  // Import your existing Agent and User types
  export type { Agent } from '../presets/agents';
  export type { User } from '../state';