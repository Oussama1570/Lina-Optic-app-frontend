// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import 'sweetalert2/dist/sweetalert2.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n.js';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "./contextLanguage/LanguageContext";
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
