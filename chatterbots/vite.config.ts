import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GPT_OSS_API_KEY),
        'process.env.GPT_OSS_API_KEY': JSON.stringify(env.GPT_OSS_API_KEY),
        'process.env.GPT_OSS_BASE_URL': JSON.stringify(env.GPT_OSS_BASE_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});