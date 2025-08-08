// Data store for managing posts, tags, and domains
// This will be replaced with Firebase/Supabase later

export interface Tag {
  id: string
  name: string
  color: string
  image?: string
}

export interface Domain {
  id: string
  name: string
  description: string
  color: string
}

export interface ResearchPost {
  id: string
  title: string
  author: string
  date: string
  excerpt: string
  tags: string[]
  image?: string
  whitepaper?: string
  createdAt: string
}

export interface SignalPost {
  id: string
  heading: string
  content: string
  tags: string[]
  image?: string
  domain: string
  createdAt: string
}

export interface ObserverPost {
  id: string
  heading: string
  content: string
  tags: string[]
  image?: string
  domain: string
  createdAt: string
}

// Initial data
let tags: Tag[] = [
  { id: '1', name: 'Machine Learning', color: '#136fd7', image: '/api/placeholder/40/40' },
  { id: '2', name: 'Neural Networks', color: '#4da6ff', image: '/api/placeholder/40/40' },
  { id: '3', name: 'Computer Vision', color: '#ff6b6b', image: '/api/placeholder/40/40' },
  { id: '4', name: 'NLP', color: '#51cf66', image: '/api/placeholder/40/40' },
  { id: '5', name: 'Robotics', color: '#ffd43b', image: '/api/placeholder/40/40' },
  { id: '6', name: 'Quantum Computing', color: '#ae3ec9', image: '/api/placeholder/40/40' },
  { id: '7', name: 'Ethics', color: '#fd7e14', image: '/api/placeholder/40/40' },
  { id: '8', name: 'Future Tech', color: '#20c997', image: '/api/placeholder/40/40' },
]

let domains: Domain[] = [
  { id: '1', name: 'Artificial Intelligence', description: 'Core AI research and developments', color: '#136fd7' },
  { id: '2', name: 'Machine Learning', description: 'ML algorithms and applications', color: '#4da6ff' },
  { id: '3', name: 'Computer Vision', description: 'Visual AI and image processing', color: '#ff6b6b' },
  { id: '4', name: 'Natural Language Processing', description: 'Language understanding and generation', color: '#51cf66' },
  { id: '5', name: 'Robotics & Automation', description: 'Physical AI and automation', color: '#ffd43b' },
  { id: '6', name: 'Quantum Computing', description: 'Quantum algorithms and computing', color: '#ae3ec9' },
]

let researchPosts: ResearchPost[] = [
  {
    id: '1',
    title: 'Advanced Neural Network Architectures for Real-time Processing',
    author: 'Dr. Sarah Chen',
    date: '2024-12-15',
    excerpt: 'Exploring novel neural network designs that enable real-time processing of complex data streams while maintaining high accuracy and efficiency.',
    tags: ['1', '2'],
    image: '/api/placeholder/400/250',
    whitepaper: '/api/placeholder/whitepaper1.pdf',
    createdAt: '2024-12-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Ethical Considerations in AI Decision Making Systems',
    author: 'Prof. Michael Rodriguez',
    date: '2024-12-10',
    excerpt: 'A comprehensive analysis of ethical frameworks for AI decision-making, focusing on transparency, fairness, and accountability.',
    tags: ['7', '1'],
    image: '/api/placeholder/400/250',
    whitepaper: '/api/placeholder/whitepaper2.pdf',
    createdAt: '2024-12-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Quantum Machine Learning: Bridging Classical and Quantum Computing',
    author: 'Dr. Emily Watson',
    date: '2024-12-05',
    excerpt: 'Investigating hybrid approaches that combine classical machine learning with quantum computing for enhanced computational capabilities.',
    tags: ['6', '2'],
    image: '/api/placeholder/400/250',
    whitepaper: '/api/placeholder/whitepaper3.pdf',
    createdAt: '2024-12-05T09:15:00Z'
  }
]

let signalPosts: SignalPost[] = [
  {
    id: '1',
    heading: 'Breakthrough in Transformer Architecture Efficiency',
    content: 'Researchers at DeepMind have developed a new transformer variant that reduces computational complexity by 40% while maintaining performance. This could significantly impact the deployment of large language models in resource-constrained environments.',
    tags: ['2', '1'],
    domain: '1',
    createdAt: '2024-12-20T08:00:00Z'
  },
  {
    id: '2',
    heading: 'Major Tech Companies Form AI Ethics Consortium',
    content: 'Google, Microsoft, and OpenAI have announced the formation of a new consortium focused on developing industry-wide ethical AI standards. The initiative aims to establish best practices for responsible AI development.',
    tags: ['7'],
    domain: '1',
    createdAt: '2024-12-19T15:30:00Z'
  },
  {
    id: '3',
    heading: 'Revolutionary Computer Vision Model Achieves Human-Level Performance',
    content: 'A new computer vision model developed by researchers at Stanford has achieved human-level performance on multiple benchmark datasets. The model uses a novel attention mechanism that mimics human visual processing.',
    tags: ['3', '1'],
    domain: '3',
    createdAt: '2024-12-18T11:45:00Z'
  }
]

let observerPosts: ObserverPost[] = [
  {
    id: '1',
    heading: 'The Rise of Edge AI: Computing at the Source',
    content: 'Edge AI is revolutionizing how we deploy artificial intelligence. By processing data locally on devices rather than in the cloud, we\'re seeing unprecedented improvements in privacy, latency, and reliability. This shift is enabling new applications in autonomous vehicles, IoT devices, and mobile computing.',
    tags: ['1', '8'],
    domain: '1',
    createdAt: '2024-12-20T10:00:00Z'
  },
  {
    id: '2',
    heading: 'Quantum Supremacy in Machine Learning: What\'s Next?',
    content: 'With recent breakthroughs in quantum computing, we\'re approaching a new era where quantum algorithms could outperform classical machine learning in specific domains. This article explores the implications for cryptography, optimization, and drug discovery.',
    tags: ['6', '2'],
    domain: '6',
    createdAt: '2024-12-19T16:00:00Z'
  },
  {
    id: '3',
    heading: 'The Future of Human-AI Collaboration',
    content: 'As AI systems become more sophisticated, the nature of human-AI collaboration is evolving. We\'re moving from AI as a tool to AI as a partner. This shift requires new interfaces, trust mechanisms, and collaborative frameworks.',
    tags: ['7', '8'],
    domain: '1',
    createdAt: '2024-12-18T12:00:00Z'
  }
]

// Data store functions
export const dataStore = {
  // Tags
  getTags: () => tags,
  addTag: (tag: Omit<Tag, 'id'>) => {
    const newTag = { ...tag, id: Date.now().toString() }
    tags.push(newTag)
    return newTag
  },
  updateTag: (id: string, updates: Partial<Tag>) => {
    const index = tags.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags[index] = { ...tags[index], ...updates }
      return tags[index]
    }
    return null
  },
  deleteTag: (id: string) => {
    tags = tags.filter(tag => tag.id !== id)
  },

  // Domains
  getDomains: () => domains,
  addDomain: (domain: Omit<Domain, 'id'>) => {
    const newDomain = { ...domain, id: Date.now().toString() }
    domains.push(newDomain)
    return newDomain
  },
  updateDomain: (id: string, updates: Partial<Domain>) => {
    const index = domains.findIndex(domain => domain.id === id)
    if (index !== -1) {
      domains[index] = { ...domains[index], ...updates }
      return domains[index]
    }
    return null
  },
  deleteDomain: (id: string) => {
    domains = domains.filter(domain => domain.id !== id)
  },

  // Research Posts
  getResearchPosts: () => researchPosts,
  addResearchPost: (post: Omit<ResearchPost, 'id' | 'createdAt'>) => {
    const newPost = { 
      ...post, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    researchPosts.push(newPost)
    return newPost
  },
  updateResearchPost: (id: string, updates: Partial<ResearchPost>) => {
    const index = researchPosts.findIndex(post => post.id === id)
    if (index !== -1) {
      researchPosts[index] = { ...researchPosts[index], ...updates }
      return researchPosts[index]
    }
    return null
  },
  deleteResearchPost: (id: string) => {
    researchPosts = researchPosts.filter(post => post.id !== id)
  },

  // Signal Posts
  getSignalPosts: () => signalPosts,
  addSignalPost: (post: Omit<SignalPost, 'id' | 'createdAt'>) => {
    const newPost = { 
      ...post, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    signalPosts.push(newPost)
    return newPost
  },
  updateSignalPost: (id: string, updates: Partial<SignalPost>) => {
    const index = signalPosts.findIndex(post => post.id === id)
    if (index !== -1) {
      signalPosts[index] = { ...signalPosts[index], ...updates }
      return signalPosts[index]
    }
    return null
  },
  deleteSignalPost: (id: string) => {
    signalPosts = signalPosts.filter(post => post.id !== id)
  },

  // Observer Posts
  getObserverPosts: () => observerPosts,
  addObserverPost: (post: Omit<ObserverPost, 'id' | 'createdAt'>) => {
    const newPost = { 
      ...post, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    observerPosts.push(newPost)
    return newPost
  },
  updateObserverPost: (id: string, updates: Partial<ObserverPost>) => {
    const index = observerPosts.findIndex(post => post.id === id)
    if (index !== -1) {
      observerPosts[index] = { ...observerPosts[index], ...updates }
      return observerPosts[index]
    }
    return null
  },
  deleteObserverPost: (id: string) => {
    observerPosts = observerPosts.filter(post => post.id !== id)
  },

  // Utility functions
  getTagById: (id: string) => tags.find(tag => tag.id === id),
  getDomainById: (id: string) => domains.find(domain => domain.id === id),
  getDomainsWithContent(): Domain[] {
    const signalPosts = this.getSignalPosts()
    const observerPosts = this.getObserverPosts()
    const domains = this.getDomains()
    
    const signalDomains = new Set(signalPosts.map(post => post.domain))
    const observerDomains = new Set(observerPosts.map(post => post.domain))
    const allDomains = new Set(Array.from(signalDomains).concat(Array.from(observerDomains)))
    return domains.filter(domain => allDomains.has(domain.id))
  }
}
