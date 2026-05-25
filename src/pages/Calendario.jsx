import Layout from '../components/Layout'
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Edit3, Trash2 } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([
    { id: '1', date: '2026-05-15', title: 'Clase Matemáticas', type: 'clase' },
    { id: '2', date: '2026-05-18', title: 'Entrega de notas', type: 'evaluacion' },
    { id: '3', date: '2026-05-22', title: 'Reunión de padres', type: 'reunion' },
    { id: '4', date: '2026-05-15', title: 'Evaluación Física', type: 'evaluacion' },
  ])
  const [showEventModal, setShowEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'clase' })
  const [editingEventId, setEditingEventId] = useState(null)
  const [dragEvent, setDragEvent] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [hoverDate, setHoverDate] = useState(null)
  const gridRef = useRef(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const typeColors = {
    clase: 'bg-[#3573A3]/10 text-[#3573A3] border-[#3573A3]/20',
    evaluacion: 'bg-[#d8629d]/10 text-[#d8629d] border-[#d8629d]/20',
    reunion: 'bg-[#a2d2b2]/10 text-green-700 border-[#a2d2b2]/30',
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const openAddModal = (dateStr) => {
    setEditingEventId(null)
    setNewEvent({ title: '', date: dateStr || '', type: 'clase' })
    setShowEventModal(true)
  }

  const openEditModal = (ev, e) => {
    e.stopPropagation()
    setEditingEventId(ev.id)
    setNewEvent({ title: ev.title, date: ev.date, type: ev.type })
    setShowEventModal(true)
  }

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    if (editingEventId) {
      setEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, title: newEvent.title, date: newEvent.date, type: newEvent.type } : ev))
    } else {
      setEvents(prev => [...prev, { id: String(Date.now()), ...newEvent }])
    }
    setNewEvent({ title: '', date: '', type: 'clase' })
    setEditingEventId(null)
    setShowEventModal(false)
  }

  const handleDeleteEvent = () => {
    if (!editingEventId) return
    setEvents(prev => prev.filter(ev => ev.id !== editingEventId))
    setNewEvent({ title: '', date: '', type: 'clase' })
    setEditingEventId(null)
    setShowEventModal(false)
  }

  const handleEventMouseDown = (ev, e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    setDragEvent(ev)
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragEvent) return
    setDragPos({ x: e.clientX, y: e.clientY })
    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('[data-date]')
      let found = null
      cells.forEach(cell => {
        const rect = cell.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          found = cell.getAttribute('data-date')
        }
      })
      setHoverDate(found)
    }
  }, [dragEvent])

  const handleMouseUp = useCallback(() => {
    if (dragEvent && hoverDate && hoverDate !== dragEvent.date) {
      setEvents(prev => prev.map(ev => ev.id === dragEvent.id ? { ...ev, date: hoverDate } : ev))
    }
    setDragEvent(null)
    setHoverDate(null)
  }, [dragEvent, hoverDate])

  useEffect(() => {
    if (!dragEvent) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragEvent, handleMouseMove, handleMouseUp])

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-6">CALENDARIO ACADEMICO</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 glass-panel-solid rounded-[2rem] p-6 md:p-8 shadow-lg overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevMonth} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-primary" />
            </motion.button>
            <h2 className="font-heading text-2xl font-bold text-primary">{monthNames[month]} {year}</h2>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextMonth} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
              <ChevronRight className="w-5 h-5 text-primary" />
            </motion.button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-center text-xs font-bold text-secondary uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>

          <div ref={gridRef} className="grid grid-cols-7 gap-1 select-none">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = events.filter(e => e.date === dateStr)
              const isToday = dateStr === todayStr
              const isHover = hoverDate === dateStr && dragEvent
              return (
                <div
                  key={day}
                  data-date={dateStr}
                  className={`min-h-[80px] md:min-h-[100px] p-1 rounded-lg border transition-all cursor-pointer ${isToday ? 'border-primary bg-primary/5' : 'border-transparent'} ${isHover ? 'bg-primary/10 border-primary/30' : 'hover:bg-primary/5'}`}
                  onClick={() => openAddModal(dateStr)}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${isToday ? 'bg-primary text-white' : 'text-secondary'}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5 mt-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onMouseDown={(e) => handleEventMouseDown(ev, e)}
                        onClick={(e) => openEditModal(ev, e)}
                        className={`text-[10px] px-1 py-0.5 rounded font-semibold truncate border cursor-grab active:cursor-grabbing ${typeColors[ev.type] || 'bg-gray-100'} hover:opacity-80 transition-opacity`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-secondary font-semibold px-1">+{dayEvents.length - 2} más</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-panel-solid rounded-[2rem] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary">Próximos Eventos</h3>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAddModal('')} className="bg-[#3573A3] text-white p-2 rounded-xl">
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {[...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
                  <div className="text-center min-w-[36px]">
                    <div className="text-xs font-bold text-primary">{ev.date.split('-')[2]}</div>
                    <div className="text-[10px] text-secondary uppercase">{monthNames[parseInt(ev.date.split('-')[1]) - 1].substring(0, 3)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary truncate">{ev.title}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeColors[ev.type]}`}>{ev.type}</span>
                  </div>
                  <button onClick={(e) => openEditModal(ev, e)} className="text-secondary hover:text-primary transition-colors shrink-0">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {dragEvent && (
        <div
          className="fixed pointer-events-none z-[999] text-xs px-2 py-1 rounded-lg font-semibold border shadow-xl opacity-90"
          style={{ left: dragPos.x + 10, top: dragPos.y + 10, backgroundColor: typeColors[dragEvent.type] ? '#3573A3' : '#f3f4f6', color: '#fff' }}
        >
          {dragEvent.title}
        </div>
      )}

      <AnimatePresence>
        {showEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  {editingEventId ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                <button onClick={() => { setShowEventModal(false); setEditingEventId(null) }} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Título</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Nombre del evento" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Fecha</label>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Tipo</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium">
                    <option value="clase">Clase</option>
                    <option value="evaluacion">Evaluación</option>
                    <option value="reunion">Reunión</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-between gap-3">
                <div>
                  {editingEventId && (
                    <button onClick={handleDeleteEvent} className="px-6 py-2.5 rounded-xl font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowEventModal(false); setEditingEventId(null) }} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                  <button onClick={handleSaveEvent} disabled={!newEvent.title || !newEvent.date} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 transition-all disabled:opacity-50">Guardar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
