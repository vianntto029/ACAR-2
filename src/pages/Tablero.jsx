import Layout from '../components/Layout'
import { Plus, X, Check, User, Calendar, Clock, Flag, ListTodo, AlignLeft, Save, GripVertical, ZoomIn, ZoomOut, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const priorityConfig = {
  baja: { label: 'Baja', color: 'bg-green-100 text-green-700' },
  media: { label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  alta: { label: 'Alta', color: 'bg-red-100 text-red-700' },
}

const columnColors = ['bg-gray-100 border-gray-200', 'bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-purple-50 border-purple-200', 'bg-orange-50 border-orange-200', 'bg-pink-50 border-pink-200', 'bg-teal-50 border-teal-200']

const zoomConfig = {
  compact: { gridCols: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6', cardPadding: 'p-3', textSize: 'text-[11px]' },
  normal: { gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', cardPadding: 'p-4', textSize: 'text-sm' },
  wide: { gridCols: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2', cardPadding: 'p-5', textSize: 'text-base' },
}

const defaultCols = [
  { id: 'por-hacer', title: 'Por Hacer' },
  { id: 'en-progreso', title: 'En Progreso' },
  { id: 'completado', title: 'Completado' },
]

export default function Tablero() {
  const [columnOrder, setColumnOrder] = useState(defaultCols)
  const [cards, setCards] = useState({
    'por-hacer': [
      { id: '1', title: 'Planificar clase de matemáticas', desc: 'Preparar ejercicios y material didáctico', subtasks: [{ id: 's1', text: 'Revisar libro de texto', done: false }, { id: 's2', text: 'Preparar ejercicios prácticos', done: true }], assignee: 'Juan Pérez', dueDate: '2025-06-10', dueTime: '14:00', estTime: '3h', priority: 'alta' },
      { id: '2', title: 'Revisar exámenes', desc: 'Corregir evaluaciones del trimestre', subtasks: [], assignee: '', dueDate: '', dueTime: '', estTime: '', priority: 'media' },
    ],
    'en-progreso': [
      { id: '3', title: 'Diseñar proyecto final', desc: 'Estructurar las fases del proyecto', subtasks: [{ id: 's3', text: 'Definir alcance', done: true }, { id: 's4', text: 'Crear cronograma', done: false }], assignee: 'María García', dueDate: '2025-06-15', dueTime: '18:00', estTime: '8h', priority: 'alta' },
    ],
    'completado': [
      { id: '4', title: 'Entregar notas', desc: 'Subir calificaciones al sistema', subtasks: [], assignee: '', dueDate: '', dueTime: '', estTime: '', priority: 'baja' },
    ],
  })
  const [showModal, setShowModal] = useState(false)
  const [newCard, setNewCard] = useState({ title: '', desc: '', column: 'por-hacer', assignee: '', dueDate: '', dueTime: '', estTime: '', priority: 'media' })
  const [detailModal, setDetailModal] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [newSubtaskText, setNewSubtaskText] = useState('')
  const [dragState, setDragState] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [columnDrag, setColumnDrag] = useState(null)
  const [columnDropIdx, setColumnDropIdx] = useState(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [columnZoom, setColumnZoom] = useState('normal')
  const dragNodeRef = useRef(null)
  const isDragging = useRef(false)

  const zoom = zoomConfig[columnZoom]

  const handleAddCard = () => {
    if (!newCard.title) return
    const card = {
      id: Date.now().toString(),
      title: newCard.title,
      desc: newCard.desc,
      subtasks: [],
      assignee: newCard.assignee,
      dueDate: newCard.dueDate,
      dueTime: newCard.dueTime,
      estTime: newCard.estTime,
      priority: newCard.priority,
    }
    setCards(prev => ({ ...prev, [newCard.column]: [...(prev[newCard.column] || []), card] }))
    setNewCard({ title: '', desc: '', column: columnOrder[0]?.id || 'por-hacer', assignee: '', dueDate: '', dueTime: '', estTime: '', priority: 'media' })
    setShowModal(false)
  }

  const handleDeleteCard = (colId, cardId) => {
    setCards(prev => ({ ...prev, [colId]: prev[colId].filter(c => c.id !== cardId) }))
  }

  const moveCard = (cardId, fromCol, toCol, toIndex) => {
    const sourceCards = [...(cards[fromCol] || [])]
    const cardIdx = sourceCards.findIndex(c => c.id === cardId)
    if (cardIdx === -1) return
    const [movedCard] = sourceCards.splice(cardIdx, 1)
    const targetCards = toCol === fromCol ? sourceCards : [...(cards[toCol] || [])]
    const insertAt = toCol === fromCol ? (toIndex > cardIdx ? toIndex - 1 : toIndex) : (toIndex ?? targetCards.length)
    targetCards.splice(insertAt, 0, movedCard)
    setCards(prev => ({
      ...prev,
      [fromCol]: toCol === fromCol ? targetCards : sourceCards,
      [toCol]: toCol === fromCol ? targetCards : targetCards,
    }))
  }

  const handleDragStart = (e, cardId, colId) => {
    isDragging.current = true
    dragNodeRef.current = e.target
    setDragState({ cardId, fromCol: colId })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setDragImage && e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, 20)
  }

  const handleDragEnd = () => {
    isDragging.current = false
    dragNodeRef.current = null
    setDragState(null)
    setDropTarget(null)
  }

  const handleDragOver = (e, colId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const colEl = e.currentTarget
    const cardEls = colEl.querySelectorAll('[data-card-id]')
    let insertIndex = cardEls.length
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect()
      if (e.clientY < rect.top + rect.height / 2) { insertIndex = i; break }
    }
    setDropTarget({ colId, index: insertIndex, cardId: cardEls[insertIndex]?.getAttribute('data-card-id') || null })
  }

  const handleDragLeave = (e, colId) => {
    if (dropTarget?.colId === colId && !e.currentTarget.contains(e.relatedTarget)) {
      setDropTarget(prev => prev?.colId === colId ? null : prev)
    }
  }

  const handleDrop = (e, colId) => {
    e.preventDefault()
    if (!dragState) return
    if (!cards[dragState.fromCol]?.some(c => c.id === dragState.cardId)) return
    const dropIdx = dropTarget?.colId === colId ? dropTarget.index : (cards[colId]?.length || 0)
    moveCard(dragState.cardId, dragState.fromCol, colId, dropIdx)
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = '1'
    dragNodeRef.current = null
    setDragState(null)
    setDropTarget(null)
  }

  const handleColumnDragStart = (e, idx) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setDragImage && e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, 20)
    setColumnDrag(idx)
  }

  const handleColumnDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (columnDrag !== null && columnDrag !== idx) setColumnDropIdx(idx)
  }

  const handleColumnDrop = () => {
    if (columnDrag === null || columnDropIdx === null) return
    const newOrder = [...columnOrder]
    const [moved] = newOrder.splice(columnDrag, 1)
    newOrder.splice(columnDropIdx, 0, moved)
    setColumnOrder(newOrder)
    setColumnDrag(null)
    setColumnDropIdx(null)
  }

  const handleAddColumn = () => {
    if (!newColName.trim()) return
    const id = 'col-' + Date.now().toString()
    setColumnOrder(prev => [...prev, { id, title: newColName.trim() }])
    setCards(prev => ({ ...prev, [id]: [] }))
    setNewColName('')
    setShowAddColumn(false)
  }

  const handleDeleteColumn = (colId) => {
    if (columnOrder.length <= 1) return
    setColumnOrder(prev => prev.filter(c => c.id !== colId))
    setCards(prev => { const n = { ...prev }; delete n[colId]; return n })
  }

  const openDetailModal = (card, colId) => {
    if (isDragging.current) return
    setDetailModal({ colId })
    setEditingCard(JSON.parse(JSON.stringify(card)))
    setNewSubtaskText('')
  }

  const closeDetailModal = () => { setDetailModal(null); setEditingCard(null); setNewSubtaskText('') }

  const saveDetailModal = () => {
    if (!editingCard || !detailModal) return
    setCards(prev => ({ ...prev, [detailModal.colId]: prev[detailModal.colId].map(c => c.id === editingCard.id ? editingCard : c) }))
    closeDetailModal()
  }

  const addSubtask = () => {
    if (!newSubtaskText.trim() || !editingCard) return
    setEditingCard({ ...editingCard, subtasks: [...editingCard.subtasks, { id: Date.now().toString() + Math.random().toString(36).slice(2, 6), text: newSubtaskText.trim(), done: false }] })
    setNewSubtaskText('')
  }

  const removeSubtask = (subId) => { if (editingCard) setEditingCard({ ...editingCard, subtasks: editingCard.subtasks.filter(s => s.id !== subId) }) }

  const toggleSubtask = (subId) => { if (editingCard) setEditingCard({ ...editingCard, subtasks: editingCard.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) }) }

  const getPriority = (p) => priorityConfig[p] || priorityConfig.media

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">TABLERO KANBAN</h1>
          <p className="text-secondary mt-2 font-medium">Planificaci&oacute;n estrat&eacute;gica y organizaci&oacute;n</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white/80 rounded-xl border border-outline-variant/30 p-0.5 shadow-sm">
            {Object.entries(zoomConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => setColumnZoom(key)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${columnZoom === key ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
                {key === 'compact' ? <ZoomOut className="w-3.5 h-3.5" /> : key === 'wide' ? <ZoomIn className="w-3.5 h-3.5" /> : <span className="text-[10px]">1:1</span>}
                <span className="hidden sm:inline">{key === 'compact' ? 'Compacto' : key === 'wide' ? 'Amplio' : 'Normal'}</span>
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm text-sm">
            <Plus className="w-4 h-4" /> Tarea
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddColumn(true)} className="bg-white border-2 border-dashed border-primary/30 text-primary px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-sm">
            <Plus className="w-4 h-4" /> Columna
          </motion.button>
        </div>
      </motion.div>

      <div className={`overflow-x-auto pb-4`}>
        <div className={`grid ${zoom.gridCols} gap-4 min-w-[600px]`}>
          {columnOrder.map((col, colIdx) => {
            const colCards = cards[col.id] || []
            const colorClass = columnColors[colIdx % columnColors.length]
            const isOver = columnDropIdx === colIdx && columnDrag !== null && columnDrag !== colIdx
            return (
              <div key={col.id} className={`glass-panel-solid rounded-[2rem] p-3 shadow-lg transition-all ${dropTarget?.colId === col.id ? 'shadow-[0_0_0_2px_#3573A3]' : ''} ${isOver ? 'ring-2 ring-primary/60 scale-[1.02]' : ''} ${columnDrag === colIdx ? 'shadow-2xl scale-[1.02] rotate-[0.3deg] z-50 ring-2 ring-primary/40' : ''}`}>
                <div
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, colIdx)}
                  onDragOver={(e) => handleColumnDragOver(e, colIdx)}
                  onDragEnd={handleColumnDrop}
                  onDrop={handleColumnDrop}
                  className={`${colorClass} border rounded-xl mb-3 p-2 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 text-secondary/40 flex-shrink-0" />
                      <h3 className="font-bold text-primary text-center uppercase text-xs truncate">{col.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] text-secondary font-semibold bg-white/60 px-1.5 py-0.5 rounded-full">{colCards.length}</span>
                      {columnOrder.length > 1 && (
                        <button onClick={() => handleDeleteColumn(col.id)} className="text-red-300 hover:text-red-500 transition-colors" title="Eliminar columna">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="space-y-2 min-h-[150px]"
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={(e) => handleDragLeave(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <AnimatePresence>
                    {colCards.map((card, idx) => {
                      const isDragSource = dragState?.cardId === card.id
                      const hasDropAbove = dropTarget?.colId === col.id && dropTarget?.index === idx
                      const pr = getPriority(card.priority)
                      return (
                        <div key={card.id}>
                          {hasDropAbove && <div className="flex items-center gap-2 py-0.5"><div className="flex-1 h-1 bg-primary/40 rounded-full" /><div className="w-2 h-2 rounded-full bg-primary" /><div className="flex-1 h-1 bg-primary/40 rounded-full" /></div>}
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, scale: isDragSource ? 1.03 : 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            data-card-id={card.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, card.id, col.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => openDetailModal(card, col.id)}
                            className={`bg-white rounded-xl ${zoom.cardPadding} shadow-sm border border-surface-variant cursor-grab active:cursor-grabbing group hover:shadow-md hover:border-primary/30 transition-all ${zoom.textSize} ${isDragSource ? 'shadow-2xl rotate-[0.5deg] z-50 ring-2 ring-primary/30 scale-[1.03]' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-primary truncate">{card.title}</h4>
                                  {card.priority && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${pr.color}`}><Flag className="w-2.5 h-2.5 inline mr-0.5" />{pr.label}</span>}
                                </div>
                                {card.desc && <p className="text-secondary mt-0.5 line-clamp-2">{card.desc}</p>}
                                <div className="flex flex-wrap gap-1.5 mt-1.5 text-secondary">
                                  {card.assignee && <span className="flex items-center gap-0.5 bg-gray-50 px-1.5 py-0.5 rounded text-[10px]"><User className="w-2.5 h-2.5" />{card.assignee}</span>}
                                  {card.dueDate && <span className="flex items-center gap-0.5 bg-gray-50 px-1.5 py-0.5 rounded text-[10px]"><Calendar className="w-2.5 h-2.5" />{card.dueDate}{card.dueTime ? ` ${card.dueTime}` : ''}</span>}
                                  {card.estTime && <span className="flex items-center gap-0.5 bg-gray-50 px-1.5 py-0.5 rounded text-[10px]"><Clock className="w-2.5 h-2.5" />{card.estTime}</span>}
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteCard(col.id, card.id) }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex gap-1 mt-1.5">
                              {columnOrder.some(c => c.id === col.id && c !== columnOrder[0]) && (
                                <button onClick={(e) => { e.stopPropagation(); moveCard(card.id, col.id, columnOrder[0].id, cards[columnOrder[0].id]?.length || 0) }} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">←</button>
                              )}
                              {col === columnOrder[columnOrder.length - 1] && (
                                <button onClick={(e) => { e.stopPropagation(); moveCard(card.id, col.id, columnOrder[columnOrder.length - 1].id, cards[columnOrder[columnOrder.length - 1].id]?.length || 0) }} className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors">Completar</button>
                              )}
                              {col !== columnOrder[0] && col !== columnOrder[columnOrder.length - 1] && (
                                <>
                                  <button onClick={(e) => { e.stopPropagation(); moveCard(card.id, col.id, columnOrder[columnOrder.indexOf(col) + 1].id, cards[columnOrder[columnOrder.indexOf(col) + 1].id]?.length || 0) }} className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors">→</button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </AnimatePresence>
                  {dropTarget?.colId === col.id && dropTarget?.index >= colCards.length && (
                    <div className="flex items-center gap-2 py-0.5"><div className="flex-1 h-1 bg-primary/40 rounded-full" /><div className="w-2 h-2 rounded-full bg-primary" /><div className="flex-1 h-1 bg-primary/40 rounded-full" /></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary">Nueva Tarea</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><AlignLeft className="w-3.5 h-3.5 inline mr-1" />T&iacute;tulo</label>
                  <input type="text" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} placeholder="Nombre de la tarea" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><AlignLeft className="w-3.5 h-3.5 inline mr-1" />Descripci&oacute;n</label>
                  <textarea value={newCard.desc} onChange={(e) => setNewCard({ ...newCard, desc: e.target.value })} placeholder="Detalles de la tarea" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium resize-none h-20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><User className="w-3.5 h-3.5 inline mr-1" />Asignado a</label>
                    <input type="text" value={newCard.assignee} onChange={(e) => setNewCard({ ...newCard, assignee: e.target.value })} placeholder="Nombre" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Flag className="w-3.5 h-3.5 inline mr-1" />Prioridad</label>
                    <select value={newCard.priority} onChange={(e) => setNewCard({ ...newCard, priority: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium">
                      <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Calendar className="w-3.5 h-3.5 inline mr-1" />Fecha</label>
                    <input type="date" value={newCard.dueDate} onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" />Hora</label>
                    <input type="time" value={newCard.dueTime} onChange={(e) => setNewCard({ ...newCard, dueTime: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" />Tiempo estimado</label>
                  <input type="text" value={newCard.estTime} onChange={(e) => setNewCard({ ...newCard, estTime: e.target.value })} placeholder="Ej: 2h, 30m" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Columna</label>
                  <select value={newCard.column} onChange={(e) => setNewCard({ ...newCard, column: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium">
                    {columnOrder.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
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

      <AnimatePresence>
        {showAddColumn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary">Nueva Columna</h2>
                <button onClick={() => setShowAddColumn(false)} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6">
                <label className="text-sm font-semibold text-secondary block mb-1">Nombre de la columna</label>
                <input type="text" value={newColName} onChange={(e) => setNewColName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()} placeholder="Ej: En Revisión" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" autoFocus />
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button onClick={() => setShowAddColumn(false)} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                <button onClick={handleAddColumn} disabled={!newColName.trim()} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 transition-all disabled:opacity-50">Agregar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailModal && editingCard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary">Detalle de Tarea</h2>
                <button onClick={closeDetailModal} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><AlignLeft className="w-3.5 h-3.5 inline mr-1" />T&iacute;tulo</label>
                  <input type="text" value={editingCard.title} onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><AlignLeft className="w-3.5 h-3.5 inline mr-1" />Descripci&oacute;n</label>
                  <textarea value={editingCard.desc} onChange={(e) => setEditingCard({ ...editingCard, desc: e.target.value })} placeholder="Sin descripci&oacute;n" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium resize-none h-20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-2"><ListTodo className="w-3.5 h-3.5 inline mr-1" />Subtareas</label>
                  <div className="space-y-2 mb-3">
                    {editingCard.subtasks.map(sub => (
                      <div key={sub.id} className="flex items-center gap-2 bg-surface-variant/30 rounded-lg px-3 py-2">
                        <button onClick={() => toggleSubtask(sub.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${sub.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-primary'}`}>
                          {sub.done && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${sub.done ? 'line-through text-gray-400' : 'text-primary'}`}>{sub.text}</span>
                        <button onClick={() => removeSubtask(sub.id)} className="text-red-300 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    {editingCard.subtasks.length === 0 && <p className="text-xs text-secondary">Sin subtareas</p>}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newSubtaskText} onChange={(e) => setNewSubtaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtask()} placeholder="Nueva subtarea..." className="flex-1 bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-primary text-sm" />
                    <button onClick={addSubtask} disabled={!newSubtaskText.trim()} className="bg-[#3573A3] text-white px-3 py-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><User className="w-3.5 h-3.5 inline mr-1" />Asignado a</label>
                    <input type="text" value={editingCard.assignee} onChange={(e) => setEditingCard({ ...editingCard, assignee: e.target.value })} placeholder="Sin asignar" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Flag className="w-3.5 h-3.5 inline mr-1" />Prioridad</label>
                    <select value={editingCard.priority} onChange={(e) => setEditingCard({ ...editingCard, priority: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium">
                      <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Calendar className="w-3.5 h-3.5 inline mr-1" />Fecha</label>
                    <input type="date" value={editingCard.dueDate} onChange={(e) => setEditingCard({ ...editingCard, dueDate: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" />Hora</label>
                    <input type="time" value={editingCard.dueTime} onChange={(e) => setEditingCard({ ...editingCard, dueTime: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1"><Clock className="w-3.5 h-3.5 inline mr-1" />Tiempo estimado</label>
                  <input type="text" value={editingCard.estTime} onChange={(e) => setEditingCard({ ...editingCard, estTime: e.target.value })} placeholder="Ej: 2h, 30m" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button onClick={closeDetailModal} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                <button onClick={saveDetailModal} className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-[#3573A3] text-white hover:opacity-90 transition-all"><Save className="w-4 h-4" /> Guardar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}