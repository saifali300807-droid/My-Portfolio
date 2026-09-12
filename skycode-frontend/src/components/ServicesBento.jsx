// src/components/ServicesBento.jsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gem, Layers, Sparkles, Zap } from 'lucide-react'

const TABS = ['All', 'Design', 'Motion', 'E-Commerce', 'Full-Stack']

const SERVICES = [
  {
    title: 'Landing Pages',
    category: 'Design',
    description: 'Conversion-obsessed landing pages — art-directed, lightning fast and engineered to make first impressions permanent.',
    icon: Sparkles,
    badge: 'Flagship',
    accent: 'from-[#00f0ff]/30 to-transparent',
    span: 'lg:col-span-2 lg:row-span-2',
    stack: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    title: 'Interactive Motion Websites',
    category: 'Motion',
    description: 'Scroll-choreographed, WebGL-accented experiences that respond to every gesture with cinematic precision.',
    icon: Zap,
    badge: 'Signature',
    accent: 'from-[#e7c793]/30 to-transparent',
    span: 'lg:col-span-1',
    stack: ['GSAP', 'Three.js', 'Lottie'],
  },
  {
    title: 'Custom E-Commerce Platforms',
    category: 'E-Commerce',
    description: 'Bespoke storefronts with headless commerce, seamless checkout flows and merchandising built to scale.',
    icon: Gem,
    badge: 'E-Commerce',
    accent: 'from-[#7c5cff]/30 to-transparent',
    span: 'lg:col-span-1',
    stack: ['Shopify', 'Stripe', 'Next.js'],
  },
  {
    title: 'Full-Stack Web Apps',
    category: 'Full-Stack',
    description: 'Resilient, secure web applications — real-time dashboards, client portals and API platforms engineered for scale.',
    icon: Layers,
    badge: 'Engineering',
    accent: 'from-[#00f0ff]/30 to-transparent',
    span: 'lg:col-span-2',
    stack: ['Node.js', 'GraphQL', 'PostgreSQL', 'AWS'],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } },
}
function BentoCard({ service }) {
  const Icon = service.icon

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0C] p-7 backdrop-blur-2xl ${service.span}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-400/0 transition-all duration-500 group-hover:border-cyan-400/40"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${service.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--sky-cyan)] transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.35)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[var(--sky-cyan)] opacity-0 transition-all duration-500 group-hover:opacity-100">
          {service.badge}
        </span>
      </div>

      <h3 className="relative z-10 mt-6 text-2xl font-semibold text-white">{service.title}</h3>
      <p className="relative z-10 mt-3 max-w-sm text-sm leading-relaxed text-white/60">{service.description}</p>

      <ul className="relative z-10 mt-6 flex flex-wrap gap-2">
        {service.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] text-white/60 transition-colors duration-500 group-hover:border-white/20 group-hover:text-white"
          >
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

export default function ServicesBento() {
  const [activeTab, setActiveTab] = useState('All')
  const visible = activeTab === 'All' ? SERVICES : SERVICES.filter((service) => service.category === activeTab)

  return (
    <section id="services" className="scroll-mt-24 bg-[var(--sky-band)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-cyan)]">Capabilities</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">An arsenal of precision disciplines</h2>
          <p className="mt-4 text-white/60">Four pillars, one obsessive standard — filter by discipline.</p>
        </motion.header>

        <div role="tablist" aria-label="Filter services by category" className="mb-10 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? 'text-[#03141c]'
                    : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="bento-tab-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0bb8d4]"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                ) : null}
                <span className="relative z-10">{tab}</span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((service) => (
              <BentoCard key={service.title} service={service} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
