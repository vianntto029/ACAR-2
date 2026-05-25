import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { db, ref, push, onValue, remove, get, set } from '../firebase'

const AttendanceContext = createContext(null)

export const INSTITUTOS = [
  { id: 'ACAR', nombre: 'Programa ACAR Sabatino' },
]

export function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function currentTime() {
  return new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function dailyCode(date) {
  return `ACAR-${date}`
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext)
  if (!ctx) throw new Error('useAttendance must be used within AttendanceProvider')
  return ctx
}

export function AttendanceProvider({ children }) {
  const [institutoActivo, setInstitutoActivo] = useState(() => {
    return localStorage.getItem('instituto-activo') || INSTITUTOS[0].id
  })
  const [attendance, setAttendance] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('current-session-id') || null
  })

  useEffect(() => {
    localStorage.setItem('instituto-activo', institutoActivo)
  }, [institutoActivo])

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('current-session-id', currentSessionId)
    }
  }, [currentSessionId])

  useEffect(() => {
    const attendanceRef = ref(db, `institutos/${institutoActivo}/attendance`)
    const unsubscribe = onValue(attendanceRef, (snapshot) => {
      try {
        const data = []
        snapshot.forEach((child) => {
          data.push({ ...child.val(), id: child.key })
        })
        data.sort((a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time))
        setAttendance(data)
      } catch (e) {
        console.error('Attendance load error:', e)
      }
    }, (err) => {
      console.error('Attendance Firebase error:', err)
    })
    return () => unsubscribe()
  }, [institutoActivo])

  useEffect(() => {
    const sessionsRef = ref(db, `institutos/${institutoActivo}/sessions`)
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      try {
        const data = []
        snapshot.forEach((child) => {
          data.push({ ...child.val(), id: child.key })
        })
        data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || 0)
        setSessions(data)
      } catch (e) {
        console.error('Sessions load error:', e)
      }
    }, (err) => {
      console.error('Sessions Firebase error:', err)
    })
    return () => unsubscribe()
  }, [institutoActivo])

  async function createSession({ materia, instituto, programa }) {
    const date = todayKey()
    const sessionRef = push(ref(db, `institutos/${institutoActivo}/sessions`))
    const sessionData = {
      date,
      materia: materia || '',
      instituto: instituto || '',
      programa: programa || '',
      createdAt: new Date().toISOString(),
      time: currentTime(),
    }
    await set(sessionRef, sessionData)
    const newId = sessionRef.key
    setCurrentSessionId(newId)
    return newId
  }

  async function checkDuplicate(nationalId, date) {
    const snapshot = await get(ref(db, `institutos/${institutoActivo}/attendance`))
    let isDuplicate = false
    snapshot.forEach(child => {
      const val = child.val()
      if (val.nationalId && val.nationalId.toLowerCase() === nationalId.toLowerCase() && val.date === date) {
        isDuplicate = true
      }
    })
    return isDuplicate
  }

  async function registerAttendance({ name, subject, nationalId, seccion, representante, instituto, sessionId }) {
    const target = instituto || institutoActivo
    const date = todayKey()
    const code = dailyCode(date)

    const duplicate = await checkDuplicate(nationalId, date)
    if (duplicate) {
      throw new Error('DUPLICADO')
    }

    const record = {
      name,
      subject,
      nationalId,
      seccion,
      representante: representante || '',
      date,
      time: currentTime(),
      code,
      instituto: target,
      sessionId: sessionId || currentSessionId || '',
    }
    await push(ref(db, `institutos/${target}/attendance`), record)
    return record
  }

  async function resetAttendance(date) {
    const snapshot = await get(ref(db, `institutos/${institutoActivo}/attendance`))
    const toRemove = []
    snapshot.forEach(child => {
      if (child.val().date === date) {
        toRemove.push(child.key)
      }
    })
    for (const key of toRemove) {
      await remove(ref(db, `institutos/${institutoActivo}/attendance/${key}`))
    }
  }

  async function switchInstituto(id) {
    setInstitutoActivo(id)
  }

  const getSessionsByDate = useCallback((date) => {
    return sessions.filter(s => s.date === date).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }, [sessions])

  const getAttendanceBySession = useCallback((sessionId) => {
    return attendance.filter(a => a.sessionId === sessionId)
  }, [attendance])

  return (
    <AttendanceContext.Provider value={{
      attendance, registerAttendance, resetAttendance,
      switchInstituto, institutoActivo,
      sessions, currentSessionId, createSession,
      setCurrentSessionId, getSessionsByDate, getAttendanceBySession,
    }}>
      {children}
    </AttendanceContext.Provider>
  )
}
