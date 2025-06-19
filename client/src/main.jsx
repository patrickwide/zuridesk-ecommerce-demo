import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from './components/ui/provider'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
