import { useEffect, useState } from 'react'
import { Eye, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { getProductImageByName, getProductPrimaryImage } from '../firebase/products'

function ProductCard({ product, mode = 'default' }) {
  const {
    addToCart,
    moveWishlistItemToCart,
    removeFromWishlist,
    toggleWishlist,
    wishlistItems,
  } = useShop()

  const inWishlist = wishlistItems.some((item) => item.productId === product.id || item.id === product.id)
  const resolvedImageValue = getProductPrimaryImage(product)
  const remoteImageSrc = typeof resolvedImageValue === 'string' && resolvedImageValue.startsWith('http')
    ? resolvedImageValue
    : null
  const importedAssetSrc = typeof resolvedImageValue === 'string'
    && (resolvedImageValue.startsWith('/assets/')
      || resolvedImageValue.startsWith('data:')
      || resolvedImageValue.startsWith('blob:')
      || resolvedImageValue.includes('/src/assets/')
      || resolvedImageValue.includes('.svg'))
    ? resolvedImageValue
    : null
  const localImageSrc = remoteImageSrc
    || importedAssetSrc
    || getProductImageByName(resolvedImageValue)
  const [imageSrc, setImageSrc] = useState(localImageSrc)

  useEffect(() => {
    setImageSrc(localImageSrc)
  }, [localImageSrc])

  const handleAddToWishlist = async (selectedProduct = product) => {
    try {
      await toggleWishlist(selectedProduct)
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  const handleAddToCart = async (event) => {
    event.stopPropagation()

    try {
      if (mode === 'wishlist') {
        await moveWishlistItemToCart(product)
        return
      }

      await addToCart(product)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleRemoveFromWishlist = async () => {
    try {
      await removeFromWishlist(product.id)
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  return (
    <article className="group flex flex-col gap-4">
      <div className="relative overflow-hidden rounded bg-[#F5F5F5] px-6 py-8">
        {product.discount ? (
          <span className="absolute left-3 top-3 rounded bg-[#DB4444] px-3 py-1 text-xs font-medium text-white">
            -{product.discount}%
          </span>
        ) : null}

        <div className="absolute right-3 top-3 z-[99] flex flex-col gap-2">
          {mode === 'wishlist' ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleRemoveFromWishlist()
              }}
              aria-label={`Remove ${product.name} from wishlist`}
              className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-white p-0 text-black shadow-sm transition-all duration-200 active:scale-90 hover:bg-black hover:text-white"
              style={{ width: '34px', height: '34px', pointerEvents: 'auto', zIndex: 99 }}
            >
              <Trash2 className="pointer-events-none h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleAddToWishlist(product)
                }}
                aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                className={`flex cursor-pointer items-center justify-center rounded-full border-0 p-0 shadow-sm transition-all duration-200 active:scale-90 ${
                  inWishlist ? 'bg-[#DB4444] text-white' : 'bg-white text-black'
                }`}
                style={{ width: '34px', height: '34px', pointerEvents: 'auto', zIndex: 99 }}
              >
                <Heart className="pointer-events-none h-4 w-4" />
              </button>
              <Link
                to={`/product/${product.id}`}
                aria-label={`View ${product.name}`}
                className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-white p-0 text-black shadow-sm transition-all duration-200 active:scale-90 hover:bg-black hover:text-white"
                style={{ width: '34px', height: '34px', pointerEvents: 'auto', zIndex: 99 }}
              >
                <Eye className="pointer-events-none h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImageSrc(getProductImageByName('bag'))}
            className="mx-auto h-44 w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-black py-3 text-sm font-medium text-white transition group-hover:translate-y-0"
        >
          <ShoppingCart className="h-4 w-4" />
          Add To Cart
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-medium">
          <Link to={`/product/${product.id}`} className="transition hover:text-[#DB4444]">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#DB4444]">${product.price}</span>
          {product.oldPrice ? (
            <span className="text-black/50 line-through">${product.oldPrice}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-sm text-black/50">
          <span className="text-[#FFAD33]">{'★'.repeat(Math.round(product.rating || 4))}</span>
          <span>({product.reviews || 0})</span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
