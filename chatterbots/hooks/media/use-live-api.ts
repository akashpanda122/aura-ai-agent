import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GeminiLiveClient, GeminiLiveConnectConfig } from '../../lib/gemini-live-client';
import { AudioStreamer } from '../../lib/audio-streamer';
import { audioContext } from '../../lib/utils';
import VolMeterWorklet from '../../lib/worklets/vol-meter';
import { DEFAULT_LIVE_API_MODEL, GENERATION_PRESETS } from '../../lib/constants';

/**
 * Configuration for agentic capabilities
 */
export interface AgenticLiveConfig {
  // Enable Model Context Protocol for microservice communication
  enableMCP?: boolean;
  mcpServerEndpoint?: string;
  
  // Enable Agent2Agent protocol for multi-agent workflows
  enableA2A?: boolean;
  a2aOrchestratorEndpoint?: string;
  
  // Enable kubectl-ai for Kubernetes operations
  enableKubectlAi?: boolean;
  kubernetesNamespace?: string;
  
  // Enable Gemini CLI for development workflow acceleration
  enableGeminiCli?: boolean;
  
  // Google Cloud Platform configuration
  gcpProjectId?: string;
  gkeClusterName?: string;
  gkeZone?: string;
}

/**
 * Results returned by the useGeminiLiveApi hook
 */
export type UseGeminiLiveApiResults = {
  client: GeminiLiveClient;
  setConfig: (config: GeminiLiveConnectConfig) => void;
  setAgenticConfig: (config: AgenticLiveConfig) => void;
  config: GeminiLiveConnectConfig;
  agenticConfig: AgenticLiveConfig;

  connect: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;
  connecting: boolean;

  volume: number;
  
  // Agentic capabilities
  executeKubernetesOperation: (operation: string) => Promise<string>;
  callMicroservice: (serviceName: string, method: string, params: object) => Promise<any>;
  accelerateWorkflow: (codeContext: string, workflowType: string) => Promise<string>;
  orchestrateAgentWorkflow: (workflowId: string, parameters: object) => Promise<any>;
  
  // Streaming capabilities
  sendMessageStream: (message: string) => Promise<void>;
  streamingText: string;
  isStreaming: boolean;
};

export function useGeminiLiveApi({
  apiKey,
  model = DEFAULT_LIVE_API_MODEL,
  agenticConfig = {},
}: {
  apiKey: string;
  model?: string;
  agenticConfig?: AgenticLiveConfig;
}): UseGeminiLiveApiResults {
  // Initialize Gemini client with agentic capabilities
  const client = useMemo(() => 
    new GeminiLiveClient(apiKey, model, {
      enableMCP: agenticConfig.enableMCP,
      enableA2A: agenticConfig.enableA2A,
      enableKubectlAi: agenticConfig.enableKubectlAi,
      enableGeminiCli: agenticConfig.enableGeminiCli,
    }), 
    [apiKey, model, agenticConfig]
  );

  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  // State management
  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [config, setConfig] = useState<GeminiLiveConnectConfig>({
    generationConfig: GENERATION_PRESETS.BALANCED,
    systemInstruction: 'You are an advanced AI assistant powered by Google Gemini with agentic capabilities.',
  });
  const [currentAgenticConfig, setAgenticConfig] = useState<AgenticLiveConfig>(agenticConfig);
  
  // Streaming state
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Initialize audio streaming for real-time audio output
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'gemini-audio-out' }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>('vumeter-out', VolMeterWorklet, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            console.log('Audio worklet successfully initialized for Gemini');
          })
          .catch(err => {
            console.error('Error adding audio worklet:', err);
          });
      }).catch(err => {
        console.error('Error initializing audio context:', err);
      });
    }
  }, []);

  // Set up event listeners for the Gemini client
  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
      setConnecting(false);
      console.log('Connected to Google Gemini Live API');
    };

    const onClose = () => {
      setConnected(false);
      setConnecting(false);
      setIsStreaming(false);
      console.log('Disconnected from Google Gemini Live API');
    };

    const onError = (error: ErrorEvent) => {
      console.error('Gemini Live API Error:', error);
      setConnecting(false);
      setConnected(false);
      setIsStreaming(false);
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    const onContent = (content: any) => {
      if (content.modelTurn?.parts) {
        const textParts = content.modelTurn.parts
          .filter((part: any) => part.text)
          .map((part: any) => part.text)
          .join(' ');
        
        if (textParts) {
          console.log('Received content from Gemini:', textParts.substring(0, 100) + '...');
        }
      }
    };

    const onStream = (chunk: string) => {
      setStreamingText(prev => prev + chunk);
    };

    const onSetupComplete = () => {
      console.log('Gemini Live API setup complete');
    };

    const onTurnComplete = () => {
      setIsStreaming(false);
      console.log('Gemini turn complete');
    };

    const onToolCall = (toolCall: any) => {
      console.log('Gemini tool call received:', toolCall);
    };

    const onLog = (log: any) => {
      console.log(`[${log.type}] ${log.message}`);
    };

    // Bind event listeners
    client.on('open', onOpen);
    client.on('close', onClose);
    client.on('error', onError);
    client.on('interrupted', stopAudioStreamer);
    client.on('audio', onAudio);
    client.on('content', onContent);
    client.on('stream', onStream);
    client.on('setupcomplete', onSetupComplete);
    client.on('turncomplete', onTurnComplete);
    client.on('toolcall', onToolCall);
    client.on('log', onLog);

    return () => {
      // Clean up event listeners
      client.off('open', onOpen);
      client.off('close', onClose);
      client.off('error', onError);
      client.off('interrupted', stopAudioStreamer);
      client.off('audio', onAudio);
      client.off('content', onContent);
      client.off('stream', onStream);
      client.off('setupcomplete', onSetupComplete);
      client.off('turncomplete', onTurnComplete);
      client.off('toolcall', onToolCall);
      client.off('log', onLog);
    };
  }, [client]);

  // Connect to Gemini Live API
  const connect = useCallback(async () => {
    if (!config) {
      throw new Error('Gemini config has not been set');
    }
    
    if (connecting || connected) {
      return;
    }

    setConnecting(true);
    
    try {
      // Enhanced system instruction with agentic capabilities
      const enhancedConfig: GeminiLiveConnectConfig = {
        ...config,
        systemInstruction: buildAgenticSystemInstruction(config.systemInstruction, currentAgenticConfig),
      };

      client.disconnect();
      const success = await client.connect(enhancedConfig);
      
      if (!success) {
        throw new Error('Failed to connect to Gemini Live API');
      }
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      setConnecting(false);
      throw error;
    }
  }, [client, config, currentAgenticConfig, connecting, connected]);

  // Disconnect from Gemini Live API
  const disconnect = useCallback(() => {
    client.disconnect();
    setConnected(false);
    setConnecting(false);
    setIsStreaming(false);
    setStreamingText('');
  }, [client]);

  // Agentic capability functions
  const executeKubernetesOperation = useCallback(async (operation: string): Promise<string> => {
    if (!connected) {
      throw new Error('Not connected to Gemini');
    }
    
    if (!currentAgenticConfig.enableKubectlAi) {
      throw new Error('kubectl-ai not enabled');
    }

    return await client.executeKubernetesOperation(operation);
  }, [client, connected, currentAgenticConfig]);

  const callMicroservice = useCallback(async (serviceName: string, method: string, params: object): Promise<any> => {
    if (!connected) {
      throw new Error('Not connected to Gemini');
    }
    
    if (!currentAgenticConfig.enableMCP) {
      throw new Error('MCP not enabled');
    }

    return await client.callMicroservice(serviceName, method, params);
  }, [client, connected, currentAgenticConfig]);

  const accelerateWorkflow = useCallback(async (codeContext: string, workflowType: string): Promise<string> => {
    if (!connected) {
      throw new Error('Not connected to Gemini');
    }
    
    if (!currentAgenticConfig.enableGeminiCli) {
      throw new Error('Gemini CLI not enabled');
    }

    return await client.accelerateWorkflow(codeContext, workflowType);
  }, [client, connected, currentAgenticConfig]);

  const orchestrateAgentWorkflow = useCallback(async (workflowId: string, parameters: object): Promise<any> => {
    if (!connected) {
      throw new Error('Not connected to Gemini');
    }
    
    if (!currentAgenticConfig.enableA2A) {
      throw new Error('A2A protocol not enabled');
    }

    return await client.orchestrateWorkflow(workflowId, parameters);
  }, [client, connected, currentAgenticConfig]);

  // Streaming message function
  const sendMessageStream = useCallback(async (message: string): Promise<void> => {
    if (!connected) {
      throw new Error('Not connected to Gemini');
    }

    setIsStreaming(true);
    setStreamingText('');
    
    try {
      await client.sendMessageStream({ text: message });
    } catch (error) {
      setIsStreaming(false);
      throw error;
    }
  }, [client, connected]);

  return {
    client,
    config,
    agenticConfig: currentAgenticConfig,
    setConfig,
    setAgenticConfig,
    connect,
    connected,
    connecting,
    disconnect,
    volume,
    
    // Agentic capabilities
    executeKubernetesOperation,
    callMicroservice,
    accelerateWorkflow,
    orchestrateAgentWorkflow,
    
    // Streaming capabilities
    sendMessageStream,
    streamingText,
    isStreaming,
  };
}

/**
 * Build enhanced system instruction with agentic capabilities
 */
function buildAgenticSystemInstruction(
  baseInstruction?: string, 
  agenticConfig?: AgenticLiveConfig
): string {
  let instruction = baseInstruction || 'You are an advanced AI assistant powered by Google Gemini.';
  
  instruction += '\n\nYou have the following enhanced agentic capabilities:\n';
  
  if (agenticConfig?.enableMCP) {
    instruction += `- **Model Context Protocol (MCP)**: You can communicate with microservices at ${agenticConfig.mcpServerEndpoint || 'configured endpoints'}.\n`;
  }
  
  if (agenticConfig?.enableA2A) {
    instruction += `- **Agent2Agent Protocol**: You can orchestrate workflows with other agents via ${agenticConfig.a2aOrchestratorEndpoint || 'the orchestrator'}.\n`;
  }
  
  if (agenticConfig?.enableKubectlAi) {
    instruction += `- **kubectl-ai**: You can execute Kubernetes operations in namespace ${agenticConfig.kubernetesNamespace || 'default'}.\n`;
  }
  
  if (agenticConfig?.enableGeminiCli) {
    instruction += '- **Gemini CLI**: You can accelerate development workflows and understand code.\n';
  }
  
  if (agenticConfig?.gcpProjectId) {
    instruction += `\nYou are running on Google Cloud Platform in project "${agenticConfig.gcpProjectId}"`;
    if (agenticConfig.gkeClusterName) {
      instruction += ` on GKE cluster "${agenticConfig.gkeClusterName}"`;
      if (agenticConfig.gkeZone) {
        instruction += ` in zone "${agenticConfig.gkeZone}"`;
      }
    }
    instruction += '.\n';
  }
  
  instruction += '\nWhen users request complex operations, leverage these agentic capabilities to provide comprehensive solutions. Always explain which capabilities you\'re using and how they benefit the user\'s request.';
  
  return instruction;
}

// Backward compatibility export
export { useGeminiLiveApi as useLiveApi };