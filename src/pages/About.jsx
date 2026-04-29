import {
  DollarSign,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.7-2.2 8.1 8.1 0 0 1-2.6 1 4 4 0 0 0-6.9 2.7c0 .3 0 .6.1.9A11.3 11.3 0 0 1 3.7 4.8a4 4 0 0 0 1.2 5.3 3.8 3.8 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4.2 4.2 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8.1 8.1 0 0 1 2 18.2a11.5 11.5 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5A8.2 8.2 0 0 0 22 5.9Z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a4.8 4.8 0 0 1 4-3Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function createPortrait(name, accentColor, panelColor) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 420">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${panelColor}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="360" height="420" fill="url(#bg)" />
      <circle cx="180" cy="135" r="72" fill="${accentColor}" opacity="0.2" />
      <circle cx="180" cy="150" r="58" fill="${accentColor}" opacity="0.92" />
      <path d="M95 370c16-72 63-108 85-108s69 36 85 108" fill="${accentColor}" opacity="0.95" />
      <text x="180" y="166" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function About() {
  const { t } = useTranslation()

  const stats = [
    { icon: Store, value: '10.5k', label: t('about.stat_stores') },
    { icon: ShoppingBag, value: '33k', label: t('about.stat_sales') },
    { icon: Users, value: '45.5k', label: t('about.stat_customers') },
    { icon: DollarSign, value: '25k', label: t('about.stat_revenue') },
  ]

  const teamMembers = [
    {
      name: t('about.team_member_1_name'),
      role: t('about.team_member_1_role'),
      image: createPortrait(t('about.team_member_1_name'), '#DB4444', '#FFE8E8'),
    },
    {
      name: t('about.team_member_2_name'),
      role: t('about.team_member_2_role'),
      image: createPortrait(t('about.team_member_2_name'), '#111827', '#F1F5F9'),
    },
    {
      name: t('about.team_member_3_name'),
      role: t('about.team_member_3_role'),
      image: createPortrait(t('about.team_member_3_name'), '#0F766E', '#ECFEFF'),
    },
  ]

  const features = [
    {
      icon: Truck,
      title: t('about.feature_delivery_title'),
      description: t('about.feature_delivery_text'),
    },
    {
      icon: Headphones,
      title: t('about.feature_support_title'),
      description: t('about.feature_support_text'),
    },
    {
      icon: ShieldCheck,
      title: t('about.feature_guarantee_title'),
      description: t('about.feature_guarantee_text'),
    },
  ]

  const socialLinks = [
    { icon: TwitterIcon, label: t('about.social_twitter'), href: 'https://twitter.com' },
    { icon: InstagramIcon, label: t('about.social_instagram'), href: 'https://instagram.com' },
    { icon: LinkedInIcon, label: t('about.social_linkedin'), href: 'https://linkedin.com' },
  ]

  return (
    <div className="pb-24 pt-20">
      <nav className="text-sm text-black/50">
        <Link to="/" className="hover:text-[#DB4444]">{t('home')}</Link> / <span className="text-black">{t('about.page_title')}</span>
      </nav>

      <section className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-18">
        <div className="max-w-[540px]">
          <h1 className="text-4xl font-semibold tracking-[0.02em] text-black lg:text-5xl">{t('about.story_title')}</h1>
          <p className="mt-10 text-base leading-8 text-black/70">{t('about.story_text_1')}</p>
          <p className="mt-6 text-base leading-8 text-black/70">{t('about.story_text_2')}</p>
        </div>

        <div className="relative overflow-hidden rounded-[8px] bg-[#FDECEC] px-6 py-10 sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.18),transparent_45%)]" />
          <img
            src={heroImage}
            alt={t('about.story_image_alt')}
            className="relative mx-auto h-auto max-h-[430px] w-full max-w-[420px] object-contain"
          />
        </div>
      </section>

      <section className="mt-18 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <article
              key={item.label}
              className="group rounded border border-black/10 bg-white px-8 py-9 text-center transition duration-300 hover:border-[#DB4444] hover:bg-[#DB4444]"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black text-white shadow-[0_0_0_10px_rgba(47,46,48,0.3)] transition duration-300 group-hover:bg-white group-hover:text-[#DB4444] group-hover:shadow-[0_0_0_10px_rgba(255,255,255,0.25)]">
                <Icon className="h-8 w-8" />
              </div>
              <div className="mt-6 text-[32px] font-bold tracking-[0.04em] text-black transition duration-300 group-hover:text-white">
                {item.value}
              </div>
              <p className="mt-3 text-base text-black/70 transition duration-300 group-hover:text-white">
                {item.label}
              </p>
            </article>
          )
        })}
      </section>

      <section className="mt-24">
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-10 w-5 rounded bg-[#DB4444]" />
            <span className="text-base font-semibold text-[#DB4444]">{t('about.team_eyebrow')}</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-[0.02em]">{t('about.team_title')}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.name}>
              <div className="overflow-hidden rounded bg-[#F5F5F5]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[430px] w-full object-cover"
                />
              </div>
              <h3 className="mt-8 text-[32px] font-medium tracking-[0.04em] text-black">{member.name}</h3>
              <p className="mt-2 text-base text-black/70">{member.role}</p>
              <div className="mt-4 flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="text-black transition hover:text-[#DB4444]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-8 border-t border-black/10 pt-20 text-center sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <article key={feature.title} className="mx-auto max-w-[270px]">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black text-white shadow-[0_0_0_10px_rgba(47,46,48,0.3)]">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold uppercase">{feature.title}</h3>
              <p className="mt-2 text-sm text-black/70">{feature.description}</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default About
