import { motion } from 'framer-motion'
import { CheckCircle2, Globe, Sparkles, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import PlanRequestModal from './PlanRequestModal'

/* =========================================================
   MEDIA
   ---------------------------------------------------------
   Put these files inside:

   public/
   ├── images/
   │   └── keyboard.jpg
   │
   └── videos/
       ├── keyboard.mp4
       └── keyboard-3d.mp4
   ========================================================= */

const KEYBOARD_IMAGE = '/images/keyboard.jpg'
const KEYBOARD_VIDEO = '/videos/keyboard.mp4'
const KEYBOARD_3D_VIDEO = '/videos/keyboard-3d.mp4'

const FALLBACK_KEYBOARD =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90'


/* =========================================================
   SMART IMAGE
   ========================================================= */

function SmartImage({
  src,
  fallback = FALLBACK_KEYBOARD,
  alt = '',
  className = '',
}) {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback)
        }
      }}
    />
  )
}


/* =========================================================
   SMART VIDEO
   ---------------------------------------------------------
   - autoplay
   - loop
   - muted
   - no controls
   - automatic play retry
   - poster fallback
   ========================================================= */

function SmartVideo({
  src,
  poster = FALLBACK_KEYBOARD,
  className = '',
}) {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    video.muted = true
    video.loop = true
    video.playsInline = true

    const startVideo = async () => {
      try {
        await video.play()
      } catch {
        // Browser autoplay restriction
      }
    }

    startVideo()
  }, [src])

  if (videoError) {
    return (
      <div
        className={className}
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      onError={() => setVideoError(true)}
      onLoadedData={(event) => {
        event.currentTarget.muted = true
        event.currentTarget.play().catch(() => {})
      }}
    />
  )
}


/* =========================================================
   COMMON PREVIEW NAVBAR
   ---------------------------------------------------------
   Same navbar on all 3 cards
   ========================================================= */

function PreviewNavbar({ accent = '#00f0ff' }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 rounded-md"
          style={{
            background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.55))`,
            boxShadow: `0 0 14px ${accent}99`,
          }}
        />

        <span
          className="text-[0.55rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          SKY CODE
        </span>
      </div>

      <div className="flex gap-2.5 text-[0.48rem] text-white/45">
        <span>Work</span>

        <span style={{ color: accent }}>
          Studio
        </span>

        <span>Contact</span>
      </div>
    </div>
  )
}


/* =========================================================
   PREVIEW SHELL
   ========================================================= */

function PreviewShell({
  accent,
  label,
  children,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07080d] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(
              circle at 15% 10%,
              ${accent}26,
              transparent 35%
            ),
            radial-gradient(
              circle at 90% 90%,
              ${accent}14,
              transparent 42%
            ),
            linear-gradient(
              135deg,
              rgba(255,255,255,0.045),
              transparent 48%
            )
          `,
        }}
      />

      <div className="relative">
        {/* Browser top bar */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />

          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />

          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />

          <span className="ml-2 truncate rounded-md border border-white/10 bg-black/30 px-2 py-0.5 text-[0.52rem] font-mono text-white/45">
            skycode.studio/{label}
          </span>

          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[0.5rem] font-mono uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)]" />
            Live
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}


/* =========================================================
   BASIC PREVIEW
   ========================================================= */

function BasicPreview() {
  return (
    <PreviewShell
      accent="#00f0ff"
      label="basic"
    >
      <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-black">
        <PreviewNavbar accent="#00f0ff" />

        <div className="relative h-40 overflow-hidden group">
          <SmartImage
            src={KEYBOARD_IMAGE}
            alt="Sky Code keyboard website preview"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03070b] via-black/20 to-black/5" />

          {/* Cyan glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,240,255,0.12),transparent_55%)]" />

          <div className="absolute inset-x-0 bottom-3 px-3">
            <p className="text-[0.45rem] font-mono uppercase tracking-[0.3em] text-cyan-300">
              STATIC EXPERIENCE
            </p>

            <h4 className="mt-1 text-sm font-bold text-white">
              Clean. Fast. Focused.
            </h4>

            <p className="mt-1 max-w-[90%] text-[0.42rem] text-white/55">
              A lightweight website experience built for speed and clarity.
            </p>

            <motion.button
              type="button"
              className="mt-2 rounded-md border border-cyan-300/50 bg-cyan-300/15 px-3 py-1.5 text-[0.48rem] font-semibold text-cyan-100"
              whileHover={{
                scale: 1.08,
                boxShadow: '0 0 20px rgba(0,240,255,0.7)',
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 12,
              }}
            >
              Start a project
            </motion.button>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}


/* =========================================================
   PREMIUM PREVIEW
   ========================================================= */

function PremiumPreview() {
  return (
    <PreviewShell
      accent="#e7c793"
      label="premium"
    >
      <div className="overflow-hidden rounded-xl border border-[#e7c793]/25 bg-black">
        {/* SAME NAVBAR */}
        <PreviewNavbar accent="#e7c793" />

        <div className="relative h-40 overflow-hidden group">
          {/* KEYBOARD VIDEO AS FULL BACKGROUND */}
          <SmartVideo
            src={KEYBOARD_VIDEO}
            poster={FALLBACK_KEYBOARD}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-black/20 to-black/5" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(231,199,147,0.2),transparent_52%)]" />

          {/* Content */}
          <div className="absolute inset-x-0 bottom-3 px-3">
            <p className="text-[0.45rem] font-mono uppercase tracking-[0.3em] text-[#e7c793]">
              INTERACTIVE EXPERIENCE
            </p>

            <h4 className="mt-1 text-sm font-bold text-white">
              Motion meets design.
            </h4>

            <p className="mt-1 max-w-[90%] text-[0.42rem] text-white/60">
              React-powered interfaces with cinematic motion and premium interactions.
            </p>

            <motion.button
              type="button"
              className="mt-2 rounded-md border border-[#e7c793]/60 bg-[#e7c793]/15 px-3 py-1.5 text-[0.48rem] font-semibold text-[#f7ead2]"
              whileHover={{
                scale: 1.08,
                boxShadow:
                  '0 0 25px rgba(231,199,147,0.65)',
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 12,
              }}
            >
              Get started
            </motion.button>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}


/* =========================================================
   TRUCK WHEEL
   ========================================================= */

function TruckWheel({ small = false }) {
  return (
    <div
      className={`absolute rounded-full border-2 border-[#181818] bg-[#050505] shadow-[0_4px_10px_rgba(0,0,0,0.8)] ${
        small
          ? 'h-7 w-7'
          : 'h-8 w-8'
      }`}
    >
      <div className="absolute inset-1 rounded-full border border-white/15 bg-gradient-to-br from-[#454545] via-[#171717] to-[#050505]" />

      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#777]" />
    </div>
  )
}


/* =========================================================
   REALISTIC SMALL TRUCK
   ---------------------------------------------------------
   IMPORTANT:
   - Small size
   - Cabin in front
   - Large cargo container behind
   - Whole container = ONE button
   ========================================================= */

function RealTruck() {
  return (
    <div className="relative h-[76px] w-[230px]">

      {/* ===================================================
          CARGO CONTAINER
          Whole container is the button
         =================================================== */}

      <motion.button
        type="button"
        aria-label="Explore Ultra Premium"
        className="absolute left-[4px] top-[7px] h-[48px] w-[158px] overflow-hidden rounded-[7px] border border-violet-300/50 bg-gradient-to-br from-[#343442] via-[#15151d] to-[#09090e] text-left shadow-[0_0_20px_rgba(124,92,255,0.35)]"
        whileHover={{
          scale: 1.03,
          boxShadow:
            '0 0 28px rgba(124,92,255,0.65), inset 0 0 20px rgba(124,92,255,0.12)',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 18,
        }}
      >
        {/* Container vertical lines */}
        <div className="absolute inset-y-0 left-4 w-px bg-violet-300/15" />
        <div className="absolute inset-y-0 left-8 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-12 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-16 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-20 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-24 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-28 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-32 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-36 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-40 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-44 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-48 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-52 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-56 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-60 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-64 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-68 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-72 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-76 w-px bg-violet-300/10" />
        <div className="absolute inset-y-0 left-80 w-px bg-violet-300/10" />

        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/25" />

        {/* ONE CTA inside complete container */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-md border border-cyan-300/50 bg-cyan-400/10 px-4 py-2 text-[0.48rem] font-bold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_16px_rgba(0,240,255,0.25)]">
            Explore
          </span>
        </span>
      </motion.button>


      {/* ===================================================
          TRUCK CAB
         =================================================== */}

      <div className="absolute right-[2px] top-[17px] h-[43px] w-[72px] rounded-r-[8px] rounded-l-[5px] border border-white/15 bg-gradient-to-br from-[#42424a] via-[#1c1c23] to-[#09090d] shadow-[0_8px_20px_rgba(0,0,0,0.55)]">

        {/* Windshield */}
        <div className="absolute left-[7px] top-[6px] h-[16px] w-[31px] rounded-[3px] border border-cyan-300/20 bg-gradient-to-br from-[#20333a] via-[#0d171c] to-[#05080b]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        {/* Side window */}
        <div className="absolute right-[7px] top-[6px] h-[16px] w-[18px] rounded-[3px] border border-white/10 bg-[#0b1014]" />

        {/* Door */}
        <div className="absolute bottom-[3px] right-[7px] h-[17px] w-[28px] rounded border border-white/10">
          <div className="absolute right-1 top-1 h-1 w-2 rounded bg-white/30" />
        </div>

        {/* Headlight */}
        <div className="absolute right-[-2px] top-[27px] h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_9px_rgba(255,225,140,0.9)]" />

        {/* Front bumper */}
        <div className="absolute right-[-5px] bottom-1 h-2.5 w-3 rounded-r bg-[#29292f]" />

        {/* Mirror */}
        <div className="absolute right-[-5px] top-[9px] h-2 w-2 rounded-sm border border-white/30 bg-[#222]" />
      </div>


      {/* ===================================================
          CONNECTION / CHASSIS
         =================================================== */}

      <div className="absolute left-[2px] top-[54px] h-[7px] w-[217px] rounded bg-[#111116] shadow-[0_3px_8px_rgba(0,0,0,0.7)]" />


      {/* ===================================================
          WHEELS
         =================================================== */}

      <div className="absolute left-[25px] top-[48px]">
        <TruckWheel small />
      </div>

      <div className="absolute left-[112px] top-[48px]">
        <TruckWheel small />
      </div>

      <div className="absolute right-[16px] top-[48px]">
        <TruckWheel small />
      </div>


      {/* ===================================================
          UNDERBODY GLOW
         =================================================== */}

      <div className="absolute bottom-[5px] left-[20px] h-1 w-[185px] rounded-full bg-violet-500/30 blur-md" />
    </div>
  )
}


/* =========================================================
   ULTRA PREMIUM PREVIEW
   ========================================================= */

function UltraPremiumPreview() {
  const previewRef = useRef(null)

  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  })

  const handleMouseMove = (event) => {
    const element = previewRef.current

    if (!element) return

    const rect = element.getBoundingClientRect()

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2

    setRotation({
      x: y * -5,
      y: x * 7,
    })
  }

  const handleMouseLeave = () => {
    setRotation({
      x: 0,
      y: 0,
    })
  }

  return (
    <PreviewShell
      accent="#7c5cff"
      label="ultra"
    >
      <div className="overflow-hidden rounded-xl border border-[#7c5cff]/30 bg-[#05050b]">

        {/* SAME NAVBAR */}
        <PreviewNavbar accent="#a78bfa" />

        <div className="relative">

          {/* =================================================
              3D KEYBOARD VIDEO
             ================================================= */}

          <div
            ref={previewRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-40 overflow-hidden"
            style={{
              perspective: '900px',
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
                scale: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22,
                mass: 0.6,
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <SmartVideo
                src={KEYBOARD_3D_VIDEO}
                poster={FALLBACK_KEYBOARD}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Neon overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03030a] via-transparent to-black/10" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,92,255,0.22),transparent_58%)]" />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="rounded-full border border-violet-400/40 bg-violet-500/15 px-2 py-0.5 text-[0.42rem] font-mono uppercase tracking-wider text-violet-300">
                WebGL
              </span>

              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2 py-0.5 text-[0.42rem] font-mono uppercase tracking-wider text-cyan-300">
                3D
              </span>
            </div>

            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[0.42rem] font-mono uppercase text-cyan-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Interactive
            </span>

            {/* Text */}
            <div className="absolute inset-x-0 bottom-3 px-3">
              <p className="text-[0.42rem] font-mono uppercase tracking-[0.3em] text-violet-300">
                NEXT GENERATION
              </p>

              <h4 className="mt-1 text-sm font-bold text-white">
                Built beyond the screen.
              </h4>

              <p className="mt-1 max-w-[90%] text-[0.4rem] text-white/55">
                Advanced WebGL interfaces, motion systems and real-time experiences.
              </p>
            </div>
          </div>


          {/* =================================================
              SMALL TRUCK ANIMATION
              left → center → hold → right → restart
             ================================================= */}

          <div className="relative h-[82px] overflow-hidden border-t border-white/5 bg-[#06060b]">

            {/* road */}
            <div className="absolute bottom-[11px] left-0 right-0 h-px bg-white/10" />

            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2"
              animate={{
                x: [
                  '-115%',
                  '12%',
                  '12%',
                  '125%',
                ],
              }}
              transition={{
                duration: 15,
                times: [
                  0,
                  0.24,
                  0.64,
                  1,
                ],
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            >
              <RealTruck />
            </motion.div>

            {/* tiny speed lights */}
            <motion.div
              className="absolute bottom-[13px] left-0 h-px w-20 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
              animate={{
                x: ['0%', '500%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}


/* =========================================================
   PLANS
   ========================================================= */

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4999,
    period: 'One-Time',
    description:
      'Clean static starter websites — fast, accessible, and easy to scale.',
    icon: Globe,
    accent: 'from-cyan-500/20 to-transparent',
    borderGlow:
      'shadow-[0_0_30px_rgba(0,240,255,0.15)]',
    buttonClass:
      'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_28px_rgba(0,240,255,0.3)]',
    features: [
      'Responsive Landing Page (up to 5 sections)',
      'HTML5 + CSS3 + JavaScript',
      'Mobile-first layout',
      'Basic micro-interactions',
      'Standard SEO meta tags',
      'Fast load optimization',
      '1 revision round',
    ],
    preview: <BasicPreview />,
  },

  {
    id: 'premium',
    name: 'Premium',
    price: 14999,
    period: 'One-Time',
    description:
      'Modern, responsive websites with React + Framer Motion interactions.',
    icon: Sparkles,
    accent:
      'from-[#e7c793]/20 to-transparent',
    borderGlow:
      'shadow-[0_0_30px_rgba(231,199,147,0.2)]',
    buttonClass:
      'border-[#e7c793]/40 bg-[#e7c793]/10 text-[#e7c793] hover:bg-[#e7c793]/20 hover:shadow-[0_0_36px_rgba(231,199,147,0.45)]',
    features: [
      'Interactive Motion Website',
      'React + Framer Motion',
      'GSAP ScrollTrigger animations',
      'Custom kinetic typography',
      'Dynamic hover states & badges',
      'Advanced SEO + Analytics',
      '3 revision rounds',
      'Performance audit report',
    ],
    preview: <PremiumPreview />,
  },

  {
    id: 'ultra',
    name: 'Ultra Premium',
    price: 19999,
    period: 'One-Time',
    description:
      'Full-stack MERN apps with advanced WebGL, motion UI, and real-time data.',
    icon: Zap,
    accent:
      'from-[#7c5cff]/20 to-transparent',
    borderGlow:
      'shadow-[0_0_30px_rgba(124,92,255,0.2)]',
    buttonClass:
      'border-[#7c5cff]/40 bg-[#7c5cff]/10 text-[#7c5cff] hover:bg-[#7c5cff]/25 hover:shadow-[0_0_48px_rgba(124,92,255,0.55)]',
    features: [
      'Full-Stack MERN Application',
      'MongoDB + Express + React + Node.js',
      'Advanced WebGL / Motion UI',
      'Real-time data dashboards',
      'Headless CMS integration',
      'Unlimited revisions',
      'SLA-backed hosting setup',
      'Priority 24/7 support channel',
    ],
    preview: <UltraPremiumPreview />,
  },
]


/* =========================================================
   PLAN CARD
   ========================================================= */

function PlanCard({
  plan,
  index,
  onSelectPlan,
}) {
  const Icon = plan.icon

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
      }}
      className={`
        relative
        flex
        h-full
        min-h-[850px]
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#0A0A0C]
        p-6
        backdrop-blur-2xl
        transition-all
        duration-500
        hover:border-white/20
        ${plan.borderGlow}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -inset-px
          rounded-3xl
          bg-gradient-to-br
          ${plan.accent}
          opacity-0
          blur-2xl
          transition-opacity
          duration-500
          hover:opacity-100
        `}
      />

      <div className="relative z-10 flex h-full flex-col">

        {/* Plan header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80">
              <Icon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {plan.name}
              </h3>

              <p className="mt-0.5 text-xs text-white/50">
                {plan.description}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/70">
            {plan.period}
          </span>
        </div>


        {/* Price */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold text-white">
              ₹{plan.price.toLocaleString('en-IN')}
            </span>

            <span className="ml-2 text-xs text-white/40">
              / project
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-[0.55rem] font-mono uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)]" />
            Available
          </span>
        </div>


        {/* Preview */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
              Interface preview
            </p>

            <span className="text-[0.5rem] font-mono text-white/35">
              1600 × 900
            </span>
          </div>

          {plan.preview}
        </div>


        {/* Features */}
        <ul className="mt-5 flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-white/70"
            >
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sky-cyan)]"
                aria-hidden="true"
              />

              <span>
                {feature}
              </span>
            </li>
          ))}
        </ul>


        {/* Bottom button */}
        <button
          type="button"
          onClick={() => onSelectPlan(plan.name)}
          className={`
            mt-6
            w-full
            rounded-2xl
            border
            px-6
            py-3
            text-sm
            font-bold
            uppercase
            tracking-[0.24em]
            transition-all
            duration-300
            ${plan.buttonClass}
          `}
        >
          Select Plan
        </button>
      </div>
    </motion.article>
  )
}


/* =========================================================
   MAIN PRICING SHOWCASE
   ========================================================= */

export default function PricingShowcase() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleSelectPlan = (planName) => setSelectedPlan(planName)
  const handleCloseModal = () => setSelectedPlan(null)

  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-[var(--sky-band)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">

        <motion.header
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-80px',
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--sky-cyan)]">
            Investment
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Precision, priced transparently
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Every engagement is a fixed-scope commission. No hourly ambiguity
            — you approve a plan, we ship against it.
          </p>
        </motion.header>


        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

      </div>

      {selectedPlan ? (
        <PlanRequestModal
          open
          planName={selectedPlan}
          onClose={handleCloseModal}
        />
      ) : null}
    </section>
  )
}