import { useState } from 'react'
import Layout from '../components/Layout'
import { Settings, User, Bell, Shield, Paintbrush } from 'lucide-react'
import { motion } from 'motion/react'

export default function Ajustes() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [profile, setProfile] = useState({
    nombres: 'Administrador',
    apellidos: 'ACAR',
    email: 'admin@acar.edu.co',
  })
  const [saved, setSaved] = useState(false)

  const tabs = [
    { id: 'perfil', icon: User, label: 'Perfil de Usuario' },
    { id: 'notificaciones', icon: Bell, label: 'Notificaciones' },
    { id: 'privacidad', icon: Shield, label: 'Privacidad y Seguridad' },
    { id: 'apariencia', icon: Paintbrush, label: 'Apariencia' },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary font-bold' : 'text-secondary hover:bg-white/50 font-medium'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
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
            {activeTab === 'perfil' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    {profile.nombres[0]}{profile.apellidos[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-primary">
                      {profile.nombres} {profile.apellidos}
                    </h2>
                    <p className="text-secondary font-medium">{profile.email}</p>
                    <button className="text-sm font-bold text-primary mt-1 hover:underline">Cambiar foto</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-secondary">Nombres</label>
                      <input
                        type="text"
                        value={profile.nombres}
                        onChange={(e) => setProfile({ ...profile, nombres: e.target.value })}
                        className="w-full bg-white/70 border border-white/60 rounded-lg p-3 text-primary shadow-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-secondary">Apellidos</label>
                      <input
                        type="text"
                        value={profile.apellidos}
                        onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
                        className="w-full bg-white/70 border border-white/60 rounded-lg p-3 text-primary shadow-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-secondary">Correo Electronico</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-white/40 border border-white/60 rounded-lg p-3 text-secondary shadow-sm outline-none cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${saved ? 'bg-[#10b981] text-white' : 'bg-primary text-white hover:opacity-90'}`}
                    >
                      {saved ? 'Guardado!' : 'Guardar Cambios'}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notificaciones' && (
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-bold text-primary">Preferencias de Notificaciones</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Nuevos registros de asistencia', desc: 'Recibir alerta cuando un estudiante se registre' },
                    { label: 'Reportes generados', desc: 'Notificar cuando se exporte un reporte' },
                    { label: 'Alertas del sistema', desc: 'Notificaciones sobre el estado del sistema' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-surface-variant">
                      <div>
                        <p className="font-bold text-primary">{item.label}</p>
                        <p className="text-sm text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacidad' && (
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-bold text-primary">Privacidad y Seguridad</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-surface-variant">
                    <p className="font-bold text-primary mb-1">Cambiar Contrasena</p>
                    <p className="text-sm text-secondary mb-3">Ultima actualizacion: hace 30 dias</p>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                      Actualizar Contrasena
                    </button>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-surface-variant">
                    <p className="font-bold text-primary mb-1">Sesiones Activas</p>
                    <p className="text-sm text-secondary">1 sesion activa actualmente</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'apariencia' && (
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-bold text-primary">Apariencia del Sistema</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-primary text-center">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-b from-white to-primary mb-2"></div>
                    <p className="font-bold text-primary text-sm">Tema Claro</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-surface-variant text-center opacity-50">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#16213e] mb-2"></div>
                    <p className="font-bold text-secondary text-sm">Tema Oscuro (Proximamente)</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}