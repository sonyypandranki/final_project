import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth'
import { ItemsProvider } from './hooks/useItems'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ItemsProvider>
      <App />
    </ItemsProvider>
  </AuthProvider>
);
