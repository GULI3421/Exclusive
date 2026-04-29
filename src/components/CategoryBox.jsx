import {
  Camera,
  Gamepad2,
  Headphones,
  Monitor,
  Smartphone,
  Watch,
} from 'lucide-react'

const iconMap = {
  camera: Camera,
  'gamepad-2': Gamepad2,
  headphones: Headphones,
  monitor: Monitor,
  smartphone: Smartphone,
  watch: Watch,
}

function CategoryBox({ category, active = false }) {
  const Icon = iconMap[category.icon] ?? Monitor

  return (
    <button
      type="button"
      className={`flex min-h-[145px] w-full flex-col items-center justify-center gap-4 rounded bg-white px-4 py-6 text-center transition ${
        active
          ? 'border border-[#DB4444] bg-[#DB4444] text-white shadow-[0_18px_50px_rgba(219,68,68,0.22)]'
          : 'border border-black/20 text-black hover:border-[#DB4444] hover:text-[#DB4444]'
      }`}
    >
      <Icon className="h-10 w-10" strokeWidth={1.7} />
      <span className="text-base font-medium">{category.label}</span>
    </button>
  )
}

export default CategoryBox
