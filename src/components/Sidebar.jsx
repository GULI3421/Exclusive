import { ChevronRight } from 'lucide-react'
import { productCategoryMenu } from '../data/productCategories'

function Sidebar({ selectedCategory = 'All', onSelectCategory }) {
  return (
    <aside className="w-full border-b border-black/10 pb-6 lg:w-[234px] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
      <ul className="space-y-4">
        {productCategoryMenu.map((category) => {
          const isActive = selectedCategory === category.value

          return (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onSelectCategory?.(category.value)}
              className={`flex w-full items-center justify-between gap-3 text-left text-base transition ${
                isActive
                  ? 'font-semibold text-[#DB4444]'
                  : 'text-black hover:text-[#DB4444]'
              }`}
            >
              <span>{category.label}</span>
              <ChevronRight className={`h-4 w-4 ${isActive ? 'text-[#DB4444]' : ''}`} />
            </button>
          </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
