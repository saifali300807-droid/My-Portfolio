// src/components/Footer.jsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe, Lock, Mail, Phone, Send, Terminal } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'What does a typical engagement look like?',
    a: 'Discovery, a focused design sprint, engineering, then a choreographed launch. Most builds run four to ten weeks depending on scope, with weekly demos so you see the work evolve in real time.',
  },
  {
    q: 'Which technologies do you build with?',
    a: 'React and Next.js on the front, Node.js with GraphQL and PostgreSQL behind, deployed on AWS or Vercel. Motion work runs through Framer Motion, GSAP and Three.js — always chosen for longevity, not novelty.',
  },
  {
    q: 'Do you build custom e-commerce platforms?',
    a: 'Yes — headless storefronts on Shopify or bespoke commerce engines with Stripe checkout, merchandising tools and analytics wired in from day one.',
  },
  {
    q: 'How do you handle pricing and timelines?',
    a: 'Fixed-scope milestones with transparent quotes. No hourly ambiguity — you approve a plan, we ship against it, and every milestone lands with something real to click.',
  },
  {
    q: 'Do you offer support after launch?',
    a: 'Every launch includes a 30-day polish window. Beyond that, retainers cover monitoring, iteration and feature drops under a documented SLA.',
  },
]
function FaqItem({ item, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0C] backdrop-blur-xl transition-colors duration-500 hover:border-cyan-400/30">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-medium text-white">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
            open
              ? 'border-cyan-400/50 text-cyan-400'
              : 'border-white/10 text-white/60'
          }`}
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">{item.a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
const EMPTY_MESSAGE = { name: '', email: '', message: '' }

/** Builds a wa.me deep link — digits only, message pre-encoded. */
function whatsappLink(number, text) {
  const digits = (number || '').replace(/[^\d]/g, '')
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

function TerminalContact({ whatsapp }) {
  const [message, setMessage] = useState(EMPTY_MESSAGE)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const updateField = (field) => (event) => {
    setMessage((prev) => ({ ...prev, [field]: event.target.value }))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    if (!message.name.trim() || !message.email.trim() || !message.message.trim()) {
      setError('all fields are required before transmission.')
      setStatus('error')
      return
    }

    // Professional WhatsApp transmission — studio ke configured number par.
    // Emojis explicit Unicode code points se bante hain taaki WhatsApp par
    // reliably render ho (file/URL encoding se independent).
    const eSparkles = String.fromCodePoint(0x2728)
    const eWave = String.fromCodePoint(0x1f44b)
    const ePerson = String.fromCodePoint(0x1f464)
    const eEmail = String.fromCodePoint(0x1f4e7)
    const eSpeech = String.fromCodePoint(0x1f4ac)
    const eRocket = String.fromCodePoint(0x1f680)
    const divider = String.fromCodePoint(0x2501).repeat(18)

    const text = [
      `${eSparkles} *NEW PROJECT INQUIRY* ${eSparkles}`,
      '_Sky Code — Website Inquiry_',
      divider,
      `Hello Sky Code Studio! ${eWave}`,
      'I visited your website and would love to start a project with you.',
      divider,
      `${ePerson} *Name:* ${message.name.trim()}`,
      `${eEmail} *Email:* ${message.email.trim()}`,
      divider,
      `${eSpeech} *My Message:*`,
      message.message.trim(),
      divider,
      `_Sent from skycode website — awaiting your reply._ ${eRocket}`,
    ].join('\n')

    const link = whatsappLink(whatsapp, text)
    if (!link) {
      setError('WhatsApp number is not configured yet — add it in admin settings.')
      setStatus('error')
      return
    }

    setStatus('sending')
    await new Promise((resolve) => setTimeout(resolve, 600))
    window.open(link, '_blank', 'noopener,noreferrer')
    setStatus('sent')
    setMessage(EMPTY_MESSAGE)
  }

  const fieldClass =
    'w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-emerald-300 outline-none transition placeholder:text-white/25 focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)]'

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0C] font-mono shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" aria-hidden="true" />
        <span className="ml-3 text-xs text-white/40">guest@skycode — ~/contact</span>
      </div>

      <div className="space-y-3 p-6 text-sm">
        <p className="text-cyan-400">$ skycode --init contact --secure</p>
        <p className="text-emerald-400">[ok] secure channel established — awaiting transmission</p>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-white/40">guest@skycode:~$</span>
              <input
                value={message.name}
                onChange={updateField('name')}
                placeholder="name"
                autoComplete="name"
                aria-label="Your name"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-white/40">&gt;</span>
              <input
                type="email"
                value={message.email}
                onChange={updateField('email')}
                placeholder="email"
                autoComplete="email"
                aria-label="Your email"
                className={fieldClass}
              />
            </label>
          </div>
          <label className="block">
            <textarea
              value={message.message}
              onChange={updateField('message')}
              rows={4}
              placeholder="describe the mission…"
              aria-label="Your message"
              className={`${fieldClass} resize-none`}
            />
          </label>

          {error ? <p className="text-rose-400">[error] {error}</p> : null}
          {status === 'sent' ? (
            <p className="text-emerald-400">[ok] transmission sent to WhatsApp — WhatsApp chat opened, message deliver karo.</p>
          ) : null}

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300 transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(0,240,255,0.35)] disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            {status === 'sending' ? './transmit --running' : './transmit --now'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--sky-band)] py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-gold)]"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            Answers, before you ask
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-md text-white/60"
          >
            Straight answers from the studio — no sales page, just signal.
          </motion.p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === index}
              onToggle={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Footer({ onAdminOpen, contact, className }) {
  const email = contact?.email || 'hello@skycode.studio'
  const website = contact?.website || 'skycode.studio'
  const whatsapp = contact?.whatsapp || ''

  return (
    <>
      <FaqSection />

      <section id="contact" className="scroll-mt-24 bg-[var(--sky-band)] py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-cyan)]">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" /> Contact
            </p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Start a transmission
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Open a secure channel and the studio replies within 24 hours.
              Bring an ambition; we will bring the engineering.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/60">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--sky-cyan)]" aria-hidden="true" />
                {email}
              </p>
              {whatsapp ? (
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[var(--sky-cyan)]" aria-hidden="true" />
                  {whatsapp}
                </p>
              ) : null}
              <p className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[var(--sky-gold)]" aria-hidden="true" />
                {website}
              </p>
            </div>
          </div>

          <TerminalContact whatsapp={whatsapp} />
        </div>
      </section>

      <footer className={`border-t border-white/10 bg-[var(--sky-band)] py-10 ${className ?? ''}`}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-black/80 p-1 shadow-[0_0_14px_rgba(0,240,255,0.25)]">
              <img src="/logo.png" alt="Sky Code logo" className="h-7 w-7 object-contain" />
            </span>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
              © {new Date().getFullYear()} Sky Code — Obsidian by design
            </p>
          </div>

          <button
            type="button"
            onClick={onAdminOpen}
            aria-label="Open admin portal"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(0,240,255,0.2)]"
          >
            <Lock className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            Admin Portal
          </button>
        </div>
      </footer>
    </>
  )
}
