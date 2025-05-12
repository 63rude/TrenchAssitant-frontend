import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', 
    port: 5173, 
    hmr: {
      clientPort: 443 
    },
    proxy: {
      '/start_session': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,      
      },
      '/get_session_status': { 
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/get_session_logs': { // Added proxy for session logs
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/get_session_result_by_wallet': { 
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
