import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Headphones } from 'lucide-react'
import { collection, onSnapshot } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'
import CategoryBox from '../components/CategoryBox'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Sidebar from '../components/Sidebar'
import {
  browseCategories,
  cartPromo,
  newArrivalGrid,
} from '../data/catalog'
import { productCategoryMenu } from '../data/productCategories'
import { useShop } from '../context/ShopContext'
import { db } from '../firebase/config'
import { getProductImageByName, getProductPrimaryImage, normalizeProduct } from '../firebase/products'

function SectionHeader({ eyebrow, title, actionLabel }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-5 flex items-center gap-4">
          <span className="h-10 w-5 rounded bg-[#DB4444]" />
          <span className="text-base font-semibold text-[#DB4444]">{eyebrow}</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-[0.02em]">{title}</h2>
      </div>
      <button
        type="button"
        className="inline-flex h-14 items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white transition hover:bg-[#c33a3a]"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function Home() {
  const { t } = useTranslation()
  const { products, setProducts } = useShop()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [totalProducts, setTotalProducts] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        let { days, hours, minutes, seconds } = current
        if (seconds > 0) {
          seconds -= 1
        } else if (minutes > 0) {
          minutes -= 1
          seconds = 59
        } else if (hours > 0) {
          hours -= 1
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days -= 1
          hours = 23
          minutes = 59
          seconds = 59
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!db) {
      setProducts([])
      setTotalProducts(0)
      return undefined
    }

    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => normalizeProduct({ id: doc.id, ...doc.data() }))

        console.log('Loaded products:', data)
        setTotalProducts(snapshot.size)
        setProducts(data)
      },
      (error) => {
        console.error('Failed to load home products:', error)
        setProducts([])
        setTotalProducts(0)
      },
    )

    return unsubscribe
  }, [setProducts])

  const visibleProducts = products.filter(
    (product) => selectedCategory === 'All' || product.category === selectedCategory,
  )

  const pickProducts = (predicate, limit) => {
    const filteredProducts = visibleProducts.filter(predicate)
    if (filteredProducts.length) {
      return filteredProducts.slice(0, limit)
    }

    return visibleProducts.slice(0, limit)
  }

  const flashSaleProducts = pickProducts((product) => product.isFlashSale, 4)
  const bestSellerProducts = pickProducts((product) => product.isBestSeller, 4)
  const exploreProducts = pickProducts((product) => product.isFeatured, 8)

  return (
    <div className="pb-24 pt-10">
      <section className="mb-8 rounded-3xl border border-black/10 bg-[#F5F5F5] px-6 py-5">
        <p className="text-sm uppercase tracking-[0.18em] text-black/45">{t('catalogStatus')}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t('totalProducts', { count: totalProducts })}</h2>
      </section>

      <section className="flex flex-col gap-10 lg:flex-row lg:gap-[45px]">
        <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <div className="min-w-0 flex-1">
          <Hero />
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-10 w-5 rounded bg-[#DB4444]" />
              <span className="text-base font-semibold text-[#DB4444]">{t('todays')}</span>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-20">
              <h2 className="text-3xl font-semibold">{t('flashSales')}</h2>
              <div className="flex items-center gap-4">
                {Object.entries(timeLeft).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs font-medium uppercase text-black/60">{t(key)}</div>
                    <div className="text-3xl font-bold">{String(value).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <button type="button" className="inline-flex h-14 items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white">
            {t('viewAllProducts')}
          </button>
        </div>
      </section>

      <section className="mt-20 border-t border-black/10 pt-20">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-10 w-5 rounded bg-[#DB4444]" />
              <span className="text-base font-semibold text-[#DB4444]">{t('categories')}</span>
            </div>
            <h2 className="text-3xl font-semibold">{t('browseByCategory')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {browseCategories.map((category, index) => (
            <CategoryBox
              key={category.id}
              category={category}
              active={index === 2}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-black/10 pt-20">
        <SectionHeader eyebrow={t('thisMonth')} title={t('bestSellingProducts')} actionLabel={t('viewAllProducts')} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded bg-black px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-base font-semibold text-[#00FF66]">{cartPromo.subtitle}</p>
            <h2 className="mt-8 max-w-[440px] text-4xl font-semibold leading-tight tracking-[0.04em] lg:text-5xl">
              {t('musicExperience')}
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                ['23', t('hours')],
                ['05', t('days')],
                ['59', t('minutes')],
                ['35', t('seconds')],
              ].map(([value, label]) => (
                <div key={label} className="grid h-16 w-16 place-items-center rounded-full bg-white text-black">
                  <div>
                    <div className="text-base font-semibold leading-none">{value}</div>
                    <div className="mt-1 text-[11px]">{label}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="mt-10 inline-flex h-14 items-center justify-center rounded bg-[#00FF66] px-12 text-base font-medium text-black">
              {cartPromo.cta}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)] blur-2xl" />
            <img
              src={
                getProductPrimaryImage(visibleProducts[5] ?? {})
                || getProductPrimaryImage(visibleProducts[0] ?? {})
                || getProductImageByName('bag')
              }
              alt="Music promo"
              className="relative h-auto max-h-[320px] w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="mt-20 border-t border-black/10 pt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-black/55">
            {selectedCategory === 'All'
              ? `Showing all products (${visibleProducts.length})`
              : `Category: ${selectedCategory} (${visibleProducts.length})`}
          </div>
          <div className="flex flex-wrap gap-2">
            {productCategoryMenu.slice(1).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedCategory === category.value
                    ? 'border-[#DB4444] bg-[#DB4444] text-white'
                    : 'border-black/10 bg-white text-black hover:border-[#DB4444] hover:text-[#DB4444]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-10 flex items-center gap-4">
          <span className="h-10 w-5 rounded bg-[#DB4444]" />
          <span className="text-base font-semibold text-[#DB4444]">{t('ourProducts')}</span>
        </div>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-semibold">{t('exploreOurProducts')}</h2>
          <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold">
            {t('shopMore')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {exploreProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-black/10 pt-20">
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-10 w-5 rounded bg-[#DB4444]" />
            <span className="text-base font-semibold text-[#DB4444]">{t('featured')}</span>
          </div>
          <h2 className="text-3xl font-semibold">{t('newArrival')}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <article className="relative overflow-hidden rounded bg-black p-8 text-white min-h-[600px]">
            <img
              src={newArrivalGrid[0].image}
              alt={newArrivalGrid[0].title}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 z-10 max-w-[260px]">
              <h3 className="text-2xl font-semibold">{newArrivalGrid[0].title}</h3>
              <p className="mt-4 text-sm text-white/80">{newArrivalGrid[0].description}</p>
              <button type="button" className="mt-4 border-b border-white pb-1 text-base font-medium">
                {t('shopNow')}
              </button>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="relative overflow-hidden rounded bg-black p-8 text-white min-h-[284px]">
              <img
                src={newArrivalGrid[1].image}
                alt={newArrivalGrid[1].title}
                className="absolute inset-0 h-full w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 z-10 max-w-[255px]">
                <h3 className="text-2xl font-semibold">{newArrivalGrid[1].title}</h3>
                <p className="mt-3 text-sm text-white/80">{newArrivalGrid[1].description}</p>
                <button type="button" className="mt-4 border-b border-white pb-1 text-base font-medium">
                  {t('shopNow')}
                </button>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2">
              {newArrivalGrid.slice(2).map((item) => (
                <article key={item.id} className="relative overflow-hidden rounded bg-black p-6 text-white min-h-[284px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <div className="absolute bottom-6 left-6 z-10 max-w-[180px]">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm text-white/80">{item.description}</p>
                    <button type="button" className="mt-4 border-b border-white pb-1 text-base font-medium">
                      {t('shopNow')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-8 border-t border-black/10 pt-20 text-center sm:grid-cols-3">
        <div className="mx-auto max-w-[250px]">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black text-white shadow-[0_0_0_10px_rgba(47,46,48,0.3)]">
            <Truck className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">FREE AND FAST DELIVERY</h3>
          <p className="mt-2 text-sm text-black/70">Free delivery for all orders over $140</p>
        </div>
        <div className="mx-auto max-w-[250px]">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black text-white shadow-[0_0_0_10px_rgba(47,46,48,0.3)]">
            <Headphones className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">24/7 CUSTOMER SERVICE</h3>
          <p className="mt-2 text-sm text-black/70">Friendly support that stays available around the clock</p>
        </div>
        <div className="mx-auto max-w-[250px]">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black text-white shadow-[0_0_0_10px_rgba(47,46,48,0.3)]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">MONEY BACK GUARANTEE</h3>
          <p className="mt-2 text-sm text-black/70">We return your money within 30 days if anything feels off</p>
        </div>
      </section>
    </div>
  )
}

export default Home
