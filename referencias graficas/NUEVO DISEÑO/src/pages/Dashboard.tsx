import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Building, Library, QrCode, Users, Radio, Download, User, Check, AlertCircle, RefreshCw, MessageSquare, X, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [activeForm, setActiveForm] = useState<'instituto' | 'materia' | 'programa' | null>(null);
  const [formValue, setFormValue] = useState('');
  
  const [qrStatus, setQrStatus] = useState<'active' | 'pending'>('active');
  const [currentMateria, setCurrentMateria] = useState('Matemáticas Avanzadas');
  const [currentInstituto, setCurrentInstituto] = useState('Politécnico Central');
  const [currentPrograma, setCurrentPrograma] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(24);
  const [totalStudents, setTotalStudents] = useState(30);
  const [showTable, setShowTable] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showManualListModal, setShowManualListModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{name: string, totalAttendances: number} | null>(null);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [observationText, setObservationText] = useState('');

  const studentsMockData = [
    { id: 'MAT-2024-001', name: 'Ana López', initials: 'AL', time: '08:02 AM', bgClass: 'bg-pink-100 text-pink-700 border-pink-200', totalAttendances: 15, attended: true },
    { id: 'MAT-2024-015', name: 'Carlos Gómez', initials: 'CG', time: '08:05 AM', bgClass: 'bg-green-100 text-green-700 border-green-200', totalAttendances: 14, attended: true },
    { id: 'MAT-2024-042', name: 'María Rodríguez', initials: 'MR', time: '08:16 AM', bgClass: 'bg-orange-100 text-orange-700 border-orange-200', totalAttendances: 8, attended: true },
  ];

  const handleReset = () => {
    setQrStatus('active');
    setAttendanceCount(24);
    setTotalStudents(30);
    setShowTable(true);
    setCurrentMateria('Matemáticas Avanzadas');
    setCurrentInstituto('Politécnico Central');
    setCurrentPrograma('');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!formValue.trim()) return;

    if (activeForm === 'instituto') setCurrentInstituto(formValue.trim());
    if (activeForm === 'materia') setCurrentMateria(formValue.trim());
    if (activeForm === 'programa') setCurrentPrograma(formValue.trim());

    setQrStatus('pending');
    setAttendanceCount(0);
    setTotalStudents(0); // Will update after generating
    setShowTable(false); // Hide the old table data
    setFormValue('');
    setActiveForm(null);
  };

  const handleGenerate = () => {
    setQrStatus('active');
    setAttendanceCount(0);
    setTotalStudents(35); // A new imaginary class size
    setShowTable(true);
  };

  const handleCancel = () => {
    setFormValue('');
    setActiveForm(null);
  };
  return (
    <Layout>
      {/* Header / Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 py-2"
      >
        <div className="text-left flex flex-col items-start xl:w-2/5">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">PANEL DE CONTROL</h1>
          <p className="text-base lg:text-lg text-secondary mt-2 font-medium leading-relaxed max-w-sm">
            ¡Hola! ¿Qué aventura vamos a registrar hoy?
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
                  placeholder={`Nombre de ${activeForm === 'instituto' ? 'la institución' : activeForm}...`}
                  className="flex-1 bg-transparent px-3 py-2 outline-none text-primary placeholder:text-outline text-sm font-medium"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formValue.trim()) handleSave();
                    if (e.key === 'Escape') handleCancel();
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
                  onClick={() => setActiveForm('instituto')}
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Building className="w-4 h-4" />
                  Agregar Instituto
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('materia')}
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
                >
                  <Library className="w-4 h-4" />
                  Agregar Materia
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveForm('programa')}
                  className="bg-[#3573A3] hover:bg-[#d8629d] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-sm text-sm"
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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* QR Card */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-solid rounded-[2rem] p-8 flex flex-col items-center text-center shadow-lg"
          >
            <h3 className="font-heading text-2xl font-semibold text-primary mb-2">Código de Asistencia</h3>
            <p className="text-secondary mb-6 font-medium text-sm">
              Materia: <strong className="text-primary">{currentMateria}</strong><br/>
              Instituto: <strong className="text-primary">{currentInstituto}</strong>
              {currentPrograma && <><br/>Programa: <strong className="text-primary">{currentPrograma}</strong></>}
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
                  <p className="text-primary font-bold mb-4 text-center">¿Despliegue listo para generar nuevo código QR?</p>
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
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://acar.edu.co/registro/${encodeURIComponent(currentMateria)}&color=255b76`} 
                    alt="QR Code" 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity rounded"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={qrStatus === 'pending'}
              className={`w-full py-4 rounded-xl text-xs tracking-widest uppercase flex justify-center items-center gap-2 font-bold text-white transition-all ${qrStatus === 'pending' ? 'bg-outline-variant shadow-none opacity-50 cursor-not-allowed' : 'bg-[#3573A3] shadow-[0_4px_14px_0_rgba(37,91,118,0.39)] hover:shadow-[0_6px_20px_rgba(37,91,118,0.23)]'}`}
            >
              <QrCode className="w-5 h-5" />
              Abrir Scanner
            </motion.button>
          </motion.div>

          {/* Stats */}
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
                animate={{ width: `${totalStudents === 0 ? 0 : (attendanceCount / totalStudents) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-[#3573A3] h-full rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Table */}
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
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer w-full text-sm"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowObservationModal(true)}
                  className="bg-white/90 border border-white hover:bg-white text-[#3573A3] px-4 py-2.5 rounded-xl font-bold flex items-center justify-start gap-3 shadow-sm transition-all w-full sm:max-w-[200px] text-sm"
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
                  <span className="text-center leading-tight">ASISTENCIA<br/>EN VIVO</span>
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/30 text-secondary text-xs tracking-widest uppercase font-bold">
                    <th className="py-5 px-6 border-b border-outline-variant/20">Estudiante</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">Sección</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">Hora</th>
                    <th className="py-5 px-6 border-b border-outline-variant/20">FORMATO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {showTable ? (
                    <>
                      {studentsMockData.map((student) => (
                        <tr key={student.id} className="hover:bg-primary/5 transition-colors duration-200">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner border ${student.bgClass}`}>
                              {student.initials}
                            </div>
                            <span 
                              className="font-bold text-primary cursor-pointer hover:underline decoration-primary/50 underline-offset-4"
                              onClick={() => setSelectedStudent({ name: student.name, totalAttendances: student.totalAttendances })}
                            >
                              {student.name}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-secondary font-medium">{student.id}</td>
                          <td className="py-4 px-6 text-secondary font-medium">{student.time}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-primary font-bold text-xs">{currentMateria}</span>
                              <span className="text-secondary text-[10px]">{currentInstituto} {currentPrograma ? `| ${currentPrograma}` : ''}</span>
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
                        <p className="font-medium text-lg">Esperando a generar código QR para iniciar el registro</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant/20 text-center bg-surface-variant/20 rounded-b-[2rem]">
              <p className="text-xs text-outline font-bold tracking-widest uppercase">Última actualización: Hace un momento</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Daily Statistics Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 mb-12 glass-panel-solid rounded-[2rem] p-8 shadow-lg w-full"
      >
        <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">Estadísticas de la Jornada</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-primary font-bold text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                Asistieron
              </span>
              <div className="flex items-end gap-2 text-primary font-bold">
                <span className="text-3xl font-heading leading-none">{attendanceCount}</span>
                <span className="text-lg opacity-80 pb-0.5">({Math.round((attendanceCount / totalStudents) * 100) || 0}%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
              <div 
                className="bg-[#10b981] h-full transition-all duration-1000" 
                style={{ width: `${(attendanceCount / totalStudents) * 100 || 0}%` }}
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
                <span className="text-lg opacity-80 pb-0.5">({Math.round((Math.max(0, totalStudents - attendanceCount) / totalStudents) * 100) || 0}%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden border border-outline-variant/30">
              <div 
                className="bg-red-400 h-full transition-all duration-1000" 
                style={{ width: `${(Math.max(0, totalStudents - attendanceCount) / totalStudents) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manual List Modal Overlay */}
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
                  ✕
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto bg-surface/30">
                <div className="border-2 border-dashed border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white mb-6">
                  <div className="w-16 h-16 bg-primary-container text-primary-container rounded-full flex items-center justify-center mb-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">Importar Archivo CSV o Excel</h3>
                  <p className="text-secondary text-sm max-w-md mx-auto mb-6">Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo de tu dispositivo. Debe contener columnas de Nombre y Sección.</p>
                  <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                    Seleccionar Archivo
                  </button>
                </div>
                
                <h4 className="font-bold text-primary mb-4">Ingreso Manual</h4>
                <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm mb-4">
                  <div className="flex gap-4">
                    <input type="text" placeholder="Nombre completo" className="flex-1 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
                    <input type="text" placeholder="Sección" className="w-48 bg-surface-variant/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium" />
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

      {/* Student Detail Modal Overlay */}
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
              <div className="bg-[#3573A3] pt-12 pb-8 px-6 relative rounded-b-[20%]">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>
                <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-lg flex items-center justify-center text-[#3573A3] font-heading font-bold text-4xl mb-4 border-4 border-[#3573A3]/20">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-white font-bold text-2xl px-4">{selectedStudent.name}</h3>
              </div>
              <div className="p-8">
                <p className="text-secondary font-medium mb-1 uppercase tracking-widest text-xs">Total de Asistencias Registradas</p>
                <div className="font-heading text-5xl font-bold text-primary mb-2">
                  {selectedStudent.totalAttendances}
                </div>
                <p className="text-sm font-medium text-[#10b981] bg-[#10b981]/10 inline-block px-4 py-1.5 rounded-full mt-2">
                  Asistencia Sobresaliente
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Observation Modal Overlay */}
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
                <div className="absolute top-0 left-0 w-full h-1 bg-[#3573A3]"></div>
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
                  Añade cualquier observación relevante sobre la clase, el grupo o particularidades de los estudiantes presentes.
                </p>
                <textarea 
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  placeholder="Ej: Muchos estudiantes llegaron tarde por la lluvia..."
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
                    // Simular exportación aparte
                    window.alert('Documento de observaciones exportado (Simulado)');
                    setShowObservationModal(false);
                    setObservationText('');
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

    </Layout>
  );
}
