import React from 'react';
import ReactDOM from 'react-dom/client';
import { needsPocketBaseClient } from '@/lib/backendConfig.js';
import App from '@/App';
import '@/index.css';

if (needsPocketBaseClient()) {
  const { initializePocketBaseAuth } = await import('@/lib/pocketbaseClient.js');
  initializePocketBaseAuth();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
