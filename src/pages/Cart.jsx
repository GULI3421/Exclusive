import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { subscribeToShopCollection } from '../firebase/shopCollections'

function Cart() {
  const { t } = useTranslation()
  const { cartItems, currentUserId, removeFromCart, subtotal, total, updateCartQuantity } = useShop()
  const [coupon, setCoupon] = useState('')
  const [liveCartItems, setLiveCartItems] = useState(cartItems)

  useEffect(() => {
    const unsubscribe = subscribeToShopCollection(
      'cart',
      currentUserId,
      (nextCartRecords) => {
        const groupedItems = new Map()

        nextCartRecords.forEach((item) => {
          const existingItem = groupedItems.get(item.productId)

          if (existingItem) {
            existingItem.quantity += item.quantity
            existingItem.subtotal = existingItem.product.price * existingItem.quantity
            return
          }

          groupedItems.set(item.productId, {
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

        setLiveCartItems([...groupedItems.values()])
      },
      (error) => {
        console.error('Failed to subscribe to cart:', error)
      },
    )

    return unsubscribe
  }, [currentUserId])

  const visibleCartItems = liveCartItems.length ? liveCartItems : cartItems

  return (
    <div className="pb-24 pt-20">
      <nav className="text-sm text-black/50">
        <Link to="/" className="hover:text-[#DB4444]">{t('home')}</Link> / <span className="text-black">{t('cart')}</span>
      </nav>

      <div className="mt-20 overflow-hidden rounded bg-white shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-10 py-6 text-base font-medium md:grid">
          <span>{t('product')}</span>
          <span>{t('price')}</span>
          <span>{t('quantity')}</span>
          <span>{t('subtotal')}</span>
        </div>

        <div className="space-y-4 p-4 md:p-0">
          {visibleCartItems.map((item) => (
            <div
              key={item.productId}
              className="grid gap-5 rounded bg-white px-4 py-5 shadow-[0_1px_13px_rgba(0,0,0,0.05)] md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center md:rounded-none md:px-10 md:py-6 md:shadow-none"
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#DB4444] text-white"
                >
                  <X className="h-3 w-3" />
                </button>
                <img src={item.product.image} alt={item.product.name} className="h-14 w-14 object-contain" />
                <span className="text-base">{item.product.name}</span>
              </div>

              <div className="text-base">${item.product.price}</div>

              <div>
                <div className="inline-flex items-center gap-4 rounded border border-black/20 px-4 py-2">
                  <span>{item.quantity}</span>
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                      <ChevronUp className="h-4 w-4 text-[#DB4444]" />
                    </button>
                    <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                      <ChevronDown className="h-4 w-4 text-[#DB4444]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-base">${item.subtotal}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="inline-flex h-14 items-center justify-center rounded border border-black/50 px-12 text-base font-medium">
          {t('returnToShop')}
        </Link>
        <button type="button" className="inline-flex h-14 items-center justify-center rounded border border-black/50 px-12 text-base font-medium">
          {t('updateCart')}
        </button>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_470px]">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            placeholder={t('couponCode')}
            aria-label={t('couponCode')}
            className="h-14 flex-1 rounded border border-black/20 px-6 text-base outline-none placeholder:text-black/50"
          />
          <button type="button" className="inline-flex h-14 items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white">
            {t('applyCoupon')}
          </button>
        </div>

        <div className="rounded border border-black/50 p-6 sm:p-8">
          <h2 className="text-xl font-medium">{t('cartTotal')}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/20 pb-4 text-base">
              <span>{t('subtotal')}:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/20 pb-4 text-base">
              <span>{t('shipping')}:</span>
              <span>{t('free')}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span>{t('total')}:</span>
              <span>${total}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 inline-flex h-14 w-full items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white">
            {t('proceedToCheckout')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
