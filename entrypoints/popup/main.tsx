import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from '@/entrypoints/popup/Popup';
import '@/assets/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
