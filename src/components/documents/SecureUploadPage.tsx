import React, { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UploadCloud, File, AlertCircle, CheckCircle2, ShieldCheck,
  X, Layers, Scale, TreePine, MapPin, Receipt, CheckSquare, Clock
} from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';

// Categorias Profissionais para Due Diligence de Imóveis Rurais
type DueDiligenceCategory =
  | 'Juridico_Propriedade'
  | 'Ambiental'
  | 'Fiscal_INCRA'
  | 'Tecnico_Georreferenciamento'
  | 'Nao_Classificado';

interface ParsedFile {
  id: string;
  file: File;
  title: string;
  category: DueDiligenceCategory;
  consultativeNote: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  error?: string;
  uploadedCount: number;
}

export function SecureUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);

  // --- Handlers de Drag and Drop (Múltiplos Arquivos) ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelection(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelection(Array.from(e.target.files));
    }
  };

  // --- Motor Analítico (Heurística Profissional para Imóvel Rural) ---
  const analyzeFile = (file: File): ParsedFile => {
    const name = file.name.toLowerCase();
    let category: DueDiligenceCategory = 'Nao_Classificado';
    let consultativeNote = '';

    if (name.match(/matricula|cartorio|transcricao|escritura|cadeia|onus|certidao/)) {
      category = 'Juridico_Propriedade';
      consultativeNote = "Análise Titular: Válido para due diligence imobiliária (Cadeia Sucessória e Ônus).";
    }
    else if (name.match(/car|cadastro|ambiental|licenca|lau|ibama|outorga|pra/)) {
      category = 'Ambiental';
      consultativeNote = "Restrições Ambientais: Comprova regularidade junto aos órgãos competentes (CAR/Licenciamento).";
    }
    else if (name.match(/ccir|itr|incra|cnd|tributo|receita|imposto/)) {
      category = 'Fiscal_INCRA';
      consultativeNote = "Regularidade Fiscal: Essencial para desmembramentos e garantia de inexistência de débitos da terra.";
    }
    else if (name.match(/laudo|tecnico|agronomico|sigef|memorial|mapa|geo|art/)) {
      category = 'Tecnico_Georreferenciamento';
      consultativeNote = "Aprovação Técnica: Documentos de confrontação e delimitação de área (Georreferenciamento/SIGEF).";
    }
    else {
      consultativeNote = "Documento genérico. Será mantido no cofre geral aguardando classificação manual.";
    }

    return {
      id: Math.random().toString(36).substring(7),
      file,
      title: file.name,
      category,
      consultativeNote
    };
  };

  const handleFilesSelection = (files: File[]) => {
    const newParsedFiles = files.map(analyzeFile);
    setParsedFiles(prev => [...prev, ...newParsedFiles]);
    setUploadStatus(null);
  };

  const removeFile = (id: string) => {
    setParsedFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileTitle = (id: string, newTitle: string) => {
    setParsedFiles(prev => prev.map(f => f.id === id ? { ...f, title: newTitle } : f));
  };

  const resetForm = () => {
    setParsedFiles([]);
    setUploadStatus(null);
  };

  // --- Motor de Relatório Geral de Due Diligence ---
  const dueDiligenceReport = useMemo(() => {
    const stats = {
      Juridico_Propriedade: 0,
      Ambiental: 0,
      Fiscal_INCRA: 0,
      Tecnico_Georreferenciamento: 0,
      Nao_Classificado: 0
    };

    parsedFiles.forEach(f => {
      stats[f.category]++;
    });

    const isComplete = stats.Juridico_Propriedade > 0 && stats.Ambiental > 0 && stats.Fiscal_INCRA > 0 && stats.Tecnico_Georreferenciamento > 0;
    const completenessPercent = [stats.Juridico_Propriedade, stats.Ambiental, stats.Fiscal_INCRA, stats.Tecnico_Georreferenciamento].filter(v => v > 0).length * 25;

    return { stats, isComplete, completenessPercent };
  }, [parsedFiles]);

  // --- Função de Upload em Lote Segura ---
  const onUploadBatch = async () => {
    if (parsedFiles.length === 0) return;
    setIsUploading(true);
    setUploadStatus(null);

    let uploadedCount = 0;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) throw new Error("Usuário não autenticado.");

      const { data: tenantData } = await supabase.from('users').select('tenant_id').eq('id', userData.user.id).single();
      const tenantId = (tenantData as SafeAny)?.tenant_id;
      if (!tenantId) throw new Error("Tenant ID não encontrado. Falha de segurança no isolamento.");

      // Para cada arquivo, vamos fazer upload pro Storage e inserir na tabela de documentos
      for (const pFile of parsedFiles) {

        // 1. Garantir que o Document Group (Kanban Board/Category mapping) existe
        const groupName = pFile.category.replace('_', ' / ');
        let finalGroupId = null;

        let { data: existingGroup } = await supabase
          .from('document_groups')
          .select('id')
          .eq('name', groupName)
          .single();

        if (!existingGroup) {
          const { data: newGroup, error: groupErr } = await (supabase.from('document_groups').insert as SafeAny)([{
            tenant_id: tenantId,
            name: groupName,
            description: 'Criado automaticamente pela Inteligência de Upload em Lote'
          }]).select().single();

          if (!groupErr && newGroup) {
            finalGroupId = (newGroup as SafeAny).id;
          }
        } else {
          finalGroupId = (existingGroup as SafeAny).id;
        }

        // 2. Upload pro Storage com RLS
        const fileExt = pFile.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${tenantId}/${pFile.category}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('secure_documents')
          .upload(filePath, pFile.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // 3. Registrar metadata na tabela documents
        const { error: dbError } = await (supabase.from('documents').insert as SafeAny)([{
          tenant_id: tenantId,
          title: pFile.title,
          file_path: filePath,
          file_type: fileExt,
          document_group_id: finalGroupId,
          status: 'under_review'
        }]);

        if (dbError) {
           await supabase.storage.from('secure_documents').remove([filePath]);
           throw dbError; // Interrompe o batch em caso de erro crítico no DB
        }

        uploadedCount++;
      }

      setUploadStatus({
        success: true,
        message: 'Todos os documentos foram encriptados e classificados com sucesso no cofre.',
        uploadedCount
      });

    } catch (err: any) {
      console.error(err);
      setUploadStatus({
        success: false,
        message: 'Falha durante a operação em lote.',
        error: err.message || 'Falha no armazenamento seguro.',
        uploadedCount
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Componentes de UI Auxiliares ----
  const CategoryIcon = ({ cat }: { cat: DueDiligenceCategory }) => {
    switch(cat) {
      case 'Juridico_Propriedade': return <Scale className="w-5 h-5 text-indigo-500" />;
      case 'Ambiental': return <TreePine className="w-5 h-5 text-emerald-500" />;
      case 'Fiscal_INCRA': return <Receipt className="w-5 h-5 text-amber-500" />;
      case 'Tecnico_Georreferenciamento': return <MapPin className="w-5 h-5 text-rose-500" />;
      default: return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-200">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            Upload em Lote & Due Diligence Automática
            <Layers className="w-6 h-6 ml-2 text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Módulo avançado de recepção documental. Solte múltiplos arquivos para montar o dossiê da negociação.
          </p>
        </div>
      </div>

      {/* FEEDBACK DE STATUS DE UPLOAD */}
      {uploadStatus && uploadStatus.success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-start border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Sucesso no Lote!</h3>
            <p className="text-sm mt-1">{uploadStatus.uploadedCount} documentos gravados no cofre digital.</p>
            <button onClick={resetForm} className="mt-3 text-sm font-medium underline text-emerald-700">Adicionar mais documentos</button>
          </div>
        </div>
      )}

      {uploadStatus && !uploadStatus.success && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-start border border-red-200">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Erro de Segurança / Upload</h3>
            <p className="text-sm mt-1">{uploadStatus.error}</p>
            <p className="text-xs mt-1 font-medium">Documentos gravados antes do erro: {uploadStatus.uploadedCount}</p>
          </div>
        </div>
      )}

      {(!uploadStatus || !uploadStatus.success) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ZONA DE ARRASTAR ARQUIVOS E LISTAGEM */}
          <div className="lg:col-span-2 space-y-6">

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors h-[200px]
                ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                disabled={isUploading}
              />
              <UploadCloud className={`w-12 h-12 mb-3 transition-colors ${dragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <p className="text-slate-700 font-semibold text-lg">Solte sua pasta de documentos aqui</p>
              <p className="text-slate-500 text-sm mt-1">Matrículas, CAR, CCIR, Laudos Técnicos, Mapas...</p>
              <div className="mt-4 px-3 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                Upload Múltiplo Ativado (Dossiê)
              </div>
            </div>

            {/* LISTA DE ARQUIVOS EM MEMÓRIA */}
            {parsedFiles.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex justify-between items-center">
                  <span>Arquivos Analisados ({parsedFiles.length})</span>
                  <button onClick={() => setParsedFiles([])} className="text-xs text-red-500 hover:underline">Limpar Fila</button>
                </h3>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {parsedFiles.map(pFile => (
                    <div key={pFile.id} className="flex flex-col p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between">
                         <div className="flex items-center space-x-3 w-full">
                           <div className="p-2 bg-slate-50 rounded-lg">
                             <CategoryIcon cat={pFile.category} />
                           </div>
                           <div className="flex-1">
                             <input
                               value={pFile.title}
                               onChange={(e) => updateFileTitle(pFile.id, e.target.value)}
                               disabled={isUploading}
                               className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full px-1"
                             />
                             <div className="flex space-x-2 mt-1 px-1">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{(pFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{pFile.category.replace('_', ' ')}</span>
                             </div>
                           </div>
                         </div>
                         <button onClick={() => removeFile(pFile.id)} disabled={isUploading} className="text-slate-400 hover:text-red-500 p-1">
                           <X className="w-4 h-4" />
                         </button>
                      </div>

                      {/* Sub-Parecer por arquivo */}
                      <div className="mt-3 text-xs bg-blue-50 text-blue-800 p-2 rounded flex items-start">
                         <ShieldCheck className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                         <span className="leading-snug">{pFile.consultativeNote}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PAINEL CONSULTIVO GERAL DE DUE DILIGENCE */}
          <div>
            <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800 h-full flex flex-col">
               <div className="flex items-center space-x-2 text-indigo-400 mb-4">
                 <CheckSquare className="w-5 h-5" />
                 <h2 className="font-bold">Check-list Due Diligence</h2>
               </div>

               <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                 O motor de organização varre os itens e monta automaticamente a saúde documental desta negociação.
               </p>

               <div className="space-y-4 flex-1">
                 {/* Item 1 */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     {dueDiligenceReport.stats.Juridico_Propriedade > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-500" />}
                     <span className={`text-sm ${dueDiligenceReport.stats.Juridico_Propriedade > 0 ? 'text-slate-200' : 'text-slate-500'}`}>Jurídico & Propriedade</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{dueDiligenceReport.stats.Juridico_Propriedade}</span>
                 </div>
                 {/* Item 2 */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     {dueDiligenceReport.stats.Ambiental > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-500" />}
                     <span className={`text-sm ${dueDiligenceReport.stats.Ambiental > 0 ? 'text-slate-200' : 'text-slate-500'}`}>Ambiental (CAR/Licenças)</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{dueDiligenceReport.stats.Ambiental}</span>
                 </div>
                 {/* Item 3 */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     {dueDiligenceReport.stats.Fiscal_INCRA > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-500" />}
                     <span className={`text-sm ${dueDiligenceReport.stats.Fiscal_INCRA > 0 ? 'text-slate-200' : 'text-slate-500'}`}>Fiscal, INCRA e CNDs</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{dueDiligenceReport.stats.Fiscal_INCRA}</span>
                 </div>
                 {/* Item 4 */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     {dueDiligenceReport.stats.Tecnico_Georreferenciamento > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-500" />}
                     <span className={`text-sm ${dueDiligenceReport.stats.Tecnico_Georreferenciamento > 0 ? 'text-slate-200' : 'text-slate-500'}`}>Técnico (Geo/SIGEF/Laudos)</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{dueDiligenceReport.stats.Tecnico_Georreferenciamento}</span>
                 </div>
               </div>

               {/* Barra de Progresso do Dossiê */}
               <div className="mt-6 border-t border-slate-800 pt-5">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-semibold text-slate-300">Completude do Dossiê</span>
                   <span className="text-sm font-bold text-indigo-400">{dueDiligenceReport.completenessPercent}%</span>
                 </div>
                 <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${dueDiligenceReport.completenessPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${dueDiligenceReport.completenessPercent}%` }}
                    ></div>
                 </div>
                 {dueDiligenceReport.completenessPercent === 100 && (
                   <p className="text-[10px] text-emerald-400 mt-2 text-center font-medium">
                     Todos os pilares de due diligence cobertos.
                   </p>
                 )}
               </div>

               <div className="mt-6">
                 <button
                    onClick={onUploadBatch}
                    disabled={parsedFiles.length === 0 || isUploading}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Encriptando Lote...
                      </>
                    ) : (
                      'Consolidar Lote Seguro'
                    )}
                  </button>
               </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}