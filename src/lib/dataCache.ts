type CACHE_TAG = 'users' | 'categories' | 'products' | 'orders' | 'address'

export const getGlobalTag = (tag: CACHE_TAG) => {
  return `global:${tag}` as const
}

export const getIdTag = (tag: CACHE_TAG, id: string) => {
  return `id:${id}-${tag}` as const
}