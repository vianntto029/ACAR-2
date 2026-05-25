import Layout from '../components/Layout'
import { GraduationCap, Download, FileText, Search, Upload, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ExcelJS from 'exceljs'

const estudiantesNotas = [
  { id: '1', name: 'Ana López', notas: { '1er': 18, '2do': 16, '3er': 19 }, promedio: 17.7 },
  { id: '2', name: 'Carlos Gómez', notas: { '1er': 15, '2do': 14, '3er': 16 }, promedio: 15.0 },
  { id: '3', name: 'María Rodríguez', notas: { '1er': 20, '2do': 19, '3er': 20 }, promedio: 19.7 },
  { id: '4', name: 'Pedro Sánchez', notas: { '1er': 12, '2do': 13, '3er': 14 }, promedio: 13.0 },
  { id: '5', name: 'Lucía Fernández', notas: { '1er': 10, '2do': 11, '3er': 9 }, promedio: 10.0 },
]

export default function Notas() {
  const [selectedTrimestre, setSelectedTrimestre] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [editNotas, setEditNotas] = useState({ '1er': '', '2do': '', '3er': '' })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', '1er': '', '2do': '', '3er': '' })
  const [students, setStudents] = useState(estudiantesNotas)

  const filtered = students.filter(s => {
    const match = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    return match
  })

  const handleEditClick = (student) => {
    setEditingStudent(student)
    setEditNotas({
      '1er': student.notas['1er'].toString(),
      '2do': student.notas['2do'].toString(),
      '3er': student.notas['3er'].toString(),
    })
    setShowEditModal(true)
  }

  const handleSaveNotas = () => {
    const n1 = parseFloat(editNotas['1er'])
    const n2 = parseFloat(editNotas['2do'])
    const n3 = parseFloat(editNotas['3er'])
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) return
    setStudents(prev => prev.map(s => {
      if (s.id === editingStudent.id) {
        return { ...s, notas: { '1er': n1, '2do': n2, '3er': n3 }, promedio: Math.round(((n1 + n2 + n3) / 3) * 10) / 10 }
      }
      return s
    }))
    setShowEditModal(false)
    setEditingStudent(null)
  }

  const handleAddStudent = () => {
    if (!newStudent.name.trim()) return
    const n1 = parseFloat(newStudent['1er'])
    const n2 = parseFloat(newStudent['2do'])
    const n3 = parseFloat(newStudent['3er'])
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) return
    const id = String(Date.now())
    setStudents(prev => [...prev, { id, name: newStudent.name.trim(), notas: { '1er': n1, '2do': n2, '3er': n3 }, promedio: Math.round(((n1 + n2 + n3) / 3) * 10) / 10 }])
    setNewStudent({ name: '', '1er': '', '2do': '', '3er': '' })
    setShowAddForm(false)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const workbook = new ExcelJS.Workbook()
        const buf = evt.target.result
        await workbook.xlsx.load(buf)
        const sheet = workbook.worksheets[0]
        const rows = []
        sheet.eachRow((row, rowIdx) => {
          if (rowIdx === 1) return
          const name = row.getCell(1).value
          const t1 = parseFloat(row.getCell(2).value)
          const t2 = parseFloat(row.getCell(3).value)
          const t3 = parseFloat(row.getCell(4).value)
          if (name && !isNaN(t1) && !isNaN(t2) && !isNaN(t3)) {
            rows.push({ id: String(Date.now() + rows.length), name: String(name), notas: { '1er': t1, '2do': t2, '3er': t3 }, promedio: Math.round(((t1 + t2 + t3) / 3) * 10) / 10 })
          }
        })
        if (rows.length > 0) setStudents(prev => [...prev, ...rows])
      } catch (err) {
        alert('Error al leer el archivo. Asegúrate de que sea un Excel válido con columnas: Nombre, 1er, 2do, 3er.')
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const clearAll = () => {
    if (window.confirm('¿Estás seguro de limpiar todos los datos de notas?')) {
      setStudents([])
    }
  }

  const getStatusText = (prom) => {
    if (prom >= 14) return { text: 'Aprobado', color: 'text-green-600 bg-green-50 border-green-200' }
    if (prom >= 10) return { text: 'Debe recuperación', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
    return { text: 'Reprobado', color: 'text-red-600 bg-red-50 border-red-200' }
  }

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Notas')
    sheet.columns = [
      { header: 'Estudiante', key: 'name', width: 30 },
      { header: '1er Trimestre', key: 't1', width: 16 },
      { header: '2do Trimestre', key: 't2', width: 16 },
      { header: '3er Trimestre', key: 't3', width: 16 },
      { header: 'Promedio', key: 'prom', width: 14 },
      { header: 'Estado', key: 'status', width: 22 },
    ]
    const headerRow = sheet.getRow(1)
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3573A3' } }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      }
    })
    students.forEach(s => {
      sheet.addRow({ name: s.name, t1: s.notas['1er'], t2: s.notas['2do'], t3: s.notas['3er'], prom: s.promedio, status: getStatusText(s.promedio).text })
    })
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    const win = window.open('', '_blank')
    const statuses = students.map(s => getStatusText(s.promedio).text)
    const rows = students.map((s, i) => `
      <tr>
        <td>${s.name}</td>
        <td>${s.notas['1er']}</td>
        <td>${s.notas['2do']}</td>
        <td>${s.notas['3er']}</td>
        <td><strong>${s.promedio}</strong></td>
        <td>${statuses[i]}</td>
      </tr>
    `).join('')
    win.document.write(`
      <html>
      <head>
        <title>Notas</title>
        <style>
          @media print {
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { text-align: center; color: #3573A3; margin-bottom: 8px; }
            p.sub { text-align: center; color: #666; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #3573A3; color: #fff; padding: 10px 12px; text-align: center; font-size: 13px; }
            td { padding: 8px 12px; text-align: center; border: 1px solid #ccc; font-size: 12px; }
            th:first-child, td:first-child { text-align: left; }
            tr:nth-child(even) { background: #f5f8fa; }
          }
        </style>
      </head>
      <body>
        <h1>REGISTRO DE NOTAS</h1>
        <p class="sub">Calificaciones por trimestre académico</p>
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>1er Trimestre</th>
              <th>2do Trimestre</th>
              <th>3er Trimestre</th>
              <th>Promedio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  const getNotaColor = (nota) => {
    if (nota >= 18) return 'text-green-600 bg-green-50'
    if (nota >= 14) return 'text-blue-600 bg-blue-50'
    if (nota >= 10) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">REGISTRO DE NOTAS</h1>
          <p className="text-secondary mt-2 font-medium">Calificaciones por trimestre académico</p>
        </div>
        <div className="flex gap-2">
          <select value={selectedTrimestre} onChange={(e) => setSelectedTrimestre(e.target.value)} className="bg-white/90 border border-white/60 rounded-xl px-4 py-2.5 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm">
            <option value="todos">Todos los trimestres</option>
            <option value="1er">1er Trimestre</option>
            <option value="2do">2do Trimestre</option>
            <option value="3er">3er Trimestre</option>
          </select>
        </div>
      </motion.div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar estudiante..." className="w-full bg-white/90 border border-white/60 rounded-xl pl-12 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" />
        </div>
        <div className="flex gap-2">
          <motion.button onClick={() => setShowAddForm(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#3573A3] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all text-sm">
            <Plus className="w-4 h-4" /> Subir manualmente
          </motion.button>
          <label className="cursor-pointer">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white border border-outline-variant text-primary px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-surface transition-all text-sm">
              <Upload className="w-4 h-4" /> Subir archivo
            </motion.div>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <motion.button onClick={clearAll} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-red-100 transition-all text-sm">
            <Trash2 className="w-4 h-4" /> Limpiar
          </motion.button>
        </div>
      </div>

      <div className="glass-panel-solid rounded-[2rem] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3573A3]/10 text-secondary text-xs tracking-widest uppercase font-bold">
                <th className="py-5 px-6 border-b border-outline-variant/20">Estudiante</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">1er Trim</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">2do Trim</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">3er Trim</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">Promedio</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">Estado</th>
                <th className="py-5 px-6 border-b border-outline-variant/20 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3573A3]/10 text-[#3573A3] flex items-center justify-center font-bold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="font-bold text-primary text-sm">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${getNotaColor(student.notas['1er'])}`}>{student.notas['1er']}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${getNotaColor(student.notas['2do'])}`}>{student.notas['2do']}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${getNotaColor(student.notas['3er'])}`}>{student.notas['3er']}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-heading text-xl font-bold text-primary">{student.promedio}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusText(student.promedio).color}`}>
                      {getStatusText(student.promedio).text}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleEditClick(student)} className="text-xs font-bold text-[#3573A3] hover:text-[#d8629d] transition-colors bg-[#3573A3]/10 hover:bg-[#d8629d]/10 px-3 py-1.5 rounded-lg">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <motion.button onClick={exportPDF} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white border border-outline-variant text-primary px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-surface transition-all text-sm">
          <FileText className="w-4 h-4" /> Exportar PDF
        </motion.button>
        <motion.button onClick={exportExcel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#207245] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all text-sm">
          <Download className="w-4 h-4" /> Exportar Excel
        </motion.button>
      </div>

      <AnimatePresence>
        {showEditModal && editingStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface">
                <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  Editar Notas - {editingStudent.name}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {['1er', '2do', '3er'].map(trim => (
                  <div key={trim}>
                    <label className="text-sm font-semibold text-secondary block mb-1">{trim} Trimestre</label>
                    <input type="number" min="0" max="20" step="0.5" value={editNotas[trim]} onChange={(e) => setEditNotas({ ...editNotas, [trim]: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button onClick={() => setShowEditModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                <button onClick={handleSaveNotas} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 shadow-sm transition-all">Guardar Notas</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-surface-variant">
              <div className="p-6 border-b border-surface-variant bg-surface">
                <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Agregar Estudiante
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-secondary block mb-1">Nombre del estudiante</label>
                  <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="Nombre y apellido" className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                </div>
                {['1er', '2do', '3er'].map(trim => (
                  <div key={trim}>
                    <label className="text-sm font-semibold text-secondary block mb-1">{trim} Trimestre</label>
                    <input type="number" min="0" max="20" step="0.5" value={newStudent[trim]} onChange={(e) => setNewStudent({ ...newStudent, [trim]: e.target.value })} className="w-full bg-surface-variant/50 border border-surface-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button onClick={() => setShowAddForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors">Cancelar</button>
                <button onClick={handleAddStudent} className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 shadow-sm transition-all">Agregar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
