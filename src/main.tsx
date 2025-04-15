
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Using requestIdleCallback for non-critical rendering if available
const renderApp = () => {
  const root = document.getElementById("root");
  if (!root) return;
  
  createRoot(root).render(<App />);
};

// Use requestIdleCallback if available for non-critical rendering
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(renderApp);
} else {
  // Fallback for browsers not supporting requestIdleCallback
  setTimeout(renderApp, 1);
}
