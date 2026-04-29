import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Star,
  User,
  UserRoundCog,
  X,
  ShoppingBag,
  XCircle
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../auth'
import { useShop } from '../context/ShopContext'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
  { to: '/signup', label: 'Sign Up', hideWhenAuth: true },
  { to: '/admin', label: 'Admin Panel', showOnlyWhenAuth: true },
]

const profileMenuItems = [
  { label: 'Manage My Account', icon: UserRoundCog, path: '/profile' },
  { label: 'My Order', icon: ShoppingBag },
  { label: 'My Cancellations', icon: XCircle },
  { label: 'My Reviews', icon: Star },
]

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const { wishlistItems, cartItems } = useShop()

  useEffect(() => {
    if (!auth) {
      setCurrentUser(null)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsProfileOpen(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isProfileOpen) {
      return undefined
    }

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const handleLogout = async () => {
    if (!auth) {
      setIsProfileOpen(false)
      navigate('/login')
      return
    }

    try {
      await auth.signOut()
      setIsProfileOpen(false)
      navigate('/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wider">
          Exclusive
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            if (item.hideWhenAuth && currentUser) return null;
            if (item.showOnlyWhenAuth && !currentUser) return null;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `font-medium text-black ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-3 rounded bg-[#F5F5F5] px-4 py-2">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-52 bg-transparent text-sm outline-none placeholder:text-black/50"
            />
            <Search className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative" aria-label="Wishlist">
              <Heart className="h-6 w-6" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DB4444] px-1 text-[10px] font-semibold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingCart className="h-6 w-6" />
              {cartItems?.length > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DB4444] px-1 text-[10px] font-semibold text-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {currentUser && (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  aria-label="Account"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    isProfileOpen
                      ? 'bg-[#DB4444] text-white'
                      : 'text-black hover:bg-black/5'
                  }`}
                >
                  <User className="h-6 w-6" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-4 w-[230px] rounded-xl border border-white/10 bg-black/75 p-3 text-white shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                    <ul className="space-y-1">
                      {profileMenuItems.map((item) => {
                        const Icon = item.icon

                        return (
                          <li key={item.label}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileOpen(false)
                                if (item.path) {
                                  navigate(item.path)
                                }
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10"
                            >
                              <Icon className="h-[18px] w-[18px] shrink-0" />
                              <span>{item.label}</span>
                            </button>
                          </li>
                        )
                      })}

                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10"
                        >
                          <LogOut className="h-[18px] w-[18px] shrink-0" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded border border-black/10 lg:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-black/10 bg-white transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[420px]' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto flex flex-col gap-5 px-4 py-5">
          <div className="flex items-center gap-3 rounded bg-[#F5F5F5] px-4 py-3">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/50"
            />
            <Search className="h-4 w-4" />
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              if (item.hideWhenAuth && currentUser) return null;
              if (item.showOnlyWhenAuth && !currentUser) return null;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className="font-medium text-black"
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
