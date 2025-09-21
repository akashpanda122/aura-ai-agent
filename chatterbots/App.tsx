

//import AgentEdit from './components/AgentEdit';
import ControlTray from './components/console/control-tray/ControlTray';
import ErrorScreen from './components/demo/ErrorSreen';
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion';
import Header from './components/Header';
import UserSettings from './components/UserSettings';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useUI, useUser } from './lib/state';
import { createAgenticChatterbot, createSystemInstructions } from '../lib/agentic-chatterbot';
import { defaultGeminiConfig, defaultGKEConfig } from '../config/agentic-config';

// For backward compatibility (no changes needed)
const instructions = createSystemInstructions(agent, user);

// Or use the enhanced version
const agenticBot = createAgenticChatterbot(agent, user, {
  gkeCluster: 'aura-ai-production',
  namespace: 'agentic-bots',
  geminiModel: 'gemini-1.5-pro',
  enableMCP: true,
  enableA2A: true,
  enableKubectlAi: true,
  enableGeminiCli: true
});

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { showUserConfig, showAgentEdit } = useUI();
  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <ErrorScreen />
        <Header />

        {showUserConfig && <UserSettings />}
        {/*{showAgentEdit && <AgentEdit />}*/}
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              <KeynoteCompanion />
            </div>

            <ControlTray></ControlTray>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
