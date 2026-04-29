import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function PageTransition() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div key={location.pathname} className="page-enter">
      <Outlet />
    </div>
  )
}

export default PageTransition
