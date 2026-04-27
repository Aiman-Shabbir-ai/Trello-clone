import './Badge.css'

export function Badge({ label, tone }) {
  return <span className={`badge badge-${tone}`}>{label}</span>
}
