import { useEffect, useState } from 'react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase/config'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const sidebarSections = [
  {
    title: 'Manage My Account',
    items: ['My Profile', 'Address Book', 'My Payment Options'],
  },
  {
    title: 'My Orders',
    items: ['My Returns', 'My Cancellations'],
  },
  {
    title: 'My Wishlist',
    items: [],
  },
]

function splitDisplayName(displayName = '') {
  const [firstName = '', ...rest] = displayName.trim().split(' ')

  return {
    firstName,
    lastName: rest.join(' '),
  }
}

function Profile() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      const currentUser = auth?.currentUser

      if (!currentUser) {
        navigate('/login')
        return
      }

      const { firstName, lastName } = splitDisplayName(currentUser.displayName)

      const nextForm = {
        ...initialForm,
        firstName,
        lastName,
        email: currentUser.email ?? '',
      }

      if (db) {
        try {
          const userSnapshot = await getDoc(doc(db, 'users', currentUser.uid))

          if (userSnapshot.exists()) {
            const data = userSnapshot.data()

            nextForm.firstName = data.firstName ?? nextForm.firstName
            nextForm.lastName = data.lastName ?? nextForm.lastName
            nextForm.email = data.email ?? nextForm.email
            nextForm.address = data.address ?? ''
          }
        } catch (firebaseError) {
          if (isMounted) {
            setError(firebaseError.message || 'Unable to load your profile.')
          }
        }
      }

      if (isMounted) {
        setForm(nextForm)
        setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const currentUser = auth?.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!db) {
      setError('Firestore is not ready. Check your Firebase configuration.')
      return
    }

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Please complete your first name, last name, and email.')
      return
    }

    const wantsPasswordChange =
      form.currentPassword || form.newPassword || form.confirmPassword

    if (wantsPasswordChange) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setError('Please fill in all password fields to change your password.')
        return
      }

      if (form.newPassword.length < 6) {
        setError('New password should be at least 6 characters long.')
        return
      }

      if (form.newPassword !== form.confirmPassword) {
        setError('New password and confirm password must match.')
        return
      }
    }

    setIsSaving(true)

    try {
      if (wantsPasswordChange && currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          form.currentPassword
        )

        await reauthenticateWithCredential(currentUser, credential)
        await updatePassword(currentUser, form.newPassword)
      }

      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          uid: currentUser.uid,
          updatedAt: Date.now(),
        },
        { merge: true }
      )

      setForm((current) => ({
        ...current,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
      setSuccess('Your profile has been updated.')
    } catch (firebaseError) {
      setError(firebaseError.message || 'Unable to save changes right now.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1170px] px-4 text-sm text-black/60 sm:px-6 lg:px-0">
          Loading profile...
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto grid max-w-[1170px] gap-10 px-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:px-0">
        <aside className="self-start">
          <nav className="space-y-8">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-base font-medium text-black">
                  {section.title}
                </h2>

                {section.items.length ? (
                  <ul className="mt-4 space-y-3 pl-8 text-sm text-black/50">
                    {section.items.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          className={`transition hover:text-[#DB4444] ${
                            item === 'My Profile'
                              ? 'font-medium text-[#DB4444]'
                              : ''
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </nav>
        </aside>

        <div className="rounded-md border border-gray-200 bg-white px-4 py-6 shadow-[0_1px_13px_rgba(0,0,0,0.05)] sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-medium text-[#DB4444] sm:text-2xl">
              Edit Your Profile
            </h1>
            <Link
              to="/"
              className="text-sm text-black/55 transition hover:text-black"
            >
              Back to home
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-black">
                  First Name
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-black">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-black">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-black">Address</span>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />
              </label>
            </div>

            <div>
              <h2 className="mb-4 text-base font-medium text-black">
                Password Change
              </h2>

              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 text-sm text-black outline-none transition focus:border-[#DB4444] focus:bg-white"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 px-8 text-sm font-medium text-black transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#DB4444] px-8 text-sm font-medium text-white transition hover:bg-[#c93f3f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Profile
