import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

function splitName(fullName: string) {
  const cleanName = fullName.trim()
  const [firstName, ...remainingNames] = cleanName.split(/\s+/)

  return {
    firstName: firstName ?? '',
    lastName: remainingNames.join(' '),
  }
}

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const successTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (user) {
      const names = splitName(user.fullName)
      setFirstName(names.firstName)
      setLastName(names.lastName)
    }
  }, [user])

  useEffect(() => {
    if (successMessage) {
      successTimeoutRef.current = window.setTimeout(() => setSuccessMessage(''), 5000)
    }
    return () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current)
    }
  }, [successMessage])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!firstName.trim()) {
      setError('First name is required.')
      return
    }

    if (!lastName.trim()) {
      setError('Last name is required.')
      return
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('Names must be at least 2 characters long.')
      return
    }

    setIsSaving(true)

    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() })
      setSuccessMessage('Profile updated successfully.')
    } catch (profileError) {
      setError(
        profileError instanceof Error ? profileError.message : 'Unable to update your profile. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  return (
    <section id="profile" className="profile-page" aria-labelledby="profile-heading">
      <div className="profile-header">
        <div>
          <h1 id="profile-heading" className="heading-1">
            Profile
          </h1>
          <p className="body-text">Manage your account details.</p>
        </div>
      </div>

      {successMessage && (
        <p className="message message--success" role="status">
          {successMessage}
        </p>
      )}

      <div className="profile-grid">
        <section className="card profile-summary" aria-label="Account overview">
          <h2 className="heading-3">Account information</h2>
          <dl className="profile-info-list">
            <div>
              <dt>First name</dt>
              <dd>{firstName || 'Not set'}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{lastName || 'Not set'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Account Number</dt>
              <dd>{user.accountNumber}</dd>
            </div>
          </dl>
        </section>

        <form className="card profile-form" onSubmit={handleSubmit} noValidate>
          <h2 className="heading-3">Edit profile</h2>

          <div>
            <label className="label" htmlFor="profile-first-name">
              First name
            </label>
            <input
              id="profile-first-name"
              className="input"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="profile-last-name">
              Last name
            </label>
            <input
              id="profile-last-name"
              className="input"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="profile-email">
              Email address
            </label>
            <input id="profile-email" className="input" type="email" value={user.email} disabled />
            <p className="field-hint">Email address cannot be changed.</p>
          </div>

          {error && (
            <p className="message message--error" role="alert">
              {error}
            </p>
          )}

          <div className="profile-actions">
            <button className="button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      <section className="card settings-card" aria-label="Settings">
        <h2 className="heading-3">Settings</h2>
        <div className="settings-row">
          <div>
            <p className="label-like">Notifications</p>
            <p className="body-text">Email updates for wallet activity.</p>
          </div>
          <span className="settings-badge">On</span>
        </div>
        <button className="button button--secondary" type="button" onClick={logout}>
          Log out
        </button>
      </section>
    </section>
  )
}
