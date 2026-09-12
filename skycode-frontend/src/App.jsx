import { useCallback, useEffect, useState } from 'react'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesBento from './components/ServicesBento'
import PortfolioGrid from './components/PortfolioGrid'
import PricingShowcase from './components/PricingShowcase'
import InteractiveCanvas from './components/InteractiveCanvas'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import { LoginModal } from './components/AdminModals'
import {
  addProject,
  editProject,
  getAdminMe,
  getProjects,
  getSettings,
  loginAdmin,
  removeProject,
} from './services/api'

function getStoredAdminToken() {
  try {
    return localStorage.getItem('skycode_admin_token') || null
  } catch {
    return null
  }
}

function saveAdminToken(token) {
  try {
    localStorage.setItem('skycode_admin_token', token)
    return true
  } catch {
    return false
  }
}

export default function App() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(getStoredAdminToken)
  const [admin, setAdmin] = useState(null)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [contact, setContact] = useState({
    email: 'hello@skycode.studio',
    whatsapp: '',
    website: 'skycode.studio',
  })

  const isAdmin = Boolean(token)

  useEffect(() => {
    let alive = true
    getProjects().then((list) => {
      if (!alive) return
      setProjects(list)
      setIsLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // Stored admin token valid hai ya expired — mount par verify karo.
  // Expired ho to logout karke fresh login dikhate hain (warna har protected
  // call chupchap fail hoti hai: projects blank, settings save fail, etc.).
  useEffect(() => {
    if (!token) return undefined
    let alive = true
    getAdminMe(token).then((result) => {
      if (!alive) return
      if (!result.success) {
        setToken(null)
        setAdmin(null)
        setIsAdminPanelOpen(false)
        try {
          localStorage.removeItem('skycode_admin_token')
        } catch {
          // storage unavailable — ignore
        }
      } else if (result.admin) {
        setAdmin(result.admin)
      }
    })
    return () => {
      alive = false
    }
  }, [token])

  // Contact details har baar fresh fetch hote hain jab site par wapas aate hain
  // (admin panel me Settings tab se change karke "Back to Site" dabane par turant
  // updated email / whatsapp / website dikhenge).
  useEffect(() => {
    if (isAdminPanelOpen) return undefined
    let alive = true
    getSettings().then((settings) => {
      if (!alive) return
      if (settings.email || settings.whatsapp) {
        setContact((prev) => ({ ...prev, ...settings }))
      }
    })
    return () => {
      alive = false
    }
  }, [isAdminPanelOpen])

  const refreshProjects = useCallback(async () => {
    const list = await getProjects()
    setProjects(list)
  }, [])

  // Admin panel khulne par projects ki fresh list lo — taaki "Live work"
  // section wale sab projects admin ke My Works tab me updated dikhen.
  useEffect(() => {
    if (!isAdminPanelOpen) return undefined
    let alive = true
    getProjects().then((list) => {
      if (alive) setProjects(list)
    })
    return () => {
      alive = false
    }
  }, [isAdminPanelOpen])

  const handleAdminTrigger = useCallback(() => {
    if (isAdmin) setIsAdminPanelOpen(true)
    else setIsLoginOpen(true)
  }, [isAdmin])

  const handleLogin = useCallback(async (credentials) => {
    const result = await loginAdmin(credentials)
    if (result.success && result.token) {
      setToken(result.token)
      setAdmin(result.admin)
      saveAdminToken(result.token)
      setIsLoginOpen(false)
      setIsAdminPanelOpen(true)
    }
    return result
  }, [])

  const handleLogout = useCallback(() => {
    setToken(null)
    setAdmin(null)
    setIsAdminPanelOpen(false)
    try {
      localStorage.removeItem('skycode_admin_token')
    } catch {
      // storage unavailable — ignore
    }
  }, [])

  const handleBackToSite = useCallback(() => setIsAdminPanelOpen(false), [])
  const handleLoginClose = useCallback(() => setIsLoginOpen(false), [])

  const handleAddProject = useCallback(
    async (payload) => {
      if (!token) {
        return { success: false, message: 'Admin session expired — sign in again.' }
      }
      const result = await addProject(payload, token)
      if (result.success && result.data) {
        setProjects((prev) => [result.data, ...prev.filter((project) => project._id !== result.data._id)])
      }
      return result
    },
    [token],
  )

  const handleEditProject = useCallback(
    async (id, payload) => {
      if (!token) {
        return { success: false, message: 'Admin session expired — sign in again.' }
      }
      const result = await editProject(id, payload, token)
      if (result.success && result.data) {
        setProjects((prev) => prev.map((project) => (project._id === id ? result.data : project)))
      }
      return result
    },
    [token],
  )

  const handleDeleteProject = useCallback(
    async (id) => {
      if (!token) return
      const result = await removeProject(id, token)
      if (result.success) {
        setProjects((prev) => prev.filter((project) => project._id !== id))
      }
    },
    [token],
  )

  // Separate admin page — shown only after signing in (or from the footer trigger).
  if (isAdmin && isAdminPanelOpen) {
    return (
      <AdminPanel
        token={token}
        admin={admin}
        projects={projects}
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onRefreshProjects={refreshProjects}
        onAdminUpdated={(newAdmin) => setAdmin(newAdmin)}
        onLogout={handleLogout}
        onBackToSite={handleBackToSite}
      />
    )
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60" aria-hidden="true">
        <InteractiveCanvas density={1} speed={0.8} interactive={false} theme="dark" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <ServicesBento />
        <PortfolioGrid
          projects={projects}
          isAdmin={isAdmin}
          loading={isLoading}
          onDeleteProject={handleDeleteProject}
        />
        <PricingShowcase />
      </main>

      <Footer onAdminOpen={handleAdminTrigger} contact={contact} />

      <LoginModal open={isLoginOpen} onClose={handleLoginClose} onLogin={handleLogin} />
    </div>
  )
}
