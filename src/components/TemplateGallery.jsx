import { useMemo, useState } from 'react'
import { Copy, Eye, Search } from 'lucide-react'
import './TemplateGallery.css'

const TEMPLATE_CATEGORIES = [
  'Popular',
  'Business',
  'Design',
  'Education',
  'Engineering',
  'Marketing',
  'Human Resources',
  'Operations',
  'Sales CRM',
]

const TEMPLATE_ITEMS = [
  {
    id: 'g1',
    title: 'Weekly Team Planner',
    creator: 'Trello',
    description: 'Track weekly priorities, blockers, and completed items across your team.',
    category: 'Business',
    coverUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80',
    views: '24.5k',
    copies: '7.2k',
  },
  {
    id: 'g2',
    title: 'Design Sprint',
    creator: 'Atlassian',
    description: 'Run a five-day design sprint from discovery to prototype testing.',
    category: 'Design',
    coverUrl:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    views: '17.8k',
    copies: '5.1k',
  },
  {
    id: 'g3',
    title: 'Classroom Assignment Board',
    creator: 'Education Labs',
    description: 'Organize lessons, homework, and grading workflow by week.',
    category: 'Education',
    coverUrl:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    views: '12.2k',
    copies: '4.6k',
  },
  {
    id: 'g4',
    title: 'Software Sprint Planning',
    creator: 'Trello',
    description: 'Plan sprints with backlog grooming, in-progress work, and release tracking.',
    category: 'Engineering',
    coverUrl:
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1000&q=80',
    views: '29.3k',
    copies: '10.8k',
  },
  {
    id: 'g5',
    title: 'Campaign Planner',
    creator: 'Growth Guild',
    description: 'Manage campaign briefs, channels, and launch milestones in one place.',
    category: 'Marketing',
    coverUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    views: '15.6k',
    copies: '4.3k',
  },
  {
    id: 'g6',
    title: 'Employee Onboarding',
    creator: 'People Ops',
    description: 'Standardize onboarding tasks for HR, IT, and hiring managers.',
    category: 'Human Resources',
    coverUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
    views: '11.9k',
    copies: '3.7k',
  },
  {
    id: 'g7',
    title: 'Operations Playbook',
    creator: 'Ops Circle',
    description: 'Coordinate recurring operational tasks and critical incident checklists.',
    category: 'Operations',
    coverUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    views: '9.8k',
    copies: '2.9k',
  },
  {
    id: 'g8',
    title: 'Sales Pipeline Tracker',
    creator: 'RevOps Team',
    description: 'Move opportunities from prospecting to close with clear owner actions.',
    category: 'Sales CRM',
    coverUrl:
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=80',
    views: '18.7k',
    copies: '6.4k',
  },
]

export function TemplateGallery({ onGoHome }) {
  const [selectedCategory, setSelectedCategory] = useState('Popular')
  const [searchQuery, setSearchQuery] = useState('')

  const visibleTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return TEMPLATE_ITEMS.filter((template) => {
      const categoryMatch = selectedCategory === 'Popular' || template.category === selectedCategory
      if (!categoryMatch) {
        return false
      }
      if (!normalizedQuery) {
        return true
      }
      const haystack = `${template.title} ${template.creator} ${template.description}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="template-gallery-page">
      <aside className="template-gallery-sidebar">
        <div className="template-gallery-brand">
          <span>T</span>
          <strong>Template Gallery</strong>
        </div>
        <nav className="template-gallery-nav" aria-label="Template categories">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`template-gallery-nav-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
        <button type="button" className="template-gallery-home-btn" onClick={onGoHome}>
          Back to Home
        </button>
      </aside>

      <main className="template-gallery-content">
        <header className="template-gallery-toolbar">
          <h1>Templates</h1>
          <label className="template-gallery-search">
            <Search size={16} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search templates"
              aria-label="Search templates"
            />
          </label>
        </header>

        <section className="template-gallery-grid" aria-label="Template cards">
          {visibleTemplates.map((template) => (
            <article key={template.id} className="template-gallery-card">
              <img src={template.coverUrl} alt={template.title} className="template-gallery-cover" loading="lazy" />
              <div className="template-gallery-card-body">
                <h3>{template.title}</h3>
                <p className="template-gallery-creator">by {template.creator}</p>
                <p className="template-gallery-description">{template.description}</p>
                <div className="template-gallery-stats">
                  <span>
                    <Copy size={13} />
                    {template.copies}
                  </span>
                  <span>
                    <Eye size={13} />
                    {template.views}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
