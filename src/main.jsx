import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './routes.jsx'
import "/public/assets/css/roksyn.css"

import '/public/assets/css/bootstrap.min.css';
import "/public/assets/css/dark-theme.css"
import "/public/assets/css/icons.css"
import '/public/assets/css/index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)

