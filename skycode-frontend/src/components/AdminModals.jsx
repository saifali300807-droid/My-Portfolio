// src/components/AdminModals.jsx
/* ---------------------------------------------------------------------------
 * Sky Code — Admin Modals
 * ---------------------------------------------------------------------------
 * LoginModal + AddProjectModal, both wrapped in AnimatePresence for smooth
 * entrance/exit. Glassmorphic panels with glowing cyan focus states, inline
 * error handling, password reveal, and a category select bound to the
 * backend's project schema (Landing Page / E-Commerce / Custom Web).
 * ------------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Pen, Plus, X } from 'lucide-react'

const INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#00f0ff]/60 focus:shadow-[0_0_24px_rgba(0,240,255,0.18)]'

const ERROR_CLASS =
  'rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'

const CATEGORIES = ['Landing Page', 'E-Commerce', 'Custom Web', 'Dashboard', 'Health & Fitness']

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 14, transition: { duration: 0.22, ease: 'easeIn' } },
}
/* ---------------------------------------------------------------------------
 * ModalShell — shared glassmorphic dialog chrome.
 * Handles AnimatePresence mount/unmount, Escape-to-close and body scroll lock.
 * ------------------------------------------------------------------------- */
function ModalShell({ open, onClose, label, icon: Icon, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="admin-modal-layer"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d14]/90 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
          >
            {/* Glowing cyan top hairline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)' }}
            />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00f0ff]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${label}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

const SUBMIT_CLASS =
  'w-full rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#36d5f2] to-[#0b8fb2] py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#03141c] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,240,255,0.45)] disabled:opacity-50'
/* ---------------------------------------------------------------------------
 * LoginModal — admin authentication with password reveal + inline errors.
 * ------------------------------------------------------------------------- */
export function LoginModal({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setError('')
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const result = await onLogin({ username, password })
    setBusy(false)
    if (!result || !result.success) {
      setError(
        (result && result.message) ||
          'Sign-in failed — check your credentials or the server connection.',
      )
    }
  }

  return (
    <ModalShell open={open} onClose={handleClose} label="Admin login" icon={Lock} title="Admin Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder="admin"
            autoFocus
            className={INPUT_CLASS}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${INPUT_CLASS} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors duration-300 hover:text-[#00f0ff]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </label>

        {error ? <p className={ERROR_CLASS}>{error}</p> : null}

        <motion.button
          type="submit"
          disabled={busy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={SUBMIT_CLASS}
        >
          {busy ? 'Authenticating…' : 'Enter Studio'}
        </motion.button>
      </form>
    </ModalShell>
  )
}
/* ---------------------------------------------------------------------------
 * AddProjectModal — publish form (title, category, description, liveLink,
 * imageUrl, tags). Maps `liveLink` → the API's `liveUrl` field.
 * ------------------------------------------------------------------------- */
const EMPTY_DRAFT = { title: '', category: CATEGORIES[0], description: '', liveLink: '', imageUrl: '', tags: '' }

/** Maps an existing project object into the modal's draft shape. */
function draftFromProject(project) {
  return {
    title: project.title || '',
    category: CATEGORIES.includes(project.category) ? project.category : CATEGORIES[0],
    description: project.description || '',
    liveLink: project.liveUrl || '',
    imageUrl: project.imageUrl || '',
    tags: (project.tags || []).join(', '),
  }
}

export function AddProjectModal({ open, onClose, onSubmit, project }) {
  const isEdit = Boolean(project)
  const [draft, setDraft] = useState(() => (project ? draftFromProject(project) : EMPTY_DRAFT))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState(false)

  const updateField = (field) => (event) => {
    const { value } = event.target
    setDraft((prev) => ({ ...prev, [field]: value }))
    if (field === 'imageUrl') setImageError(false)
  }

  const handleClose = () => {
    setDraft(project ? draftFromProject(project) : EMPTY_DRAFT)
    setError('')
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = draft.title.trim()
    if (busy || !title) return
    setBusy(true)
    setError('')
    const result = await onSubmit({
      title,
      category: draft.category,
      description: draft.description.trim(),
      liveUrl: draft.liveLink.trim(),
      imageUrl: draft.imageUrl.trim(),
      tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    })
    setBusy(false)
    if (result && result.success) {
      handleClose()
    } else {
      setError((result && result.message) || (isEdit ? 'Could not save the project.' : 'Could not publish the project.'))
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      label={isEdit ? 'Edit project' : 'Add project'}
      icon={isEdit ? Pen : Plus}
      title={isEdit ? 'Edit Project' : 'Publish Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Title</span>
          <input value={draft.title} onChange={updateField('title')} placeholder="Obsidian Finance" className={INPUT_CLASS} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Category</span>
          <select
            value={draft.category}
            onChange={updateField('category')}
            className={`${INPUT_CLASS} appearance-none`}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category} className="bg-[#0b0d14] text-white">
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Description</span>
          <textarea
            value={draft.description}
            onChange={updateField('description')}
            rows={3}
            placeholder="A private wealth platform engineered for the discerning few."
            className={`${INPUT_CLASS} resize-none`}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Live Link</span>
          <input
            value={draft.liveLink}
            onChange={updateField('liveLink')}
            type="url"
            placeholder="https://obsidian.finance"
            className={INPUT_CLASS}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Image URL</span>
          <input
            value={draft.imageUrl}
            onChange={updateField('imageUrl')}
            type="url"
            placeholder="https://cdn.example.com/cover.png"
            className={INPUT_CLASS}
          />
          <span className="mt-1.5 block text-[0.6rem] text-white/30">
            Direct image link chahiye (.jpg / .png / .webp) — Google share ya Drive page link kaam nahi karega.
          </span>
        </label>

        {draft.imageUrl.trim() ? (
          <div>
            <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Image Preview</span>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img
                src={draft.imageUrl.trim()}
                alt="Project image preview"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            </div>
            {imageError ? (
              <p className={ERROR_CLASS}>
                Ye link direct image nahi hai — load nahi ho raha. Image par right-click karke
                "Copy image address" wala direct link use karo (.jpg / .png / .webp). Google ke
                share.google links sirf web page hote hain, image nahi.
              </p>
            ) : null}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Tags</span>
          <input
            value={draft.tags}
            onChange={updateField('tags')}
            placeholder="React, Node.js, WebGL"
            className={INPUT_CLASS}
          />
          <span className="mt-1.5 block text-[0.6rem] text-white/30">Comma separated — optional</span>
        </label>

        {error ? <p className={ERROR_CLASS}>{error}</p> : null}

        <motion.button
          type="submit"
          disabled={busy || draft.title.trim().length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={SUBMIT_CLASS}
        >
          {busy ? (isEdit ? 'Saving…' : 'Publishing…') : isEdit ? 'Save Changes' : 'Publish Project'}
        </motion.button>
      </form>
    </ModalShell>
  )
}