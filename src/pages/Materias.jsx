import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { BookOpen, Search, Plus, Clock, Users, X, Trash2, Calendar, FileText, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { db, ref, push, onValue, remove } from '../firebase'

export default function Materias() {
  const [materias, setMaterias] = useState([])
  const [selectedMateria, setSelectedMateria] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    unidadesDeCredito: '',
    profesor: '',
    aula: '',
    time: '',
    semestre: '',
  })

  const colorClasses = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-emerald-100 text-emerald-800',
    'bg-amber-100 text-amber-800',
    'bg-pink-100 text-pink-800',
    'bg-cyan-100 text-cyan-800',
  ]

  useEffect(() => {
    const materiasRef = ref(db, 'Materias')
    const unsubscribe = onValue(materiasRef, (snapshot) => {
      const data = []
      snapshot.forEach((child) => {
        data.push({ ...child.val(), id: child.key })
      })
      setMaterias(data)
    })
    return () => unsubscribe()
  }, [])

  const filteredMaterias = materias.filter(m =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    if (!newForm.name.trim()) return
    await push(ref(db, 'Materias'), {
      name: newForm.name.trim(),
      description: newForm.description,
      unidadesDeCredito: parseInt(newForm.unidadesDeCredito) || 3,
      profesor: newForm.profesor,
      aula: newForm.aula,
      time: newForm.time,
      semestre: newForm.semestre || new Date().getFullYear().toString(),
      students: 0,
      temario: [],
    })
    setNewForm({ name: '', description: '', unidadesDeCredito: '', profesor: '', aula: '', time: '', semestre: '' })
    setShowNewModal(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar esta materia?')) return
    await remove(ref(db, `Materias/${id}`))
    setSelectedMateria(null)
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
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight">GESTION DE MATERIAS</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Visualiza y edita los pensums, horarios y materias asignadas.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/80 p-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white">
              <Search className="w-5 h-5 ml-2 text-outline" />
              <input
                type="text"
                placeholder="Buscar materia..."
                className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewModal(true)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              Nueva Materia
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterias.map((materia, i) => {
            const colorClass = colorClasses[i % colorClasses.length]
            return (
              <motion.div
                key={materia.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedMateria(materia)}
                className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-5 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${colorClass}`}>
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-primary mb-1">{materia.name}</h3>
                      <span className="text-xs font-bold text-secondary tracking-widest uppercase">{materia.semestre || 'Sin semestre'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-secondary text-sm line-clamp-2 leading-relaxed">{materia.description || 'Sin descripcion'}</p>

                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-outline-variant/50 mt-auto">
                  <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{materia.time || 'Sin horario'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{materia.students || 0} Estudiantes</span>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {filteredMaterias.length === 0 && (
            <div className="col-span-2 glass-panel-solid rounded-[2rem] p-12 text-center">
              <BookOpen className="w-16 h-16 text-outline-variant mx-auto mb-4 opacity-50" />
              <p className="text-secondary font-medium text-lg">No hay materias registradas</p>
              <p className="text-sm text-outline mt-1">Crea una nueva materia para comenzar</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedMateria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setSelectedMateria(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-surface-variant bg-surface flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] -z-10"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-primary text-white">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedMateria.name}</h2>
                      <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border border-black/10 shadow-sm bg-white text-secondary">
                        {selectedMateria.semestre || 'Sin semestre'} | {selectedMateria.unidadesDeCredito || 3} UC
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary text-base leading-relaxed max-w-2xl">{selectedMateria.description || 'Sin descripcion'}</p>
                </div>
                <button
                  onClick={() => setSelectedMateria(null)}
                  className="w-10 h-10 bg-white shadow-sm border border-outline-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Temario y Contenido
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm space-y-3">
                      {(selectedMateria.temario || []).length > 0 ? (
                        selectedMateria.temario.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/10">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </div>
                            <span className="font-medium text-secondary">{item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-secondary text-center py-4">No hay unidades en el temario</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Estudiantes Inscritos ({selectedMateria.students || 0})
                    </h3>
                    <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm text-center">
                      {selectedMateria.students > 0 ? (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-secondary font-medium">Hay {selectedMateria.students} estudiantes registrados.</p>
                        </div>
                      ) : (
                        <p className="text-secondary opacity-70">Aun no hay estudiantes inscritos.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-5">
                    {selectedMateria.time && (
                      <div>
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" /> Horario
                        </span>
                        <p className="font-bold text-primary bg-surface-variant/30 p-2.5 rounded-lg">{selectedMateria.time}</p>
                      </div>
                    )}

                    {selectedMateria.profesor && (
                      <div className="pt-5 border-t border-outline-variant/30">
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4" /> Profesor
                        </span>
                        <p className="font-bold text-primary">{selectedMateria.profesor}</p>
                      </div>
                    )}

                    {selectedMateria.aula && (
                      <div className="pt-5 border-t border-outline-variant/30">
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" /> Aula o Laboratorio
                        </span>
                        <p className="font-bold text-primary">{selectedMateria.aula}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMateria.id)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" /> Eliminar Materia
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="bg-primary/10 p-2 rounded-xl text-primary"><Plus className="w-6 h-6" /></span>
                  Crear Nueva Materia
                </h2>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-outline-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Nombre de la Materia</label>
                    <input
                      type="text"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                      className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none"
                      placeholder="Ej. Logica Matematica"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Unidades de Credito</label>
                    <input
                      type="number"
                      value={newForm.unidadesDeCredito}
                      onChange={(e) => setNewForm({ ...newForm, unidadesDeCredito: e.target.value })}
                      className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none"
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Descripcion</label>
                  <textarea
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                    className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none resize-none h-24"
                    placeholder="Breve resumen de la materia"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Profesor Asignado</label>
                    <input
                      type="text"
                      value={newForm.profesor}
                      onChange={(e) => setNewForm({ ...newForm, profesor: e.target.value })}
                      className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none"
                      placeholder="Nombre del docente"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Aula o Laboratorio</label>
                    <input
                      type="text"
                      value={newForm.aula}
                      onChange={(e) => setNewForm({ ...newForm, aula: e.target.value })}
                      className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none"
                      placeholder="Ej. Sala 2B"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Horario</label>
                  <input
                    type="text"
                    value={newForm.time}
                    onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                    className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none"
                    placeholder="Ej. Lunes y Miercoles, 08:00 AM"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  Confirmar Materia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}