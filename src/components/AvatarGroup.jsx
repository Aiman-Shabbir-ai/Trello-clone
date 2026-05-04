import './AvatarGroup.css'

export function AvatarGroup({ users = [] }) {
  return (
    <div className="avatar-group">
      {(users ?? []).map((user) => (
        <img key={user.id} className="avatar" src={user.avatar} alt={user.name} title={user.name} />
      ))}
    </div>
  )
}
