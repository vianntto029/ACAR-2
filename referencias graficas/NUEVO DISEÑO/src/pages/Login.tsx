import { useNavigate } from 'react-router-dom';
import React from 'react';
import { User, Lock, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    // Simulando login con google
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(0deg, #3573a3 0%, #A6C4D6 40%, #FFFFFF 100%)" }}>
      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="glass-panel-solid rounded-xl p-8 md:p-10 text-center shadow-xl">
          <h1 className="font-heading text-3xl font-semibold text-primary mb-2">Plataforma ACAR</h1>
          <p className="text-secondary mb-6">Acceso administrativo seguro.</p>

          <motion.button 
            type="button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-primary border border-outline-variant py-3 rounded-lg shadow-sm hover:bg-surface transition-all duration-300 flex items-center justify-center gap-3 font-semibold mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar con Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">O con correo</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Usuario Institucional</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="text" 
                  placeholder="admin@acar.edu.co" 
                  defaultValue="fundacion2026"
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-secondary">Contraseña</label>
                <button type="button" className="text-[#3573A3] text-xs font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer transition-all">
                  Restablecer
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  defaultValue="admin123"
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full mt-2 bg-[#3573A3] text-white py-3.5 rounded-lg shadow-[0_4px_14px_0_rgba(37,91,118,0.39)] hover:shadow-[0_6px_20px_rgba(37,91,118,0.23)] transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              <Mail className="w-5 h-5 opacity-80" />
              Entrar con Correo
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-xs text-white/90 font-semibold mt-8">
          © 2026 Fundación Mochila de Sueños & Programa ACAR.<br/>Entorno Seguro.
        </p>
      </motion.main>
    </div>
  );
}
