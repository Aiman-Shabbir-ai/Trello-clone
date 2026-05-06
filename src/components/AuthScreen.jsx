import { useState } from 'react'

export function AuthScreen({ onAuthenticate }) {
  const [mode, setMode] = useState('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const heading = mode === 'signin' ? 'Log in to continue' : 'Create your account'

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password.trim()) {
      return
    }
    onAuthenticate({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password.trim(),
      mode,
    })
  }

  return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-logo">Trello</p>
        <h1>{heading}</h1>
        {mode === 'signup' ? (
          <label>
            Full name
            <input
              type="text"
              placeholder="e.g. Ayman Shabir"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
        ) : null}
        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="auth-submit-btn">
          {mode === 'signin' ? 'Continue' : 'Create account'}
        </button>
        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => setMode((current) => (current === 'signin' ? 'signup' : 'signin'))}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </form>
    </main>
  )
}
