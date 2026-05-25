import React, { useState } from 'react';
import Layout from '../components/Layout';
import { BookOpen, Search, Plus, Clock, Users, X, Trash2, Calendar, FileText, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Materias() {
  const [selectedMateria, setSelectedMateria] = useState<any>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const materiasMock = [
    { 
      id: 1,
      name: "Matemáticas Avanzadas", 
      time: "Lunes y Miércoles, 08:00 AM", 
      students: 30, 
      color: "bg-blue-100 text-blue-800",
      description: "Desarrollo de habilidades en cálculo integral, ecuaciones diferenciales y series matemáticas aplicadas.",
      semestre: "Semestre 2024-II",
      profesor: "Dr. Roberto García",
      aula: "Edificio A - Aula 302",
      unidadesDeCredito: 4,
      temario: ["Cálculo Multivariable", "Ecuaciones Diferenciales", "Transformadas de Fourier"]
    },
    { 
      id: 2,
      name: "Física Cuántica III", 
      time: "Martes y Jueves, 10:30 AM", 
      students: 24, 
      color: "bg-purple-100 text-purple-800",
      description: "Estudio profundo de la mecánica cuántica, operadores, partículas elementales y entrelazamiento.",
      semestre: "Semestre 2024-II",
      profesor: "Dra. Sofía Luna",
      aula: "Laboratorio Central 2",
      unidadesDeCredito: 5,
      temario: ["Postulados Cuánticos", "Momento Angular", "Perturbaciones"]
    },
    { 
      id: 3,
      name: "Lógica de Programación", 
      time: "Viernes, 09:00 AM", 
      students: 45, 
      color: "bg-emerald-100 text-emerald-800",
      description: "Introducción al pensamiento algorítmico, estructuras de datos, y programación orientada a objetos.",
      semestre: "Semestre 2024-II",
      profesor: "Ing. Pedro Medina",
      aula: "Sala de Computación B",
      unidadesDeCredito: 3,
      temario: ["Algoritmos y Pseudocódigo", "Estructuras de Control", "Arreglos y Matrices"]
    },
    { 
      id: 4,
      name: "Historia Contemporánea", 
      time: "Lunes, 02:00 PM", 
      students: 18, 
      color: "bg-amber-100 text-amber-800",
      description: "Análisis de los eventos socio-políticos desde la revolución industrial hasta el presente siglo.",
      semestre: "Semestre 2024-II",
      profesor: "Lic. Carmen Silva",
      aula: "Auditorio Menor",
      unidadesDeCredito: 3,
      temario: ["Revolución Industrial", "Guerras Mundiales", "Guerra Fría y Globalización"]
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
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight">GESTIÓN DE MATERIAS</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Visualiza y edita los pensums, horarios y materias asignadas.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/80 p-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white">
               <Search className="w-5 h-5 ml-2 text-outline" />
              <input 
                type="text" 
                placeholder="Buscar materia..."
                className="bg-transparent px-3 py-1.5 rounded-lg font-medium text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewModal(true)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
               <Plus className="w-5 h-5" />
              Nueva Materia
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {materiasMock.map((materia, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -4, scale: 1.02 }}
               onClick={() => setSelectedMateria(materia)}
               className="glass-panel-solid rounded-[2rem] p-8 shadow-lg flex flex-col gap-5 cursor-pointer relative overflow-hidden group"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
               <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${materia.color}`}>
                     <BookOpen className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="font-heading text-2xl font-bold text-primary mb-1">{materia.name}</h3>
                     <span className="text-xs font-bold text-secondary tracking-widest uppercase">{materia.semestre}</span>
                   </div>
                 </div>
               </div>
               
               <p className="text-secondary text-sm line-clamp-2 leading-relaxed">{materia.description}</p>
               
               <div className="grid grid-cols-2 gap-4 pt-5 border-t border-outline-variant/50 mt-auto">
                 <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{materia.time}</span>
                 </div>
                 <div className="flex items-center gap-2 text-secondary font-medium bg-surface-variant/30 p-2 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{materia.students} Estudiantes</span>
                 </div>
               </div>
             </motion.div>
          ))}
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
              className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-surface-variant flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-surface-variant bg-surface flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] -z-10"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedMateria.color}`}>
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedMateria.name}</h2>
                      <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border border-black/10 shadow-sm bg-white text-secondary`}>
                        {selectedMateria.semestre} | {selectedMateria.unidadesDeCredito} UC
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary text-base leading-relaxed max-w-2xl">{selectedMateria.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedMateria(null)}
                  className="w-10 h-10 bg-white shadow-sm border border-outline-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                       <FileText className="w-5 h-5" /> Temario y Contenido
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm space-y-3">
                      {selectedMateria.temario.map((item: string, idx: number) => (
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
                       <Users className="w-5 h-5" /> Estudiantes Inscritos ({selectedMateria.students})
                    </h3>
                    <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm text-center">
                        <div className="flex flex-col items-center gap-3">
                           <p className="text-secondary font-medium">Hay {selectedMateria.students} estudiantes registrados en esta materia.</p>
                           <button className="bg-primary/10 text-primary font-bold px-5 py-2 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer">
                              Ver Lista de Asistencia
                           </button>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-5">
                    <div>
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><Clock className="w-4 h-4"/> Horario</span>
                       <p className="font-bold text-primary bg-surface-variant/30 p-2.5 rounded-lg">{selectedMateria.time}</p>
                    </div>

                    <div className="pt-5 border-t border-outline-variant/30">
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><Users className="w-4 h-4"/> Profesor</span>
                       <p className="font-bold text-primary">{selectedMateria.profesor}</p>
                    </div>

                    <div className="pt-5 border-t border-outline-variant/30">
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Aula o Laboratorio</span>
                       <p className="font-bold text-primary">{selectedMateria.aula}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                        window.alert('Materia eliminada (Simulado)');
                        setSelectedMateria(null);
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                     <Trash2 className="w-5 h-5" /> Eliminar Materia
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
                  Crear Nueva Materia
                </h2>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-outline-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto bg-surface/30 space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Nombre de la Materia</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Lógica Matemática" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Unidades de Crédito</label>
                      <input type="number" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="0" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Descripción</label>
                   <textarea className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none resize-none h-24" placeholder="Breve resumen de la materia"></textarea>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Profesor Asignado</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Nombre del docente" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Aula o Laboratorio</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Sala 2B" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Horario</label>
                   <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Lunes y Miércoles, 08:00 AM" />
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
                  Confirmar Materia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
