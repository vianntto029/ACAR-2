import React from 'react';
import Layout from '../components/Layout';
import { Settings, User, Bell, Shield, Paintbrush } from 'lucide-react';
import { motion } from 'motion/react';

export default function Ajustes() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2"
        >
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary">Ajustes del Sistema</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Configura preferencias personales y de la plataforma.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 flex flex-col gap-2"
          >
             <div className="glass-panel-solid rounded-2xl p-4 shadow-lg flex flex-col gap-2">
                {[
                  { icon: User, label: "Perfil de Usuario", active: true },
                  { icon: Bell, label: "Notificaciones", active: false },
                  { icon: Shield, label: "Privacidad y Seguridad", active: false },
                  { icon: Paintbrush, label: "Apariencia", active: false }
                ].map((item, i) => (
                  <button key={i} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${item.active ? 'bg-primary/10 text-primary font-bold' : 'text-secondary hover:bg-white/50 font-medium'}`}>
                     <item.icon className="w-5 h-5" />
                     {item.label}
                  </button>
                ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-panel-solid rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md">
                 AB
               </div>
               <div>
                 <h2 className="text-2xl font-heading font-bold text-primary">Adminstrador ACAR</h2>
                 <p className="text-secondary font-medium">admin@acar.edu.co</p>
                 <button className="text-sm font-bold text-primary mt-1 hover:underline">Cambiar foto</button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-secondary">Nombres</label>
                   <input type="text" defaultValue="Adminstrador" className="w-full bg-white/70 border border-white/60 rounded-lg p-3 text-primary shadow-sm focus:border-primary outline-none" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-secondary">Apellidos</label>
                   <input type="text" defaultValue="ACAR" className="w-full bg-white/70 border border-white/60 rounded-lg p-3 text-primary shadow-sm focus:border-primary outline-none" />
                 </div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-secondary">Correo Electrónico</label>
                 <input type="email" defaultValue="admin@acar.edu.co" disabled className="w-full bg-white/40 border border-white/60 rounded-lg p-3 text-secondary shadow-sm outline-none cursor-not-allowed" />
               </div>

               <div className="pt-4 flex justify-end">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all"
                  >
                     Guardar Cambios
                  </motion.button>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
