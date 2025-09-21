import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import EventEmitter from 'eventemitter3';
import { difference } from 'lodash';
import { base64ToArrayBuffer } from './utils';

/**
 * Represents a single log entry in the system.
 * Used for tracking and displaying system events, messages, and errors.
 */
export interface StreamingLog {
  // Optional count for repeated log entries
  count?: number;
  // Optional additional data associated with the log
  data?: unknown;
  // Timestamp of when the log was created
  date: Date;
  // The log message content
  message: string | object;
  // The type/category of the log entry
  type: string;
}

/**
 * Configuration for connecting to the Google Gemini Live API
 */
export interface GeminiLiveConnectConfig {
  systemInstruction?: string;
  tools?: Array<{
    functionDeclarations: Array<{
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
      };
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    candidateCount?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

/**
 * Represents a part of content (text, audio, image, etc.) for Gemini
 */
export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
  fileData?: {
    mimeType: string;
    fileUri: string;
  };
}

/**
 * Server content from the Gemini model
 */
export interface GeminiLiveServerContent {
  modelTurn?: {
    parts: GeminiPart[];
    role?: 'model' | 'user';
  };
  candidates?: Array<{
    content: {
      parts: GeminiPart[];
      role: string;
    };
    finishReason?: string;
    index: number;
  }>;
}

/**
 * Tool call from the Gemini server
 */
export interface GeminiLiveServerToolCall {
  functionCalls: Array<{
    name: string;
    id: string;
    args: Record<string, any>;
  }>;
}

/**
 * Tool call cancellation from Gemini server
 */
export interface GeminiLiveServerToolCallCancellation {
  ids: string[];
}

/**
 * Tool response from client to Gemini
 */
export interface GeminiLiveClientToolResponse {
  functionResponses?: Array<{
    name: string;
    id: string;
    response: Record<string, any>;
  }>;
}

/**
 * Event types that can be emitted by the GeminiLiveClient.
 * Each event corresponds to a specific message from Google Gemini or client state change.
 */
export interface GeminiLiveClientEventTypes {
  // Emitted when audio data is received
  audio: (data: ArrayBuffer) => void;
  // Emitted when the connection closes
  close: (event: CloseEvent) => void;
  // Emitted when content is received from the server
  content: (data: GeminiLiveServerContent) => void;
  // Emitted when an error occurs
  error: (e: ErrorEvent) => void;
  // Emitted when the server interrupts the current generation
  interrupted: () => void;
  // Emitted for logging events
  log: (log: StreamingLog) => void;
  // Emitted when the connection opens
  open: () => void;
  // Emitted when the initial setup is complete
  setupcomplete: () => void;
  // Emitted when a tool call is received
  toolcall: (toolCall: GeminiLiveServerToolCall) => void;
  // Emitted when a tool call is cancelled
  toolcallcancellation: (
    toolcallCancellation: GeminiLiveServerToolCallCancellation
  ) => void;
  // Emitted when the current turn is complete
  turncomplete: () => void;
  // Emitted when streaming content is received
  stream: (chunk: string) => void;
}

/**
 * Google Gemini Live Client for real-time multimodal interactions
 * Supports Google's agentic capabilities including MCP, A2A, kubectl-ai, and Gemini CLI
 */
export class GeminiLiveClient extends EventEmitter<GeminiLiveClientEventTypes> {
  public readonly model: string;
  
  protected readonly geminiAI: GoogleGenerativeAI;
  protected generativeModel?: GenerativeModel;
  protected websocket?: WebSocket;
  protected config?: GeminiLiveConnectConfig;
  protected chatSession?: any;
  
  // Agentic capabilities
  protected mcpEnabled: boolean = false;
  protected a2aEnabled: boolean = false;
  protected kubectlAiEnabled: boolean = false;
  protected geminiCliEnabled: boolean = false;

  private _status: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  public get status() {
    return this._status;
  }

  /**
   * Creates a new GeminiLiveClient instance with agentic capabilities.
   * @param apiKey - Google AI API key for authentication
   * @param model - Gemini model name (gemini-2.0-flash-exp, gemini-1.5-pro, etc.)
   * @param agenticConfig - Configuration for agentic capabilities
   */
  constructor(
    apiKey: string, 
    model: string = 'gemini-2.0-flash-exp',
    agenticConfig?: {
      enableMCP?: boolean;
      enableA2A?: boolean;
      enableKubectlAi?: boolean;
      enableGeminiCli?: boolean;
    }
  ) {
    super();
    this.model = model;
    
    // Initialize Google Generative AI
    this.geminiAI = new GoogleGenerativeAI(apiKey);
    
    // Set agentic capabilities
    if (agenticConfig) {
      this.mcpEnabled = agenticConfig.enableMCP || false;
      this.a2aEnabled = agenticConfig.enableA2A || false;
      this.kubectlAiEnabled = agenticConfig.enableKubectlAi || false;
      this.geminiCliEnabled = agenticConfig.enableGeminiCli || false;
    }
    
    this.log('client.init', `Initialized Gemini Live Client with ${model}`);
  }

  /**
   * Connect to Google Gemini with enhanced agentic capabilities
   */
  public async connect(config: GeminiLiveConnectConfig): Promise<boolean> {
    if (this._status === 'connected' || this._status === 'connecting') {
      return false;
    }

    this._status = 'connecting';
    this.config = config;

    try {
      // Enhanced system instruction with agentic capabilities
      const enhancedSystemInstruction = this.buildEnhancedSystemInstruction(config.systemInstruction);
      
      // Initialize Gemini model with agentic configuration
      this.generativeModel = this.geminiAI.getGenerativeModel({
        model: this.model,
        systemInstruction: enhancedSystemInstruction,
        tools: config.tools,
        generationConfig: {
          temperature: config.generationConfig?.temperature || 0.7,
          topP: config.generationConfig?.topP || 0.8,
          topK: config.generationConfig?.topK || 40,
          maxOutputTokens: config.generationConfig?.maxOutputTokens || 2048,
          responseMimeType: config.generationConfig?.responseMimeType || 'text/plain',
        },
        safetySettings: config.safetySettings || [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      });

      // Start chat session
      this.chatSession = this.generativeModel.startChat({
        history: []
      });

      // Try to establish WebSocket connection for real-time features (if available)
      await this.tryWebSocketConnection();
      
      this._status = 'connected';
      this.emit('open');
      this.emit('setupcomplete');
      
      this.log('client.connect', 'Connected to Google Gemini with agentic capabilities');
      return true;
      
    } catch (e) {
      console.error('Error connecting to Google Gemini:', e);
      this._status = 'disconnected';
      this.websocket = undefined;
      this.log('client.error', `Connection failed: ${e}`);
      return false;
    }
  }

  /**
   * Build enhanced system instruction with agentic capabilities
   */
  private buildEnhancedSystemInstruction(baseInstruction?: string): string {
    let instruction = baseInstruction || '';
    
    instruction += `\n\nYou are an advanced agentic AI system powered by Google Gemini with the following enhanced capabilities:\n`;
    
    if (this.mcpEnabled) {
      instruction += `- **Model Context Protocol (MCP)**: You can communicate with microservices and external APIs through standardized protocols.\n`;
    }
    
    if (this.a2aEnabled) {
      instruction += `- **Agent2Agent (A2A) Protocol**: You can coordinate with other AI agents to execute complex workflows.\n`;
    }
    
    if (this.kubectlAiEnabled) {
      instruction += `- **kubectl-ai Integration**: You can translate natural language requests into precise Kubernetes operations.\n`;
    }
    
    if (this.geminiCliEnabled) {
      instruction += `- **Gemini CLI**: You have access to command-line AI workflow tools for code understanding and development acceleration.\n`;
    }
    
    instruction += `\nWhen users request complex operations, leverage these agentic capabilities to provide comprehensive solutions. Always explain which capabilities you're using and how they benefit the user's request.`;
    
    return instruction;
  }

  /**
   * Try to establish WebSocket connection for real-time features
   */
  private async tryWebSocketConnection(): Promise<void> {
    try {
      // Note: Google Gemini doesn't currently support WebSocket for live streaming
      // This is a placeholder for when/if Google adds WebSocket support
      // For now, we'll use the streaming API through HTTP requests
      
      this.log('client.websocket', 'WebSocket not available for Gemini, using HTTP streaming');
    } catch (e) {
      this.log('client.websocket', 'WebSocket connection not available, using standard API');
    }
  }

  /**
   * Disconnect from Google Gemini
   */
  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = undefined;
    }
    
    this.chatSession = undefined;
    this.generativeModel = undefined;
    this._status = 'disconnected';

    this.log('client.close', 'Disconnected from Google Gemini');
    return true;
  }

  /**
   * Send message to Gemini with agentic processing
   */
  public async send(parts: GeminiPart | GeminiPart[], turnComplete: boolean = true): Promise<void> {
    if (this._status !== 'connected' || !this.chatSession) {
      this.emit('error', new ErrorEvent('Client is not connected to Gemini'));
      return;
    }

    const partsArray = Array.isArray(parts) ? parts : [parts];
    
    try {
      // Process content through agentic capabilities if needed
      const processedParts = await this.processAgenticContent(partsArray);
      
      // Prepare message for Gemini
      let messageText = '';
      const multimodalParts: any[] = [];
      
      processedParts.forEach(part => {
        if (part.text) {
          messageText += part.text + ' ';
        }
        if (part.inlineData) {
          multimodalParts.push({
            inlineData: part.inlineData
          });
        }
        if (part.fileData) {
          multimodalParts.push({
            fileData: part.fileData
          });
        }
      });

      // Send to Gemini
      let result;
      if (multimodalParts.length > 0) {
        // Multimodal content
        result = await this.chatSession.sendMessage([messageText.trim(), ...multimodalParts]);
      } else {
        // Text only
        result = await this.chatSession.sendMessage(messageText.trim());
      }

      // Process response
      const response = await result.response;
      const responseText = response.text();
      
      // Emit content event
      const content: GeminiLiveServerContent = {
        modelTurn: {
          parts: [{ text: responseText }],
          role: 'model'
        }
      };
      
      this.emit('content', content);
      
      // Check for function calls (tool calls)
      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const toolCall: GeminiLiveServerToolCall = {
          functionCalls: functionCalls.map(call => ({
            name: call.name,
            id: call.name + '_' + Date.now(),
            args: call.args || {}
          }))
        };
        this.emit('toolcall', toolCall);
        this.log('server.toolCall', toolCall);
      }

      if (turnComplete) {
        this.emit('turncomplete');
        this.log('server.send', 'turnComplete');
      }

      this.log('client.send', { parts: processedParts, response: responseText });
      
    } catch (error) {
      console.error('Error sending to Gemini:', error);
      const errorEvent = new ErrorEvent('Gemini API Error', {
        message: `Failed to send message: ${error}`
      });
      this.emit('error', errorEvent);
      this.log('client.error', error);
    }
  }

  /**
   * Process content through agentic capabilities
   */
  private async processAgenticContent(parts: GeminiPart[]): Promise<GeminiPart[]> {
    let processedParts = [...parts];
    
    for (const part of processedParts) {
      if (part.text) {
        let processedText = part.text;
        
        // Process through kubectl-ai if Kubernetes operations detected
        if (this.kubectlAiEnabled && this.isKubernetesRequest(processedText)) {
          processedText = await this.processKubectlAi(processedText);
        }
        
        // Process through Gemini CLI if code operations detected
        if (this.geminiCliEnabled && this.isCodeRequest(processedText)) {
          processedText = await this.processGeminiCli(processedText);
        }
        
        // Process through MCP if microservice operations detected
        if (this.mcpEnabled && this.isMicroserviceRequest(processedText)) {
          processedText = await this.processMCP(processedText);
        }
        
        part.text = processedText;
      }
    }
    
    return processedParts;
  }

  /**
   * Send real-time multimodal input (audio/video chunks)
   */
  public sendRealtimeInput(chunks: Array<{ mimeType: string; data: string }>): void {
    if (this._status !== 'connected') {
      this.emit('error', new ErrorEvent('Client is not connected to Gemini'));
      return;
    }

    // Process chunks for Gemini
    const parts: GeminiPart[] = chunks.map(chunk => ({
      inlineData: {
        mimeType: chunk.mimeType,
        data: chunk.data
      }
    }));

    // Send as multimodal message
    this.send(parts, false);

    // Determine content type for logging
    let hasAudio = false;
    let hasVideo = false;
    for (const chunk of chunks) {
      if (chunk.mimeType.includes('audio')) hasAudio = true;
      if (chunk.mimeType.includes('image') || chunk.mimeType.includes('video')) hasVideo = true;
    }

    let message = 'unknown';
    if (hasAudio && hasVideo) message = 'audio + video';
    else if (hasAudio) message = 'audio';
    else if (hasVideo) message = 'video';
    
    this.log('client.realtimeInput', message);
  }

  /**
   * Send tool response back to Gemini
   */
  public async sendToolResponse(toolResponse: GeminiLiveClientToolResponse): Promise<void> {
    if (this._status !== 'connected' || !this.chatSession) {
      this.emit('error', new ErrorEvent('Client is not connected to Gemini'));
      return;
    }

    if (toolResponse.functionResponses && toolResponse.functionResponses.length) {
      try {
        // Format function responses for Gemini
        const functionResponseParts = toolResponse.functionResponses.map(response => ({
          functionResponse: {
            name: response.name,
            response: response.response
          }
        }));

        // Send function responses
        const result = await this.chatSession.sendMessage(functionResponseParts);
        const response = await result.response;
        
        // Emit the response
        const content: GeminiLiveServerContent = {
          modelTurn: {
            parts: [{ text: response.text() }],
            role: 'model'
          }
        };
        
        this.emit('content', content);
        this.emit('turncomplete');
        
        this.log('client.toolResponse', { toolResponse, response: response.text() });
        
      } catch (error) {
        console.error('Error sending tool response to Gemini:', error);
        const errorEvent = new ErrorEvent('Gemini Tool Response Error', {
          message: `Failed to send tool response: ${error}`
        });
        this.emit('error', errorEvent);
      }
    }
  }

  /**
   * Stream content from Gemini (for long responses)
   */
  public async sendMessageStream(parts: GeminiPart | GeminiPart[]): Promise<void> {
    if (this._status !== 'connected' || !this.generativeModel) {
      this.emit('error', new ErrorEvent('Client is not connected to Gemini'));
      return;
    }

    const partsArray = Array.isArray(parts) ? parts : [parts];
    
    try {
      // Process content through agentic capabilities
      const processedParts = await this.processAgenticContent(partsArray);
      
      // Prepare message
      let messageText = '';
      const multimodalParts: any[] = [];
      
      processedParts.forEach(part => {
        if (part.text) {
          messageText += part.text + ' ';
        }
        if (part.inlineData) {
          multimodalParts.push({ inlineData: part.inlineData });
        }
        if (part.fileData) {
          multimodalParts.push({ fileData: part.fileData });
        }
      });

      // Stream the response
      let content = multimodalParts.length > 0 
        ? [messageText.trim(), ...multimodalParts]
        : messageText.trim();
        
      const result = await this.generativeModel.generateContentStream(content);
      
      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        // Emit streaming chunk
        this.emit('stream', chunkText);
        
        // Also emit as content for compatibility
        const streamContent: GeminiLiveServerContent = {
          modelTurn: {
            parts: [{ text: chunkText }],
            role: 'model'
          }
        };
        this.emit('content', streamContent);
      }
      
      this.emit('turncomplete');
      this.log('client.stream', `Streamed ${fullText.length} characters`);
      
    } catch (error) {
      console.error('Error streaming from Gemini:', error);
      const errorEvent = new ErrorEvent('Gemini Stream Error', {
        message: `Failed to stream message: ${error}`
      });
      this.emit('error', errorEvent);
    }
  }

  // Agentic capability detection methods
  private isKubernetesRequest(text: string): boolean {
    const k8sKeywords = ['kubectl', 'kubernetes', 'k8s', 'pod', 'deployment', 'service', 'namespace', 'cluster'];
    return k8sKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  private isCodeRequest(text: string): boolean {
    const codeKeywords = ['code', 'function', 'class', 'method', 'variable', 'debug', 'optimize', 'refactor'];
    return codeKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  private isMicroserviceRequest(text: string): boolean {
    const serviceKeywords = ['api', 'service', 'microservice', 'endpoint', 'database', 'query'];
    return serviceKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  // Agentic capability processing methods (placeholder implementations)
  private async processKubectlAi(text: string): Promise<string> {
    // Placeholder for kubectl-ai processing
    this.log('agentic.kubectl-ai', `Processing K8s request: ${text.substring(0, 50)}...`);
    return `[kubectl-ai processed] ${text}`;
  }

  private async processGeminiCli(text: string): Promise<string> {
    // Placeholder for Gemini CLI processing
    this.log('agentic.gemini-cli', `Processing code request: ${text.substring(0, 50)}...`);
    return `[Gemini CLI processed] ${text}`;
  }

  private async processMCP(text: string): Promise<string> {
    // Placeholder for MCP processing
    this.log('agentic.mcp', `Processing microservice request: ${text.substring(0, 50)}...`);
    return `[MCP processed] ${text}`;
  }

  /**
   * Internal method to emit a log event.
   * @param type - Log type
   * @param message - Log message
   */
  protected log(type: string, message: string | object) {
    this.emit('log', {
      type,
      message,
      date: new Date(),
    });
  }
}

// Export for backward compatibility
export { GeminiLiveClient as OpenAILiveClient };