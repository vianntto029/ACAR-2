import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import {
  Building, Library, QrCode, Users, Download, User, Check, AlertCircle,
  RefreshCw, MessageSquare, X, FileText, Radio, Copy, ExternalLink
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAttendance, todayKey } from '../context/AttendanceContext'
import { db, ref, push } from '../firebase'
import ExcelJS from 'exceljs'
import { motion, AnimatePresence } from 'motion/react'

export default function Dashboard() {
  const { attendance, resetAttendance, sessions, currentSessionId, initSession, setCurrentSessionId, getSessionsByDate, getAttendanceBySession } = useAttendance()
  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState(today)
  const totalStudents = 30
  const todaySessions = getSessionsByDate(selectedDate)
  const sessionAttendance = currentSessionId ? getAttendanceBySession(currentSessionId) : []
  const displayAttendance = currentSessionId ? sessionAttendance : attendance.filter(a => a.date === selectedDate)
  const sessionTotal = displayAttendance.length
  const sessionPct = totalStudents > 0 ? Math.round((sessionTotal / totalStudents) * 100) : 0
  const [dateNav, setDateNav] = useState('today')

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [observationText, setObservationText] = useState('')
  const [activeForm, setActiveForm] = useState(null)
  const [formValue, setFormValue] = useState('')
  const [currentMateria, setCurrentMateria] = useState(() => {
    const saved = localStorage.getItem('acar_materia'); return saved !== null ? saved : 'Programa ACAR'
  })
  const [currentInstituto, setCurrentInstituto] = useState(() => {
    const saved = localStorage.getItem('acar_instituto'); return saved !== null ? saved : 'Programa ACAR'
  })
  const [currentPrograma, setCurrentPrograma] = useState(() => {
    const saved = localStorage.getItem('acar_programa'); return saved !== null ? saved : ''
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [showManualListModal, setShowManualListModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrStatus, setQrStatus] = useState('active')
  const [manualName, setManualName] = useState('')
  const [manualSeccion, setManualSeccion] = useState('')
  const [manualList, setManualList] = useState([])
  const [manualStatus, setManualStatus] = useState('')
  const [excelStudents, setExcelStudents] = useState([])
  const [excelAsistencia, setExcelAsistencia] = useState({})
  const fileInputRef = useRef(null)
  const qrLinkRef = useRef(null)
  const [exposicionMode, setExposicionMode] = useState(false)
  useEffect(() => { localStorage.setItem('acar_materia', currentMateria) }, [currentMateria])
  useEffect(() => { localStorage.setItem('acar_instituto', currentInstituto) }, [currentInstituto])
  useEffect(() => { localStorage.setItem('acar_programa', currentPrograma) }, [currentPrograma])

  const handleSave = async () => {
    if (!formValue.trim()) return
    if (activeForm === 'instituto') setCurrentInstituto(formValue.trim())
    if (activeForm === 'materia') setCurrentMateria(formValue.trim())
    if (activeForm === 'programa') setCurrentPrograma(formValue.trim())
    setQrStatus('pending')
    setFormValue('')
    setActiveForm(null)
  }

  const handleGenerate = () => {
    setQrStatus('active')
    initSession({ materia: currentMateria, instituto: currentInstituto, programa: currentPrograma })
    setSelectedDate(today)
    setDateNav('today')
  }

  const handleCancel = () => {
    setFormValue('')
    setActiveForm(null)
  }

  const handleResetMateria = () => {
    setCurrentMateria('')
    setQrStatus('pending')
  }

  const handleResetInstituto = () => {
    setCurrentInstituto('')
    setQrStatus('pending')
  }

  const handleResetPrograma = () => {
    setCurrentPrograma('')
    setQrStatus('pending')
  }

  const handleOpenQR = () => {
    if (qrStatus === 'pending') return
    setShowQRModal(true)
    navigator.clipboard.writeText(qrData)
  }

  const handleAddToManualList = () => {
    if (!manualName.trim() || !manualSeccion.trim()) {
      setManualStatus('Completa nombre y seccion.')
      return
    }
    setManualList(prev => [...prev, {
      id: Date.now().toString(),
      name: manualName.trim(),
      seccion: manualSeccion.trim(),
    }])
    setManualName('')
    setManualSeccion('')
    setManualStatus(`${manualList.length + 1} estudiante(s) agregado(s)`)
  }

  const handleSaveManualList = async () => {
    if (manualList.length === 0) return
    setManualStatus('Guardando...')
    try {
      for (const student of manualList) {
        await push(ref(db, `institutos/ACAR/attendance`), {
          name: student.name,
          subject: currentMateria || 'Programa ACAR',
          nationalId: 'MANUAL-' + student.id,
          seccion: student.seccion,
          representante: '',
          date: today,
          time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
          code: `ACAR-${today}`,
          instituto: currentInstituto || 'Programa ACAR',
        })
      }
      setManualStatus(`${manualList.length} estudiante(s) registrado(s) en Firebase`)
      setManualList([])
      setTimeout(() => {
        setShowManualListModal(false)
        setManualStatus('')
      }, 1500)
    } catch (err) {
      setManualStatus('Error al guardar: ' + err.message)
    }
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setManualStatus('Leyendo archivo...')
    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)
      const sheet = workbook.worksheets[0]
      const students = []
      sheet.eachRow((row, rowIdx) => {
        if (rowIdx === 1) return
        const name = String(row.getCell(1).value || '').trim()
        const cedula = String(row.getCell(2).value || '').trim()
        if (name) students.push({ id: Date.now().toString() + rowIdx, name, cedula })
      })
      if (students.length === 0) {
        setManualStatus('No se encontraron estudiantes en el archivo')
        return
      }
      setExcelStudents(students)
      const asist = {}
      students.forEach(s => { asist[s.id] = true })
      setExcelAsistencia(asist)
      setManualStatus(`${students.length} estudiante(s) cargado(s) desde Excel`)
      setManualList([])
    } catch (err) {
      setManualStatus('Error al leer Excel: ' + err.message)
    }
    e.target.value = ''
  }

  const handleSaveExcelList = async () => {
    const selected = excelStudents.filter(s => excelAsistencia[s.id])
    if (selected.length === 0) { setManualStatus('Selecciona al menos un estudiante'); return }
    setManualStatus('Guardando...')
    try {
      for (const student of selected) {
        await push(ref(db, `institutos/ACAR/attendance`), {
          name: student.name,
          subject: currentMateria || 'Programa ACAR',
          nationalId: student.cedula || 'EXCEL-' + student.id,
          seccion: 'Cargado',
          representante: '',
          date: today,
          time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
          code: `ACAR-${today}`,
          instituto: currentInstituto || 'Programa ACAR',
        })
      }
      setManualStatus(`${selected.length} estudiante(s) registrado(s) como ASISTENTE(S)`)
      setExcelStudents([])
      setExcelAsistencia({})
      setTimeout(() => {
        setShowManualListModal(false)
        setManualStatus('')
      }, 1500)
    } catch (err) {
      setManualStatus('Error al guardar: ' + err.message)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'ACAR'
      workbook.created = new Date()

      const sheet = workbook.addWorksheet('Asistencia')
      sheet.columns = [
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Cedula', key: 'nationalId', width: 18 },
        { header: 'Seccion', key: 'seccion', width: 15 },
        { header: 'Materia', key: 'subject', width: 25 },
        { header: 'Representante', key: 'representante', width: 30 },
        { header: 'Hora', key: 'time', width: 15 },
        { header: 'Fecha', key: 'date', width: 15 },
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

      sheet.getRow(1).font = { bold: true, size: 11 }
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3573A3' } }
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

      const buf = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ACAR_Asistencia_${today}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (err) {
      console.error('Excel error:', err)
    }
    setTimeout(() => setIsDownloading(false), 1500)
  }

  const handleReset = () => {
    if (confirm(`¿Reiniciar la lista del ${selectedDate}?`)) {
      resetAttendance(selectedDate)
    }
  }

  const qrData = `https://acar-2-git-main-vianntto029s-projects.vercel.app/registro?materia=${encodeURIComponent(currentMateria)}`

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
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Building className="w-4 h-4" />
                  Agregar Instituto
                </motion.button>
                {currentInstituto && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetInstituto}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-2 py-2 rounded-lg transition-all shadow-sm text-sm"
                    title="Reiniciar instituto"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('materia')}
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Library className="w-4 h-4" />
                  Agregar Materia
                </motion.button>
                {currentMateria !== 'Programa ACAR' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetMateria}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-2 py-2 rounded-lg transition-all shadow-sm text-sm"
                    title="Reiniciar materia"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('programa')}
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Building className="w-4 h-4" />
                  Agregar Programa
                </motion.button>
                {currentPrograma && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetPrograma}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-2 py-2 rounded-lg transition-all shadow-sm text-sm"
                    title="Reiniciar programa"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                )}
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

            <AnimatePresence mode="wait">
              {qrStatus === 'pending' ? (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center p-6 border border-dashed border-outline-variant rounded-2xl mb-8 w-full min-h-[12rem] bg-surface-variant/30"
                >
                  <AlertCircle className="w-8 h-8 text-secondary mb-3 opacity-50" />
                  <p className="text-primary font-bold mb-4 text-center">Despliegue listo para generar nuevo codigo QR?</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    className="bg-[#d8629d] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generar QR
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-4 rounded-2xl shadow-md border border-surface-variant mb-8 w-48 h-48 flex items-center justify-center relative group hover:shadow-xl transition-shadow duration-300"
                >
                  <QRCodeSVG
                    value={qrData}
                    size={160}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#3573A3"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={qrStatus === 'pending'}
              onClick={handleOpenQR}
              className={`w-full py-4 rounded-xl text-xs tracking-widest uppercase flex justify-center items-center gap-2 font-bold text-white transition-all ${qrStatus === 'pending' ? 'bg-outline-variant shadow-none opacity-50 cursor-not-allowed' : 'bg-[#3573A3] shadow-[0_4px_14px_0_rgba(37,91,118,0.39)] hover:shadow-[0_6px_20px_rgba(37,91,118,0.23)]'}`}
            >
              <QrCode className="w-5 h-5" />
              Codigo QR
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-solid rounded-[2rem] p-8 shadow-lg"
          >
            <h4 className="text-xs text-secondary/80 uppercase tracking-widest font-bold mb-4">{selectedDate === today ? 'Resumen de Hoy' : selectedDate}</h4>
            <div className="flex justify-between items-end">
              <div>
                <span className="font-heading text-6xl font-bold text-primary leading-none">{sessionTotal}</span>
                <span className="text-lg text-secondary font-medium ml-2">/ {totalStudents}</span>
              </div>
              <div>
                <Users className="w-10 h-10 text-secondary" />
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-3 mt-6 overflow-hidden border border-white/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sessionPct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-[#3573A3] h-full rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-medium">Sesiones del día</span>
                <span className="font-bold text-primary">{todaySessions.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {todaySessions.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-all ${currentSessionId === s.id ? 'bg-primary text-white shadow-sm' : 'bg-surface-variant/50 text-secondary hover:text-primary'}`}
                  >
                    {s.materia || `Lista ${i + 1}`}
                    <span className="ml-1 opacity-70">({getAttendanceBySession(s.id).length})</span>
                  </button>
                ))}
              </div>
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
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setCurrentSessionId(null) }}
                    className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer w-full text-sm"
                  />
                  {selectedDate !== today && (
                    <button onClick={() => { setSelectedDate(today); setCurrentSessionId(null) }} className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg whitespace-nowrap hover:bg-primary/20 transition-colors">Hoy</button>
                  )}
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
                    <th className="py-5 px-6 border-b border-outline-variant/20">FORMATO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {displayAttendance.length > 0 ? (
                    <>
                      {displayAttendance.map((student, idx) => (
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
                              <span className="text-primary font-bold text-xs">{currentMateria}</span>
                              <span className="text-secondary text-[10px]">{currentInstituto}{currentPrograma ? ` | ${currentPrograma}` : ''}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="hover:bg-primary/5 transition-colors duration-200">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-variant text-secondary flex items-center justify-center font-bold shadow-inner">
                            <User className="w-5 h-5" />
                          </div>
                          <span className="text-secondary italic font-medium">Esperando...</span>
                        </td>
                        <td className="py-4 px-6 text-secondary font-medium">-</td>
                        <td className="py-4 px-6 text-secondary font-medium">-</td>
                        <td className="py-4 px-6 text-secondary font-medium">-</td>
                      </tr>
                    </>
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
              <p className="text-xs text-outline font-bold tracking-widest uppercase">Última actualización: Ahora mismo</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 mb-12 rounded-[2rem] p-8 shadow-lg w-full transition-all ${exposicionMode ? 'bg-[#fefce8] border-2 border-yellow-400' : 'glass-panel-solid'}`}
      >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm">ESTADISTICAS DIARIAS — {selectedDate}</h4>
            {exposicionMode && (
              <span className="text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full uppercase tracking-wider">REFERENCIA</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExposicionMode(!exposicionMode)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${exposicionMode ? 'bg-yellow-400 text-yellow-900 shadow-sm' : 'bg-white border border-outline-variant text-secondary hover:text-primary'}`}
            >
              {exposicionMode ? 'Desactivar Vista' : 'Vista de Exposición'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExposicionMode(false)}
              className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Reiniciar
            </motion.button>
          </div>
        </div>

        {exposicionMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Estudiantes Registrados', value: '1,247', sub: 'en el período', color: 'text-primary', bar: 'bg-primary' },
                { label: 'Asistencias Totales', value: '1,083', sub: `${sessionPct}% de la capacidad`, color: 'text-[#10b981]', bar: 'bg-[#10b981]' },
                { label: 'Instituciones Activas', value: '8', sub: 'en todo el país', color: 'text-[#d8629d]', bar: 'bg-[#d8629d]' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`font-heading text-4xl font-bold ${item.color} leading-none`}>{item.value}</p>
                  <p className="text-xs text-secondary mt-1">{item.sub}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                    <div className={`${item.bar} h-full rounded-full`} style={{ width: `${60 + i * 15}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-3">Comparativa por Período</p>
              <div className="flex items-end gap-4 h-32">
                {[{ label: 'Ene', v: 65 }, { label: 'Feb', v: 72 }, { label: 'Mar', v: 80 }, { label: 'Abr', v: 68 }, { label: 'May', v: 78 }, { label: 'Jun', v: 85 }, { label: 'Jul', v: 0 }].map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-[#3573A3]/20 rounded-t-lg" style={{ height: `${m.v * 1.5}px`, minHeight: m.v > 0 ? '8px' : '0' }}>
                      {m.v > 0 && <div className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80" style={{ height: `${m.v * 1.5}px` }}></div>}
                    </div>
                    <span className="text-[10px] font-bold text-secondary">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[10px] text-secondary/60 italic">* Datos de referencia con fines demostrativos</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-primary font-bold text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                  Asistieron
                </span>
                <div className="flex items-end gap-2 text-primary font-bold">
                  <span className="text-3xl font-heading leading-none">{sessionTotal}</span>
                  <span className="text-lg opacity-80 pb-0.5">({sessionPct}%)</span>
                </div>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
                <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: `${sessionPct}%` }}></div>
              </div>
              <p className="text-xs text-secondary/70 mt-2 font-medium">{selectedDate} — {displayAttendance.length} registros</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary font-bold text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  Inasistencias
                </span>
                <div className="flex items-end gap-2 text-secondary font-bold">
                  <span className="text-3xl font-heading leading-none">{Math.max(0, totalStudents - sessionTotal)}</span>
                  <span className="text-lg opacity-80 pb-0.5">({100 - sessionPct}%)</span>
                </div>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
                <div className="bg-red-400 h-full transition-all duration-1000" style={{ width: `${100 - sessionPct}%` }}></div>
              </div>
              <p className="text-xs text-secondary/70 mt-2 font-medium">Total esperado: {totalStudents} estudiantes</p>
            </div>
          </div>
        )}
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
                {manualStatus && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {manualStatus}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Carga Manual</span>
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="flex-1 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddToManualList()}
                    />
                    <input
                      type="text"
                      placeholder="Seccion"
                      value={manualSeccion}
                      onChange={(e) => setManualSeccion(e.target.value)}
                      className="w-full sm:w-48 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddToManualList()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToManualList}
                      className="bg-[#3573A3] hover:bg-[#d8629d] text-white font-bold px-6 rounded-xl transition-all"
                    >
                      Agregar
                    </motion.button>
                  </div>
                </div>

                {manualList.length > 0 && (
                  <div className="bg-white rounded-2xl border border-surface-variant shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-surface-variant bg-surface/50">
                      <h4 className="font-bold text-primary">Lista Temporal ({manualList.length} estudiante(s))</h4>
                    </div>
                    <div className="divide-y divide-surface-variant/50 max-h-48 overflow-y-auto">
                      {manualList.map((student) => (
                        <div key={student.id} className="flex justify-between items-center px-4 py-3">
                          <div>
                            <span className="font-semibold text-primary">{student.name}</span>
                            <span className="text-secondary text-sm ml-2">- {student.seccion}</span>
                          </div>
                          <button
                            onClick={() => setManualList(prev => prev.filter(s => s.id !== student.id))}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Carga por Excel</span>
                  <div className="flex-1 h-px bg-outline-variant/40"></div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm mb-6">
                  <p className="text-sm text-secondary font-medium mb-3">Sube un archivo Excel (.xlsx) con columnas: <strong>Nombre</strong> (col A), <strong>Cédula</strong> (col B). La primera fila se ignora como encabezado.</p>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border-2 border-dashed border-primary/30 text-primary px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Seleccionar Archivo Excel
                    </motion.button>
                  </div>
                </div>

                {excelStudents.length > 0 && (
                  <div className="bg-white rounded-2xl border border-surface-variant shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-surface-variant bg-surface/50 flex justify-between items-center">
                      <h4 className="font-bold text-primary">Estudiantes desde Excel ({excelStudents.length})</h4>
                      <span className="text-xs text-secondary font-medium">{excelStudents.filter(s => excelAsistencia[s.id]).length} seleccionados</span>
                    </div>
                    <div className="divide-y divide-surface-variant/50 max-h-64 overflow-y-auto">
                      {excelStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between px-4 py-3 hover:bg-surface-variant/20 transition-colors">
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={excelAsistencia[student.id] || false}
                              onChange={() => setExcelAsistencia(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                              className="w-4 h-4 rounded accent-[#10b981]"
                            />
                            <div>
                              <span className={`font-semibold text-sm ${excelAsistencia[student.id] ? 'text-primary' : 'text-secondary line-through'}`}>{student.name}</span>
                              {student.cedula && <span className="text-secondary text-xs ml-2">({student.cedula})</span>}
                            </div>
                          </label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${excelAsistencia[student.id] ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                            {excelAsistencia[student.id] ? 'ASISTENTE' : 'AUSENTE'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button
                  onClick={() => { setShowManualListModal(false); setManualList([]); setExcelStudents([]); setExcelAsistencia({}); setManualStatus('') }}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Descartar
                </button>
                {excelStudents.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveExcelList}
                    disabled={excelStudents.filter(s => excelAsistencia[s.id]).length === 0}
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#10b981] text-white hover:opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar Asistentes desde Excel
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveManualList}
                  disabled={manualList.length === 0}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#d8629d] text-white hover:opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Lista Manual en Firebase
                </motion.button>
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
                    window.alert('Documento de observaciones exportado (Simulado)')
                    setShowObservationModal(false)
                    setObservationText('')
                  }}
                  disabled={!observationText.trim()}
                  className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-[#3573A3] text-white hover:opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  Exportar Documento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-surface-variant text-center"
            >
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-xl font-bold text-primary">Codigo QR de Asistencia</h2>
                <button onClick={() => setShowQRModal(false)} className="w-8 h-8 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-surface-variant">
                  <QRCodeSVG
                    value={qrData}
                    size={280}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#3573A3"
                  />
                </div>
                <p className="text-secondary text-sm font-medium">Materia: <strong className="text-primary">{currentMateria}</strong></p>
                <p className="text-secondary text-sm font-medium">Instituto: <strong className="text-primary">{currentInstituto}</strong></p>
                {currentPrograma && <p className="text-secondary text-sm font-medium">Programa: <strong className="text-primary">{currentPrograma}</strong></p>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { navigator.clipboard.writeText(qrData); setShowQRModal(false) }}
                  className="bg-[#3573A3] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  Copiar enlace
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}