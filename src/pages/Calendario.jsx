import Layout from '../components/Layout'
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Edit3, Trash2, MapPin, Clock, AlignLeft, Sun } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const presetColors = ['#3573A3', '#d8629d', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#F44336', '#607D8B']

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([
    { id: '1', date: '2026-05-15', title: 'Clase Matemáticas', type: 'Clase', color: '#3573A3', startTime: '08:00', endTime: '09:30', allDay: false, location: 'Aula 101', description: 'Álgebra lineal - Capítulo 5' },
    { id: '2', date: '2026-05-18', title: 'Entrega de notas', type: 'Evaluación', color: '#d8629d', startTime: '', endTime: '', allDay: true, location: '', description: 'Fecha límite para cargar notas del 2do trimestre' },
    { id: '3', date: '2026-05-22', title: 'Reunión de padres', type: 'Reunión', color: '#4CAF50', startTime: '14:00', endTime: '16:00', allDay: false, location: 'Salón de actos', description: 'Entrega de boletines' },
    { id: '4', date: '2026-05-15', title: 'Evaluación Física', type: 'Evaluación', color: '#FF9800', startTime: '10:00', endTime: '11:00', allDay: false, location: 'Cancha deportiva', description: '' },
  ])
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [dragEvent, setDragEvent] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragRect, setDragRect] = useState(null)
  const [dropTargetDate, setDropTargetDate] = useState(null)
  const gridRef = useRef(null)
  const eventRefs = useRef({})

  const [form, setForm] = useState({
    title: '', date: '', type: '', color: '#3573A3',
    startTime: '', endTime: '', allDay: false, location: '', description: '',
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const todayStr = new Date().toISOString().split('T')[0]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const resetForm = (dateStr) => {
    setForm({ title: '', date: dateStr || '', type: '', color: '#3573A3', startTime: '', endTime: '', allDay: false, location: '', description: '' })
  }

  const openAddModal = (dateStr) => {
    setEditingEventId(null)
    resetForm(dateStr)
    setShowEventModal(true)
  }

  const openEditModal = (ev, e) => {
    if (e) { e.stopPropagation(); if (dragEvent) return }
    setEditingEventId(ev.id)
    setForm({ title: ev.title, date: ev.date, type: ev.type, color: ev.color, startTime: ev.startTime || '', endTime: ev.endTime || '', allDay: ev.allDay || false, location: ev.location || '', description: ev.description || '' })
    setShowEventModal(true)
  }

  const handleSaveEvent = () => {
    if (!form.title || !form.date) return
    const payload = { ...form, startTime: form.allDay ? '' : form.startTime, endTime: form.allDay ? '' : form.endTime }
    if (editingEventId) {
      setEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, ...payload } : ev))
    } else {
      setEvents(prev => [...prev, { id: String(Date.now()), ...payload }])
    }
    setShowEventModal(false)
    setEditingEventId(null)
  }

  const handleDeleteEvent = () => {
    if (!editingEventId) return
    setEvents(prev => prev.filter(ev => ev.id !== editingEventId))
    setShowEventModal(false)
    setEditingEventId(null)
  }

  const getEventStyle = (color) => ({
    backgroundColor: `${color}18`,
    color: color,
    borderColor: `${color}40`,
  })

  const getEventStyleSolid = (color) => ({
    backgroundColor: color,
    color: '#fff',
  })

  const handleMouseDown = (ev, e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    const el = eventRefs.current[ev.id]
    if (!el) return
    const rect = el.getBoundingClientRect()
    setDragEvent(ev)
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragRect({ width: rect.width, height: rect.height })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragEvent) return
    setDragRect(prev => prev ? { ...prev } : null)
    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('[data-date]')
      let found = null
      cells.forEach(cell => {
        const rect = cell.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          found = cell.getAttribute('data-date')
        }
      })
      setDropTargetDate(found)
    }
  }, [dragEvent])

  const handleMouseUp = useCallback(() => {
    if (dragEvent && dropTargetDate && dropTargetDate !== dragEvent.date) {
      setEvents(prev => prev.map(ev => ev.id === dragEvent.id ? { ...ev, date: dropTargetDate } : ev))
    }
    setDragEvent(null)
    setDropTargetDate(null)
    setDragRect(null)
  }, [dragEvent, dropTargetDate])

  useEffect(() => {
    if (!dragEvent) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragEvent, handleMouseMove, handleMouseUp])

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
              const isDropTarget = dropTargetDate === dateStr && dragEvent
              return (
                <div
                  key={day}
                  data-date={dateStr}
                  className={`min-h-[80px] md:min-h-[100px] p-1 rounded-lg border transition-all cursor-pointer ${isToday ? 'border-primary bg-primary/5' : 'border-transparent'} ${isDropTarget ? 'bg-surface-variant/30' : 'hover:bg-primary/5'}`}
                  onClick={() => openAddModal(dateStr)}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${isToday ? 'bg-primary text-white' : 'text-secondary'}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5 mt-1">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const isDragging = dragEvent?.id === ev.id
                      return (
                        <div
                          key={ev.id}
                          ref={el => { eventRefs.current[ev.id] = el }}
                          onMouseDown={(e) => handleMouseDown(ev, e)}
                          onClick={(e) => openEditModal(ev, e)}
                          style={getEventStyle(ev.color)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold truncate border cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity ${isDragging ? 'opacity-0' : ''}`}
                        >
                          {ev.allDay ? ev.title : `${ev.startTime?.slice(0, 5) || ''} ${ev.title}`}
                        </div>
                      )
                    })}
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {[...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8).map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
                  <div className="text-center min-w-[36px]">
                    <div className="text-xs font-bold" style={{ color: ev.color }}>{ev.date.split('-')[2]}</div>
                    <div className="text-[10px] text-secondary uppercase">{monthNames[parseInt(ev.date.split('-')[1]) - 1].substring(0, 3)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary truncate flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                      {ev.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-secondary mt-0.5">
                      {!ev.allDay && ev.startTime && <span>{ev.startTime.slice(0, 5)}</span>}
                      {ev.type && <span className="truncate">{ev.type}</span>}
                    </div>
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

      {dragEvent && dragRect && (
        <div
          className="fixed pointer-events-none z-[999] text-xs px-1.5 py-0.5 rounded font-semibold truncate border shadow-xl"
          style={{
            ...getEventStyle(dragEvent.color),
            position: 'fixed',
            top: dragEvent.y !== undefined ? dragEvent.y - dragOffset.y : 0,
            left: dragEvent.x !== undefined ? dragEvent.x - dragOffset.x : 0,
            width: dragRect.width,
            height: dragRect.height,
            transform: 'scale(1.05) rotate(0.5deg)',
            zIndex: 9999,
          }}
        >
          {dragEvent.allDay ? dragEvent.title : `${dragEvent.startTime?.slice(0, 5) || ''} ${dragEvent.title}`}
        </div>
      )}

      <AnimatePresence>
        {showEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  {editingEventId ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                <button onClick={() => { setShowEventModal(false); setEditingEventId(null) }} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Título *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nombre del evento" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1">Fecha *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-1">Tipo</label>
                    <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Ej: Clase, Taller, Examen" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.allDay} onChange={(e) => setForm({ ...form, allDay: e.target.checked })} className="w-4 h-4 rounded border-surface-variant text-primary focus:ring-primary" />
                    <span className="text-sm font-semibold text-secondary flex items-center gap-1.5"><Sun className="w-3.5 h-3.5" />Todo el día</span>
                  </label>
                </div>
                {!form.allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-secondary block mb-1">Hora inicio</label>
                      <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-secondary block mb-1">Hora fin</label>
                      <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Ubicación</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Aula, salón, dirección..." className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1 flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Descripción</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Notas o detalles adicionales..." className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium resize-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Color del evento</label>
                  <div className="flex gap-2 flex-wrap">
                    {presetColors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm({ ...form, color: c })}
                        className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
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
                  <button onClick={handleSaveEvent} disabled={!form.title || !form.date} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 transition-all disabled:opacity-50">Guardar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
