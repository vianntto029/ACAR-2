import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, User, IdCard, BookOpen, Users2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAttendance } from '../context/AttendanceContext'

export default function RegistroView() {
  const navigate = useNavigate()
  const { registerAttendance } = useAttendance()

  const urlParams = new URLSearchParams(window.location.search)
  const materiaParam = urlParams.get('materia') || 'Programa ACAR'
  const institutoQR = urlParams.get('instituto')

  const [form, setForm] = useState({
    name: '',
    nationalId: '',
    seccion: '',
    representante: '',
  })
  const [status, setStatus] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanName = form.name.trim()
    const cleanId = form.nationalId.trim()
    const cleanSeccion = form.seccion.trim()
    const cleanRep = form.representante.trim()

    if (!cleanName || !cleanId || !cleanSeccion) {
      setStatus('Completa todos los campos.')
      return
    }

    setStatus('Registrando...')
    try {
      await registerAttendance({
        name: cleanName,
        subject: materiaParam,
        nationalId: cleanId,
        seccion: cleanSeccion,
        representante: cleanRep,
        instituto: institutoQR || 'Programa ACAR',
      })
      setIsSubmitted(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      if (err.message === 'DUPLICADO') {
        setStatus('Esta cedula ya fue registrada hoy.')
      } else {
        setStatus('Error al registrar. Intenta de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10"
      style={{ background: "linear-gradient(0deg, #417490 0%, #7197AE 30%, #ACC2CF 50%, #FFFFFF 100%)" }}>

      <div className="w-full max-w-[500px]">
        <div className="glass-panel-solid rounded-xl p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-primary mb-2">Registro de Asistencia</h1>
            <p className="text-secondary text-sm">
              Materia: <span className="font-semibold text-primary">{decodeURIComponent(materiaParam)}</span>
            </p>
          </div>

          {status && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {status}
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#a2d2b2] text-primary mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-2">Registro Exitoso!</h2>
              <p className="text-secondary">Tu asistencia fue registrada exitosamente.</p>
              <p className="text-sm text-primary font-semibold mt-4">Redirigiendo...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary">Nombre Completo</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej. Ana Garcia"
                    className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary">Numero de Cedula</label>
                <div className="relative group">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={form.nationalId}
                    onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
                    placeholder="Ej. V-12345678"
                    className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary">Seccion / Grupo</label>
                <div className="relative group">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={form.seccion}
                    onChange={(e) => setForm({ ...form, seccion: e.target.value })}
                    placeholder="Ej. Sabatino A, Unica, A1"
                    className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary">Nombre del Representante</label>
                <div className="relative group">
                  <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={form.representante}
                    onChange={(e) => setForm({ ...form, representante: e.target.value })}
                    placeholder="Ej. Carlos Garcia"
                    className="w-full bg-white/70 border border-white/60 rounded-lg pl-10 pr-4 py-3 text-primary placeholder:text-outline shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-primary text-white py-4 rounded-lg shadow-[0_4px_14px_0_rgba(65,116,144,0.39)] hover:shadow-[0_6px_20px_rgba(65,116,144,0.23)] transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <CheckCircle className="w-5 h-5" />
                Registrar Asistencia
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/login" className="text-white/90 text-sm font-semibold hover:text-white transition-colors">
            Panel administrativo
          </a>
        </div>

        <p className="text-center text-xs text-white/80 font-semibold mt-4">
          Sistema de Gestion Academica Seguro
        </p>
      </div>
    </div>
  )
}