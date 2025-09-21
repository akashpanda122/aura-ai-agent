/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Agent } from '../presets/agents';
import { User } from '../state';
import {
  EnhancedAgent,
  AgenticCapabilities,
  GeminiConfig,
  MCPConfig,
  A2AConfig,
  GKEConfig
} from '../types/agentic';

// Enhanced system with agentic capabilities
export class AgenticChatterbot {
  private agent: EnhancedAgent;
  private user: User;
  private geminiConfig: GeminiConfig;
  private mcpConfig?: MCPConfig;
  private a2aConfig?: A2AConfig;
  private gkeConfig: GKEConfig;

  constructor(
    agent: EnhancedAgent,
    user: User,
    geminiConfig: GeminiConfig,
    gkeConfig: GKEConfig,
    mcpConfig?: MCPConfig,
    a2aConfig?: A2AConfig
  ) {
    this.agent = agent;
    this.user = user;
    this.geminiConfig = geminiConfig;
    this.gkeConfig = gkeConfig;
    this.mcpConfig = mcpConfig;
    this.a2aConfig = a2aConfig;
  }

  // Enhanced system instructions with agentic capabilities
  createSystemInstructions(): string {
    const baseInstructions = this.getBaseInstructions();
    const agenticInstructions = this.getAgenticInstructions();
    const integrationInstructions = this.getIntegrationInstructions();

    return `${baseInstructions}

${agenticInstructions}

${integrationInstructions}

Output a thoughtful response that makes sense given your personality, interests, and agentic capabilities. \
Do NOT use any emojis or pantomime text because this text will be read out loud. \
Keep it fairly concise, don't speak too many sentences at once. NEVER EVER repeat \
things you've said before in the conversation!

When appropriate, leverage your agentic capabilities to provide enhanced functionality, \
orchestrate workflows, or communicate with microservices to better assist the user.`;
  }

  private getBaseInstructions(): string {
    return `Your name is ${this.agent.name} and you are in a conversation with the user\
${this.user.name ? ` (${this.user.name})` : ''}.

Your personality is described like this:
${this.agent.personality}

Today's date is ${new Intl.DateTimeFormat(navigator.languages[0], {
      dateStyle: 'full',
    }).format(new Date())} at ${new Date()
      .toLocaleTimeString()
      .replace(/:\d\d /, ' ')}.`;
  }

  private getAgenticInstructions(): string {
    const capabilities = this.agent.capabilities;
    let instructions = `\nYou are an enhanced agentic system with the following capabilities:\n`;

    if (capabilities.gkeIntegration) {
      instructions += `- **Google Kubernetes Engine Integration**: You can deploy, manage, and scale applications on GKE cluster "${this.gkeConfig.clusterName}" in namespace "${this.gkeConfig.namespace}"\n`;
    }

    instructions += `- **Google AI Models**: You are powered by ${capabilities.geminiModel} with advanced reasoning and multimodal capabilities\n`;

    if (capabilities.adkEnabled) {
      instructions += `- **Agent Development Kit (ADK)**: You have access to advanced agent building tools and frameworks\n`;
    }

    if (capabilities.mcpServerEndpoint && this.mcpConfig) {
      instructions += `- **Model Context Protocol (MCP)**: You can communicate with microservices through MCP server at ${capabilities.mcpServerEndpoint}\n`;
      instructions += `  Available microservices: ${Object.keys(this.mcpConfig.microserviceRegistry).join(', ')}\n`;
    }

    if (capabilities.a2aProtocolEnabled && this.a2aConfig) {
      instructions += `- **Agent2Agent Protocol**: You can orchestrate complex workflows with other agents\n`;
      instructions += `  Available agents: ${this.a2aConfig.agentRegistry.join(', ')}\n`;
    }

    if (capabilities.kubectlAiEnabled) {
      instructions += `- **kubectl-ai**: You can translate user intent into precise Kubernetes operations for efficient cluster management\n`;
    }

    if (capabilities.geminiCliEnabled) {
      instructions += `- **Gemini CLI**: You have access to command-line AI workflow tools that understand code and accelerate workflows\n`;
    }

    return instructions;
  }

  private getIntegrationInstructions(): string {
    return `\nIntegration Guidelines:
- When users request application deployment or scaling, leverage your GKE integration
- For complex data processing or analysis tasks, utilize appropriate microservices via MCP
- When multi-step workflows are needed, coordinate with other agents using A2A protocol
- Use kubectl-ai for any Kubernetes management tasks to make operations more accessible
- Leverage Gemini CLI for development workflow acceleration when working with code

Your agent ID is ${this.agent.agentId} for coordination purposes.`;
  }

  // Method to interact with Gemini models
  async queryGemini(prompt: string, context?: object): Promise<string> {
    const payload = {
      model: this.geminiConfig.model,
      prompt: prompt,
      temperature: this.geminiConfig.temperature,
      maxTokens: this.geminiConfig.maxTokens,
      topP: this.geminiConfig.topP,
      topK: this.geminiConfig.topK,
      context: context
    };

    // Implementation would call Google AI API
    console.log('Querying Gemini with:', payload);
    return "Enhanced response from Gemini model";
  }

  // Method to communicate with microservices via MCP
  async callMicroservice(serviceName: string, method: string, params: object): Promise<any> {
    if (!this.mcpConfig) {
      throw new Error('MCP not configured');
    }

    const service = this.mcpConfig.microserviceRegistry[serviceName];
    if (!service) {
      throw new Error(`Microservice ${serviceName} not found`);
    }

    console.log(`Calling ${serviceName}.${method} with:`, params);
    return { status: 'success', data: 'Mock microservice response' };
  }

  // Method to orchestrate agent workflows via A2A
  async orchestrateWorkflow(workflowId: string, parameters: object): Promise<any> {
    if (!this.a2aConfig) {
      throw new Error('A2A protocol not configured');
    }

    const workflow = this.a2aConfig.workflowDefinitions[workflowId];
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    console.log(`Orchestrating workflow ${workflowId} with:`, parameters);
    return { workflowId, status: 'initiated', steps: workflow.steps.length };
  }

  // Method to execute kubectl operations via kubectl-ai
  async executeKubernetes(userIntent: string): Promise<string> {
    if (!this.agent.capabilities.kubectlAiEnabled) {
      throw new Error('kubectl-ai not enabled');
    }

    console.log(`Translating kubectl intent: ${userIntent}`);
    return `Kubernetes operation completed: ${userIntent}`;
  }

  // Method to accelerate workflows via Gemini CLI
  async accelerateWorkflow(codeContext: string, workflowType: string): Promise<string> {
    if (!this.agent.capabilities.geminiCliEnabled) {
      throw new Error('Gemini CLI not enabled');
    }

    console.log(`Accelerating ${workflowType} workflow with context:`, codeContext);
    return `Workflow accelerated using Gemini CLI`;
  }

  // Get deployment configuration for GKE
  getGKEDeploymentConfig(): object {
    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: `${this.agent.name.toLowerCase()}-agent`,
        namespace: this.gkeConfig.namespace,
        labels: {
          app: `${this.agent.name.toLowerCase()}-agent`,
          'agent-id': this.agent.agentId
        }
      },
      spec: {
        replicas: this.gkeConfig.autoscaling.minReplicas,
        selector: {
          matchLabels: {
            app: `${this.agent.name.toLowerCase()}-agent`
          }
        },
        template: {
          metadata: {
            labels: {
              app: `${this.agent.name.toLowerCase()}-agent`,
              'agent-id': this.agent.agentId
            }
          },
          spec: {
            serviceAccountName: this.gkeConfig.serviceAccount,
            containers: [{
              name: 'agent',
              image: `gcr.io/${this.gkeConfig.clusterName}/${this.agent.name.toLowerCase()}-agent:latest`,
              resources: this.gkeConfig.resources,
              env: [
                {
                  name: 'AGENT_ID',
                  value: this.agent.agentId
                },
                {
                  name: 'GEMINI_MODEL',
                  value: this.geminiConfig.model
                }
              ]
            }]
          }
        }
      }
    };
  }
}

// Factory function to create enhanced agentic chatterbot
export const createAgenticChatterbot = (
  baseAgent: Agent,
  user: User,
  options: {
    gkeCluster: string;
    namespace: string;
    geminiModel?: string;
    enableMCP?: boolean;
    enableA2A?: boolean;
    enableKubectlAi?: boolean;
    enableGeminiCli?: boolean;
    mcpConfig?: MCPConfig;
    a2aConfig?: A2AConfig;
  }
): AgenticChatterbot => {
  const enhancedAgent: EnhancedAgent = {
    ...baseAgent,
    agentId: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    capabilities: {
      gkeIntegration: true,
      geminiModel: options.geminiModel || 'gemini-1.5-pro',
      adkEnabled: true,
      mcpServerEndpoint: options.enableMCP ? `https://${options.gkeCluster}/mcp` : undefined,
      a2aProtocolEnabled: options.enableA2A || false,
      kubectlAiEnabled: options.enableKubectlAi || false,
      geminiCliEnabled: options.enableGeminiCli || false
    },
    kubernetesNamespace: options.namespace
  };

  const geminiConfig: GeminiConfig = {
    model: (options.geminiModel as any) || 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.8,
    topK: 40
  };

  const gkeConfig: GKEConfig = {
    clusterName: options.gkeCluster,
    namespace: options.namespace,
    serviceAccount: 'agentic-chatterbot-sa',
    resources: {
      requests: { cpu: '100m', memory: '256Mi' },
      limits: { cpu: '500m', memory: '512Mi' }
    },
    autoscaling: {
      minReplicas: 1,
      maxReplicas: 10,
      targetCPUUtilization: 70
    }
  };

  return new AgenticChatterbot(
    enhancedAgent,
    user,
    geminiConfig,
    gkeConfig,
    options.mcpConfig,
    options.a2aConfig
  );
};

// BACKWARD COMPATIBILITY: Export the original function
export const createSystemInstructions = (agent: Agent, user: User) => {
  const basicBot = createAgenticChatterbot(agent, user, {
    gkeCluster: 'default-cluster',
    namespace: 'default'
  });
  return basicBot.createSystemInstructions();
};