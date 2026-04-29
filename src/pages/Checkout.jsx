import { useMemo, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { db } from '../firebase/config'

const initialFormValues = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  phone: '',
}

function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cartItems, currentUserId, subtotal, total } = useShop()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const orderItems = useMemo(
    () => cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageName ?? item.product.image ?? 'bag',
      subtotal: item.subtotal,
    })),
    [cartItems],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const clearCartCollection = async () => {
    const cartQuery = query(
      collection(db, 'cart'),
      where('userId', '==', currentUserId ?? null),
    )
    const cartSnapshot = await getDocs(cartQuery)

    await Promise.all(
      cartSnapshot.docs.map((snapshotDoc) => deleteDoc(doc(db, 'cart', snapshotDoc.id))),
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!db) {
      alert('Firebase жеткиликтүү эмес.')
      return
    }

    if (!orderItems.length) {
      alert('Корзина бош.')
      return
    }

    const hasEmptyField = Object.values(formValues).some((value) => !value.trim())
    if (hasEmptyField) {
      alert('Бардык талааларды толтуруңуз.')
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'orders'), {
        ...formValues,
        userId: currentUserId ?? null,
        items: orderItems,
        subtotal,
        total,
        createdAt: Date.now(),
      })

      await clearCartCollection()
      alert('Рахмат, буйрутма кабыл алынды!')
      navigate('/')
    } catch (error) {
      console.error('Failed to place order:', error)
      alert(`Буйрутманы сактоо мүмкүн болгон жок: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-24 pt-20">
      <nav className="text-sm text-black/50">
        <Link to="/" className="hover:text-[#DB4444]">{t('home')}</Link> / <span className="text-black">{t('checkout')}</span>
      </nav>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_420px]">
        <form onSubmit={handleSubmit} className="rounded border border-black/10 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">{t('billingDetails')}</h1>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-black/60">
              <span>{t('firstName')}</span>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className="h-14 rounded bg-[#F5F5F5] px-4 text-base text-black outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/60">
              <span>{t('lastName')}</span>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className="h-14 rounded bg-[#F5F5F5] px-4 text-base text-black outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/60 sm:col-span-2">
              <span>{t('address')}</span>
              <input
                type="text"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                className="h-14 rounded bg-[#F5F5F5] px-4 text-base text-black outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/60">
              <span>{t('city')}</span>
              <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                className="h-14 rounded bg-[#F5F5F5] px-4 text-base text-black outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/60">
              <span>{t('phone')}</span>
              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                className="h-14 rounded bg-[#F5F5F5] px-4 text-base text-black outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 inline-flex h-14 items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t('saving') : t('placeOrder')}
          </button>
        </form>

        <aside className="rounded border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">{t('orderSummary')}</h2>

          <div className="mt-8 space-y-5">
            {orderItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{item.name}</p>
                  <p className="text-sm text-black/50">{t('qty')}: {item.quantity}</p>
                </div>
                <span className="text-base font-medium">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 border-t border-black/10 pt-6">
            <div className="flex items-center justify-between text-base">
              <span>{t('subtotal')}</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span>{t('shipping')}</span>
              <span>{t('free')}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t('total')}</span>
              <span>${total}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
