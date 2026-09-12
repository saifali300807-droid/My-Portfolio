import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ChevronDown, ExternalLink, Sparkles } from 'lucide-react'

const HEADLINE_WORDS = [
  { text: 'Architectural', tone: 'ivory' },
  { text: 'Precision', tone: 'gold' },
  { text: 'in', tone: 'muted' },
  { text: 'Web', tone: 'cyan' },
  { text: 'Engineering', tone: 'ivory' },
]

const GLOW = {
  gold: {
    backgroundImage: 'linear-gradient(120deg, #f7ead2 0%, #e7c793 38%, #c8a468 72%, #f0dca8 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(0 0 20px rgba(231,199,147,0.5))',
  },
  cyan: {
    backgroundImage: 'linear-gradient(120deg, #9ff8ff 0%, #00f0ff 45%, #12b8d6 90%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(0 0 26px rgba(0,240,255,0.45))',
  },
  ivory: {
    color: '#f7f2ea',
    textShadow: '0 0 34px rgba(0,240,255,0.18)',
  },
  muted: {
    color: 'rgba(247,242,234,0.5)',
    fontStyle: 'italic',
  },
}

const WORD_VARIANTS = {
  hidden: { y: '120%', opacity: 0, filter: 'blur(8px)' },
  show: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
}

const HERO_STATS = [
  { value: '2+', label: 'Years Experience', fullLabel: '2+ Years Experience' },
  { value: '10+', label: 'Projects Completed', fullLabel: '10+ Projects Completed' },
  { value: '100%', label: 'Client Satisfaction', fullLabel: '100% Client Satisfaction' },
]

function MagneticButton({ href, variant = 'primary', icon: Icon, children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.25 })

  const handleMouseMove = (event) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.35)
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const isPrimary = variant === 'primary'

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileHover={{
        scale: 1.05,
        boxShadow: isPrimary ? '0 0 64px rgba(0,240,255,0.5)' : '0 0 44px rgba(231,199,147,0.4)',
      }}
      whileTap={{ scale: 0.96 }}
      className="group relative inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] transition-colors duration-300"
    >
      {isPrimary ? (
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#36d5f2] to-[#0b8fb2] text-[#03141c]" />
      ) : (
        <span className="absolute inset-0 rounded-full border border-white/15 bg-white/5 text-white/90 backdrop-blur-xl" />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 70%)' }}
      />
      {Icon ? <Icon className="relative z-10 h-4 w-4" aria-hidden="true" /> : null}
      <span className="relative z-10">{children}</span>
    </motion.a>
  )
}

function HeroParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const sizeRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = Array.from({ length: 82 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.55 + 0.25,
    }))

    let animationId
    let width = 0
    let height = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      sizeRef.current = { width, height }
    }

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }

    const handleTouchMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const touch = event.touches[0]
      if (touch) {
        mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
      }
    }

    const animate = () => {
      const currentSize = sizeRef.current
      ctx.clearRect(0, 0, currentSize.width, currentSize.height)
      const mouse = mouseRef.current

      particles.forEach((particle) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 160 && distance > 0) {
          particle.vx += (dx / distance) * 0.025
          particle.vy += (dy / distance) * 0.025
        }

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.99
        particle.vy *= 0.99

        if (particle.x < 0 || particle.x > currentSize.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > currentSize.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.alpha})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - distance / 110)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = window.requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />
}

export default function HeroSection({ className }) {
  return (
    <section
      id="top"
      className={`relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050508] ${className ?? ''}`}
    >
      <HeroParticleCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,240,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.18) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(0,240,255,0.18), transparent 55%), radial-gradient(circle at 50% 65%, rgba(124,92,255,0.16), transparent 55%)',
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/45" aria-hidden="true" />
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 0%, rgba(3,4,8,0.68) 68%, rgba(2,3,6,0.96) 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/85 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/95 to-transparent" aria-hidden="true" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.16), rgba(231,199,147,0.08) 45%, transparent 65%)' }}
        animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-20 mx-auto w-full max-w-6xl px-6 pt-36 pb-24 text-center sm:pt-36"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
      >
        <motion.p
          variants={WORD_VARIANTS}
          className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-white/70 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00f0ff]" aria-hidden="true" />
          Ultra-Luxury Web Agency
        </motion.p>

        <motion.h1
          className="flex flex-wrap items-baseline justify-center gap-x-[0.24em] text-[clamp(2.7rem,8vw,7.2rem)] font-bold leading-[1.02] tracking-[-0.03em]"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.085, delayChildren: 0.3 } } }}
        >
          {HEADLINE_WORDS.map((word, index) => (
            <span key={`${word.text}-${index}`} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span variants={WORD_VARIANTS} className="inline-block whitespace-nowrap" style={GLOW[word.tone]}>
                {word.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p variants={WORD_VARIANTS} className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          We build digital cathedrals for visionary brands — engineering first,
          motion second, obsidian standards throughout.
        </motion.p>

        <motion.div variants={WORD_VARIANTS} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton href="#portfolio" variant="primary" icon={ExternalLink}>
            View Portfolio
          </MagneticButton>
          <MagneticButton href="#pricing" variant="secondary" icon={Sparkles}>
            View Pricing
          </MagneticButton>
        </motion.div>

        <motion.dl
          variants={WORD_VARIANTS}
          className="mx-auto mt-16 flex w-full max-w-3xl flex-wrap items-stretch justify-center gap-4"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.fullLabel}
              className="flex min-w-[10rem] flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md sm:min-w-[12rem]"
            >
              <dt className="sr-only">{stat.fullLabel}</dt>
              <dd className="font-mono text-2xl font-bold text-white sm:text-3xl" style={{ textShadow: '0 0 24px rgba(0,240,255,0.35)' }}>
                {stat.value} <span className="text-base font-medium text-white/65 sm:text-lg">{stat.label}</span>
              </dd>
              <dd className="mt-1 h-px w-10 bg-gradient-to-r from-[#00f0ff] to-[#e7c793]" aria-hidden="true" />
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-white/50 transition-colors duration-300 hover:text-white"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-6 w-6" aria-hidden="true" />
      </motion.a>
    </section>
  )
}
