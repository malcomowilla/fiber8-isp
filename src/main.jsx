import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "react-query";

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { BrowserRouter as Router } from 'react-router-dom';




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
// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

persistQueryClient({
  queryClient: queryClient,
  persister: localStoragePersister,
  key: 'tableData',
})



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    < Router >
      <QueryClientProvider   client={queryClient} contextSharing={true}>

      <App client={queryClient}/>
      </QueryClientProvider>
</Router>
  </React.StrictMode>,
)