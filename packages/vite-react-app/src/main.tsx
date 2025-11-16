import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement | null;
if (!rootElement) {
  throw new Error('Root element with id=\"root\" not found');
}
const root = createRoot(rootElement);
root.render(<App />);


