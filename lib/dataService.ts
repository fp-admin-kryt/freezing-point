import { getTags, getDomains } from './firebase'

// Simple cache for tags and domains
let tagsCache: any[] = []
let domainsCache: any[] = []

export const getTagById = (tagId: string) => {
  return tagsCache.find(tag => tag.id === tagId)
}

export const getDomainById = (domainId: string) => {
  return domainsCache.find(domain => domain.id === domainId)
}

export const loadTagsAndDomains = async () => {
  try {
    const [tags, domains] = await Promise.all([
      getTags(),
      getDomains()
    ])
    tagsCache = tags
    domainsCache = domains
  } catch (error) {
    console.error('Error loading tags and domains:', error)
    // Fallback to empty arrays
    tagsCache = []
    domainsCache = []
  }
}

// Load data on module import
loadTagsAndDomains()
