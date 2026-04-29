import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import {
  googleProvider,
  requireFirebaseAuth,
} from '../firebase/config'
import sideImage from '../assets/Side.svg'

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M21.805 10.023h-9.81v3.955h5.622c-.242 1.272-.967 2.35-2.06 3.074v2.555h3.338c1.954-1.8 3.08-4.452 3.08-7.607 0-.661-.057-1.307-.17-1.977z"
        fill="#4285F4"
      />
      <path
        d="M11.995 22c2.79 0 5.13-.924 6.84-2.393l-3.338-2.555c-.925.622-2.109.99-3.502.99-2.688 0-4.968-1.815-5.782-4.255H2.763v2.636A10.323 10.323 0 0011.995 22z"
        fill="#34A853"
      />
      <path
        d="M6.213 13.787a6.197 6.197 0 010-3.574V7.577H2.763a10.325 10.325 0 000 9.846l3.45-2.636z"
        fill="#FBBC04"
      />
      <path
        d="M11.995 5.958c1.516 0 2.879.522 3.95 1.548l2.959-2.96C17.119 2.89 14.778 2 11.995 2A10.323 10.323 0 002.763 7.577l3.45 2.636c.814-2.44 3.094-4.255 5.782-4.255z"
        fill="#EA4335"
      />
    </svg>
  )
}

const initialForm = {
  name: '',
  email: '',
  password: '',
}

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleCreateAccount = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in your name, email, and password.')
      return
    }

    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (form.password.length < 6) {
      setError('Password should be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      const firebaseAuth = requireFirebaseAuth()
      const credentials = await createUserWithEmailAndPassword(
        firebaseAuth,
        form.email.trim(),
        form.password
      )

      if (form.name.trim()) {
        await updateProfile(credentials.user, { displayName: form.name.trim() })
      }

      setForm(initialForm)
      navigate('/')
    } catch (firebaseError) {
      setError(firebaseError.message || 'Unable to create account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setIsSubmitting(true)

    try {
      const firebaseAuth = requireFirebaseAuth()
      await signInWithPopup(firebaseAuth, googleProvider)
      navigate('/')
    } catch (firebaseError) {
      setError(firebaseError.message || 'Google sign up failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-221px)] bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-221px)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[#d9eef2] lg:block">
          <img
            src={sideImage}
            alt="Exclusive shopping illustration"
            className="h-full min-h-[760px] w-full object-cover object-center"
          />
        </section>

        <section className="flex items-center justify-center bg-white px-4 py-14 sm:px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="w-full max-w-[396px]">
            <div className="mb-10">
              <h1 className="text-2xl font-medium leading-[1.2] tracking-[-0.04em] text-black sm:text-3xl md:text-4xl lg:text-[36px]">
                Create an account
              </h1>
              <p className="mt-6 text-base leading-6 text-black/80">
                Enter your details below
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-9">
              <div className="space-y-10">
                <label className="block">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-4 pt-1 text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </label>

                <label className="block">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email or Phone Number"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-4 pt-1 text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </label>

                <label className="block">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-4 pt-1 text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </label>
              </div>

              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="space-y-4 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center rounded-md bg-[#DB4444] px-4 text-base font-medium text-white transition hover:bg-[#c93f3f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-4 rounded-md border border-gray-300 bg-white px-4 text-base font-medium text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <GoogleIcon className="h-6 w-6 shrink-0" />
                  Sign up with Google
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-base text-black/70">
              Already have account?{' '}
              <Link
                to="/login"
                className="font-medium text-black underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SignUp
