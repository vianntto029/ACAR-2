import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Download, FileText, FileSpreadsheet, File, Search, Users, Calendar, X, Building, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Reportes() {
  const [selectedMateria, setSelectedMateria] = useState<any>(null);

  const materiasHistorialMock = [
    {
      id: 1,
      name: "Matemáticas Avanzadas",
      color: "bg-blue-100 text-blue-800",
      studentsCount: 30,
      totalClasses: 12,
      averageAttendance: "92%",
      students: [
        { name: "Ana López", section: "MAT-2024-001", attendances: 12, misses: 0 },
        { name: "Carlos Gómez", section: "MAT-2024-015", attendances: 10, misses: 2 },
        { name: "María Rodríguez", section: "MAT-2024-042", attendances: 8, misses: 4 },
      ]
    },
    {
      id: 2,
      name: "Física Cuántica III",
      color: "bg-purple-100 text-purple-800",
      studentsCount: 24,
      totalClasses: 10,
      averageAttendance: "88%",
      students: [
        { name: "José Paz", section: "FIS-2024-01", attendances: 9, misses: 1 },
        { name: "Elena Ramos", section: "FIS-2024-02", attendances: 8, misses: 2 },
      ]
    }
  ];

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
           {/* Report Config */}
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
                 <label className="text-sm font-semibold text-secondary flex items-center gap-2"><Building className="w-4 h-4"/> Institución (Opcional)</label>
                 <select className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none">
                   <option>Todas las Instituciones</option>
                   <option>Politécnico Central</option>
                   <option>Universidad del Norte</option>
                 </select>
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-secondary flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-list"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/></svg> Programa (Opcional)</label>
                 <select className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none">
                   <option>Todos los Programas</option>
                   <option>Programa ACAR</option>
                   <option>Semilleros del Saber</option>
                 </select>
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-secondary flex items-center gap-2"><BookOpen className="w-4 h-4"/> Materia</label>
                 <select className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none">
                   <option>Todas las Materias</option>
                   <option>Matemáticas Avanzadas</option>
                   <option>Física Cuántica III</option>
                 </select>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="flex flex-col gap-2 flex-1">
                 <label className="text-sm font-semibold text-secondary">Fecha Inicio</label>
                 <input type="date" className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none" />
               </div>
               <div className="flex flex-col gap-2 flex-1">
                 <label className="text-sm font-semibold text-secondary">Fecha Fin</label>
                 <input type="date" className="w-full bg-white border border-outline-variant rounded-xl p-3 text-primary shadow-sm focus:border-primary outline-none" />
               </div>
             </div>

             <div className="mt-4 flex gap-3">
               <motion.button 
                 whileHover={{ scale: 1.02, y: -2 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 bg-[#207245] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
               >
                 <FileSpreadsheet className="w-5 h-5" />
                 Exportar XLSX
               </motion.button>
               <motion.button 
                 whileHover={{ scale: 1.02, y: -2 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 bg-[#d32f2f] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
               >
                 <File className="w-5 h-5" />
                 Exportar PDF
               </motion.button>
             </div>
           </motion.div>

           <div className="flex flex-col gap-6">
              {/* Materias Resumen */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-4 relative overflow-hidden"
              >
                 <h3 className="font-heading text-xl font-bold text-primary mb-2">Desglose por Materia</h3>
                 <div className="flex flex-col gap-3">
                    {materiasHistorialMock.map((materia) => (
                       <div 
                         key={materia.id} 
                         onClick={() => setSelectedMateria(materia)}
                         className="p-4 bg-white rounded-xl border border-outline-variant flex justify-between items-center hover:shadow-md transition-all cursor-pointer group"
                       >
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full ${materia.color.split(' ')[0]}`}></div>
                               <span className="font-bold text-primary">{materia.name}</span>
                             </div>
                             <span className="text-xs text-secondary mt-1 font-medium">{materia.studentsCount} estudiantes inscritos</span>
                          </div>
                          <div className="text-right">
                             <span className="block font-heading text-lg font-bold text-[#3573A3]">{materia.averageAttendance}</span>
                             <span className="text-[10px] uppercase font-bold text-secondary">Asistencia</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>

              {/* Report History */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-4 relative overflow-hidden"
              >
                 <h3 className="font-heading text-xl font-bold text-primary mb-2">Últimos Exportados</h3>
                 <div className="flex flex-col gap-3">
                    {[1, 2].map((item) => (
                       <div key={item} className="p-4 bg-white/50 rounded-xl border border-white/60 flex justify-between items-center hover:bg-white/80 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="font-bold text-primary text-sm">Registro_Hist_Abril_0{item}.pdf</p>
                               <p className="text-xs text-secondary font-medium">12 May 2026</p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    ))}
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
              <div className={`p-8 border-b border-surface-variant bg-surface flex justify-between items-start relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${selectedMateria.color.split(' ')[0]} opacity-20 rounded-bl-[200px] -z-10`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedMateria.color}`}>
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedMateria.name}</h2>
                      <span className="inline-block mt-2 text-xs font-bold px-3 py-1 bg-surface border border-outline-variant rounded-full text-secondary">
                        {selectedMateria.totalClasses} Clases Impartidas
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
                    <h3 className="font-bold text-primary text-xl">Registro Histórico de Estudiantes</h3>
                    <div className="bg-white px-4 py-2 border border-outline-variant rounded-xl shadow-sm font-bold text-primary">
                       Promedio General: <span className="text-[#3573A3]">{selectedMateria.averageAttendance}</span>
                    </div>
                 </div>

                 <div className="bg-white border border-surface-variant rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-surface-variant/30 text-xs text-secondary uppercase tracking-widest">
                             <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Estudiante</th>
                             <th className="py-4 px-6 font-bold border-b border-outline-variant/30">Sección</th>
                             <th className="py-4 px-6 font-bold border-b border-outline-variant/30 text-center">Asistencias</th>
                             <th className="py-4 px-6 font-bold border-b border-outline-variant/30 text-center">Faltas</th>
                             <th className="py-4 px-6 font-bold border-b border-outline-variant/30 text-right">%</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-outline-variant/20">
                          {selectedMateria.students.map((student: any, idx: number) => {
                             const percentage = Math.round((student.attendances / selectedMateria.totalClasses) * 100);
                             return (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                   <td className="py-4 px-6 font-bold text-primary">{student.name}</td>
                                   <td className="py-4 px-6 text-sm text-secondary font-medium">{student.section}</td>
                                   <td className="py-4 px-6 text-center">
                                      <span className="inline-block bg-[#10b981]/10 text-[#10b981] font-bold px-3 py-1 rounded-full">{student.attendances}</span>
                                   </td>
                                   <td className="py-4 px-6 text-center">
                                      <span className="inline-block bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full">{student.misses}</span>
                                   </td>
                                   <td className="py-4 px-6 text-right font-heading font-bold text-primary">
                                      {percentage}%
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </Layout>
  );
}
