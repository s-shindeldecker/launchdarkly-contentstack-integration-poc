import React from 'react'
import ReactDOM from 'react-dom/client'
import { LDClient, LDContext } from 'launchdarkly-react-client-sdk'
import App from './App.tsx'
import './index.css'

// Initialize LaunchDarkly client
const clientSideID = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID || 'placeholder-client-id';
const context: LDContext = {
  kind: 'user',
  key: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com'
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LDClient clientSideID={clientSideID} context={context}>
      <App />
    </LDClient>
  </React.StrictMode>,
) 