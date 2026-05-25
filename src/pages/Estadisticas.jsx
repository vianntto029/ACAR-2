import Layout from '../components/Layout'
import { BarChart3, TrendingUp, Users, Calendar, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const monthlyData = [
  { name: 'Ene', asistencia: 85, inasistencias: 15 },
  { name: 'Feb', asistencia: 88, inasistencias: 12 },
  { name: 'Mar', asistencia: 82, inasistencias: 18 },
  { name: 'Abr', asistencia: 90, inasistencias: 10 },
  { name: 'May', asistencia: 84, inasistencias: 16 },
  { name: 'Jun', asistencia: 91, inasistencias: 9 },
]

const weeklyData = [
  { name: 'Sem 1', alumnos: 28 },
  { name: 'Sem 2', alumnos: 32 },
  { name: 'Sem 3', alumnos: 25 },
  { name: 'Sem 4', alumnos: 30 },
  { name: 'Sem 5', alumnos: 27 },
  { name: 'Sem 6', alumnos: 33 },
]

export default function Estadisticas() {
  const [exposicionMode, setExposicionMode] = useState(true)

  const handleReset = () => {
    if (confirm('¿Reiniciar todas las estadísticas?')) {
      setExposicionMode(false)
    }
  }

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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExposicionMode(!exposicionMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${exposicionMode ? 'bg-[#3573A3] text-white shadow-sm' : 'bg-white border border-outline-variant text-secondary hover:text-primary'}`}
            >
              {exposicionMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {exposicionMode ? 'Desactivar Vista' : 'Vista de Exposición'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reiniciar
            </motion.button>
          </div>
        </motion.div>

        {exposicionMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-[#10b981]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Total de Asistencias</p>
                    <h3 className="text-4xl font-heading font-bold text-primary">84%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-secondary flex items-center gap-1 font-medium">
                  <TrendingUp className="w-4 h-4 text-[#10b981]" /> +2.4% que el mes pasado
                </p>
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
                <p className="text-xs text-secondary flex items-center gap-1 font-medium">
                  <TrendingUp className="w-4 h-4 text-red-600" /> +1.1% que el mes pasado
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-primary"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Materias Activas</p>
                    <h3 className="text-4xl font-heading font-bold text-primary">4</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-secondary font-medium">100% Cobertura de Pensum</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel-solid rounded-2xl p-8 shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold text-primary mb-6">Asistencia Mensual</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CCD9E1" />
                    <XAxis dataKey="name" stroke="#7197AE" fontSize={12} fontFamily="Plus Jakarta Sans" />
                    <YAxis stroke="#7197AE" fontSize={12} fontFamily="Plus Jakarta Sans" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid #CCD9E1',
                        borderRadius: '12px',
                        fontFamily: 'Plus Jakarta Sans',
                      }}
                    />
                    <Bar dataKey="asistencia" fill="#417490" radius={[8, 8, 0, 0]} name="Asistencia %" />
                    <Bar dataKey="inasistencias" fill="#f87171" radius={[8, 8, 0, 0]} name="Inasistencias %" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel-solid rounded-2xl p-8 shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold text-primary mb-6">Alumnos por Semana</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CCD9E1" />
                    <XAxis dataKey="name" stroke="#7197AE" fontSize={12} fontFamily="Plus Jakarta Sans" />
                    <YAxis stroke="#7197AE" fontSize={12} fontFamily="Plus Jakarta Sans" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid #CCD9E1',
                        borderRadius: '12px',
                        fontFamily: 'Plus Jakarta Sans',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="alumnos"
                      stroke="#5B84A1"
                      strokeWidth={3}
                      dot={{ fill: '#417490', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8 }}
                      name="Alumnos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Total de Asistencias</p>
                    <h3 className="text-4xl font-heading font-bold text-gray-300">0%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium">Sin datos registrados</p>
              </div>
              <div className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Promedio de Retardos</p>
                    <h3 className="text-4xl font-heading font-bold text-gray-300">0%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium">Sin datos registrados</p>
              </div>
              <div className="glass-panel-solid rounded-2xl p-6 shadow-lg border-l-4 border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-secondary uppercase mb-1">Materias Activas</p>
                    <h3 className="text-4xl font-heading font-bold text-gray-300">0</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium">Sin datos registrados</p>
              </div>
            </div>
            <div className="glass-panel-solid rounded-2xl p-12 shadow-lg flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="font-heading text-xl font-bold text-gray-300 mb-2">Vista de Exposición Desactivada</h3>
              <p className="text-secondary max-w-md">Activa la Vista de Exposición para mostrar las estadísticas de referencia con datos de muestra y gráficas interactivas.</p>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
