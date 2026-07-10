// src/App.jsx
import React from 'react';
import AppRoutes from './routes/appRoutes';
import { Toaster } from 'sonner';
function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
      </>
      );
}

export default App;