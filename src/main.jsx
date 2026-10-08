import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import useStore from './store/useStore'

if (typeof window !== 'undefined') {
  window.__store = useStore;
  window.__useStore = useStore;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
