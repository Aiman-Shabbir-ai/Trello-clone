import { useState } from 'react'

export function AuthScreen({ onAuthenticate }) {
  const [mode, setMode] = useState('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const heading = mode === 'signin' ? 'Log in to continue' : 'Create your account'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password.trim()) {
      return
    }
    setIsSubmitting(true)
    try {
      await onAuthenticate({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: password.trim(),
        mode,
      })
    } catch (error) {
      setErrorMessage(error.message || 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="password-input-row">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-visibility-btn"
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              {isPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Continue' : 'Create account'}
        </button>
        {errorMessage ? <p className="auth-error-text">{errorMessage}</p> : null}
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
