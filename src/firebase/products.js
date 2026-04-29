import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import bag from '../assets/bag.svg'
import cooler from '../assets/cooler.svg'
import gamepad from '../assets/gamepad.svg'
import jacket from '../assets/jacket.svg'
import keyboard from '../assets/keyboard.svg'
import laptop from '../assets/laptop.svg'
import monitor from '../assets/monitor.svg'
import { db } from './config'

export const productImageMap = {
  bag,
  'bag.svg': bag,
  cooler,
  'cooler.svg': cooler,
  gamepad,
  'gamepad.svg': gamepad,
  jacket,
  'jacket.svg': jacket,
  keyboard,
  'keyboard.svg': keyboard,
  laptop,
  'laptop.svg': laptop,
  monitor,
  'monitor.svg': monitor,
}

const defaultImageName = 'bag'

function normalizeImageName(imageName) {
  if (!imageName || typeof imageName !== 'string') {
    return defaultImageName
  }

  return imageName.replace(/\.svg$/i, '')
}

export function getProductImageByName(imageName) {
  const normalizedImageName = normalizeImageName(imageName)

  return (
    productImageMap[normalizedImageName] ??
    productImageMap[`${normalizedImageName}.svg`] ??
    productImageMap[defaultImageName]
  )
}

export function normalizeImageList(images) {
  if (!Array.isArray(images)) {
    return []
  }

  return images
    .map((image) => (typeof image === 'string' ? image.trim() : ''))
    .filter(Boolean)
}

export function getProductPrimaryImage(product) {
  const images = normalizeImageList(product.images)
  const imageURL = typeof product.imageURL === 'string' && product.imageURL.trim() ? product.imageURL.trim() : ''
  const primaryRemoteImage = images[0] || imageURL
  const imageName = normalizeImageName(product.image ?? product.imageName ?? defaultImageName)

  if (primaryRemoteImage) {
    return primaryRemoteImage
  }

  return getProductImageByName(imageName)
}

export function normalizeProduct(product) {
  const imageName = normalizeImageName(product.image ?? product.imageName ?? defaultImageName)
  const imageURL = typeof product.imageURL === 'string' && product.imageURL.trim() ? product.imageURL.trim() : ''
  const images = normalizeImageList(product.images)

  return {
    ...product,
    image: getProductPrimaryImage(product),
    imageName,
    imageURL,
    images,
    description: typeof product.description === 'string' ? product.description.trim() : '',
    colors: Array.isArray(product.colors)
      ? product.colors.map((color) => String(color).trim()).filter(Boolean)
      : [],
    sizes: Array.isArray(product.sizes)
      ? product.sizes.map((size) => String(size).trim()).filter(Boolean)
      : [],
    price: Number(product.price) || 0,
    oldPrice: Number(product.oldPrice) || null,
    rating: Number(product.rating) || 4.5,
    reviews: Number(product.reviews) || 0,
    discount: Number(product.discount) || 0,
    isFeatured: Boolean(product.isFeatured),
    isNewArrival: Boolean(product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    isFlashSale: Boolean(product.isFlashSale),
  }
}

function getProductsCollection() {
  if (!db) return null
  return collection(db, 'products')
}

export function subscribeToProductsSnapshot(onChange, onError) {
  const productsCollection = getProductsCollection()

  if (!productsCollection) {
    return () => {}
  }

  const productsQuery = query(productsCollection, orderBy('createdAt', 'desc'))

  return onSnapshot(
    productsQuery,
    (snapshot) => {
      const nextProducts = snapshot.docs.map((snapshotDoc) =>
        normalizeProduct({
          id: snapshotDoc.id,
          ...snapshotDoc.data(),
        }),
      )

      onChange(nextProducts)
    },
    onError,
  )
}

export async function createProduct(product) {
  const productsCollection = getProductsCollection()

  if (!productsCollection) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  await addDoc(productsCollection, {
    ...product,
    createdAt: Date.now(),
  })
}

export async function getProductById(id) {
  if (!db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  const productSnapshot = await getDoc(doc(db, 'products', String(id)))

  if (!productSnapshot.exists()) {
    return null
  }

  return normalizeProduct({
    id: productSnapshot.id,
    ...productSnapshot.data(),
  })
}

export async function updateProductById(id, updates) {
  if (!db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  await updateDoc(doc(db, 'products', String(id)), updates)
}

export async function deleteProductById(id) {
  if (!db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  await deleteDoc(doc(db, 'products', String(id)))
}
