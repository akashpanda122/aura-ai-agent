/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef } from 'react';

import BasicFace from '../basic-face/BasicFace';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { createSystemInstructions } from '@/lib/prompts';
import { useAgent, useUser } from '@/lib/state';

export default function KeynoteCompanion() {
  const { client, connected, setConfig } = useLiveAPIContext();
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const user = useUser();
  const { current } = useAgent();

  // Set the configuration for the Live API
  useEffect(() => {
    setConfig({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'audio/pcm',
      },
      systemInstruction: createSystemInstructions(current, user),
      tools: [], // Add any tools you need here
    });
  }, [setConfig, user, current]);

  // Initiate the session when the Live API connection is established
  // Instruct the model to send an initial greeting message
  useEffect(() => {
    const beginSession = async () => {
      if (!connected) return;
      client.send(
        {
          text: 'Greet the user and introduce yourself and your role.',
        },
        true
      );
    };
    beginSession();
  }, [client, connected]);

  return (
    <div className="keynote-companion">
      <BasicFace canvasRef={faceCanvasRef!} color={current.bodyColor} />
    </div>
  );
}