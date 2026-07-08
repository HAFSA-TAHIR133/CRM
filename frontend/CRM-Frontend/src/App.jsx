import './App.css'
import './index.css'
import AppRoutes from './routes/appRoutes';
import { Toaster } from "sonner";
function App() {

  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-center" />
      
    </>
  )
};

export default App
