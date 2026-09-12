import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Code, Database, GitBranch, Sparkles, Trash2, Workflow } from 'lucide-react'

const SKILL_CARDS = [
  {
    _id: 'skill-frontend',
    title: 'Frontend Web Development',
    category: 'HTML, CSS & JavaScript',
    description: 'Responsive landing pages and dynamic web apps built with clean semantic markup, modern CSS, and vanilla JavaScript.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind'],
    visual: <FrontendVisual />,
  },
  {
    _id: 'skill-mern',
    title: 'Full-Stack Web Applications',
    category: 'MongoDB, Express, React, Node.js',
    description: 'Scalable full-stack solutions with REST APIs, authentication, real-time features, and cloud deployment.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    visual: <FullStackVisual />,
  },
  {
    _id: 'skill-motion',
    title: 'Motion & UI Animation Showcase',
    category: 'Interactive Framer Motion & Canvas Showcase',
    description: 'Cinematic scroll-choreographed experiences with kinetic typography and self-contained interactive motion systems.',
    tags: ['Framer Motion', 'GSAP', 'Canvas', 'Animation'],
    visual: <MotionVisual />,
  },
]

function MotionMeshCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const points = Array.from({ length: 42 }, (_, index) => ({
      nx: (index % 7) / 6,
      ny: Math.floor(index / 7) / 5,
      phase: index * 0.42,
      amplitude: 0.035 + (index % 4) * 0.008,
      radius: 1.2 + (index % 3) * 0.45,
    }))

    let animationId
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)
      const seconds = time / 1000
      const positions = points.map((point) => ({
        x: width * (point.nx + Math.sin(seconds * 0.9 + point.phase) * point.amplitude),
        y: height * (point.ny + Math.cos(seconds * 0.75 + point.phase * 1.4) * point.amplitude),
        point,
      }))

      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const dx = positions[i].x - positions[j].x
          const dy = positions[i].y - positions[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < width * 0.24) {
            ctx.beginPath()
            ctx.moveTo(positions[i].x, positions[i].y)
            ctx.lineTo(positions[j].x, positions[j].y)
            ctx.strokeStyle = `rgba(124,92,255,${0.24 * (1 - distance / (width * 0.24))})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      positions.forEach(({ x, y, point }, index) => {
        const pulse = 0.65 + Math.sin(seconds * 2 + point.phase) * 0.35
        ctx.beginPath()
        ctx.arc(x, y, point.radius * pulse, 0, Math.PI * 2)
        ctx.fillStyle = index % 5 === 0 ? `rgba(0,240,255,${0.8 * pulse})` : `rgba(167,139,250,${0.72 * pulse})`
        ctx.shadowColor = index % 5 === 0 ? 'rgba(0,240,255,0.8)' : 'rgba(124,92,255,0.8)'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = window.requestAnimationFrame(draw)
    }

    resize()
    animationId = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label="Animated glowing mesh motion visual" />
}

function FrontendVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050508] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_7px_rgba(244,63,94,0.7)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_7px_rgba(251,191,36,0.7)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.7)]" />
        </div>
        <span className="text-[0.52rem] font-mono text-white/40">frontend-studio</span>
        <span className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-[0.48rem] font-mono text-cyan-300">main</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 bg-[#080a10] p-3 sm:border-b-0 sm:border-r">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.52rem] font-mono text-white/40">src / App.jsx</span>
            <span className="text-[0.48rem] text-emerald-300">saved</span>
          </div>
          <div className="space-y-1 font-mono text-[0.55rem] leading-5 text-white/65">
            <div><span className="w-3 inline-block text-right text-white/20">1</span> <span className="text-[#e7c793]">export default</span> <span className="text-cyan-300">function</span> <span className="text-white">App()</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">2</span> <span className="text-white/60">{'{'}</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">3</span> <span className="pl-2 text-[#e7c793]">&lt;main</span> <span className="text-cyan-300">className</span>=<span className="text-emerald-400">"surface"</span><span className="text-[#e7c793]">&gt;</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">4</span> <span className="pl-4 text-[#e7c793]">&lt;h1&gt;</span><span className="text-white">Make it tangible.</span><span className="text-[#e7c793]">&lt;/h1&gt;</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">5</span> <span className="pl-4 text-[#e7c793]">&lt;Button</span> <span className="text-cyan-300">tone</span>=<span className="text-emerald-400">"cyan"</span> <span className="text-[#e7c793]">{'/>'}</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">6</span> <span className="pl-2 text-[#e7c793]">&lt;/main&gt;</span></div>
            <div><span className="w-3 inline-block text-right text-white/20">7</span> <span className="text-white/60">{'}'}</span></div>
          </div>
          <div className="mt-3 flex gap-1.5">
            {['HTML5', 'CSS3', 'JS'].map((tag) => (
              <span key={tag} className="rounded border border-cyan-400/20 bg-cyan-400/[0.08] px-1.5 py-0.5 text-[0.48rem] font-mono text-cyan-300">{tag}</span>
            ))}
          </div>
        </div>

        <div className="bg-[#070910] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.52rem] font-mono text-white/40">preview / localhost</span>
            <span className="flex items-center gap-1 text-[0.48rem] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 60fps</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#090a12]">
            <div className="flex items-center justify-between border-b border-white/10 px-2.5 py-2">
              <span className="h-3 w-3 rounded bg-gradient-to-br from-cyan-300 to-cyan-600 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
              <div className="flex gap-1.5 text-[0.48rem] text-white/45"><span>Work</span><span className="text-cyan-300">Studio</span><span>Contact</span></div>
            </div>
            <div className="p-3">
              <div className="h-1.5 w-12 rounded bg-cyan-400/70 shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
              <div className="mt-2 h-2.5 w-4/5 rounded bg-white/80" />
              <div className="mt-1 h-2.5 w-2/3 rounded bg-white/35" />
              <div className="mt-3 h-6 w-20 rounded-md border border-cyan-300/50 bg-cyan-300/15 text-[0.48rem] leading-5 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]">Explore</div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((item) => <span key={item} className="h-8 rounded-md border border-white/10 bg-white/[0.05]" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FullStackVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050508] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <div className="flex items-center gap-2">
          <Workflow className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-[0.52rem] font-mono text-white/45">full-stack / live</span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.48rem] font-mono text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)]" />
          DB CONNECTED
        </div>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-[#080a10] p-2.5">
            <div className="flex items-center justify-between text-[0.5rem] text-white/45"><span>Requests</span><span className="font-mono text-cyan-300">1.8k</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.5)]" initial={{ width: '62%' }} animate={{ width: ['62%', '78%', '68%', '84%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} /></div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#080a10] p-2.5">
            <div className="flex items-center justify-between text-[0.5rem] text-white/45"><span>Latency</span><span className="font-mono text-[#e7c793]">24ms</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-[#e7c793] shadow-[0_0_8px_rgba(231,199,147,0.5)]" initial={{ width: '34%' }} animate={{ width: ['34%', '48%', '39%', '56%'] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} /></div>
          </div>
          <div className="rounded-lg border border-[#7c5cff]/20 bg-[#0a0714] p-2.5">
            <div className="flex items-center gap-1.5 text-[0.5rem] text-[#d8ccff]"><Database className="h-3 w-3" aria-hidden="true" /> MongoDB</div>
            <div className="mt-2 flex items-center justify-between text-[0.48rem] font-mono"><span className="text-emerald-300">● primary</span><span className="text-white/40">replica healthy</span></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-[#080a10] p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.5rem] text-white/45">Traffic / real-time</span>
              <span className="text-[0.48rem] font-mono text-cyan-300">LIVE</span>
            </div>
            <svg className="mt-2 h-20 w-full" viewBox="0 0 260 80" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="stack-chart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity="0.38" /><stop offset="100%" stopColor="#00f0ff" stopOpacity="0" /></linearGradient></defs>
              <path d="M0 68 C18 56 28 65 45 50 S75 30 96 42 S130 58 151 30 S190 20 212 34 S242 18 260 24 L260 80 L0 80 Z" fill="url(#stack-chart)" />
              <path d="M0 68 C18 56 28 65 45 50 S75 30 96 42 S130 58 151 30 S190 20 212 34 S242 18 260 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="151" cy="30" r="3" fill="#e7c793" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['API', '/users', '#00f0ff'],
              ['AUTH', '/token', '#e7c793'],
              ['DATA', '/events', '#7c5cff'],
            ].map(([label, route, color]) => (
              <div key={route} className="rounded-lg border border-white/10 bg-[#080a10] p-2">
                <span className="block text-[0.48rem] font-mono text-white/40">{label}</span>
                <span className="mt-1 block truncate text-[0.5rem] font-mono" style={{ color }}>{route}</span>
                <span className="mt-2 block h-1 w-full rounded-full bg-white/10"><span className="block h-full rounded-full bg-white/60" style={{ width: '72%', boxShadow: `0 0 7px ${color}` }} /></span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/10 bg-[#05070b] p-2.5 font-mono text-[0.5rem] leading-4 text-white/55">
            <div><span className="text-emerald-400">GET</span> <span className="text-cyan-300">/api/v1/projects</span> <span className="text-white/35">200 · 18ms</span></div>
            <div><span className="text-emerald-400">WS</span> <span className="text-[#7c5cff]">/realtime/events</span> <span className="text-white/35">open</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MotionVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#7c5cff]/25 bg-[#050508] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="relative h-44 overflow-hidden bg-[#070511]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,240,255,0.14),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(124,92,255,0.2),transparent_32%)]" />
        <MotionMeshCanvas />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050508] to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[0.48rem] font-mono text-white/60 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c5cff] shadow-[0_0_7px_rgba(124,92,255,0.9)]" />
          CANVAS / 60FPS
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7c5cff] shadow-[0_0_8px_rgba(124,92,255,0.8)]" />
          <span className="text-[0.52rem] font-mono text-white/55">motion-system / active</span>
        </div>
        <div className="flex gap-1.5">
          {['Framer', 'GSAP', 'Canvas'].map((tag) => <span key={tag} className="rounded border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-1.5 py-0.5 text-[0.48rem] font-mono text-[#c4b5fd]">{tag}</span>)}
        </div>
      </div>
    </div>
  )
}

function SkillCard({ card, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#0a0a10] p-5 backdrop-blur-2xl sm:p-6"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00f0ff]/15 via-transparent to-[#e7c793]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.12)]">
            <Code className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/50">Core discipline</span>
        </div>
        {card.visual}
        <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">{card.category}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => <li key={tag} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[0.6rem] font-medium text-cyan-300">{tag}</li>)}
        </ul>
      </div>
    </motion.article>
  )
}

function ProjectCard({ project, index, isAdmin, isManaged, onDelete }) {
  // Project ki apni image dikhate hain (admin panel se change ho sakti hai).
  const imageUrl =
    typeof project.imageUrl === 'string' && project.imageUrl.trim()
      ? project.imageUrl.trim()
      : ''
  const title = project.title || 'Untitled project'
  const tags = Array.isArray(project.tags) ? project.tags : []
  const liveUrl = typeof project.liveUrl === 'string' && project.liveUrl ? project.liveUrl : ''
  const [confirming, setConfirming] = useState(false)
  const [imageBroken, setImageBroken] = useState(false)

  const handleDeleteClick = useCallback(() => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    onDelete?.(project._id)
  }, [confirming, onDelete, project._id])

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a10] shadow-[0_18px_50px_rgba(0,0,0,0.32)]"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#7c5cff]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative p-3 sm:p-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#080a10]">
          {imageUrl && !imageBroken ? (
            <img
              src={imageUrl}
              alt={`${title} project preview`}
              loading="lazy"
              decoding="async"
              onError={() => setImageBroken(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#050508]">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
                No preview image
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[0.55rem] font-mono uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">{project.category || 'Live work'}</span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.5rem] font-mono uppercase tracking-wider text-emerald-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)]" />
            Deployed
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#e7c793]">{project.category || 'Custom Web'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {liveUrl ? (
              <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 transition-all duration-300 hover:bg-cyan-400/20 hover:shadow-[0_0_18px_rgba(0,240,255,0.35)]" aria-label={`Visit live site for ${title}`}>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {isAdmin && isManaged ? (
              <button type="button" onClick={handleDeleteClick} className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all duration-300 ${confirming ? 'border-rose-400/60 bg-rose-500/20 text-rose-300' : 'border-white/10 bg-white/5 text-white/60 hover:border-rose-400/40 hover:text-rose-300'}`} aria-label={confirming ? `Confirm delete ${title}` : `Delete ${title}`}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {confirming ? 'Confirm?' : <span className="hidden sm:inline">Delete</span>}
              </button>
            ) : null}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/70">{project.description || 'A production-ready digital experience from the Sky Code studio.'}</p>
        {liveUrl ? (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200">
            Visit Live Site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => <li key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-medium text-white/65">{tag}</li>)}
          </ul>
        ) : null}
      </div>
    </motion.article>
  )
}

export default function PortfolioGrid({ projects = [], isAdmin = false, loading = false, onDeleteProject }) {
  const hasProjects = Array.isArray(projects) && projects.length > 0
  // Sirf DB wale projects dikhते hain — deleted project kabhi wapas nahi aayega.
  const visibleProjects = projects

  return (
    <section id="portfolio" className="scroll-mt-24 bg-[var(--sky-band)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-gold)]">Selected Works</p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Engineering that outlasts trends</h2>
            <p className="mt-4 max-w-xl text-white/60">Three core disciplines, one obsessive standard — then a live gallery of work built to perform in the real world.</p>
          </div>
          {isAdmin ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Admin session active
            </span>
          ) : null}
        </motion.header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SKILL_CARDS.map((card, index) => <SkillCard key={card._id} card={card} index={index} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 scroll-mt-28"
          id="projects-gallery"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-cyan)]">Interactive Projects Gallery</p>
              <h3 className="text-3xl font-bold text-white sm:text-4xl">Live work, engineered for impact</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">A living showcase of production interfaces, commerce systems, and real-time products. Published projects stay in sync with the studio API.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/55">
              <GitBranch className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              {hasProjects ? `${projects.length} published` : 'No projects yet'}
            </span>
          </div>

          {loading && !hasProjects ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />)}
            </div>
          ) : !hasProjects ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-10 text-center">
              <p className="mx-auto w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-300">
                <Sparkles className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                Abhi koi project published nahi hai
              </p>
              <p className="mt-3 text-sm text-white/50">
                Admin panel se "Add My Work" dabakar pehla project publish karo — yahan turant dikh jayega.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project._id || project.title || index} project={project} index={index} isAdmin={isAdmin} isManaged={hasProjects} onDelete={onDeleteProject} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
