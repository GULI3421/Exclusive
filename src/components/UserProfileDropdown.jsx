import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  LogOut,
  ShoppingBag,
  Star,
  UserRound,
  UserRoundCog,
  XCircle,
} from 'lucide-react'
import { auth } from '../firebase/config'

const menuItems = [
  { label: 'Manage My Account', icon: UserRoundCog, path: '/account' },
  { label: 'Admin Panel', icon: UserRoundCog, path: '/admin' },
  { label: 'My Order', icon: ShoppingBag, path: '/orders' },
  { label: 'My Cancellations', icon: XCircle, path: '/cancellations' },
  { label: 'My Reviews', icon: Star, path: '/reviews' },
]

function UserProfileDropdown() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!auth) {
      setUser(null)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  const handleLogout = async () => {
    if (!auth) {
      setIsOpen(false)
      setUser(null)
      navigate('/')
      return
    }

    try {
      await signOut(auth)
      setIsOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (!user) {
    return (
      <Link
        to="/signup"
        className="text-base font-normal text-black transition hover:underline"
      >
        Sign Up
      </Link>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open profile menu"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-transparent transition ${
          isOpen
            ? 'bg-[#DB4444] text-white shadow-[0_8px_18px_rgba(219,68,68,0.32)]'
            : 'bg-transparent text-[#7d8184] hover:bg-[#DB4444]/10 hover:text-[#DB4444]'
        }`}
      >
        <UserRound className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-[224px] overflow-hidden rounded-md border border-white/10 bg-black/80 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (item.path) {
                        navigate(item.path)
                      }
                    }}
                    className="flex w-full items-center gap-4 rounded-md px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0 text-white"
                      strokeWidth={1.75}
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}

            <li className="pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-md px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
              >
                <LogOut
                  className="h-[18px] w-[18px] shrink-0 text-white"
                  strokeWidth={1.75}
                />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default UserProfileDropdown
