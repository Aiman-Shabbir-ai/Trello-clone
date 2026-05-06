import { Building2, LayoutGrid, ShieldCheck, SquareKanban, X } from 'lucide-react'

const TEMPLATE_CARDS = [
  {
    id: 'it-service',
    title: 'IT service management',
    description: 'Handle incidents and support requests with prebuilt workflows.',
    appName: 'Jira Service Management',
    icon: ShieldCheck,
    tone: 'tone-indigo',
  },
  {
    id: 'legal-service',
    title: 'Legal service management',
    description: 'Track legal intake, approvals, and SLA-heavy legal tasks.',
    appName: 'Confluence',
    icon: Building2,
    tone: 'tone-slate',
  },
  {
    id: 'project-plan',
    title: 'Project plan',
    description: 'Plan releases and coordinate delivery milestones with teams.',
    appName: 'Jira',
    icon: LayoutGrid,
    tone: 'tone-violet',
  },
  {
    id: 'delivery-board',
    title: 'Delivery board',
    description: 'Organize sprint execution and cross-functional updates fast.',
    appName: 'Trello',
    icon: SquareKanban,
    tone: 'tone-blue',
  },
]

export function AppStoreModal({ onClose }) {
  return (
    <div className="app-store-overlay" role="presentation">
      <div className="app-store-modal" role="dialog" aria-modal="true" aria-label="Atlassian App store">
        <header className="app-store-header">
          <h2>Atlassian App store</h2>
          <button type="button" className="app-store-close" aria-label="Close app store" onClick={onClose}>
            <X size={16} />
          </button>
        </header>

        <section className="app-store-content">
          <h3>Recommended for your team</h3>
          <p>Get up and running quickly with templates that suit the way your team works.</p>

          <div className="app-store-grid">
            {TEMPLATE_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <article key={card.id} className="app-store-card">
                  <div className={`app-store-card-hero ${card.tone}`} />
                  <div className="app-store-card-body">
                    <h4>{card.title}</h4>
                    <p>{card.description}</p>
                    <div className="app-store-card-footer">
                      <span>
                        <Icon size={13} />
                        {card.appName}
                      </span>
                      <button type="button">Try template</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
