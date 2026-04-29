import { Apple, Briefcase, Globe, Image, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-20 bg-black text-white">
      <div className="mx-auto grid w-full max-w-[1170px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-0">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Exclusive</h2>
            <p className="mt-4 text-xl font-medium">Subscribe</p>
            <p className="mt-2 text-sm text-white/70">Get 10% off your first order</p>
          </div>
          <label className="flex items-center justify-between rounded border border-white px-4 py-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/60"
            />
            <Send className="h-4 w-4" />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Support</h3>
          <p className="text-sm text-white/70">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="text-sm text-white/70">exclusive@gmail.com</p>
          <p className="text-sm text-white/70">+88015-88888-9999</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Account</h3>
          <Link className="block text-sm text-white/70" to="/login">Login / Register</Link>
          <Link className="block text-sm text-white/70" to="/cart">Cart</Link>
          <Link className="block text-sm text-white/70" to="/wishlist">Wishlist</Link>
          <Link className="block text-sm text-white/70" to="/">Shop</Link>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Quick Link</h3>
          <Link className="block text-sm text-white/70" to="/privacy">Privacy Policy</Link>
          <Link className="block text-sm text-white/70" to="/terms">Terms Of Use</Link>
          <Link className="block text-sm text-white/70" to="/faq">FAQ</Link>
          <Link className="block text-sm text-white/70" to="/contact">Contact</Link>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">Download App</h3>
            <p className="mt-2 text-xs text-white/60">Save $3 with App New User Only</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-20 w-20 place-items-center rounded bg-white text-xs font-semibold text-black">
              QR
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <button type="button" className="flex items-center gap-3 rounded border border-white px-3 py-2 text-left">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Google Play</span>
              </button>
              <button type="button" className="flex items-center gap-3 rounded border border-white px-3 py-2 text-left">
                <Apple className="h-4 w-4" />
                <span className="text-sm">App Store</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Globe className="h-5 w-5" />
            <Image className="h-5 w-5" />
            <Briefcase className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1170px] px-4 py-4 text-center text-sm text-white/40 sm:px-6 lg:px-0">
          © Copyright Rimel 2022. All right reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer
