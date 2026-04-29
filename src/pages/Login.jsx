import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { requireFirebaseAuth } from '../firebase/config'
import sideImage from '../assets/Side.svg'

const initialForm = {
  email: '',
  password: '',
}

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const firebaseAuth = requireFirebaseAuth()
      await signInWithEmailAndPassword(
        firebaseAuth,
        form.email.trim(),
        form.password
      )
      navigate('/')
    } catch (firebaseError) {
      setError(firebaseError.message || 'Unable to log in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-221px)] bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-221px)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-full overflow-hidden bg-[#CBE4E8] lg:block">
          <img
            src={sideImage}
            alt="Shopping illustration"
            className="h-full min-h-[760px] w-full object-cover object-center"
          />
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-14 sm:px-10 md:px-14 lg:px-16 xl:px-24">
          <div className="w-full max-w-[408px]">
            <div className="mb-12">
              <h1 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-black sm:text-[36px]">
                Log in to Exclusive
              </h1>
              <p className="mt-5 text-base leading-6 text-black/80">
                Enter your details below
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-9">
              <div className="space-y-10">
                <label className="block">
                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email or Phone Number"
                    autoComplete="email"
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 pb-4 pt-1 text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </label>

                <label className="block">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 pb-4 pt-1 text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </label>
              </div>

              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-md bg-[#DB4444] px-12 text-base font-medium text-white transition hover:bg-[#c93f3f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Logging In...' : 'Log In'}
                </button>

                <Link
                  to="/login"
                  className="text-sm font-medium text-[#DB4444] transition hover:text-[#c93f3f] sm:text-base"
                >
                  Forget Password?
                </Link>
              </div>
            </form>

            <p className="mt-12 text-sm text-black/55 sm:text-base">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-black underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
