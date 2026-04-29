import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'kg', label: 'Кыргызча' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguageLabel = useMemo(() => {
    const activeLanguage = languages.find((language) => language.value === i18n.resolvedLanguage)
    return activeLanguage?.label ?? 'English'
  }, [i18n.resolvedLanguage])

  const handleChangeLanguage = async (languageValue) => {
    await i18n.changeLanguage(languageValue)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 text-sm text-white transition hover:text-white/80"
      >
        <span className="font-medium">{currentLanguageLabel}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[120] mt-2 min-w-[150px] rounded-xl border border-white/10 bg-[#1F1F1F] p-2 shadow-2xl">
          {languages.map((language) => {
            const isActive = i18n.resolvedLanguage === language.value

            return (
              <button
                key={language.value}
                type="button"
                onClick={() => handleChangeLanguage(language.value)}
                className={`relative z-[121] flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  isActive ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{language.label}</span>
                {isActive ? <span className="text-xs">●</span> : null}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
