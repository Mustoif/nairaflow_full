import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

type RegisterPageProps = {
  onShowLogin: () => void
}

type RegisterErrors = {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage({ onShowLogin }: RegisterPageProps) {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const nextErrors: RegisterErrors = {}

    if (!fullName.trim()) {
      nextErrors.fullName = 'Enter your full name.'
    }

    if (!email.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Create a password.'
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.'
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await register({ fullName, email, password })
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to create your account. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card" aria-labelledby="register-heading">
        <div className="auth-heading">
          <p className="brand">NairaFlow</p>
          <h1 id="register-heading" className="heading-2">
            Create your account
          </h1>
          <p className="body-text">Start with a simple NairaFlow wallet profile.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="message message--error" role="alert">
              {formError}
            </p>
          )}

          <div>
            <label className="label" htmlFor="register-full-name">
              Full name
            </label>
            <input
              id="register-full-name"
              className="input"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'register-full-name-error' : undefined}
            />
            {errors.fullName && (
              <p id="register-full-name-error" className="field-error">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="register-email">
              Email address
            </label>
            <input
              id="register-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
            />
            {errors.email && (
              <p id="register-email-error" className="field-error">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'register-password-error' : undefined}
            />
            {errors.password && (
              <p id="register-password-error" className="field-error">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="register-confirm-password">
              Confirm password
            </label>
            <input
              id="register-confirm-password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? 'register-confirm-password-error' : undefined
              }
            />
            {errors.confirmPassword && (
              <p id="register-confirm-password-error" className="field-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer body-text">
          Already have an account?{' '}
          <button className="auth-link" type="button" onClick={onShowLogin}>
            Log in
          </button>
        </p>
      </section>
    </main>
  )
}
