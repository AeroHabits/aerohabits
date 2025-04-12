
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Auth from './pages/Auth';
import Premium from './pages/Premium';
import { AppHeader } from './components/layout/AppHeader';
import { PageHeader } from './components/layout/PageHeader';
import { ToastProvider } from "./hooks/use-toast";
import { ToastContainer } from "./components/ui/toast-notification";
import { ToastContext } from './hooks/use-toast';

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="container max-w-4xl mx-auto p-4">
              <AppHeader />
              <Routes>
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/" element={<PageHeader />} />
              </Routes>
            </div>
          </div>
        </Router>
        <ToastContext.Consumer>
          {({ toasts, dismissToast }) => (
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
          )}
        </ToastContext.Consumer>
      </div>
    </ToastProvider>
  );
}

export default App;
