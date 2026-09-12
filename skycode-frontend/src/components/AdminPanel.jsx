// src/components/AdminPanel.jsx
/* ---------------------------------------------------------------------------
 * Sky Code — Admin Panel (separate page)
 * ---------------------------------------------------------------------------
 * Rendered as its own full page once the admin signs in. Three tabs:
 *   1. My Works     — add / remove portfolio projects
 *   2. Submissions  — everyone who selected a plan and submitted the form
 *   3. Settings     — edit the public contact details
 * ------------------------------------------------------------------------ */

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Building2,
  Inbox,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Pen,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
  Globe as GlobeIcon,
} from 'lucide-react'
import { AddProjectModal } from './AdminModals'
import {
  getLeads,
  getSettings,
  removeLead,
  updateAdminCredentials,
  updateSettings,
} from '../services/api'

const INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#00f0ff]/60 focus:shadow-[0_0_24px_rgba(0,240,255,0.18)]'

const SUBMIT_CLASS =
  'rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#36d5f2] to-[#0b8fb2] px-8 py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#03141c] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,240,255,0.45)] disabled:opacity-50'

const SUCCESS_CLASS =
  'rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300'

const ERROR_CLASS =
  'rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'

const TABS = [
  { id: 'works', label: 'My Works', icon: Briefcase },
  { id: 'submissions', label: 'Submissions', icon: Inbox },
  { id: 'settings', label: 'Settings', icon: Building2 },
]

const EMPTY_SETTINGS = { email: '', whatsapp: '', website: '', location: '' }

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function StatPill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/60">
      {label}
      <span className="text-[#00f0ff]">{value}</span>
    </span>
  )
}

function SubmissionsTab({ token }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  // Initial load — state updates happen inside the async callback.
  useEffect(() => {
    let alive = true
    getLeads(token).then((list) => {
      if (!alive) return
      setLeads(list)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [token])

  const refresh = useCallback(async () => {
    setLoading(true)
    const list = await getLeads(token)
    setLeads(list)
    setLoading(false)
  }, [token])

  const handleDelete = async (id) => {
    const result = await removeLead(id, token)
    if (result.success) {
      setLeads((prev) => prev.filter((lead) => lead._id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatPill label="Total" value={leads.length} />
          <StatPill
            label="New"
            value={leads.filter((lead) => lead.status === 'new').length}
          />
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/50">
          Loading submissions…
        </p>
      ) : leads.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/50">
          No plan submissions yet. Jab koi visitor plan select karke form submit karega,
          uski details yahan dikhengi.
        </p>
      ) : (
        leads.map((lead) => (
          <div
            key={lead._id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-white">{lead.name}</p>
                  <span className="rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#00f0ff]">
                    {lead.plan}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-white/60">
                    {lead.workType}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-white/60">
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5 text-[var(--sky-gold)]" aria-hidden="true" />
                    {lead.whatsapp}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[var(--sky-cyan)]" aria-hidden="true" />
                    {lead.email}
                  </p>
                  {lead.details ? (
                    <p className="flex items-start gap-2 text-white/50">
                      <Inbox className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {lead.details}
                    </p>
                  ) : null}
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(lead._id)}
                aria-label={`Delete submission from ${lead.name}`}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function SettingsTab({ token, settings, onSaved }) {
  const [draft, setDraft] = useState(settings)
  const [syncedSettings, setSyncedSettings] = useState(settings)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Sync the draft when fresh settings arrive from the server
  // (adjust-state-on-prop-change pattern, done during render).
  if (settings !== syncedSettings) {
    setSyncedSettings(settings)
    setDraft(settings)
  }

  const updateField = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage('')
    setError('')
    const result = await updateSettings(
      {
        email: draft.email.trim(),
        whatsapp: draft.whatsapp.trim(),
        website: draft.website.trim(),
        location: draft.location.trim(),
      },
      token,
    )
    setBusy(false)
    if (result && result.success && result.data) {
      setMessage('Contact details updated successfully.')
      onSaved(result.data)
    } else {
      setError((result && result.message) || 'Could not save settings.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <p className="text-sm text-white/50">
        Yahan se site par dikhne wali contact details change kar sakte hain.
      </p>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
        </span>
        <input
          value={draft.email}
          onChange={updateField('email')}
          type="email"
          placeholder="hello@skycode.studio"
          className={INPUT_CLASS}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          <Phone className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp Number
        </span>
        <input
          value={draft.whatsapp}
          onChange={updateField('whatsapp')}
          type="tel"
          placeholder="+91 98765 43210"
          className={INPUT_CLASS}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          <GlobeIcon className="h-3.5 w-3.5" aria-hidden="true" /> Website
        </span>
        <input
          value={draft.website}
          onChange={updateField('website')}
          placeholder="skycode.studio"
          className={INPUT_CLASS}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Location
        </span>
        <input
          value={draft.location}
          onChange={updateField('location')}
          placeholder="India"
          className={INPUT_CLASS}
        />
      </label>

      {message ? <p className={SUCCESS_CLASS}>{message}</p> : null}
      {error ? <p className={ERROR_CLASS}>{error}</p> : null}

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={SUBMIT_CLASS}
      >
        {busy ? 'Saving…' : 'Save Settings'}
      </motion.button>
    </form>
  )
}

function AdminCredentials({ token, admin, onUpdated }) {
  const [username, setUsername] = useState(admin?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const trimmedUser = username.trim().toLowerCase()
    const wantsPassword = newPassword.length > 0

    if (!currentPassword) {
      setError('Confirmation ke liye current password zaroori hai.')
      return
    }
    if (wantsPassword && newPassword.length < 6) {
      setError('Naya password kam se kam 6 characters ka hona chahiye.')
      return
    }
    if (wantsPassword && newPassword !== confirmPassword) {
      setError('Naya password aur confirm password match nahi kar rahe.')
      return
    }
    if (!trimmedUser && !wantsPassword) {
      setError('Kuch change nahi kiya — naya username ya naya password daalo.')
      return
    }

    setBusy(true)
    setMessage('')
    setError('')
    const result = await updateAdminCredentials(
      {
        currentPassword,
        newUsername: trimmedUser || undefined,
        newPassword: wantsPassword ? newPassword : undefined,
      },
      token,
    )
    setBusy(false)

    if (result && result.success && result.admin) {
      setMessage(
        `Login credentials update ho gaye — agli baar "${result.admin.username}" se login karna.`,
      )
      onUpdated?.(result.admin)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError((result && result.message) || 'Could not update credentials.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <p className="text-sm text-white/50">
        Admin page par aane ke liye login credentials — yahan se username aur password dono
        change kar sakte ho. Confirmation ke liye current password lena zaroori hai.
      </p>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          Username
        </span>
        <input
          value={username}
          onChange={(event) => {
            setUsername(event.target.value)
            setMessage('')
            setError('')
          }}
          placeholder="skycode_admin"
          autoComplete="username"
          className={INPUT_CLASS}
        />
        <span className="mt-1.5 block text-[0.6rem] text-white/30">
          Chhota (lowercase) rakho — login isi se hoga.
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
          Current Password <span className="text-rose-300">*</span>
        </span>
        <input
          value={currentPassword}
          onChange={(event) => {
            setCurrentPassword(event.target.value)
            setMessage('')
            setError('')
          }}
          type="password"
          placeholder="Abhi wala password"
          autoComplete="current-password"
          className={INPUT_CLASS}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">
            New Password
          </span>
          <input
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value)
              setMessage('')
              setError('')
            }}
            type="password"
            placeholder="Khaali chhodo to nahi badlega"
            autoComplete="new-password"
            className={INPUT_CLASS}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">
            Confirm New Password
          </span>
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            placeholder="Dobara wahi naya password"
            autoComplete="new-password"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      {message ? <p className={SUCCESS_CLASS}>{message}</p> : null}
      {error ? <p className={ERROR_CLASS}>{error}</p> : null}

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={SUBMIT_CLASS}
      >
        {busy ? 'Updating…' : 'Update Credentials'}
      </motion.button>
    </form>
  )
}

export default function AdminPanel({
  token,
  admin,
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onRefreshProjects,
  onAdminUpdated,
  onLogout,
  onBackToSite,
}) {
  const [activeTab, setActiveTab] = useState('works')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [settings, setSettings] = useState(EMPTY_SETTINGS)

  useEffect(() => {
    let alive = true
    getSettings().then((data) => {
      if (alive && data) {
        setSettings({
          email: data.email || '',
          whatsapp: data.whatsapp || '',
          website: data.website || '',
          location: data.location || '',
        })
      }
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050508] text-white antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0d14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-black/80 p-1 shadow-[0_0_14px_rgba(0,240,255,0.25)]">
              <img src="/logo.png" alt="Sky Code logo" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-[var(--sky-cyan)]">
                Admin Panel
              </p>
              <p className="text-sm font-semibold text-white">
                {admin?.username ? `@${admin.username}` : 'Sky Code Studio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToSite}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Back to Site
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition hover:border-rose-400/40 hover:text-rose-300"
            >
              <LogOut className="h-3 w-3" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 pb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                  active
                    ? 'border-[#00f0ff]/60 bg-[#00f0ff]/15 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.18)]'
                    : 'border-white/10 bg-white/5 text-white/55 hover:border-white/25 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {activeTab === 'works' ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">My Works</h1>
                <p className="mt-1 text-sm text-white/50">
                  Apne portfolio projects add, edit aur manage karo.
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => {
                  setEditingProject(null)
                  setIsAddOpen(true)
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#36d5f2] to-[#0b8fb2] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#03141c] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add My Work
              </motion.button>
            </div>

            {/* Project stats */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatPill label="Total Projects" value={projects.length} />
                {['Landing Page', 'E-Commerce', 'Custom Web', 'Dashboard', 'Health & Fitness'].map(
                  (category) => (
                    <StatPill
                      key={category}
                      label={category}
                      value={projects.filter((project) => project.category === category).length}
                    />
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={onRefreshProjects}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/50">
                  Koi project add nahi hua abhi. "Add My Work" button dabakar pehla project
                  publish karo.
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-white">{project.title}</p>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-white/60">
                          {project.category}
                        </span>
                      </div>
                      {project.description ? (
                        <p className="mt-1.5 text-sm text-white/50">{project.description}</p>
                      ) : null}
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-block font-mono text-[0.65rem] text-[var(--sky-cyan)] underline-offset-4 hover:underline"
                        >
                          {project.liveUrl}
                        </a>
                      ) : null}
                      {project.tags && project.tags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[0.6rem] text-white/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(project)
                          setIsAddOpen(true)
                        }}
                        aria-label={`Edit project ${project.title}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        <Pen className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(project._id)}
                        aria-label={`Delete project ${project.title}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : null}

        {activeTab === 'submissions' ? (
          <section className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Plan Submissions</h1>
              <p className="mt-1 text-sm text-white/50">
                Kisne konsa plan select kiya aur form submit kiya — sab yahan.
              </p>
            </div>
            <SubmissionsTab token={token} />
          </section>
        ) : null}

        {activeTab === 'settings' ? (
          <section className="space-y-10">
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="mt-1 text-sm text-white/50">
                Public contact details aur admin login credentials — dono yahan se manage karo.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--sky-cyan)]">
                Contact Details
              </h2>
              <SettingsTab
                token={token}
                settings={settings}
                onSaved={(data) =>
                  setSettings({
                    email: data.email || '',
                    whatsapp: data.whatsapp || '',
                    website: data.website || '',
                    location: data.location || '',
                  })
                }
              />
            </div>

            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--sky-gold)]">
                Admin Login Credentials
              </h2>
              <AdminCredentials token={token} admin={admin} onUpdated={onAdminUpdated} />
            </div>
          </section>
        ) : null}
      </main>

      <AddProjectModal
        key={editingProject?._id ?? 'new-project'}
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false)
          setEditingProject(null)
        }}
        project={editingProject}
        onSubmit={(payload) =>
          editingProject
            ? onEditProject(editingProject._id, payload)
            : onAddProject(payload)
        }
      />
    </div>
  )
}