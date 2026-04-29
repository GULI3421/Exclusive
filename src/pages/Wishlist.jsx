import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { subscribeToShopCollection } from '../firebase/shopCollections'

function Wishlist() {
  const { currentUserId, moveWishlistToCart, products, wishlistItems } = useShop()
  const [liveWishlistItems, setLiveWishlistItems] = useState(wishlistItems)

  useEffect(() => {
    const unsubscribe = subscribeToShopCollection(
      'wishlist',
      currentUserId,
      (nextWishlistItems) => {
        setLiveWishlistItems(nextWishlistItems)
      },
      (error) => {
        console.error('Failed to subscribe to wishlist:', error)
      },
    )

    return unsubscribe
  }, [currentUserId])

  const visibleWishlistItems = liveWishlistItems.length ? liveWishlistItems : wishlistItems
  const justForYou = products
    .filter((product) => !visibleWishlistItems.some((item) => item.id === product.id))
    .slice(0, 4)

  return (
    <div className="pb-24 pt-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium">Wishlist ({visibleWishlistItems.length})</h1>
        <button
          type="button"
          onClick={moveWishlistToCart}
          className="inline-flex h-14 items-center justify-center rounded border border-black/50 px-12 text-base font-medium"
        >
          Move All To Bag
        </button>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {visibleWishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} mode="wishlist" />
        ))}
      </div>

      <section className="mt-20 border-t border-black/10 pt-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="h-10 w-5 rounded bg-[#DB4444]" />
            <h2 className="text-2xl font-semibold">Just For You</h2>
          </div>
          <button type="button" className="inline-flex h-14 items-center justify-center rounded border border-black/50 px-12 text-base font-medium">
            See All
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {justForYou.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Wishlist
