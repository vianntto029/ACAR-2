import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  School, Plus, LayoutDashboard, BookOpen, BarChart3, Settings,
  LogOut, Bell, User, Clock, Menu, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
    { to: '/programas', icon: BookOpen, label: 'Programas' },
    { to: '/institutos', icon: School, label: 'Instituciones | Convenio' },
    { to: '/materias', icon: BookOpen, label: 'Materias' },
    { to: '/estadisticas', icon: BarChart3, label: 'Estadisticas' },
    { to: '/reportes', icon: BarChart3, label: 'Reportes' },
    { to: '/ajustes', icon: Settings, label: 'Ajustes' },
  ]

  return (
    <div className="flex bg-surface h-screen overflow-hidden text-secondary">
      <aside className="hidden md:flex flex-col gap-2 p-6 border-r border-outline-variant/30 bg-surface/95 backdrop-blur-2xl w-80 shadow-2xl flex-shrink-0 z-40">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="w-full flex justify-center mb-2">
            <img
              src="/logo-fundacion.png"
              alt="Fundacion Mochila de Suenos"
              className="w-56 h-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.src = "https://placehold.co/200x150/ffffff/3573A3?text=Logo"
              }}
            />
          </div>
          <div>
            <h2 className="text-[1.8rem] leading-tight text-primary font-heading uppercase tracking-tight">
              <span className="font-bold">GESTION</span><br />
              <span className="font-light">EDUCATIVA</span>
            </h2>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/registro')}
          className="w-full py-3.5 rounded-xl text-xs flex justify-center items-center gap-2 mb-6 tracking-widest uppercase font-bold bg-[#a2d2b2] text-white shadow-[0_4px_14px_0_rgba(130,180,150,0.3)] hover:shadow-[0_6px_20px_rgba(130,180,150,0.25)] transition-all duration-300"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Nuevo Registro</span>
        </motion.button>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/dashboard">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Panel de Control
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/programas">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <BookOpen className="w-5 h-5" />
                Programas
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/institutos">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <School className="w-5 h-5" />
                Instituciones | Convenio
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/materias">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <BookOpen className="w-5 h-5" />
                Materias
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/estadisticas">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <BarChart3 className="w-5 h-5" />
                Estadisticas
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/reportes">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <BarChart3 className="w-5 h-5" />
                Reportes
              </motion.div>
            )}
          </NavLink>
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant/20 pt-6">
          <NavLink to="/ajustes">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm ${isActive ? 'text-primary bg-primary/10 shadow-md' : 'text-secondary'}`}
              >
                <Settings className="w-5 h-5" />
                Ajustes
              </motion.div>
            )}
          </NavLink>
          <motion.button
            whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
            onClick={() => {
              localStorage.removeItem('admin-auth')
              navigate('/login')
            }}
            className="flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm text-secondary text-left w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesion
          </motion.button>
        </div>
      </aside>

      <main
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #467694 100%)", backgroundAttachment: "fixed" }}
      >
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm flex justify-between items-center px-6 h-16 flex-shrink-0 z-30">
          <div className="md:hidden flex items-center">
            <span className="font-heading text-lg font-bold text-primary">ACAR</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <NavLink to="/dashboard" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>PANEL DE CONTROL</NavLink>
            <NavLink to="/calendario" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>CALENDARIO</NavLink>
            <NavLink to="/basedatos" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>BASE DE DATOS</NavLink>
            <NavLink to="/tablero" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>TABLERO</NavLink>
            <NavLink to="/notas" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>NOTAS</NavLink>
          </nav>
          <div className="flex items-center gap-4 text-primary">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-surface-variant/50 rounded-full font-bold text-sm text-[#3573A3]">
              <Clock className="w-4 h-4" />
              <span>{formatTime(time)}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/ajustes')}
              className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>

          <footer className="mt-10 py-6 border-t border-white/20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/90 text-xs uppercase tracking-wide font-medium">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-white mr-2">ACAR</span>
              <span className="text-white/80">2026 Fundacion Mochila de Suenos & Programa ACAR. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 font-bold text-white/80">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
              <a href="#" className="hover:text-white transition-colors">Terminos</a>
            </div>
          </footer>
        </div>
      </main>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-surface shadow-2xl p-6 flex flex-col gap-2"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-variant/50">
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-3 mb-6">
                <img src="/logo-fundacion.png" alt="Fundacion" className="w-40" onError={(e) => { e.target.src = "https://placehold.co/200x150/ffffff/3573A3?text=Logo" }} />
                <h2 className="text-[1.4rem] leading-tight text-primary font-heading uppercase tracking-tight text-center">
                  <span className="font-bold">GESTION</span><br />
                  <span className="font-light">EDUCATIVA</span>
                </h2>
              </div>

              <motion.button
                onClick={() => { navigate('/registro'); setMobileMenuOpen(false) }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-xs flex justify-center items-center gap-2 mb-4 tracking-widest uppercase font-bold bg-[#a2d2b2] text-white shadow-[0_4px_12px_0_rgba(130,180,150,0.25)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-white">Nuevo Registro</span>
              </motion.button>

              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}
                      className={`flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all ${isActive ? 'text-primary bg-primary/10' : 'text-secondary'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </motion.div>
                  )}
                </NavLink>
              ))}

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => { localStorage.removeItem('admin-auth'); navigate('/login'); setMobileMenuOpen(false) }}
                className="flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold text-secondary mt-auto border-t border-outline-variant/20 pt-4"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesion
              </motion.button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}