// src/components/Navbar.jsx
/* ---------------------------------------------------------------------------
 * Sky Code — Floating Glassmorphism Navbar (Dark Only)
 * ---------------------------------------------------------------------------
 * • Glowing circular logo frame with exact neon spec.
 * • Anchor links only — no theme switcher.
 * • Full mobile drawer with spring motion.
 * ------------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const DRAWER_VARIANTS = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
}

export default function Navbar({ className }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeDrawer = () => setOpen(false)

  return (
    <header className={`fixed inset-x-0 top-4 z-50 px-4 sm:px-6 ${className ?? ''}`}>
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0A0A0C]/80 py-2 pl-3 pr-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:pl-4 sm:pr-6">
        <a href="#top" className="flex shrink-0 items-center gap-3.5" aria-label="Sky Code — home">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-400 bg-black shadow-[0_0_15px_rgba(0,240,255,0.6)] p-1">
            <img src="logo.png" alt="Sky Code logo" className="h-full w-full object-contain" />
          </span>
          <span className="hidden text-base font-semibold tracking-[0.38em] text-white lg:inline">SKY CODE</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="group relative rounded-full px-4 py-2 text-sm text-white/60 transition-colors duration-300 hover:text-white">
                {label}
                <span className="absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-[#00f0ff] to-[#e7c793] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="skycode-mobile-drawer"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="mobile-overlay"
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
              aria-hidden="true"
            />
            <motion.div
              key="mobile-drawer"
              id="skycode-mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,20rem)] flex-col border-l border-white/10 bg-[#0A0A0C] px-6 py-6 shadow-2xl backdrop-blur-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-full border-2 border-cyan-400 bg-black shadow-[0_0_15px_rgba(0,240,255,0.6)] p-1">
                  <img src="logo.png" alt="Sky Code logo" className="h-9 w-9 object-contain" />
                </span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-10 flex flex-col gap-2">
                {NAV_LINKS.map(({ label, href }, index) => (
                  <motion.li
                    key={href}
                    variants={DRAWER_VARIANTS}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.1 + index * 0.07, duration: 0.4, ease: 'easeOut' }}
                  >
                    <a
                      href={href}
                      onClick={closeDrawer}
                      className="block rounded-xl px-4 py-3 text-lg text-white/60 transition duration-300 hover:bg-white/5 hover:text-white"
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
