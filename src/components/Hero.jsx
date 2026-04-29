import { Apple, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../data/catalog'

function Hero() {
  const slide = heroSlides[0]

  return (
    <section className="relative overflow-hidden bg-black px-5 py-10 text-white sm:px-8 lg:min-h-[344px] lg:px-14 lg:py-12">
      <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[400px]">
          <div className="mb-5 flex items-center gap-4 text-base">
            <Apple className="h-10 w-10" />
            <span>{slide.eyebrow}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-[0.04em] lg:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-[320px] text-sm text-white/70">{slide.description}</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-3 border-b border-white pb-1 text-base font-medium"
          >
            {slide.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative z-10 flex justify-center lg:justify-end">
          <img
            src={slide.image}
            alt={slide.title}
            className="h-auto max-h-[300px] w-full max-w-[540px] object-contain"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 lg:absolute lg:bottom-6 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
        {[0, 1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className={`h-3 w-3 rounded-full ${dot === 2 ? 'border-2 border-[#DB4444] bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
