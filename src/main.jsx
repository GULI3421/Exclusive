import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n'
import { App } from './app.jsx'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
