import { useState } from 'react'
import { Boxes, Plus, Trash2 } from 'lucide-react'
import { addDoc, collection } from 'firebase/firestore'
import { productCategories, productImageOptions } from '../data/productCategories'
import { useShop } from '../context/ShopContext'
import { db } from '../firebase/config'
import { getProductImageByName, normalizeImageList } from '../firebase/products'

const initialState = {
  name: '',
  price: '',
  oldPrice: '',
  category: productCategories[0],
  image: 'bag',
  imageUrls: ['', '', '', ''],
  description: '',
  colors: '',
  sizes: '',
  rating: '4.5',
  reviews: '24',
  discount: '10',
}

function removeUndefinedFields(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  )
}

function parseCsvList(value) {
  if (typeof value !== 'string') {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function AdminPanel() {
  const { deleteProduct, products, productsError } = useShop()
  const [formValues, setFormValues] = useState(initialState)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const images = normalizeImageList(formValues.imageUrls)
    const colors = parseCsvList(formValues.colors)
    const sizes = parseCsvList(formValues.sizes)
    const data = removeUndefinedFields({
      name: formValues.name.trim(),
      category: formValues.category,
      image: formValues.image,
      images,
      imageURL: images[0] || undefined,
      description: formValues.description.trim(),
      colors,
      sizes,
      price: Number(formValues.price),
      oldPrice: Number(formValues.oldPrice) || null,
      rating: Number(formValues.rating) || 4.5,
      reviews: Number(formValues.reviews) || 0,
      discount: Number(formValues.discount) || 0,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: Number(formValues.discount) <= 15,
      isFlashSale: Number(formValues.discount) > 15,
    })

    if (!data.name || !data.price) return

    try {
      setIsSubmitting(true)

      if (!db) {
        throw new Error('Firestore is not ready. Check your Firebase configuration.')
      }

      await addDoc(collection(db, 'products'), data)

      setFormValues(initialState)
      alert('Товар успешно добавлен!')
      console.log('Product Added!')
    } catch (e) {
      console.error('Failed to add product:', e)
      alert(`Ошибка Firebase: ${e.message}`)
      setSubmitError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-24 pt-20">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="rounded-[28px] bg-[#F5F5F5] p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-black text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-black/50">Dashboard</p>
              <h1 className="text-2xl font-semibold">Admin Panel</h1>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <input
              value={formValues.name}
              onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))}
              placeholder="Product name"
              className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={formValues.price}
                onChange={(event) => setFormValues((current) => ({ ...current, price: event.target.value }))}
                placeholder="Price"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
              <input
                value={formValues.oldPrice}
                onChange={(event) => setFormValues((current) => ({ ...current, oldPrice: event.target.value }))}
                placeholder="Old price"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={formValues.category}
                onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value }))}
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              >
                {productCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                value={formValues.discount}
                onChange={(event) => setFormValues((current) => ({ ...current, discount: event.target.value }))}
                placeholder="Discount"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={formValues.rating}
                onChange={(event) => setFormValues((current) => ({ ...current, rating: event.target.value }))}
                placeholder="Rating"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
              <input
                value={formValues.reviews}
                onChange={(event) => setFormValues((current) => ({ ...current, reviews: event.target.value }))}
                placeholder="Reviews"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
            </div>
            <select
              value={formValues.image}
              onChange={(event) => setFormValues((current) => ({ ...current, image: event.target.value }))}
              className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
            >
              {productImageOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3">
              {formValues.imageUrls.map((imageUrl, index) => (
                <input
                  key={`image-url-${index + 1}`}
                  value={imageUrl}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      imageUrls: current.imageUrls.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    }))}
                  placeholder={`Image URL ${index + 1}`}
                  className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
                />
              ))}
            </div>
            <textarea
              value={formValues.description}
              onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
              placeholder="Description"
              rows={5}
              className="w-full rounded border border-black/15 bg-white px-4 py-3 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={formValues.colors}
                onChange={(event) => setFormValues((current) => ({ ...current, colors: event.target.value }))}
                placeholder="Colors (e.g. Red, Black, White)"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
              <input
                value={formValues.sizes}
                onChange={(event) => setFormValues((current) => ({ ...current, sizes: event.target.value }))}
                placeholder="Sizes (e.g. XS, S, M, L)"
                className="h-12 w-full rounded border border-black/15 bg-white px-4 outline-none"
              />
            </div>

            {submitError ? <p className="text-sm text-[#DB4444]">{submitError}</p> : null}
            {productsError ? <p className="text-sm text-[#DB4444]">{productsError}</p> : null}

            <button type="submit" disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-[#DB4444] px-5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-black/50">Catalog</p>
              <h2 className="text-2xl font-semibold">Product Management</h2>
            </div>
            <div className="rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-medium">
              {products.length} items
            </div>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <article key={product.id} className="grid gap-4 rounded-3xl border border-black/10 p-4 md:grid-cols-[88px_1fr_auto] md:items-center">
                <img
                  src={product.images?.[0] || product.imageURL || getProductImageByName(product.imageName)}
                  alt={product.name}
                  className="h-20 w-20 rounded-2xl bg-[#F5F5F5] object-contain p-3"
                />
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="mt-2 text-sm text-black/50">{product.category}</p>
                  {product.description ? <p className="mt-2 line-clamp-2 text-sm text-black/60">{product.description}</p> : null}
                  {!!product.colors?.length ? <p className="mt-2 text-xs text-black/45">Colors: {product.colors.join(', ')}</p> : null}
                  {!!product.sizes?.length ? <p className="mt-1 text-xs text-black/45">Sizes: {product.sizes.join(', ')}</p> : null}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-medium text-[#DB4444]">${product.price}</span>
                    {product.oldPrice ? <span className="text-sm text-black/50 line-through">${product.oldPrice}</span> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void deleteProduct(product.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444] text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminPanel
