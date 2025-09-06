import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { TripFormProvider } from "./store/TripFormContext";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TripFormProvider>
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>
  </TripFormProvider>
); 
