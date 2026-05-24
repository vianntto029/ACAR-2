import Layout from '../components/Layout'
import { Plus, X, GripVertical } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const initialColumns = {
  'por-hacer': { id: 'por-hacer', title: 'Por Hacer', color: 'bg-gray-100 border-gray-200' },
  'en-progreso': { id: 'en-progreso', title: 'En Progreso', color: 'bg-blue-50 border-blue-200' },
  'completado': { id: 'completado', title: 'Completado', color: 'bg-green-50 border-green-200' },
}

export default function Tablero() {
  const [columns, setColumns] = useState(initialColumns)
  const [cards, setCards] = useState({
    'por-hacer': [
      { id: '1', title: 'Planificar clase de matemáticas', desc: 'Preparar ejercicios y material didáctico' },
      { id: '2', title: 'Revisar exámenes', desc: 'Corregir evaluaciones del trimestre' },
    ],
    'en-progreso': [
      { id: '3', title: 'Diseñar proyecto final', desc: 'Estructurar las fases del proyecto' },
    ],
    'completado': [
      { id: '4', title: 'Entregar notas', desc: 'Subir calificaciones al sistema' },
    ],
  })
  const [showModal, setShowModal] = useState(false)
  const [newCard, setNewCard] = useState({ title: '', desc: '', column: 'por-hacer' })
  const [dragging, setDragging] = useState(null)

  const handleAddCard = () => {
    if (!newCard.title) return
    const card = { id: Date.now().toString(), title: newCard.title, desc: newCard.desc }
    setCards(prev => ({ ...prev, [newCard.column]: [...(prev[newCard.column] || []), card] }))
    setNewCard({ title: '', desc: '', column: 'por-hacer' })
    setShowModal(false)
  }

  const handleDeleteCard = (colId, cardId) => {
    setCards(prev => ({ ...prev, [colId]: prev[colId].filter(c => c.id !== cardId) }))
  }

  const moveCard = (cardId, fromCol, toCol) => {
    if (!toCol || fromCol === toCol) return
    const card = cards[fromCol]?.find(c => c.id === cardId)
    if (!card) return
    setCards(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(c => c.id !== cardId),
      [toCol]: [...(prev[toCol] || []), card],
    }))
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">TABLERO KANBAN</h1>
          <p className="text-secondary mt-2 font-medium">Planificación estratégica y organización</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
          <Plus className="w-5 h-5" /> Nueva Tarea
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(columns).map(col => (
          <div key={col.id} className="glass-panel-solid rounded-[2rem] p-4 shadow-lg">
            <div className={`p-3 rounded-xl mb-4 ${col.color} border`}>
              <h3 className="font-bold text-primary text-center">{col.title}</h3>
              <p className="text-center text-xs text-secondary">{cards[col.id]?.length || 0} tareas</p>
            </div>
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence>
                {(cards[col.id] || []).map(card => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-surface-variant cursor-grab active:cursor-grabbing group"
                    draggable
                    onDragStart={() => setDragging({ cardId: card.id, fromCol: col.id })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragging) moveCard(dragging.cardId, dragging.fromCol, col.id); setDragging(null) }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-primary text-sm">{card.title}</h4>
                        {card.desc && <p className="text-xs text-secondary mt-1">{card.desc}</p>}
                      </div>
                      <button onClick={() => handleDeleteCard(col.id, card.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {col.id !== 'por-hacer' && (
                        <button onClick={() => moveCard(card.id, col.id, 'por-hacer')} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">←</button>
                      )}
                      {col.id === 'por-hacer' && (
                        <button onClick={() => moveCard(card.id, col.id, 'en-progreso')} className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">Iniciar</button>
                      )}
                      {col.id === 'en-progreso' && (
                        <button onClick={() => moveCard(card.id, col.id, 'completado')} className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors">Completar</button>
                      )}
                      {col.id === 'completado' && (
                        <button onClick={() => moveCard(card.id, col.id, 'en-progreso')} className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">Reabrir</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary">Nueva Tarea</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Título</label>
                  <input type="text" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} placeholder="Nombre de la tarea" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Descripción</label>
                  <textarea value={newCard.desc} onChange={(e) => setNewCard({ ...newCard, desc: e.target.value })} placeholder="Detalles de la tarea" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium resize-none h-24" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Columna</label>
                  <select value={newCard.column} onChange={(e) => setNewCard({ ...newCard, column: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium">
                    <option value="por-hacer">Por Hacer</option>
                    <option value="en-progreso">En Progreso</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                <button onClick={handleAddCard} disabled={!newCard.title} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 transition-all disabled:opacity-50">Agregar Tarea</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}