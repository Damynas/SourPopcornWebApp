import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from './application.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);
