import Layout from '../components/Layout'
import { Search, User, GraduationCap, BookOpen, ChevronDown, ChevronUp, MessageSquare, Building2, Library } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const estudiantesMock = [
  { id: '1', name: 'Ana López', cedula: 'V-28567123', seccion: 'Sabatino A', profesor: 'Carlos Méndez', asistencias: 15, observaciones: 'Buena participación en clase', programa: 'Medicina', instituto: 'IUSF', materia: 'Anatomía' },
  { id: '2', name: 'Carlos Gómez', cedula: 'V-30123456', seccion: 'Sabatino A', profesor: 'Carlos Méndez', asistencias: 14, observaciones: '', programa: 'Medicina', instituto: 'IUSF', materia: 'Anatomía' },
  { id: '3', name: 'María Rodríguez', cedula: 'V-25987654', seccion: 'Sabatino B', profesor: 'Ana Torres', asistencias: 8, observaciones: 'Llegó tarde varias veces', programa: 'Enfermería', instituto: 'IUSF', materia: 'Farmacología' },
  { id: '4', name: 'Pedro Sánchez', cedula: 'V-27890123', seccion: 'Sabatino B', profesor: 'Ana Torres', asistencias: 12, observaciones: '', programa: 'Enfermería', instituto: 'IUSF', materia: 'Farmacología' },
]

export default function BaseDatos() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [selectedProf, setSelectedProf] = useState('todos')
  const [selectedPrograma, setSelectedPrograma] = useState('todos')
  const [selectedInstituto, setSelectedInstituto] = useState('todos')
  const [selectedMateria, setSelectedMateria] = useState('todos')

  const filtered = estudiantesMock.filter(s => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) || s.cedula.includes(search)
    const profMatch = selectedProf === 'todos' || s.profesor === selectedProf
    const progMatch = selectedPrograma === 'todos' || s.programa === selectedPrograma
    const instMatch = selectedInstituto === 'todos' || s.instituto === selectedInstituto
    const matMatch = selectedMateria === 'todos' || s.materia === selectedMateria
    return match && profMatch && progMatch && instMatch && matMatch
  })

  const profesores = [...new Set(estudiantesMock.map(s => s.profesor))]
  const programas = [...new Set(estudiantesMock.map(s => s.programa))]
  const institutos = [...new Set(estudiantesMock.map(s => s.instituto))]
  const materias = [...new Set(estudiantesMock.map(s => s.materia))]

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-2">BASE DE DATOS</h1>
        <p className="text-secondary font-medium mb-6">Información de estudiantes, profesores y observaciones</p>
      </motion.div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o cédula..." className="w-full bg-white/90 border border-white/60 rounded-xl pl-12 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" />
          </div>
          <select value={selectedProf} onChange={(e) => setSelectedProf(e.target.value)} className="bg-white/90 border border-white/60 rounded-xl px-4 py-3 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium">
            <option value="todos">Todos los profesores</option>
            {profesores.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select value={selectedPrograma} onChange={(e) => setSelectedPrograma(e.target.value)} className="flex-1 bg-white/90 border border-white/60 rounded-xl px-4 py-3 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium">
            <option value="todos">Todos los programas</option>
            {programas.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={selectedInstituto} onChange={(e) => setSelectedInstituto(e.target.value)} className="flex-1 bg-white/90 border border-white/60 rounded-xl px-4 py-3 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium">
            <option value="todos">Todos los institutos</option>
            {institutos.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)} className="flex-1 bg-white/90 border border-white/60 rounded-xl px-4 py-3 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium">
            <option value="todos">Todas las materias</option>
            {materias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel-solid rounded-[2rem] overflow-hidden shadow-lg">
          <div className="p-6 border-b border-outline-variant/20 bg-primary/5 flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary">Estudiantes ({filtered.length})</h3>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {filtered.map(student => (
              <div key={student.id}>
                <div
                  className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3573A3]/10 text-[#3573A3] flex items-center justify-center font-bold">
                      {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-primary text-sm">{student.name}</span>
                      <span className="text-secondary text-xs ml-2">{student.cedula}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-secondary">{student.seccion}</span>
                    <span className="text-xs font-bold text-primary">{student.asistencias} asistencias</span>
                    {expandedId === student.id ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-secondary" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === student.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pl-16 pr-4 bg-surface/30 p-4 rounded-b-xl">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-secondary font-semibold uppercase mb-1">Profesor</p>
                            <p className="text-sm font-bold text-primary flex items-center gap-1"><User className="w-3 h-3" />{student.profesor}</p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary font-semibold uppercase mb-1">Programa</p>
                            <p className="text-sm font-bold text-primary flex items-center gap-1"><GraduationCap className="w-3 h-3" />{student.programa}</p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary font-semibold uppercase mb-1">Instituto</p>
                            <p className="text-sm font-bold text-primary flex items-center gap-1"><Building2 className="w-3 h-3" />{student.instituto}</p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary font-semibold uppercase mb-1">Materia</p>
                            <p className="text-sm font-bold text-primary flex items-center gap-1"><Library className="w-3 h-3" />{student.materia}</p>
                          </div>
                          {student.observaciones && (
                            <div className="col-span-2">
                              <p className="text-xs text-secondary font-semibold uppercase mb-1">Observaciones</p>
                              <p className="text-sm text-primary flex items-center gap-1"><MessageSquare className="w-3 h-3" />{student.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel-solid rounded-[2rem] p-6 shadow-lg">
            <h3 className="font-bold text-primary mb-4">Profesores</h3>
            <div className="space-y-3">
              {profesores.map((prof, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setSelectedProf(prof)}>
                  <div className="w-10 h-10 rounded-full bg-[#d8629d]/10 text-[#d8629d] flex items-center justify-center font-bold">
                    {prof.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-semibold text-primary text-sm">{prof}</span>
                    <span className="text-xs text-secondary block">{estudiantesMock.filter(s => s.profesor === prof).length} estudiantes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
