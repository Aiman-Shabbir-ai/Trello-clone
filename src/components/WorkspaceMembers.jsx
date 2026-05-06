export function WorkspaceMembers() {
  const memberRows = [
    {
      id: 'm1',
      initials: 'AS',
      name: 'Ayman Shabir',
      username: '@aymanshabir44',
      lastActive: 'Last active 2m ago',
      boards: 7,
      role: 'Admin',
    },
  ]

  const memberTabs = [
    'Members (1)',
    'Single-board guests (0)',
    'Multi-board guests (0)',
    'Join requests (0)',
  ]

  return (
    <section className="workspace-members-view">
      <header className="workspace-members-header">
        <div>
          <h2>Collaborators (1/10)</h2>
          <p>Upgrade your Workspace plan to unlock advanced permissions and controls.</p>
        </div>
        <button type="button" className="members-upgrade-btn">
          Upgrade
        </button>
      </header>

      <nav className="members-tab-row" aria-label="Collaborator categories">
        {memberTabs.map((tab, index) => (
          <button key={tab} type="button" className={`members-tab ${index === 0 ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </nav>

      <div className="members-toolbar">
        <label htmlFor="workspace-member-filter" className="sr-only">
          Filter by name
        </label>
        <input id="workspace-member-filter" type="text" placeholder="Filter by name" />
        <button type="button" className="invite-members-btn">
          Invite Workspace members
        </button>
      </div>

      <div className="members-list-wrap">
        <div className="members-list-head">
          <span>Member</span>
          <span>Last active</span>
          <span>Boards</span>
          <span>Role</span>
        </div>
        {memberRows.map((member) => (
          <article key={member.id} className="member-row">
            <div className="member-identity">
              <span className="member-avatar">{member.initials}</span>
              <div>
                <strong>{member.name}</strong>
                <small>{member.username}</small>
              </div>
            </div>
            <p>{member.lastActive}</p>
            <p>{member.boards}</p>
            <label>
              <span className="sr-only">Role for {member.name}</span>
              <select defaultValue={member.role}>
                <option>Admin</option>
                <option>Member</option>
              </select>
            </label>
          </article>
        ))}
      </div>
    </section>
  )
}
