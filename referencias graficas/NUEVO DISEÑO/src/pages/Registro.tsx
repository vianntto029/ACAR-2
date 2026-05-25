import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { UserPlus, User, IdCard, BookOpen, Users2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Registro() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard'); // Proceed to dashboard for demo
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10" style={{ background: "linear-gradient(0deg, #3573a3 0%, #A6C4D6 40%, #FFFFFF 100%)" }}>
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[500px]"
      >
        <div className="glass-panel-solid rounded-xl p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4"
            >
              <UserPlus className="w-7 h-7" />
            </motion.div>
            <h1 className="font-heading text-2xl font-semibold text-primary mb-2">Registro de Asistencia</h1>
            <p className="text-secondary text-sm">Ingrese los datos para confirmar la presencia en la sesión académica.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Ej. Ana García" 
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Cédula de Identidad</label>
              <div className="relative group">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Ej. 12345678" 
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                 />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Sección Asignada</label>
              <div className="relative group">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="text"
                  placeholder="Ej. A1, B2, Única"
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Nombre del Representante</label>
              <div className="relative group">
                <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-[#3573A3] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Ej. Carlos García" 
                  className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-[#3573A3] focus:ring-2 focus:ring-[#3573A3]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={isSubmitted ? {} : { scale: 1.02, y: -2 }}
              whileTap={isSubmitted ? {} : { scale: 0.98 }}
              disabled={isSubmitted}
              type="submit" 
              className={`w-full mt-6 text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${isSubmitted ? 'bg-[#a2d2b2] text-primary shadow-[0_4px_14px_0_rgba(162,210,178,0.39)]' : 'bg-[#3573A3] shadow-[0_4px_14px_0_rgba(37,91,118,0.39)] hover:shadow-[0_6px_20px_rgba(37,91,118,0.23)]'}`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    ¡Registro Exitoso!
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Registrar Asistencia
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-xs text-white/80 font-semibold mt-8">
          Sistema de Gestión Académica Seguro
        </p>
      </motion.main>
    </div>
  );
}
