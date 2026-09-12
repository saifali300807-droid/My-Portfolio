// src/components/InteractiveCanvas.jsx
/* ---------------------------------------------------------------------------
 * Sky Code â€” 3D Interactive Wireframe Mesh
 * ---------------------------------------------------------------------------
 * Feature 1: a slowly rotating 3D particle wireframe sphere rendered on a
 * bare <canvas>. The cursor steers the mesh with smooth velocity
 * interpolation (parallax pitch/yaw), while depth-sorted edges glow cyan
 * with champagne-gold beacons.
 *
 * Zero-leak lifecycle:
 *   â€¢ requestAnimationFrame id is tracked and cancelled on unmount.
 *   â€¢ ResizeObserver, pointer and visibility listeners are all removed.
 *   â€¢ prefers-reduced-motion paints a single static composition.
 *   â€¢ Fully theme-aware â€” dark renders neon-on-obsidian, light renders a
 *     deep-teal wireframe on champagne.
 * ------------------------------------------------------------------------ */

import { useEffect, useRef } from 'react'

const THEMES = {
  dark: { line: [0, 240, 255], accent: [231, 199, 147] },
  light: { line: [0, 122, 156], accent: [154, 111, 31] },
}

/* --------------------------- math helpers -------------------------------- */

const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (value, min, max) => (value < min ? min : value > max ? max : value)
const lerp = (a, b, t) => a + (b - a) * t

/** Fibonacci-sphere distribution â€” perfectly even node coverage. */
const buildSphere = (count) => {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const points = []
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, beacon: i % 9 === 0 })
  }
  return points
}

/** Precompute wireframe edges between nodes that sit close on the sphere. */
const buildEdges = (points, threshold) => {
  const edges = []
  const limit = threshold * threshold
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y
      const dz = points[i].z - points[j].z
      if (dx * dx + dy * dy + dz * dz <= limit) edges.push([i, j])
    }
  }
  return edges
}

/** Rotate a unit point (yaw around Y, then pitch around X) and project it. */
const project = (point, cosYaw, sinYaw, cosPitch, sinPitch, cx, cy, radius, fov) => {
  const x1 = point.x * cosYaw + point.z * sinYaw
  const z1 = -point.x * sinYaw + point.z * cosYaw
  const y1 = point.y * cosPitch - z1 * sinPitch
  const z2 = point.y * sinPitch + z1 * cosPitch
  const scale = fov / (fov - z2)
  return {
    sx: cx + x1 * radius * scale,
    sy: cy + y1 * radius * scale,
    depth: z2,
    scale,
  }
}
export default function InteractiveCanvas({
  className,
  style,
  density = 1,
  speed = 1,
  interactive = true,
  theme = 'dark',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  // Props mirrored into a ref inside an effect so the rAF loop always reads
  // fresh values without being torn down on parent re-renders.
  const settingsRef = useRef({})
  useEffect(() => {
    settingsRef.current = { density, speed, interactive, theme }
  }, [density, speed, interactive, theme])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let points = []
    let edges = []
    let stars = []
    let rafId = 0
    let running = false
    let last = performance.now()
    let yaw = 0
    let pitch = -0.26

    // Cursor parallax targets — eased with velocity interpolation.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false }

    const rebuild = () => {
      const s = settingsRef.current
      const target = clamp(Math.round(((width * height) / 13000) * (s.density || 1)), 48, 170)
      points = buildSphere(target)
      edges = buildEdges(points, 2.35 / Math.sqrt(target))
      stars = Array.from({ length: 90 }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(0.4, 1.4),
        twinkle: rand(0, Math.PI * 2),
      }))
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      rebuild()
    }

    /* ------------------------- pointer parallax ------------------------- */

    const setPointer = (event) => {
      if (!settingsRef.current.interactive) return
      const rect = wrap.getBoundingClientRect()
      pointer.tx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1)
      pointer.ty = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1)
      pointer.inside = true
    }

    const clearPointer = () => {
      pointer.inside = false
      pointer.tx = 0
      pointer.ty = 0
    }
    /* ------------------------- render + animation ------------------------- */

    const renderFrame = (now) => {
      const s = settingsRef.current
      const palette = THEMES[s.theme === 'light' ? 'light' : 'dark']
      const [lr, lg, lb] = palette.line
      const [ar, ag, ab] = palette.accent
      const t = now * 0.001

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // Twinkling far-field stars
      for (const star of stars) {
        const twinkle = 0.18 + 0.16 * Math.sin(t * 1.6 + star.twinkle)
        ctx.fillStyle = `rgba(${lr},${lg},${lb},${twinkle.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Perspective-project the rotating sphere
      const cx = width / 2
      const cy = height / 2
      const radius = Math.min(width, height) * 0.33
      const renderYaw = yaw + pointer.x * 0.55
      const cosYaw = Math.cos(renderYaw)
      const sinYaw = Math.sin(renderYaw)
      const cosPitch = Math.cos(pitch)
      const sinPitch = Math.sin(pitch)
      const projected = points.map((point) =>
        project(point, cosYaw, sinYaw, cosPitch, sinPitch, cx, cy, radius, 2.6),
      )

      // Wireframe edges — depth-faded filaments
      ctx.globalCompositeOperation = s.theme === 'light' ? 'source-over' : 'lighter'
      ctx.lineWidth = 1
      for (const [a, b] of edges) {
        const pa = projected[a]
        const pb = projected[b]
        const depth = (pa.depth + pb.depth) / 2
        const alpha = clamp(0.08 + (depth + 1) * 0.2, 0.05, 0.42)
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy)
        ctx.lineTo(pb.sx, pb.sy)
        ctx.stroke()
      }

      // Nodes — cyan particles with gold beacons
      for (let i = 0; i < projected.length; i += 1) {
        const p = projected[i]
        const beacon = points[i].beacon
        const size = clamp(1.15 * p.scale, 0.6, 2.7)
        const alpha = clamp(0.3 + (p.depth + 1) * 0.3, 0.12, 0.95)
        ctx.fillStyle = `rgba(${beacon ? ar : lr},${beacon ? ag : lg},${beacon ? ab : lb},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, beacon ? size * 1.7 : size, 0, Math.PI * 2)
        ctx.fill()
        if (beacon) {
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(alpha * 0.35).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, size * 3.4, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (now) => {
      if (!running) return
      const dt = clamp((now - last) / 1000, 0, 0.05)
      last = now
      const s = settingsRef.current

      // Constant cinematic rotation + velocity-interpolated cursor parallax.
      yaw += 0.14 * (s.speed || 1) * dt
      const ease = 1 - Math.pow(0.004, dt)
      pointer.x = lerp(pointer.x, pointer.tx, ease)
      pointer.y = lerp(pointer.y, pointer.ty, ease)
      pitch = lerp(pitch, -0.26 + pointer.y * 0.42, ease)

      renderFrame(now)
      rafId = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        if (rafId) cancelAnimationFrame(rafId)
      } else if (!reduceMotion) {
        running = true
        last = performance.now()
        rafId = requestAnimationFrame(frame)
      }
    }

    /* ------------------------------- boot -------------------------------- */

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    wrap.addEventListener('pointermove', setPointer)
    wrap.addEventListener('pointerenter', setPointer)
    wrap.addEventListener('pointerleave', clearPointer)
    document.addEventListener('visibilitychange', onVisibility)

    if (!reduceMotion) {
      running = true
      rafId = requestAnimationFrame(frame)
    } else {
      renderFrame(performance.now()) // calm single-frame composition
    }

    /* ----------------------------- teardown ------------------------------ */

    return () => {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      observer.disconnect()
      wrap.removeEventListener('pointermove', setPointer)
      wrap.removeEventListener('pointerenter', setPointer)
      wrap.removeEventListener('pointerleave', clearPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
