import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import AppPreRegistro from './AppPreRegistro.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppPreRegistro />
  </StrictMode>,
);
