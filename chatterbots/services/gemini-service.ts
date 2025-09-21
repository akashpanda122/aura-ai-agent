/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GeminiConfig } from '../types/agentic';

export class GeminiService {
  private config: GeminiConfig;
  private apiKey: string;

  constructor(config: GeminiConfig, apiKey: string) {
    this.config = config;
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    try {
      // Integration with Google AI Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
            topP: this.config.topP,
            topK: this.config.topK
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate response from Gemini');
    }
  }
}