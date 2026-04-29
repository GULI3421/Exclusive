import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || '',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '',
}

const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
]

const missingFirebaseKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key]
)

const hasFirebaseConfig = missingFirebaseKeys.length === 0

if (!hasFirebaseConfig) {
  console.error(
    `[Firebase] Missing Vite env keys: ${missingFirebaseKeys
      .map((key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (char) => `_${char}`).toUpperCase()}`)
      .join(', ')}. Add them to your project root .env file and restart the Vite server.`
  )
}

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const googleProvider = new GoogleAuthProvider()

export function requireFirebaseAuth() {
  if (!auth) {
    throw new Error(
      'Firebase Authentication is not ready. Check your .env values and restart the Vite dev server.'
    )
  }

  return auth
}

export { firebaseConfig, hasFirebaseConfig, missingFirebaseKeys }
