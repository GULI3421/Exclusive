export const productCategories = [
  'Bag',
  'Cooler',
  'Gamepad',
  'Jacket',
  'Keyboard',
  'Laptop',
  'Monitor',
]

export const productCategoryMenu = [
  { id: 'all', label: 'All', value: 'All' },
  ...productCategories.map((category) => ({
    id: category.toLowerCase(),
    label: category,
    value: category,
  })),
]

export const productImageOptions = productCategories.map((category) => ({
  label: category,
  value: category.toLowerCase(),
}))
