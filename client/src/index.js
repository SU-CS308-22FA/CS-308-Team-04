import React from 'react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
