import React, { useState } from 'react';
import Layout from '../components/Layout';
import { School, Search, Building, Plus, X, Trash2, Link, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Institutos() {
  const [selectedInstituto, setSelectedInstituto] = useState<any>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const institutosMock = [
    {
      id: 1,
      name: "Politécnico Central",
      location: "Av. Principal Universitario, Edo. Miranda.",
      status: "Activo",
      color: "bg-green-100 text-green-800",
      facultades: 4,
      alumnos: "2,400",
      serviciosConjuntos: ["Intercambio de Tesistas", "Uso de Laboratorios compartidos", "Pasantías pre-profesionales"],
      cronograma: "Actividades del Trimestre",
      fechaConvenio: "12 Oct 2023 - Presente",
      caracteristicas: "Institución pionera en el desarrollo tecnológico de la región central. Excelencia académica en ingenierías y ciencias aplicadas."
    },
    {
      id: 2,
      name: "Universidad del Norte",
      location: "Calle 50 #12-40, Zona Norte.",
      status: "Renovando",
      color: "bg-amber-100 text-amber-800",
      facultades: 7,
      alumnos: "8,500",
      serviciosConjuntos: ["Intercambio deportivo", "Sede para eventos masivos", "Red de bibliotecas conectadas"],
      cronograma: "Semestre B-2026",
      fechaConvenio: "01 Mar 2020 - 28 Feb 2026",
      caracteristicas: "Campus amplio con enfoque humanista y ciencias sociales. Referente nacional en investigación."
    },
    {
      id: 3,
      name: "Instituto Tecnológico del Llano",
      location: "Sector La Planicie, Km 12.",
      status: "Inactivo",
      color: "bg-red-100 text-red-800",
      facultades: 2,
      alumnos: "1,200",
      serviciosConjuntos: ["Agro-tecnología", "Semilleros rurales"],
      cronograma: "Suspendido",
      fechaConvenio: "Anulado",
      caracteristicas: "Enfoque en desarrollo agrario y sustentabilidad tecnológica. Actual convenio en revisión."
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
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight">INSTITUCIONES | CONVENIOS</h1>
            <p className="text-lg text-secondary mt-2 font-medium">Gestiona y consulta los recintos educativos asociados detalladamente.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/80 p-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white">
              <Search className="w-5 h-5 ml-2 text-outline" />
              <input 
                type="text" 
                placeholder="Buscar instituto..."
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
              Nuevo
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutosMock.map((instituto, i) => (
            <motion.div 
              key={instituto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedInstituto(instituto)}
              className="glass-panel-solid rounded-2xl p-6 shadow-lg flex flex-col gap-4 cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${instituto.color.split(' ')[0].replace('100', '200')} ${instituto.color}`}>{instituto.status}</span>
              </div>
              
              <div>
                <h3 className="font-heading text-xl font-bold text-primary line-clamp-1">{instituto.name}</h3>
                <p className="text-secondary text-sm font-medium mt-1 line-clamp-1">{instituto.location}</p>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex justify-between text-sm text-secondary font-semibold mt-auto">
                <span className="flex items-center gap-1.5"><Building className="w-4 h-4"/> {instituto.facultades} Facultades</span>
                <span>{instituto.alumnos} Alumnos</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedInstituto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setSelectedInstituto(null)}
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
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg">
                      <School className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary">{selectedInstituto.name}</h2>
                      <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${selectedInstituto.color.split(' ')[0].replace('100', '200')} ${selectedInstituto.color}`}>
                        {selectedInstituto.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary text-base leading-relaxed max-w-2xl">{selectedInstituto.caracteristicas}</p>
                </div>
                <button 
                  onClick={() => setSelectedInstituto(null)}
                  className="w-10 h-10 bg-white shadow-sm border border-outline-variant rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

               <div className="p-8 flex-1 overflow-y-auto bg-surface/30 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                        <Link className="w-5 h-5" /> Servicios y Acuerdos Conjuntos
                      </h3>
                      <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm space-y-3">
                        {selectedInstituto.serviciosConjuntos.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-2">
                            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                            <span className="font-medium text-secondary">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                         <Building className="w-5 h-5" /> Capacidades
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm text-center">
                            <span className="block text-3xl font-heading font-bold text-primary mb-1">{selectedInstituto.facultades}</span>
                            <span className="text-xs text-secondary font-bold uppercase tracking-widest">Facultades</span>
                         </div>
                         <div className="bg-white p-5 rounded-2xl border border-surface-variant shadow-sm text-center">
                            <span className="block text-3xl font-heading font-bold text-primary mb-1">{selectedInstituto.alumnos}</span>
                            <span className="text-xs text-secondary font-bold uppercase tracking-widest">Alumnos Totales</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-sm space-y-5">
                       <div>
                         <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Dirección</span>
                         <p className="font-bold text-primary">{selectedInstituto.location}</p>
                       </div>
                       <div className="pt-5 border-t border-outline-variant/30">
                         <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><Calendar className="w-4 h-4"/> Vigencia del Convenio</span>
                         <p className="font-bold text-primary">{selectedInstituto.fechaConvenio}</p>
                       </div>
                       <div className="pt-5 border-t border-outline-variant/30">
                         <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><Calendar className="w-4 h-4"/> Cronograma Actual</span>
                         <p className="font-bold text-primary">{selectedInstituto.cronograma}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        window.alert('Institución eliminada (Simulado)');
                        setSelectedInstituto(null);
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" /> Eliminar Convenio
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
                  <span className="bg-primary/10 p-2 rounded-xl text-primary"><Building className="w-6 h-6" /></span>
                  Configurar Nueva Institución
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
                   <label className="text-sm font-semibold text-secondary">Nombre de la Institución</label>
                   <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Politécnico Central" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Características y Resumen</label>
                   <textarea className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none resize-none h-24" placeholder="Breve reseña sobre la institución y su especialidad"></textarea>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-secondary">Servicios en Conjunto</label>
                   <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Separar con comas. Ej. Pasantías, Laboratorios compartidos" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Vigencia del Convenio</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. 12 Oct 2023 - 12 Oct 2026" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Cronograma / Periodo Actual</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. Semestre B-2026" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Cantidad de Facultades</label>
                      <input type="number" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-secondary">Población Estudiantil Aprox.</label>
                      <input type="text" className="w-full bg-white border border-outline-variant p-3 rounded-xl focus:border-primary outline-none" placeholder="Ej. 5,000" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-surface-variant transition-colors"
                >
                  Descartar
                </button>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#3573A3] text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  Crear Institución
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
