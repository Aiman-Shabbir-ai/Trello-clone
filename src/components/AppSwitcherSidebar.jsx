import {
  Building2,
  Compass,
  Goal,
  Home,
  LayoutGrid,
  MoreHorizontal,
  Settings,
  Shield,
  Sparkles,
  SquareKanban,
  Users,
} from 'lucide-react'

const PRIMARY_APPS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'jira', label: 'Jira', icon: Compass },
  { id: 'trello', label: 'Trello', icon: SquareKanban },
  { id: 'goals', label: 'Goals', icon: Goal },
  { id: 'projects', label: 'Projects', icon: LayoutGrid },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'administration', label: 'Administration', icon: Shield },
]

const RECOMMENDED_APPS = [
  {
    id: 'jsm',
    title: 'Jira Service Management',
    description: 'Manage requests, incidents, and operations in one place.',
    icon: Settings,
  },
  {
    id: 'jpd',
    title: 'Jira Product Discovery',
    description: 'Prioritize ideas and align roadmaps with outcomes.',
    icon: Sparkles,
  },
  {
    id: 'confluence',
    title: 'Confluence',
    description: 'Create docs and shared knowledge spaces for your team.',
    icon: Building2,
  },
  {
    id: 'more-apps',
    title: 'More Atlassian apps',
    description: 'Explore templates and additional tools for every workflow.',
    icon: LayoutGrid,
  },
]

export function AppSwitcherSidebar({ onOpenAppStore }) {
  return (
    <aside className="app-switcher-menu">
      <div className="app-switcher-primary">
        {PRIMARY_APPS.map((app) => {
          const Icon = app.icon
          return (
            <button key={app.id} type="button" className="app-switcher-item">
              <Icon size={16} />
              <span>{app.label}</span>
            </button>
          )
        })}
      </div>

      <div className="app-switcher-recommended">
        <p>Recommended for your team</p>
        {RECOMMENDED_APPS.map((app) => {
          const Icon = app.icon
          const isMoreApps = app.id === 'more-apps'
          return (
            <button
              key={app.id}
              type="button"
              className="app-switcher-reco-item"
              onClick={isMoreApps ? onOpenAppStore : undefined}
            >
              <span className="app-switcher-reco-icon">
                <Icon size={16} />
              </span>
              <span className="app-switcher-reco-copy">
                <strong>{app.title}</strong>
                <small>{app.description}</small>
              </span>
              <span className="app-switcher-more">
                <MoreHorizontal size={15} />
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
