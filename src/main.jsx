import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import 'sweetalert2/dist/sweetalert2.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n.js'; // ✅ Keep this
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contextLanguage/LanguageContext"; // ✅ Add this

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <LanguageProvider> {/* ✅ Move here to take effect earlier */}
        <RouterProvider router={router} />
      </LanguageProvider>
    </HelmetProvider>
  </Provider>
);

