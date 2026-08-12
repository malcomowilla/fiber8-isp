import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "react-query";

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationSettings from './settings/ApplicationSettings'
import { HelmetProvider } from 'react-helmet-async';
import { bootTheme } from './theme/applyTheme';



const subdomain = window.location.hostname.split('.')[0];
// userId is optional at boot (not logged in yet) — pass it once known,
// or just re-run bootTheme(currentUser.id, subdomain) after login resolves.
bootTheme(localStorage.getItem('last_known_user_id'), subdomain);


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,

    },
  },


});
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient: queryClient,
  persister: localStoragePersister,
  key: 'tableData',
})

const startupLoader = document.getElementById("startup-loader");
if (startupLoader) startupLoader.remove();


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <ApplicationSettings>
    < Router >
      <QueryClientProvider   client={queryClient} contextSharing={true}>
  <HelmetProvider>

      <App client={queryClient}/>
      </HelmetProvider>
      </QueryClientProvider>
</Router>
</ApplicationSettings>
  </React.StrictMode>,
)