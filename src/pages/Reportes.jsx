import { useState } from 'react'
import Layout from '../components/Layout'
import { Download, FileText, FileSpreadsheet, File, Search, Users, Calendar, X, Building, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAttendance, todayKey } from '../context/AttendanceContext'
import ExcelJS from 'exceljs'

export default function Reportes() {
  const { attendance } = useAttendance()
  const [selectedMateria, setSelectedMateria] = useState(null)
  const [filters, setFilters] = useState({
    institucion: '',
    programa: '',
    materia: '',
    fechaInicio: '',
    fechaFin: '',
  })

  const today = todayKey()
  const todayAttendance = attendance.filter(a => a.date === today)

  const groupedBySubject = {}
  todayAttendance.forEach(a => {
    const key = a.subject || 'Sin materia'
    if (!groupedBySubject[key]) groupedBySubject[key] = []
    groupedBySubject[key].push(a)
  })

  const handleExportXLSX = async () => {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'FUNDMSJS'
    workbook.created = new Date()

    const sheet = workbook.addWorksheet('Reporte General')
    sheet.columns = [
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Cedula', key: 'nationalId', width: 15 },
      { header: 'Seccion', key: 'seccion', width: 15 },
      { header: 'Materia', key: 'subject', width: 25 },
      { header: 'Representante', key: 'representante', width: 25 },
      { header: 'Hora', key: 'time', width: 12 },
      { header: 'Fecha', key: 'date', width: 12 },
      { header: 'Instituto', key: 'instituto', width: 20 },
    ]

    todayAttendance.forEach(a => {
      sheet.addRow({
        name: a.name,
        nationalId: a.nationalId,
        seccion: a.seccion,
        subject: a.subject,
        representante: a.representante || '',
        time: a.time,
        date: a.date,
        instituto: a.instituto || '',
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FUNDMSJS_Reporte_${today}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
  }

  const getMateriaStats = (materiaName) => {
    const items = groupedBySubject[materiaName] || []
    const total = items.length
    return {
      studentsCount: new Set(items.map(i => i.nationalId)).size,
      averageAttendance: total > 0 ? '95%' : '0%',
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
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight">REPORTES GENERALES</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Genera y descarga reportes tabulares consolidados de asistencia.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[150px] -z-10"></div>
            <h3 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Configurar Reporte
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary flex items-center gap-2">
                  <Building className="w-4 h-4" /> Institucion (Opcional)
                </label>
                <select
                  className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none"
                  value={filters.institucion}
                  onChange={(e) => setFilters({ ...filters, institucion: e.target.value })}
                >
                  <option>Todas las Instituciones</option>
                  <option>FUNDMSJS</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/></svg> Programa (Opcional)
                </label>
                <select
                  className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none"
                  value={filters.programa}
                  onChange={(e) => setFilters({ ...filters, programa: e.target.value })}
                >
                  <option>Todos los Programas</option>
                  <option>FUNDMSJS</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Materia
                </label>
                <select
                  className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none"
                  value={filters.materia}
                  onChange={(e) => setFilters({ ...filters, materia: e.target.value })}
                >
                  <option>Todas las Materias</option>
                  {Object.keys(groupedBySubject).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-secondary">Fecha Inicio</label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-secondary">Fecha Fin</label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportXLSX}
                className="flex-1 bg-[#207245] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Exportar XLSX
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportPDF}
                className="flex-1 bg-[#d32f2f] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <File className="w-5 h-5" />
                Exportar PDF
              </motion.button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-4 relative overflow-hidden"
            >
              <h3 className="font-heading text-xl font-bold text-primary mb-2">Desglose por Materia</h3>
              <div className="flex flex-col gap-3">
                {Object.keys(groupedBySubject).length > 0 ? (
                  Object.entries(groupedBySubject).map(([materiaName, items]) => {
                    const stats = getMateriaStats(materiaName)
                    return (
                      <div
                        key={materiaName}
                        onClick={() => setSelectedMateria({ name: materiaName, items })}
                        className="p-4 bg-white rounded-xl border border-outline-variant flex justify-between items-center hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="font-bold text-primary">{materiaName}</span>
                          </div>
                          <span className="text-xs text-secondary mt-1 font-medium">{stats.studentsCount} estudiantes</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-heading text-lg font-bold text-primary">{stats.averageAttendance}</span>
                          <span className="text-[10px] uppercase font-bold text-secondary">Asistencia</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-secondary">
                    <FileText className="w-12 h-12 text-outline-variant mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No hay datos de asistencia hoy</p>
                    <p className="text-xs text-outline mt-1">Los reportes se generan con datos de asistencia</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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
              className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-surface-variant bg-surface flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 opacity-20 rounded-bl-[200px] -z-10"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-primary text-white">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedMateria.name}</h2>
                      <span className="inline-block mt-2 text-xs font-bold px-3 py-1 bg-surface border border-outline-variant rounded-full text-secondary">
                        {selectedMateria.items.length} Registros
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMateria(null)}
                  className="w-10 h-10 bg-white shadow-sm border border-outline-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-surface/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-primary text-xl">Registro de Estudiantes</h3>
                  <div className="bg-white px-4 py-2 border border-outline-variant rounded-xl shadow-sm font-bold text-primary">
                    Total: <span className="text-primary">{selectedMateria.items.length}</span>
                  </div>
                </div>

                <div className="bg-white border border-surface-variant rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-variant/30 text-xs text-secondary uppercase tracking-widest">
                        <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Estudiante</th>
                        <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Cedula</th>
                        <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Seccion</th>
                        <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {selectedMateria.items.map((student, idx) => (
                        <tr key={idx} className="hover:bg-primary/5 transition-colors">
                          <td className="py-4 px-6 font-bold text-primary">{student.name}</td>
                          <td className="py-4 px-6 text-sm text-secondary font-medium">{student.nationalId}</td>
                          <td className="py-4 px-6 text-sm text-secondary font-medium">{student.seccion}</td>
                          <td className="py-4 px-6 text-sm text-secondary font-medium">{student.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}