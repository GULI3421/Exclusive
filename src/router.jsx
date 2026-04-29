import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Regester from './pages/Regester'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import AdminPanel from './pages/AdminPanel'
import Checkout from './pages/Checkout'
import ProductDetails from './pages/ProductDetails'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const myRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: 'about', element: <About /> },
      { path: 'regester', element: <Regester /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'login', element: <Login /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'admin', element: <AdminPanel /> },
      { path: 'profile', element: <Profile /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default myRouter
