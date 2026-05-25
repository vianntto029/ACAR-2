import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  School, Plus, LayoutDashboard, BookOpen, BarChart3, Settings, LogOut, 
  Bell, User, Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex bg-surface h-screen overflow-hidden text-secondary">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col gap-2 p-6 border-r border-outline-variant/30 bg-surface/95 backdrop-blur-2xl w-80 shadow-2xl flex-shrink-0 z-40">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="w-full flex justify-center mb-2">
            <img 
              src="/logo-fundacion.png" 
              alt="Fundación Mochila de Sueños" 
              className="w-56 h-auto object-contain drop-shadow-sm"
              onError={(e) => {
                /* Fallback si no han subido la imagen a public/ */
                (e.target as HTMLImageElement).src = "https://placehold.co/200x150/ffffff/3573A3?text=Logo";
              }}
            />
          </div>
          <div>
            <h2 className="text-[1.8rem] leading-tight text-primary font-heading uppercase tracking-tight">
              <span className="font-bold">GESTIÓN</span><br/>
              <span className="font-light">EDUCATIVA</span>
            </h2>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/registro')}
          className="w-full py-3.5 rounded-xl text-xs flex justify-center items-center gap-2 mb-6 tracking-widest uppercase font-bold bg-[#a2d2b2] text-white shadow-[0_4px_14px_0_rgba(162,210,178,0.39)] hover:shadow-[0_6px_20px_rgba(162,210,178,0.3)] transition-all duration-300"
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
                Estadísticas
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
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 p-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm text-secondary text-left w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </motion.button>
        </div>
      </aside>

      {/* Main Area */}
      <main 
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #467694 100%)", backgroundAttachment: "fixed" }}
      >
        {/* Topbar */}
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm flex justify-between items-center px-6 h-16 flex-shrink-0 z-30">
          <div className="md:hidden flex items-center">
            <span className="font-heading text-lg font-bold text-primary">ACAR</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 h-full">
            <NavLink to="/dashboard" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>PANEL DE CONTROL</NavLink>
            <NavLink to="/programas" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>PROGRAMAS</NavLink>
            <NavLink to="/institutos" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>INSTITUCIONES | CONVENIO</NavLink>
            <NavLink to="/materias" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>MATERIAS</NavLink>
            <NavLink to="/reportes" className={({ isActive }) => `font-bold h-full flex items-center transition-colors uppercase tracking-wide text-sm ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>REPORTES</NavLink>
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
              className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
          
          <footer className="mt-10 py-6 border-t border-white/20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/90 text-xs uppercase tracking-wide font-medium">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-white mr-2">ACAR</span>
              <span>© 2024 Fundación Mochila de Sueños & Programa ACAR. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 font-bold text-white/80">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
