import React, { useState } from 'react';
import Layout from '../components/Layout';
import { BookOpen, Search, Plus, MapPin, Users, Calendar, Target, User, Trash2, X, GraduationCap, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Programas() {
  const [selectedPrograma, setSelectedPrograma] = useState<any>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const programasMock = [
    { 
      name: "Programa ACAR", 
      location: "Sede Principal", 
      status: "Activo", 
      color: "bg-blue-100 text-blue-800",
      fechaInicio: "15 Ene 2026",
      fechaFin: "15 Dic 2026",
      proposito: "Fomentar el desarrollo tecnológico y analítico en jóvenes talentos del país mediante herramientas avanzadas.",
      docente: "Dra. Elena Martínez",
      estudiantes: 124,
      pensum: ["Módulo 1: Fundamentos", "Módulo 2: Herramientas Digitales", "Módulo 3: Proyecto Final"]
    },
    { 
      name: "Semilleros del Saber", 
      location: "Sede Centro", 
      status: "En curso", 
      color: "bg-green-100 text-green-800",
      fechaInicio: "01 Feb 2026",
      fechaFin: "10 Nov 2026",
      proposito: "Impulsar las ciencias básicas desde una edad temprana.",
      docente: "Lic. Marcos Rivas",
      estudiantes: 85,
      pensum: ["Biología Básica", "Física Dinámica", "Matemática Aplicada"]
    },
    { 
      name: "Líderes Comunitarios", 
      location: "Sede Sur", 
      status: "Inscripciones", 
      color: "bg-amber-100 text-amber-800",
      fechaInicio: "10 Ago 2026",
      fechaFin: "10 Jul 2027",
      proposito: "Formar líderes capaces de gestionar proyectos de impacto social comunitario.",
      docente: "Mg. Sandra Gómez",
      estudiantes: 0,
      pensum: ["Liderazgo 101", "Gestión de Proyectos", "Oratoria", "Resolución de Conflictos"]
    },
    { 
      name: "Jóvenes Emprendedores", 
      location: "Múltiples", 
      status: "Cerrado", 
      color: "bg-neutral-100 text-neutral-800",
      fechaInicio: "01 Ene 2025",
      fechaFin: "20 Dic 2025",
      proposito: "Creación de modelos de negocio viables liderados por estudiantes.",
      docente: "Ing. Carlos Díaz",
      estudiantes: 42,
      pensum: ["Ideación", "Plan de Negocios", "Marketing Digital", "Finanzas Básicas"]
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
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight">PROGRAMAS</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Gestión de todos los programas educativos activos.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/80 p-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white">
               <Search className="w-5 h-5 ml-2 text-outline" />
              <input 
                type="text" 
                placeholder="Buscar programa..."
                className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewModal(true)}
              className="bg-primary hover:bg-[#255b76] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
               <Plus className="w-5 h-5" />
              Nuevo
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programasMock.map((programa, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -4, scale: 1.01 }}
               onClick={() => setSelectedPrograma(programa)}
               className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-5 cursor-pointer relative overflow-hidden group"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
               <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 text-primary shadow-inner">
                   <BookOpen className="w-7 h-7" />
                 </div>
                 <span className={`text-xs font-bold px-4 py-1.5 rounded-full border ${programa.color.split(' ')[0].replace('100', '200')} ${programa.color} shadow-sm`}>
                   {programa.status}
                 </span>
               </div>
               
               <div>
                 <h3 className="font-heading text-2xl font-bold text-primary mb-1">{programa.name}</h3>
                 <p className="text-secondary text-sm line-clamp-2 leading-relaxed">{programa.proposito}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-5 border-t border-outline-variant/50 mt-auto">
                 <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{programa.location}</span>
                 </div>
                 <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{programa.estudiantes} Alumnos</span>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPrograma && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setSelectedPrograma(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-surface-variant bg-surface flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] -z-10"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedPrograma.name}</h2>
                      <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${selectedPrograma.color.split(' ')[0].replace('100', '200')} ${selectedPrograma.color}`}>
                        {selectedPrograma.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary text-base leading-relaxed max-w-2xl">{selectedPrograma.proposito}</p>
                </div>
                <button 
                  onClick={() => setSelectedPrograma(null)}
                  className="w-10 h-10 bg-white shadow-sm border border-outline-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                       <GraduationCap className="w-5 h-5" /> Pensum Académico
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm space-y-3">
                      {selectedPrograma.pensum.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/10">
                           <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                             {idx + 1}
                           </div>
                           <span className="font-medium text-secondary">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                     <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                       <Users className="w-5 h-5" /> Estudiantes Matriculados ({selectedPrograma.estudiantes})
                    </h3>
                    <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm text-center">
                       {selectedPrograma.estudiantes > 0 ? (
                          <div className="flex flex-col items-center gap-3">
                             <p className="text-secondary font-medium">Hay {selectedPrograma.estudiantes} estudiantes registrados en este programa.</p>
                             <button className="bg-primary/10 text-primary font-bold px-5 py-2 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer">
                                Ver Lista Completa
                             </button>
                          </div>
                       ) : (
                          <p className="text-secondary opacity-70">Aún no hay estudiantes inscritos en este programa.</p>
                       )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-5">
                    <div>
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><Calendar className="w-4 h-4"/> Fechas</span>
                       <div className="flex justify-between items-center text-sm font-medium text-primary bg-surface-variant/30 p-2.5 rounded-lg mb-2">
                         <span>Inicio:</span>
                         <span className="font-bold">{selectedPrograma.fechaInicio}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-medium text-primary bg-surface-variant/30 p-2.5 rounded-lg">
                         <span>Fin:</span>
                         <span className="font-bold">{selectedPrograma.fechaFin}</span>
                       </div>
                    </div>

                    <div className="pt-5 border-t border-outline-variant/30">
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><User className="w-4 h-4"/> Docente a cargo</span>
                       <p className="font-bold text-primary">{selectedPrograma.docente}</p>
                    </div>

                    <div className="pt-5 border-t border-outline-variant/30">
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Modalidad / Sede</span>
                       <p className="font-bold text-primary">{selectedPrograma.location}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                        window.alert('Programa eliminado (Simulado)');
                        setSelectedPrograma(null);
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                     <Trash2 className="w-5 h-5" /> Eliminar Programa
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewModal && (
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
              className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="bg-primary/10 p-2 rounded-xl text-primary"><Plus className="w-6 h-6" /></span>
                  Crear Nuevo Programa
                </h2>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-outline-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 space-y-5">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Nombre del Programa</label>
                   <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Programa Avanzado" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Propósito</label>
                   <textarea className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none resize-none h-24" placeholder="Describe el objetivo del programa"></textarea>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Fecha de Inicio</label>
                      <input type="date" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Fecha de Finalización</label>
                      <input type="date" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Docente Responsable</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Nombre completo" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Sede / Ubicación</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Lugar de clases" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  Crear Programa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </Layout>
  );
}
