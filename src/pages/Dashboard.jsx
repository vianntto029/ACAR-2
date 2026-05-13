import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import {
  Building, Library, QrCode, Users, Download, User, Check, AlertCircle,
  RefreshCw, MessageSquare, X, FileText, Plus, Clock, Radio, Calendar
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAttendance, todayKey } from '../context/AttendanceContext'
import { db, ref, push } from '../firebase'
import ExcelJS from 'exceljs'
import { motion, AnimatePresence } from 'motion/react'

export default function Dashboard() {
  const { attendance, resetAttendance } = useAttendance()
  const today = todayKey()

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [observationText, setObservationText] = useState('')
  const [activeForm, setActiveForm] = useState(null)
  const [formValue, setFormValue] = useState('')
  const [currentMateria, setCurrentMateria] = useState('Programa ACAR')
  const [currentInstituto, setCurrentInstituto] = useState('Programa ACAR')
  const [currentPrograma, setCurrentPrograma] = useState('')

  const todayAttendance = attendance.filter(a => a.date === today)
  const attendanceCount = todayAttendance.length
  const totalStudents = 30
  const percentage = totalStudents > 0 ? Math.round((attendanceCount / totalStudents) * 100) : 0

  const handleSave = async () => {
    if (!formValue.trim()) return
    if (activeForm === 'materia') {
      await push(ref(db, 'Materias'), {
        name: formValue.trim(),
        time: '',
        students: 0,
        description: '',
        semestre: new Date().getFullYear().toString(),
        profesor: '',
        aula: '',
        unidadesDeCredito: 3,
        temario: [],
      })
    }
    setFormValue('')
    setActiveForm(null)
  }

  const handleCancel = () => {
    setFormValue('')
    setActiveForm(null)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'ACAR'
    workbook.created = new Date()

    const sheet = workbook.addWorksheet('Asistencia')
    sheet.columns = [
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Cedula', key: 'nationalId', width: 15 },
      { header: 'Seccion', key: 'seccion', width: 15 },
      { header: 'Materia', key: 'subject', width: 25 },
      { header: 'Representante', key: 'representante', width: 25 },
      { header: 'Hora', key: 'time', width: 12 },
      { header: 'Fecha', key: 'date', width: 12 },
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
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ACAR_Asistencia_${today}.xlsx`
    a.click()
    URL.revokeObjectURL(url)

    setTimeout(() => setIsDownloading(false), 1500)
  }

  const handleReset = () => {
    if (confirm('Reiniciar la lista de hoy?')) {
      resetAttendance(today)
    }
  }

  const qrData = `https://acar-asistencia.vercel.app/registro?materia=${encodeURIComponent(currentMateria)}&instituto=${encodeURIComponent(currentInstituto)}`

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const bgColors = [
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
  ]
  const getBgClass = (idx) => bgColors[idx % bgColors.length]

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 py-2"
      >
        <div className="text-left flex flex-col items-start xl:w-2/5">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">PANEL DE CONTROL</h1>
          <p className="text-base lg:text-lg text-secondary mt-2 font-medium leading-relaxed max-w-sm">
            ¡Hola! ¿Que aventura vamos a registrar hoy?
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full xl:w-auto min-h-[44px] justify-start xl:justify-end">
          <AnimatePresence mode="wait">
            {activeForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 bg-white/70 p-1 rounded-xl border border-white/60 shadow-sm w-full xl:w-96"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder={`Nombre de ${activeForm === 'instituto' ? 'la institucion' : activeForm}...`}
                  className="flex-1 bg-transparent px-3 py-2 outline-none text-primary placeholder:text-outline text-sm font-medium"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formValue.trim()) handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                />
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 text-sm font-semibold text-secondary hover:bg-surface-variant rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => formValue.trim() && handleSave()}
                  disabled={!formValue.trim()}
                  className="px-3 py-2 text-sm font-bold bg-[#d8629d] text-white rounded-lg shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Guardar
                </button>
              </motion.div>
            ) : (
              <motion.div key="buttons" className="flex flex-wrap gap-2 justify-start xl:justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveForm('instituto'); setFormValue(currentInstituto) }}
                  className="bg-primary hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Building className="w-4 h-4" />
                  Agregar Instituto
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('materia')}
                  className="bg-primary hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Library className="w-4 h-4" />
                  Agregar Materia
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('programa')}
                  className="bg-primary hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Building className="w-4 h-4" />
                  Agregar Programa
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowManualListModal(true)}
                  className="bg-white hover:bg-surface-variant text-primary border border-outline-variant px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Users className="w-4 h-4" />
                  Agregar Lista Manual
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-solid rounded-[2rem] p-8 flex flex-col items-center text-center shadow-lg"
          >
            <h3 className="font-heading text-2xl font-semibold text-primary mb-2">Codigo de Asistencia</h3>
            <p className="text-secondary mb-6 font-medium text-sm">
              Materia: <strong className="text-primary">{currentMateria}</strong><br />
              Instituto: <strong className="text-primary">{currentInstituto}</strong>
              {currentPrograma && <><br />Programa: <strong className="text-primary">{currentPrograma}</strong></>}
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-surface-variant mb-8 w-48 h-48 flex items-center justify-center relative group hover:shadow-xl transition-shadow duration-300">
              <QRCodeSVG
                value={qrData}
                size={160}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#417490"
              />
            </div>

            <button
              onClick={() => window.open(qrData, '_blank')}
              className="w-full py-4 rounded-xl text-xs tracking-widest uppercase flex justify-center items-center gap-2 font-bold text-white bg-primary shadow-[0_4px_14px_0_rgba(65,116,144,0.39)] hover:shadow-[0_6px_20px_rgba(65,116,144,0.23)] transition-all"
            >
              <QrCode className="w-5 h-5" />
              Ver Registro Publico
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-solid rounded-[2rem] p-8 shadow-lg"
          >
            <h4 className="text-xs text-secondary/80 uppercase tracking-widest font-bold mb-4">Resumen de Hoy</h4>
            <div className="flex justify-between items-end">
              <div>
                <span className="font-heading text-6xl font-bold text-primary leading-none">{attendanceCount}</span>
                <span className="text-lg text-secondary font-medium ml-2">/ {totalStudents}</span>
              </div>
              <div>
                <Users className="w-10 h-10 text-secondary" />
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-3 mt-6 overflow-hidden border border-white/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-primary h-full rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-solid rounded-[2rem] h-full flex flex-col overflow-hidden shadow-lg"
          >
            <div className="p-6 md:p-8 border-b border-outline-variant/20 bg-primary/5 flex flex-col sm:flex-row justify-between items-start rounded-t-[2rem]">
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <div className="bg-white/90 px-2 py-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white w-full sm:max-w-[200px]">
                  <input
                    type="date"
                    defaultValue={today}
                    className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer w-full text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowObservationModal(true)}
                  className="bg-white/90 border border-white hover:bg-white text-primary px-4 py-2.5 rounded-xl font-bold flex items-center justify-start gap-3 shadow-sm transition-all w-full sm:max-w-[200px] text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Observaciones</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="bg-[#207245] border border-transparent hover:opacity-90 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-start gap-3 shadow-sm transition-all w-full sm:max-w-[200px] overflow-hidden text-sm"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {isDownloading ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>¡Exportado!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="download"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Excel</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all w-full sm:max-w-[200px] mt-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reiniciar Lista</span>
                </motion.button>
              </div>

              <div className="bg-white/90 px-6 py-5 rounded-2xl shadow-sm border border-white flex flex-col justify-center items-center mt-6 sm:mt-0 sm:ml-6 ml-auto min-w-[220px]">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-primary flex items-center gap-3 tracking-tight">
                  <Radio className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
                  <span className="text-center leading-tight">ASISTENCIA<br />EN VIVO</span>
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/30 text-secondary text-xs tracking-widest uppercase font-bold">
                    <th className="py-5 px-6 border-b border-outline-variant/20">Estudiante</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">Seccion</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">Hora</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">Materia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {todayAttendance.length > 0 ? (
                    todayAttendance.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-primary/5 transition-colors duration-200">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner border ${getBgClass(idx)}`}>
                            {getInitials(student.name)}
                          </div>
                          <span
                            className="font-bold text-primary cursor-pointer hover:underline decoration-primary/50 underline-offset-4"
                            onClick={() => setSelectedStudent(student)}
                          >
                            {student.name}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-secondary font-medium">{student.seccion}</td>
                        <td className="py-4 px-6 text-secondary font-medium">{student.time}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-primary font-bold text-xs">{student.subject}</span>
                            <span className="text-secondary text-[10px]">{student.instituto}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-secondary">
                        <QrCode className="w-12 h-12 text-outline-variant mx-auto mb-4 opacity-50" />
                        <p className="font-medium text-lg">Esperando registros de asistencia</p>
                        <p className="text-sm text-outline mt-1">Los estudiantes pueden escanear el codigo QR para registrarse</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant/20 text-center bg-surface-variant/20 rounded-b-[2rem]">
              <p className="text-xs text-outline font-bold tracking-widest uppercase">Ultima actualizacion: Ahora mismo</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 mb-12 glass-panel-solid rounded-[2rem] p-8 shadow-lg w-full"
      >
        <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">Estadisticas de la Jornada</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-primary font-bold text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                Asistieron
              </span>
              <div className="flex items-end gap-2 text-primary font-bold">
                <span className="text-3xl font-heading leading-none">{attendanceCount}</span>
                <span className="text-lg opacity-80 pb-0.5">({percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
              <div
                className="bg-[#10b981] h-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-secondary font-bold text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                Inasistencias
              </span>
              <div className="flex items-end gap-2 text-secondary font-bold">
                <span className="text-3xl font-heading leading-none">{Math.max(0, totalStudents - attendanceCount)}</span>
                <span className="text-lg opacity-80 pb-0.5">({100 - percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
              <div
                className="bg-red-400 h-full transition-all duration-1000"
                style={{ width: `${100 - percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showManualListModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="bg-primary/10 p-2 rounded-xl text-primary"><Users className="w-6 h-6" /></span>
                  Carga Manual de Estudiantes
                </h2>
                <button
                  onClick={() => setShowManualListModal(false)}
                  className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-outline-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto bg-surface/30">
                <div className="border-2 border-dashed border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white mb-6">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">Importar Archivo CSV o Excel</h3>
                  <p className="text-secondary text-sm max-w-md mx-auto mb-6">Arrastra y suelta tu archivo aqui o haz clic para seleccionarlo de tu dispositivo.</p>
                  <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                    Seleccionar Archivo
                  </button>
                </div>

                <h4 className="font-bold text-primary mb-4">Ingreso Manual</h4>
                <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm mb-4">
                  <div className="flex gap-4">
                    <input type="text" placeholder="Nombre completo" className="flex-1 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                    <input type="text" placeholder="Seccion" className="w-48 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                    <button className="bg-surface-variant hover:bg-outline-variant text-primary font-bold px-6 rounded-xl transition-colors">
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button
                  onClick={() => setShowManualListModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={() => setShowManualListModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#d8629d] text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  Guardar Lista
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-surface-variant text-center"
            >
              <div className="bg-primary pt-12 pb-8 px-6 relative rounded-b-[20%]">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-lg flex items-center justify-center text-primary font-heading font-bold text-4xl mb-4 border-4 border-white/20">
                  {getInitials(selectedStudent.name)}
                </div>
                <h3 className="text-white font-bold text-2xl px-4">{selectedStudent.name}</h3>
              </div>
              <div className="p-8">
                <p className="text-secondary font-medium mb-1 uppercase tracking-widest text-xs">Cedula</p>
                <p className="font-bold text-primary text-lg mb-4">{selectedStudent.nationalId}</p>
                <p className="text-secondary font-medium mb-1 uppercase tracking-widest text-xs">Representante</p>
                <p className="font-bold text-primary text-lg mb-4">{selectedStudent.representante || 'No especificado'}</p>
                <p className="text-secondary font-medium mb-1 uppercase tracking-widest text-xs">Total de Asistencias</p>
                <div className="font-heading text-5xl font-bold text-primary mb-2">
                  {attendance.filter(a => a.nationalId === selectedStudent.nationalId).length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showObservationModal && (
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
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-surface-variant flex flex-col"
            >
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  Observaciones de la Lista
                </h2>
                <button
                  onClick={() => setShowObservationModal(false)}
                  className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-outline-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-4 bg-surface/30">
                <p className="text-secondary font-medium text-sm">
                  Anade cualquier observacion relevante sobre la clase, el grupo o particularidades de los estudiantes presentes.
                </p>
                <textarea
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  placeholder="Ej. Muchos estudiantes llegaron tarde por la lluvia..."
                  className="w-full h-40 bg-white border border-outline-variant rounded-xl p-4 text-primary shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all duration-300"
                ></textarea>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button
                  onClick={() => setShowObservationModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (observationText.trim()) {
                      alert('Observacion guardada (simulado)')
                    }
                    setShowObservationModal(false)
                    setObservationText('')
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-primary text-white hover:opacity-90 shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Guardar Observacion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}