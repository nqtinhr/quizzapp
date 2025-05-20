import { store } from '@/redux/store'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { injectStore } from './api/axiosIntance.ts'
import App from './App.tsx'
import './index.css'

const persistor = persistStore(store)

// Kỹ thuật Inject Store
injectStore(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)
