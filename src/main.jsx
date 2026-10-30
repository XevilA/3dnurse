import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BabyDemo from './BabyDemo.jsx'
import './index.css'

import useStore from './store/useStore'

if (typeof window !== 'undefined') {
  window.__store = useStore;
  window.__useStore = useStore;

  // Keep --app-h and --app-top locked to the true visible viewport (above iOS Safari's floating bottom toolbar)
  const syncVisualViewport = () => {
    const vv = window.visualViewport;
    const h = vv ? vv.height : window.innerHeight;
    const top = vv ? vv.offsetTop : 0;
    document.documentElement.style.setProperty('--app-h', `${Math.round(h)}px`);
    document.documentElement.style.setProperty('--app-top', `${Math.round(top)}px`);
  };
  syncVisualViewport();
  window.addEventListener('resize', syncVisualViewport);
  window.addEventListener('orientationchange', syncVisualViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncVisualViewport);
    window.visualViewport.addEventListener('scroll', syncVisualViewport);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {(import.meta.env.DEV && new URLSearchParams(window.location.search).get('babydemo')) ? <BabyDemo pose={new URLSearchParams(window.location.search).get('babydemo')} view={new URLSearchParams(window.location.search).get('view') || 'top'} /> : <App />}
  </React.StrictMode>,
)
