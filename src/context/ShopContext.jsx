import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  createProduct,
  deleteProductById,
  updateProductById,
} from '../firebase/products'
import {
  addCartDoc,
  removeShopDocsByProduct,
  subscribeToShopCollection,
  toggleWishlistDoc,
  updateCartDocsQuantity,
} from '../firebase/shopCollections'

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function persistStorage(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([])
  const [currentUserId, setCurrentUserId] = useState(() => auth?.currentUser?.uid ?? null)
  const [wishlistRecords, setWishlistRecords] = useState([])
  const [cartRecords, setCartRecords] = useState([])
  const [productsError, setProductsError] = useState('')

  useEffect(() => {
    if (!auth) {
      setCurrentUserId(null)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUserId(currentUser?.uid ?? null)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToShopCollection(
      'wishlist',
      currentUserId,
      (nextWishlistRecords) => {
        setWishlistRecords(nextWishlistRecords)
        persistStorage('exclusive-wishlist', nextWishlistRecords)
      },
      (error) => {
        console.error('Failed to load wishlist:', error)
      },
    )

    return unsubscribe
  }, [currentUserId])

  useEffect(() => {
    const unsubscribe = subscribeToShopCollection(
      'cart',
      currentUserId,
      (nextCartRecords) => {
        setCartRecords(nextCartRecords)
        persistStorage('exclusive-cart', nextCartRecords)
      },
      (error) => {
        console.error('Failed to load cart:', error)
      },
    )

    return unsubscribe
  }, [currentUserId])

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    [products],
  )

  const wishlistItems = useMemo(() => wishlistRecords, [wishlistRecords])

  const wishlistIds = useMemo(
    () => wishlistRecords.map((item) => item.productId),
    [wishlistRecords],
  )

  const cartDetailedItems = useMemo(
    () => {
      const groupedItems = new Map()

      cartRecords.forEach((item) => {
        const existingItem = groupedItems.get(item.productId)

        if (existingItem) {
          existingItem.quantity += item.quantity
          existingItem.subtotal = existingItem.product.price * existingItem.quantity
          return
        }

        groupedItems.set(item.productId, {
          firestoreId: item.firestoreId,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            imageName: item.imageName,
          },
          subtotal: item.price * item.quantity,
        })
      })

      return [...groupedItems.values()]
    },
    [cartRecords],
  )

  const subtotal = cartDetailedItems.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 0 ? 0 : 0
  const total = subtotal + shipping

  const addToWishlist = async (product) => {
    await toggleWishlistDoc(product, currentUserId)
  }

  const removeFromWishlist = async (productId) => {
    await removeShopDocsByProduct('wishlist', productId, currentUserId)
  }

  const toggleWishlist = async (product) => {
    await toggleWishlistDoc(product, currentUserId)
  }

  const addToCart = async (product) => {
    await addCartDoc(product, currentUserId)
  }

  const moveWishlistItemToCart = async (product) => {
    const alreadyInCart = cartRecords.some((item) => item.productId === product.id)

    if (!alreadyInCart) {
      await addCartDoc(product, currentUserId)
    }

    await removeShopDocsByProduct('wishlist', product.id, currentUserId)
  }

  const updateCartQuantity = async (productId, quantity) => {
    await updateCartDocsQuantity(productId, quantity, currentUserId)
  }

  const removeFromCart = async (productId) => {
    await removeShopDocsByProduct('cart', productId, currentUserId)
  }

  const moveWishlistToCart = async () => {
    await Promise.all(
      wishlistItems.map(async (item) => {
        await moveWishlistItemToCart(item)
      }),
    )
  }

  const addProduct = async (product) => {
    try {
      setProductsError('')
      await createProduct(product)
    } catch (error) {
      setProductsError(error.message)
      throw error
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      setProductsError('')
      await updateProductById(id, updates)
    } catch (error) {
      setProductsError(error.message)
      throw error
    }
  }

  const deleteProduct = async (id) => {
    try {
      setProductsError('')
      await deleteProductById(id)
      removeFromWishlist(id)
      removeFromCart(id)
    } catch (error) {
      setProductsError(error.message)
      throw error
    }
  }

  const value = {
    products,
    setProducts,
    currentUserId,
    productsError,
    wishlistIds,
    wishlistItems,
    cartItems: cartDetailedItems,
    subtotal,
    shipping,
    total,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    addToCart,
    moveWishlistItemToCart,
    updateCartQuantity,
    removeFromCart,
    moveWishlistToCart,
    addProduct,
    updateProduct,
    deleteProduct,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within ShopProvider')
  }
  return context
}
