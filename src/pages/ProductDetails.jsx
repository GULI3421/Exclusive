import { useEffect, useMemo, useState } from 'react'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import {
  getProductById,
  getProductImageByName,
  getProductPrimaryImage,
  normalizeImageList,
} from '../firebase/products'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, wishlistItems } = useShop()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      try {
        setIsLoading(true)
        setError('')
        const nextProduct = await getProductById(id)

        if (!isMounted) {
          return
        }

        if (!nextProduct) {
          setProduct(null)
          setError('Product not found.')
          return
        }

        setProduct(nextProduct)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        console.error('Failed to load product details:', loadError)
        setError(loadError.message || 'Failed to load product.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const imageGallery = useMemo(() => {
    if (!product) {
      return [getProductImageByName('bag')]
    }

    const remoteImages = normalizeImageList(product.images)

    if (remoteImages.length) {
      return remoteImages
    }

    return [getProductPrimaryImage(product)]
  }, [product])

  useEffect(() => {
    setSelectedImage(imageGallery[0] || getProductImageByName('bag'))
  }, [imageGallery])

  useEffect(() => {
    if (!product) {
      return
    }

    setSelectedColor(product.colors?.[0] || '')
    setSelectedSize(product.sizes?.[0] || '')
  }, [product])

  const inWishlist = wishlistItems.some((item) => item.productId === product?.id || item.id === product?.id)

  const handleAddToCart = async () => {
    if (!product) {
      return
    }

    try {
      await Promise.all(
        Array.from({ length: quantity }, () => addToCart(product)),
      )
    } catch (addError) {
      console.error('Failed to add product to cart:', addError)
    }
  }

  const handleToggleWishlist = async () => {
    if (!product) {
      return
    }

    try {
      await toggleWishlist(product)
    } catch (toggleError) {
      console.error('Failed to update wishlist:', toggleError)
    }
  }

  if (isLoading) {
    return <div className="py-20 text-center text-black/60">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="py-20">
        <p className="text-lg font-medium">{error || 'Product not found.'}</p>
        <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-[#DB4444]">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-24 pt-10">
      <div className="mb-10 text-sm text-black/55">
        <Link to="/" className="hover:text-[#DB4444]">Home</Link> / <span className="text-black">{product.name}</span>
      </div>

      <section className="grid gap-10 lg:grid-cols-[140px_minmax(0,620px)_1fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-1">
          {imageGallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-3xl border bg-[#F5F5F5] p-3 transition ${
                selectedImage === image ? 'border-[#DB4444]' : 'border-black/10'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} preview ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.src = getProductImageByName(product.imageName)
                }}
                className="h-24 w-full object-contain"
              />
            </button>
          ))}
        </div>

        <div className="rounded-[32px] bg-[#F5F5F5] p-8">
          <img
            src={selectedImage}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = getProductImageByName(product.imageName)
            }}
            className="mx-auto h-[420px] w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-[0.02em]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-[#FFAD33]">{'★'.repeat(Math.round(product.rating || 4))}</span>
            <span className="text-black/50">({product.reviews || 0} Reviews)</span>
            <span className="text-[#00A651]">In Stock</span>
          </div>
          <p className="mt-6 text-3xl font-medium">${product.price}</p>
          {product.oldPrice ? <p className="mt-2 text-base text-black/45 line-through">${product.oldPrice}</p> : null}
          <p className="mt-6 border-b border-black/10 pb-6 text-base leading-7 text-black/70">
            {product.description || 'Detailed product description will appear here after the item is added from the admin panel.'}
          </p>

          {product.colors?.length ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xl">Colours:</span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedColor === color
                        ? 'border-[#DB4444] bg-[#DB4444] text-white'
                        : 'border-black/15 hover:border-[#DB4444]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes?.length ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xl">Size:</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-11 rounded border px-4 py-2 text-sm font-medium transition ${
                      selectedSize === size
                        ? 'border-[#DB4444] bg-[#DB4444] text-white'
                        : 'border-black/15 hover:border-[#DB4444]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center overflow-hidden rounded border border-black/25">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="grid h-11 w-11 place-items-center hover:bg-black hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="grid h-11 min-w-14 place-items-center border-x border-black/25 px-4 font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="grid h-11 w-11 place-items-center bg-[#DB4444] text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#DB4444] px-8 text-sm font-medium text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`grid h-11 w-11 place-items-center rounded border transition ${
                inWishlist
                  ? 'border-[#DB4444] bg-[#DB4444] text-white'
                  : 'border-black/20 hover:border-[#DB4444] hover:text-[#DB4444]'
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 rounded border border-black/15">
            <div className="border-b border-black/15 px-5 py-4">
              <p className="font-medium">Free Delivery</p>
              <p className="mt-1 text-sm text-black/55">Enter your postal code for delivery availability.</p>
            </div>
            <div className="px-5 py-4">
              <p className="font-medium">Return Delivery</p>
              <p className="mt-1 text-sm text-black/55">Free 30 Days Delivery Returns. Details available on request.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
