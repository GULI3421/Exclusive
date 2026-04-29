import { RouterProvider } from 'react-router-dom'
import myRouter from './router'
import './app.css'
import { ShopProvider } from './context/ShopContext'

export function App() {
  return (
    <ShopProvider>
      <RouterProvider router={myRouter} />
    </ShopProvider>
  )
}
