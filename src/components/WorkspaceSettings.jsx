export function WorkspaceSettings() {
  const settingRows = [
    {
      id: 's1',
      title: 'Workspace membership restrictions',
      description: 'Control who can invite members and guests into this Workspace.',
      actionLabel: 'Upgrade',
      actionTone: 'upgrade',
    },
    {
      id: 's2',
      title: 'Board creation restrictions',
      description: 'Decide who can create or move boards into this Workspace.',
      actionLabel: 'Change',
      actionTone: 'change',
    },
    {
      id: 's3',
      title: 'Workspace deletion restrictions',
      description: 'Require admin approval before deleting Workspace resources.',
      actionLabel: 'Upgrade',
      actionTone: 'upgrade',
    },
  ]

  return (
    <section className="workspace-settings-view">
      <header className="workspace-settings-header">
        <span className="workspace-settings-badge">T</span>
        <div>
          <h2>Workspace settings</h2>
          <p>Trello Workspace</p>
        </div>
      </header>

      <article className="workspace-settings-card">
        <div>
          <h3>Workspace visibility</h3>
          <p>Private - this Workspace is visible only to invited members.</p>
        </div>
        <button type="button" className="settings-change-btn">
          Change
        </button>
      </article>

      <article className="workspace-settings-card">
        <div>
          <h3>Slack workspaces linking</h3>
          <p>Connect Slack to receive updates and notifications where your team works.</p>
        </div>
        <button type="button" className="settings-slack-btn">
          Add to Slack
        </button>
      </article>

      <section className="workspace-restrictions-card">
        <h3>Restrictions</h3>
        <div className="workspace-restrictions-list">
          {settingRows.map((row) => (
            <article key={row.id} className="workspace-restriction-row">
              <div>
                <strong>{row.title}</strong>
                <p>{row.description}</p>
              </div>
              <button
                type="button"
                className={`settings-row-action ${row.actionTone === 'upgrade' ? 'upgrade' : 'change'}`}
              >
                {row.actionLabel}
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
