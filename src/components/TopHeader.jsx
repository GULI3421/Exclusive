import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

function TopHeader() {
  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex min-h-12 w-full max-w-[1170px] items-center justify-between gap-4 px-4 text-center text-sm sm:px-6 lg:px-0">
        <p className="flex-1">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <Link to="/" className="ml-2 font-semibold underline underline-offset-4">
            ShopNow
          </Link>
        </p>
        <LanguageSwitcher />
      </div>
    </div>
  )
}

export default TopHeader
