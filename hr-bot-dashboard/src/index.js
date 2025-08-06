import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { AppProvider } from './context/AppContext'; // Імпортуємо провайдер

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Огортаємо App */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
