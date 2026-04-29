import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './config'
import { getProductImageByName } from './products'

function getScopedUserId(userId) {
  return userId ?? null
}

function getCollectionRef(collectionName) {
  if (!db) return null
  return collection(db, collectionName)
}

function buildScopedQuery(collectionName, userId) {
  const collectionRef = getCollectionRef(collectionName)
  if (!collectionRef) return null

  return query(
    collectionRef,
    where('userId', '==', getScopedUserId(userId)),
  )
}

function buildProductMatchQuery(collectionName, productId, userId) {
  const collectionRef = getCollectionRef(collectionName)
  if (!collectionRef) return null

  return query(
    collectionRef,
    where('productId', '==', productId),
    where('userId', '==', getScopedUserId(userId)),
  )
}

function normalizeShopDoc(snapshotDoc) {
  const data = snapshotDoc.data()
  const imageName = data.image ?? 'bag'

  return {
    firestoreId: snapshotDoc.id,
    productId: data.productId,
    id: data.productId,
    name: data.name ?? '',
    price: Number(data.price) || 0,
    imageName,
    image: getProductImageByName(imageName),
    quantity: Number(data.quantity) || 1,
    userId: data.userId ?? null,
    createdAt: Number(data.createdAt) || 0,
  }
}

export function buildShopProductData(product, userId, extraFields = {}) {
  return {
    productId: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    image: product.imageName ?? product.image ?? 'bag',
    userId: getScopedUserId(userId),
    createdAt: Date.now(),
    ...extraFields,
  }
}

export function subscribeToShopCollection(collectionName, userId, onChange, onError) {
  const collectionQuery = buildScopedQuery(collectionName, userId)

  if (!collectionQuery) {
    onChange([])
    return () => {}
  }

  return onSnapshot(
    collectionQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map(normalizeShopDoc)
        .sort((firstItem, secondItem) => secondItem.createdAt - firstItem.createdAt)

      onChange(items)
    },
    onError,
  )
}

export async function toggleWishlistDoc(product, userId) {
  const matchQuery = buildProductMatchQuery('wishlist', product.id, userId)

  if (!matchQuery || !db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  const existingDocs = await getDocs(matchQuery)

  if (!existingDocs.empty) {
    await Promise.all(existingDocs.docs.map((snapshotDoc) => deleteDoc(doc(db, 'wishlist', snapshotDoc.id))))
    return false
  }

  await addDoc(collection(db, 'wishlist'), buildShopProductData(product, userId))
  return true
}

export async function addCartDoc(product, userId) {
  const collectionRef = getCollectionRef('cart')

  if (!collectionRef) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  await addDoc(collectionRef, buildShopProductData(product, userId, { quantity: 1 }))
}

export async function removeShopDocsByProduct(collectionName, productId, userId) {
  const matchQuery = buildProductMatchQuery(collectionName, productId, userId)

  if (!matchQuery || !db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  const existingDocs = await getDocs(matchQuery)
  await Promise.all(existingDocs.docs.map((snapshotDoc) => deleteDoc(doc(db, collectionName, snapshotDoc.id))))
}

export async function updateCartDocsQuantity(productId, quantity, userId) {
  const matchQuery = buildProductMatchQuery('cart', productId, userId)

  if (!matchQuery || !db) {
    throw new Error('Firestore is not ready. Check your Firebase configuration.')
  }

  const existingDocs = await getDocs(matchQuery)

  if (quantity < 1) {
    await Promise.all(existingDocs.docs.map((snapshotDoc) => deleteDoc(doc(db, 'cart', snapshotDoc.id))))
    return
  }

  if (existingDocs.empty) {
    return
  }

  const [firstDoc, ...remainingDocs] = existingDocs.docs

  await updateDoc(doc(db, 'cart', firstDoc.id), { quantity })

  if (remainingDocs.length) {
    await Promise.all(remainingDocs.map((snapshotDoc) => deleteDoc(doc(db, 'cart', snapshotDoc.id))))
  }
}
