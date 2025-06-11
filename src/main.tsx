import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./services/mock-worker');
  return worker.start();
}

enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
        <Toaster position="top-center" />
      </React.StrictMode>,
    );
  } else {
    console.error('Root element not found');
  }
});
