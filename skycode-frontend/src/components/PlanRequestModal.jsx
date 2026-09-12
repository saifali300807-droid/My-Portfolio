// src/components/PlanRequestModal.jsx
/* ---------------------------------------------------------------------------
 * Sky Code — Plan Request Modal
 * ---------------------------------------------------------------------------
 * Opens when a visitor clicks "Select Plan". Captures name, WhatsApp number,
 * email, the selected plan (pre-filled), what they want built (Website,
 * E-Commerce Website, Web Page, Others) and an optional details note.
 * Close (X) button sits at the top; Submit at the bottom.
 * ------------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, X } from 'lucide-react'
import { submitLead } from '../services/api'

const INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#00f0ff]/60 focus:shadow-[0_0_24px_rgba(0,240,255,0.18)]'

const SUBMIT_CLASS =
  'w-full rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#36d5f2] to-[#0b8fb2] py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#03141c] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,240,255,0.45)] disabled:opacity-50'

const ERROR_CLASS =
  'rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'

const WORK_TYPES = ['Website', 'E-Commerce Website', 'Web Page', 'Others']

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

const EMPTY_FORM = {
  name: '',
  whatsapp: '',
  email: '',
  workType: 'Website',
  details: '',
}

export default function PlanRequestModal({ open, planName, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Body scroll lock + Escape to close while open.
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

  const updateField = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleClose = () => {
    if (!busy) onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    if (!form.name.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setError('Please fill in your name, WhatsApp number and email.')
      return
    }

    setBusy(true)
    setError('')
    const result = await submitLead({
      name: form.name.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      plan: planName,
      workType: form.workType,
      details: form.details.trim(),
    })
    setBusy(false)

    if (result && result.success) {
      setSubmitted(true)
    } else {
      setError((result && result.message) || 'Could not send your request. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="plan-request-layer"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Plan request form"
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0d14]/90 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)' }}
            />

            {/* Header + Close button (top) */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00f0ff]">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </span>
                {submitted ? 'Request Sent' : 'Start Your Project'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close plan request form"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {submitted ? (
              <div className="space-y-5 py-4 text-center">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-semibold text-white">
                    Thanks, {form.name.split(' ')[0]}!
                  </p>
                  <p className="mt-1.5 text-sm text-white/60">
                    Your <span className="text-[#00f0ff]">{planName}</span> plan request is in.
                    We will reach out on WhatsApp / email within 24 hours.
                  </p>
                </div>
                <button type="button" onClick={onClose} className={SUBMIT_CLASS}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Name</span>
                  <input
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="Your full name"
                    autoFocus
                    className={INPUT_CLASS}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">WhatsApp Number</span>
                  <input
                    value={form.whatsapp}
                    onChange={updateField('whatsapp')}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={INPUT_CLASS}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Email ID</span>
                  <input
                    value={form.email}
                    onChange={updateField('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">Selected Plan</span>
                  <div className="flex items-center justify-between rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-4 py-3">
                    <span className="text-sm font-semibold text-[#00f0ff]">{planName}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
                      Locked
                    </span>
                  </div>
                </label>

                <div>
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">
                    What do you want built?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {WORK_TYPES.map((type) => {
                      const active = form.workType === type
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, workType: type }))}
                          aria-pressed={active}
                          className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-300 ${
                            active
                              ? 'border-[#00f0ff]/60 bg-[#00f0ff]/15 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.2)]'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.28em] text-white/45">
                    Details <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                  </span>
                  <textarea
                    value={form.details}
                    onChange={updateField('details')}
                    rows={3}
                    placeholder="Tell us a little about your project…"
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </label>

                {error ? <p className={ERROR_CLASS}>{error}</p> : null}

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={SUBMIT_CLASS}
                >
                  {busy ? 'Sending…' : 'Submit'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}