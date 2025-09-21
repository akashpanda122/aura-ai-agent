# Aura AI - Advanced Agentic Companion with Google Cloud Integration

An intelligent, multimodal AI companion powered by Google Gemini with advanced agentic capabilities for real-time conversations, microservice orchestration, and cloud-native operations.

## 🌟 Features

### Core Capabilities
- **Real-time Voice Chat**: Live audio streaming with Google Gemini 2.0 Flash Exp
- **Visual Avatar**: Animated face that responds to audio input/output
- **Multimodal Support**: Text, audio, image, and video processing
- **Volume Monitoring**: Real-time audio visualization
- **Customizable Agents**: Different AI personalities with agentic capabilities

### 🤖 Advanced Agentic Features
- **Google Kubernetes Engine (GKE)**: Cloud-native deployment and scaling
- **Model Context Protocol (MCP)**: Seamless microservice communication
- **Agent2Agent (A2A)**: Multi-agent workflow orchestration
- **kubectl-ai**: Natural language Kubernetes operations
- **Gemini CLI**: AI-powered development workflow acceleration

## 🚀 Google Cloud Integration

This application leverages the full Google Cloud ecosystem with advanced agentic capabilities:

### Google AI Models
- **Primary Model**: `gemini-2.0-flash-exp` (Latest experimental with enhanced capabilities)
- **Alternative Models**: `gemini-1.5-pro`, `gemini-1.5-flash`
- **Multimodal Processing**: Advanced text, audio, image, and video understanding
- **Real-time Streaming**: Low-latency conversational AI

### Agentic Architecture Components

#### 1. **Google Kubernetes Engine (GKE)** - Required
- **Purpose**: Deploy and scale your agentic microservice application
- **Features**: Auto-scaling, load balancing, health monitoring
- **Integration**: Native kubectl-ai support for natural language operations

#### 2. **Google AI Models** - Required  
- **Purpose**: Power advanced agentic functionalities
- **Models**: Gemini 2.0 Flash Exp, 1.5 Pro, 1.5 Flash
- **Capabilities**: Multimodal understanding, function calling, streaming

#### 3. **Agent Development Kit (ADK)** - Optional (Recommended)
- **Purpose**: Toolkit for building sophisticated agents
- **Features**: Agent orchestration, capability management, workflow design

#### 4. **Model Context Protocol (MCP)** - Optional
- **Purpose**: Connect and communicate with existing microservice APIs
- **Deployment**: MCP server deployed alongside application on GKE
- **Benefits**: Standardized API communication, service discovery

#### 5. **Agent2Agent (A2A) Protocol** - Optional
- **Purpose**: Facilitate orchestration between different agent components
- **Features**: Complex workflow execution, agent coordination, task distribution

#### 6. **kubectl-ai** - Optional
- **Purpose**: Intelligent interface for Kubernetes operations
- **Features**: Natural language to kubectl translation, cluster management
- **Integration**: Direct GKE cluster management through conversation

#### 7. **Gemini CLI** - Optional
- **Purpose**: Command-line AI workflow acceleration
- **Features**: Code understanding, development process optimization
- **Integration**: Seamless development workflow enhancement

## 📋 Prerequisites

- Node.js 18+
- NPM or Yarn  
- Google Cloud Platform Account
- Google AI API Key
- Modern web browser with WebRTC support
- **Optional**: GKE cluster for full agentic deployment

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/akashpanda122/aura-ai.git
cd aura-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:

```env
# Google AI Configuration (Required)
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
VITE_GCP_PROJECT_ID=your-gcp-project-id

# Google Kubernetes Engine Configuration (Required)
VITE_GKE_CLUSTER_NAME=aura-ai-cluster
VITE_GKE_ZONE=us-central1-a
VITE_GKE_NAMESPACE=agentic-bots

# Optional: Advanced Agentic Features
VITE_MCP_SERVER_ENDPOINT=https://your-mcp-server.googleapis.com
VITE_A2A_ORCHESTRATOR_ENDPOINT=https://your-a2a-orchestrator.googleapis.com

# Optional: Service Account for Advanced Features
VITE_GCP_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key

# Development Settings
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## ☁️ Google Cloud Setup

### Step 1: Google AI API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file

### Step 2: Google Cloud Platform Setup (Optional but Recommended)
1. Create a new GCP project or use existing
2. Enable the following APIs:
   - Google AI Platform API
   - Kubernetes Engine API
   - Container Registry API
   - Cloud Logging API
   - Cloud Monitoring API

### Step 3: GKE Cluster Setup (For Full Agentic Features)
```bash
# Create GKE cluster
gcloud container clusters create aura-ai-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10

# Get cluster credentials
gcloud container clusters get-credentials aura-ai-cluster --zone=us-central1-a
```

### Step 4: Deploy to GKE (Optional)
```bash
# Build and deploy
npm run deploy:gke

# Or manual deployment
npm run build
docker build -t gcr.io/YOUR_PROJECT_ID/aura-ai:latest .
docker push gcr.io/YOUR_PROJECT_ID/aura-ai:latest
kubectl apply -f k8s/
```

## 🧪 Testing Instructions

### Basic Functionality Test

1. **Start the application**
```bash
npm run dev
```

2. **Test Google Gemini Connection**
- Open the application in your browser
- Click "Connect" button  
- Verify successful connection to Google Gemini
- Check console for "Connected to Google Gemini Live API"

3. **Test Multimodal Interaction**
- **Voice**: Allow microphone permissions, speak to the AI
- **Text**: Type messages in the chat interface
- **Images**: Upload images for visual analysis
- **Audio**: Test real-time audio processing

### Advanced Agentic Testing

4. **Test MCP Integration (If Enabled)**
```javascript
// Example microservice call
await callMicroservice('user-service', 'GET', { userId: 123 });
```

5. **Test kubectl-ai (If Enabled)**
```javascript  
// Example Kubernetes operation
await executeKubernetesOperation('scale deployment my-app to 5 replicas');
```

6. **Test A2A Workflow (If Enabled)**
```javascript
// Example multi-agent workflow
await orchestrateAgentWorkflow('complex-analysis', { data: 'sample' });
```

## 🔧 Configuration Examples

### Basic Configuration
```typescript
const geminiApi = useGeminiLiveApi({
  apiKey: process.env.VITE_GOOGLE_AI_API_KEY,
  model: 'gemini-2.0-flash-exp'
});
```

### Full Agentic Configuration
```typescript
const geminiApi = useGeminiLiveApi({
  apiKey: process.env.VITE_GOOGLE_AI_API_KEY,
  model: 'gemini-2.0-flash-exp',
  agenticConfig: {
    enableMCP: true,
    enableA2A: true, 
    enableKubectlAi: true,
    enableGeminiCli: true,
    gcpProjectId: 'your-project-id',
    gkeClusterName: 'aura-ai-cluster',
    gkeZone: 'us-central1-a'
  }
});
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Google Cloud   │    │   Agentic       │
│   (React/Vite)  │◄──►│   Gemini API     │◄──►│   Services      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   GKE Cluster    │
                       │   ┌────────────┐ │
                       │   │    MCP     │ │
                       │   │   Server   │ │
                       │   └────────────┘ │
                       │   ┌────────────┐ │
                       │   │    A2A     │ │
                       │   │Orchestrator│ │
                       │   └────────────┘ │
                       │   ┌────────────┐ │
                       │   │ kubectl-ai │ │
                       │   └────────────┘ │
                       └──────────────────┘
```

## 🚀 Deployment Scripts

The application includes several npm scripts for easy deployment:

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production

# GKE Deployment
npm run deploy:gke            # Full build and deploy to GKE
npm run k8s:apply             # Apply Kubernetes manifests
npm run k8s:delete            # Delete Kubernetes resources

# Testing
npm run gemini:test           # Test Gemini API connection
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request