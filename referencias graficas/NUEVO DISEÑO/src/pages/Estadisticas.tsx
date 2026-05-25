import React from 'react';
import Layout from '../components/Layout';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Estadisticas() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2"
        >
          <div>
             <h1 className="font-heading text-4xl font-bold text-primary">Estadísticas de Rendimiento</h1>
             <p className="text-lg text-secondary mt-2 font-medium">Visualiza gráficas interactivas sobre la asistencia general.</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-white/80 p-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white">
                <select className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer">
                  <option>Últimos 30 días</option>
                  <option>Semestre Actual</option>
                  <option>Año Académico</option>
                </select>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-primary"
           >
             <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Total de Asistencias</p>
                  <h3 className="text-4xl font-heading font-bold text-primary">84%</h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                 <Users className="w-5 h-5" />
               </div>
             </div>
             <p className="text-xs text-secondary flex items-center gap-1 font-medium"><TrendingUp className="w-4 h-4 text-green-600"/> +2.4% que el mes pasado</p>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-amber-500"
           >
             <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Promedio de Retardos</p>
                  <h3 className="text-4xl font-heading font-bold text-primary">12%</h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                 <Calendar className="w-5 h-5" />
               </div>
             </div>
             <p className="text-xs text-secondary flex items-center gap-1 font-medium"><TrendingUp className="w-4 h-4 text-red-600"/> +1.1% que el mes pasado</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500"
           >
             <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Materias Activas</p>
                  <h3 className="text-4xl font-heading font-bold text-primary">4</h3>
               </div>
               <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                 <BarChart3 className="w-5 h-5" />
               </div>
             </div>
             <p className="text-xs text-secondary font-medium">100% Cobertura de Pensum</p>
           </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="glass-panel-solid rounded-2xl p-8 shadow-lg flex-1 min-h-[300px] flex items-center justify-center"
        >
          <div className="text-center opacity-50">
             <BarChart3 className="w-16 h-16 mx-auto mb-4 text-secondary" />
             <p className="text-lg font-semibold text-secondary">Gráfica de Asistencia Mensual</p>
             <p className="text-sm">El componente del gráfico se cargará aquí.</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
