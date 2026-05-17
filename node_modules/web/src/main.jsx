import React from 'react';
import ReactDOM from 'react-dom/client';
import pb, { initializePocketBaseAuth } from '@/lib/pocketbaseClient.js';
import App from '@/App';
import '@/index.css';

console.log('PB INSTANCE main.jsx', pb);
if (typeof window !== 'undefined') {
  console.log(
    '[SmartFashion auth] singleton main',
    pb === window.__SMARTFASHION_PB__
  );
}

initializePocketBaseAuth();

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);
