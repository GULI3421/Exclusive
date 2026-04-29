import { Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const initialFormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function Contact() {
  const { t } = useTranslation()
  const [formValues, setFormValues] = useState(initialFormValues)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(t('contact.success'))
    setFormValues(initialFormValues)
  }

  return (
    <div className="pb-24 pt-20">
      <nav className="text-sm text-black/50">
        <Link to="/" className="hover:text-[#DB4444]">{t('home')}</Link> / <span className="text-black">{t('contact.title')}</span>
      </nav>

      <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <div className="rounded bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444] text-white">
                <Phone className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{t('contact.call')}</h2>
            </div>
            <p className="mt-6 text-sm leading-6 text-black/70">{t('contact.callText')}</p>
            <a href="tel:+8801611112222" className="mt-4 block text-base font-medium text-black hover:text-[#DB4444]">
              +8801611112222
            </a>
          </div>

          <div className="rounded bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444] text-white">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{t('contact.write')}</h2>
            </div>
            <p className="mt-6 text-sm leading-6 text-black/70">{t('contact.writeText')}</p>
            <a href="mailto:customer@exclusive.com" className="mt-4 block text-base font-medium text-black hover:text-[#DB4444]">
              customer@exclusive.com
            </a>
            <a href="mailto:support@exclusive.com" className="mt-2 block text-base font-medium text-black hover:text-[#DB4444]">
              support@exclusive.com
            </a>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded bg-white p-8 shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder={t('contact.yourName')}
              className="h-14 rounded border border-[#E5E5E5] bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-black/50"
            />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder={t('contact.yourEmail')}
              className="h-14 rounded border border-[#E5E5E5] bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-black/50"
            />
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder={t('contact.yourPhone')}
              className="h-14 rounded border border-[#E5E5E5] bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-black/50"
            />
          </div>

          <textarea
            name="message"
            value={formValues.message}
            onChange={handleChange}
            placeholder={t('contact.yourMessage')}
            className="mt-8 min-h-[220px] w-full rounded border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-4 text-base outline-none placeholder:text-black/50"
          />

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded bg-[#DB4444] px-12 text-base font-medium text-white transition hover:bg-[#c33a3a]"
            >
              {t('contact.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
