import React from 'react'
import ReactDOM from 'react-dom/client'
import rootStore, { StoreContext } from './store'
import App from './App.tsx'
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreContext.Provider value={rootStore}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
)
