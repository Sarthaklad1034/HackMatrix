import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import './styles/index.css';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <pre className="text-red-500 mb-4">{error.message}</pre>
        <button 
          onClick={resetErrorBoundary}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);