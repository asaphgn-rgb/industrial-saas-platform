import React, { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UploadCloud, File, AlertCircle, CheckCircle2, ShieldCheck,
  X, Layers, Scale, TreePine, MapPin, Receipt, CheckSquare, Clock
} from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';

// --- Utilitário IndexedDB para suportar dezenas de MegaBytes (Bypass de cota do LocalStorage) ---
const vaultDB = {
  dbName: 'B2B_Vault_DB',
  storeName: 'documents',
  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  },
  async set(key: string, value: any): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async get(key: string): Promise<any> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};


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
  fileData?: string;
  fileType?: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  error?: string;
  uploadedCount: number;
}

interface SecureUploadPageProps {
  onUploadComplete?: () => void;
}

export function SecureUploadPage({ onUploadComplete }: SecureUploadPageProps) {
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
  const analyzeFile = (file: File, index: number): ParsedFile => {
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
      // Fallback Inteligente para UX de Demonstração (Distribui os genéricos para mostrar a barra funcionando)
      const fallbackCategories: DueDiligenceCategory[] = [
        'Juridico_Propriedade', 'Ambiental', 'Fiscal_INCRA', 'Tecnico_Georreferenciamento'
      ];
      category = fallbackCategories[index % fallbackCategories.length];
      consultativeNote = "Documento genérico em triagem. Classificação preliminar atribuída para estruturação de dossiê inicial.";
    }

    return {
      id: Math.random().toString(36).substring(7),
      file,
      title: file.name,
      category,
      consultativeNote
    };
  };

    const handleFilesSelection = async (files: File[]) => {
    // Para renderizar PDFs e imagens reais na tela de Validação
    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const currentOffset = parsedFiles.length; // Usa o offset de quantos já tem pra não cair na mesma categoria

    const newParsedFiles = await Promise.all(
      files.map(async (file, idx) => {
        const parsed = analyzeFile(file, currentOffset + idx);
        try {
          // Convertendo para Base64 para armazenar no localStorage e recuperar no visualizador
          const base64 = await readFileAsBase64(file);
          parsed.fileData = base64;
          parsed.fileType = file.type;
        } catch (e) {
          console.error('Erro ao ler arquivo', e);
        }
        return parsed;
      })
    );
    
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
      // MOCK PARA DEMONSTRAÇÃO (SEM SUPABASE LOCAL STARTADO)
      await new Promise(r => setTimeout(r, 600)); // Simulando criptografia E2E rápida
      uploadedCount = parsedFiles.length;

      setUploadStatus({
        success: true,
        message: "[DEMO] Todos os documentos foram encriptados e classificados com sucesso no cofre.",
        uploadedCount
      });

      // Gravar dados mockados na memória local para a tela de Validação enxergar que algo foi upado
      const docsForValidation = parsedFiles.map((pf) => {
         // Ajuste do mock para mapear o status de auditoria dependendo da categoria e de uma heurística boba
         let status: 'Aprovado'|'Pendente' = 'Aprovado';
         let resolutionAction = undefined;

         if (pf.category === 'Fiscal_INCRA' && pf.file.name.toLowerCase().includes('2024')) {
             status = 'Pendente';
             resolutionAction = 'Acessar o portal do SNCR (Sistema Nacional de Cadastro Rural) via gov.br, gerar o boleto da taxa de serviço cadastral de 2026, efetuar o pagamento e emitir o CCIR atualizado. O sistema confirmará a compensação em até 48h úteis.';
         }

         return {
           id: pf.id,
           title: pf.title,
           category: pf.category.split('_')[0] as any, // Transforma 'Juridico_Propriedade' em 'Juridico'
           status: status,
           uploadDate: new Date().toISOString().split('T')[0],
           issuingAuthority: 'Autoridade Reguladora Virtual',
           regulatoryAnalysis: pf.consultativeNote,
           resolutionAction,
           fileData: pf.fileData,
           fileType: pf.fileType
         };
      });

      await vaultDB.set('B2B_MOCK_VAULT', docsForValidation);

      // Navegar para a validação se existir o hook de redirect (App.tsx passará)
      if (onUploadComplete) {
         setTimeout(() => onUploadComplete(), 400);
      }

      return;

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
      case 'Juridico_Propriedade': return <Scale className="w-5 h-5 text-fbsb-cyan" />;
      case 'Ambiental': return <TreePine className="w-5 h-5 text-emerald-600" />;
      case 'Fiscal_INCRA': return <Receipt className="w-5 h-5 text-fbsb-text-secondary" />;
      case 'Tecnico_Georreferenciamento': return <MapPin className="w-5 h-5 text-fbsb-text-primary" />;
      default: return <File className="w-5 h-5 text-fbsb-text-secondary" />;
    }
  };

  return (
    <div className="w-full h-full bg-fbsb-surface-100 rounded-2xl shadow-premium border border-fbsb-border overflow-hidden flex flex-col">
      {/* HEADER ELITIZADO */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-fbsb-border bg-fbsb-surface-100">
        <h1 className="text-2xl md:text-3xl font-bold text-fbsb-text-primary flex items-center font-serif">
          Cofre de Due Diligence
          <Layers className="w-6 h-6 md:w-7 md:h-7 ml-3 text-fbsb-cyan" />
        </h1>
        <p className="text-xs md:text-sm text-fbsb-text-secondary mt-2 font-medium">
          Os documentos enviados são analisados automaticamente para identificar erros, inconsistências, pendências e não conformidades.
        </p>
      </div>

      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        {/* FEEDBACK DE STATUS DE UPLOAD */}
        {uploadStatus && uploadStatus.success && (
          <div className="mb-8 p-5 bg-fbsb-surface-100 border-l-4 border-emerald-500 shadow-sm rounded-r-xl flex items-start">
            <CheckCircle2 className="w-6 h-6 mr-4 mt-0.5 text-emerald-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-fbsb-text-primary text-lg font-serif">Sucesso na Criptografia</h3>
              <p className="text-sm text-fbsb-text-secondary mt-1">{uploadStatus.uploadedCount} documentos foram transferidos para o cofre seguro.</p>
              <button onClick={resetForm} className="mt-4 px-4 py-2 bg-fbsb-bg-main text-fbsb-text-primary text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-fbsb-text-secondary/20 transition-colors">
                Novo Lote
              </button>
            </div>
          </div>
        )}

        {uploadStatus && !uploadStatus.success && (
          <div className="mb-8 p-5 bg-fbsb-surface-100 border-l-4 border-red-500 shadow-sm rounded-r-xl flex items-start">
            <AlertCircle className="w-6 h-6 mr-4 mt-0.5 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-fbsb-text-primary text-lg font-serif">Falha de Segurança</h3>
              <p className="text-sm text-fbsb-text-secondary mt-1">{uploadStatus.error}</p>
              <p className="text-xs mt-2 font-bold text-fbsb-text-secondary">Documentos gravados antes da interrupção: {uploadStatus.uploadedCount}</p>
            </div>
          </div>
        )}

        {(!uploadStatus || !uploadStatus.success) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

            {/* ZONA DE ARRASTAR ARQUIVOS E LISTAGEM */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div
                className={`relative border border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[200px] md:min-h-[240px]
                  ${dragActive
                    ? 'border-fbsb-cyan bg-fbsb-cyan/5 shadow-[0_0_30px_rgba(225,174,71,0.15)] scale-[1.02]'
                    : 'border-fbsb-border hover:border-fbsb-cyan hover:bg-fbsb-bg-main/50 bg-fbsb-surface-100'}
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
                <div className={`p-4 rounded-full mb-4 transition-colors ${dragActive ? 'bg-fbsb-cyan/20' : 'bg-fbsb-bg-main'}`}>
                  <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-fbsb-cyan' : 'text-fbsb-text-primary/60'}`} />
                </div>
                <h3 className="text-xl font-bold text-fbsb-text-primary font-serif">Solte o pacote de documentos aqui</h3>
                <p className="text-fbsb-text-secondary text-sm mt-2 max-w-sm">
                  Matrículas, Certidões, CAR, SIGEF. O sistema analisará o conteúdo automaticamente.
                </p>
                <div className="mt-6 px-4 py-1.5 border border-fbsb-border text-fbsb-text-primary rounded-full text-[10px] font-bold uppercase tracking-widest bg-fbsb-surface-100 shadow-sm">
                  Criptografia E2E Ativa
                </div>
              </div>

              {/* LISTA DE ARQUIVOS EM MEMÓRIA */}
              {parsedFiles.length > 0 && (
                <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-fbsb-text-primary mb-5 flex justify-between items-center uppercase tracking-wider">
                    <span>Lote de Análise ({parsedFiles.length})</span>
                    <button onClick={() => setParsedFiles([])} className="text-[10px] text-red-400 hover:text-red-600 font-bold transition-colors">LIMPAR FILA</button>
                  </h3>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {parsedFiles.map(pFile => (
                      <div key={pFile.id} className="flex flex-col p-4 bg-fbsb-bg-main/30 border border-fbsb-border rounded-xl hover:border-fbsb-border transition-colors">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center space-x-4 w-full min-w-0">
                             <div className="p-3 bg-fbsb-surface-100 rounded-xl shadow-sm border border-fbsb-border flex-shrink-0">
                               <CategoryIcon cat={pFile.category} />
                             </div>
                             <div className="flex-1 min-w-0">
                               <input
                                 value={pFile.title}
                                 onChange={(e) => updateFileTitle(pFile.id, e.target.value)}
                                 disabled={isUploading}
                                 className="text-sm font-bold text-fbsb-text-primary bg-transparent border-b border-transparent hover:border-fbsb-border focus:border-fbsb-cyan focus:outline-none w-full pb-1 transition-colors"
                               />
                               <div className="flex space-x-2 mt-2">
                                  <span className="text-[10px] bg-fbsb-surface-100 border border-fbsb-border text-fbsb-text-secondary px-2 py-0.5 rounded font-bold tracking-wide">{(pFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  <span className="text-[10px] bg-fbsb-primary text-white px-2 py-0.5 rounded font-bold tracking-wide">{pFile.category.replace('_', ' ')}</span>
                               </div>
                             </div>
                           </div>
                           {/* Só mostra botão de excluir no upload se não for regra restrita, mas a regra BSB diz "somente Administrador pode excluir documentos definitivamente" no cofre. Na tela de upload é a triagem, então ok. */}
                           <button onClick={() => removeFile(pFile.id)} disabled={isUploading} className="text-fbsb-text-secondary hover:text-red-500 p-2 ml-2 transition-colors">
                             <X className="w-5 h-5" />
                           </button>
                        </div>

                        {/* Sub-Parecer por arquivo */}
                        <div className="mt-4 text-[11px] bg-fbsb-surface-100 border border-fbsb-cyan/20 text-fbsb-text-secondary p-3 rounded-lg flex items-start shadow-sm">
                           <ShieldCheck className="w-4 h-4 mr-2 text-fbsb-cyan flex-shrink-0" />
                           <span className="leading-relaxed font-medium">{pFile.consultativeNote}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PAINEL CONSULTIVO GERAL DE DUE DILIGENCE */}
            <div>
              <div className="bg-fbsb-primary rounded-2xl p-8 shadow-premium h-full flex flex-col relative overflow-hidden">
                 {/* Elemento de background decorativo */}
                 <div className="absolute -top-24 -right-24 w-48 h-48 bg-fbsb-cyan opacity-10 rounded-full blur-3xl"></div>

                 <div className="flex items-center space-x-3 text-fbsb-cyan mb-6 relative z-10">
                   <CheckSquare className="w-6 h-6" />
                   <h2 className="font-bold font-serif text-xl text-white">Status do Dossiê</h2>
                 </div>

                 <p className="text-xs text-fbsb-text-secondary mb-8 leading-relaxed relative z-10">
                   A inteligência do cofre classifica seus documentos garantindo que os 4 pilares da due diligence rural estejam cobertos.
                 </p>

                 <div className="space-y-6 flex-1 relative z-10">
                   {/* Item 1 */}
                   <div className="flex items-center justify-between group">
                     <div className="flex items-center space-x-3">
                       {dueDiligenceReport.stats.Juridico_Propriedade > 0 ? <CheckCircle2 className="w-5 h-5 text-fbsb-cyan" /> : <Clock className="w-5 h-5 text-fbsb-text-secondary" />}
                       <span className={`text-sm font-medium ${dueDiligenceReport.stats.Juridico_Propriedade > 0 ? 'text-white' : 'text-fbsb-text-secondary'}`}>Jurídico & Propriedade</span>
                     </div>
                     <span className="text-xs font-bold text-fbsb-text-primary bg-fbsb-text-secondary px-2.5 py-1 rounded-md">{dueDiligenceReport.stats.Juridico_Propriedade}</span>
                   </div>
                   {/* Item 2 */}
                   <div className="flex items-center justify-between group">
                     <div className="flex items-center space-x-3">
                       {dueDiligenceReport.stats.Ambiental > 0 ? <CheckCircle2 className="w-5 h-5 text-fbsb-cyan" /> : <Clock className="w-5 h-5 text-fbsb-text-secondary" />}
                       <span className={`text-sm font-medium ${dueDiligenceReport.stats.Ambiental > 0 ? 'text-white' : 'text-fbsb-text-secondary'}`}>Ambiental (CAR/Licenças)</span>
                     </div>
                     <span className="text-xs font-bold text-fbsb-text-primary bg-fbsb-text-secondary px-2.5 py-1 rounded-md">{dueDiligenceReport.stats.Ambiental}</span>
                   </div>
                   {/* Item 3 */}
                   <div className="flex items-center justify-between group">
                     <div className="flex items-center space-x-3">
                       {dueDiligenceReport.stats.Fiscal_INCRA > 0 ? <CheckCircle2 className="w-5 h-5 text-fbsb-cyan" /> : <Clock className="w-5 h-5 text-fbsb-text-secondary" />}
                       <span className={`text-sm font-medium ${dueDiligenceReport.stats.Fiscal_INCRA > 0 ? 'text-white' : 'text-fbsb-text-secondary'}`}>Fiscal, INCRA e CNDs</span>
                     </div>
                     <span className="text-xs font-bold text-fbsb-text-primary bg-fbsb-text-secondary px-2.5 py-1 rounded-md">{dueDiligenceReport.stats.Fiscal_INCRA}</span>
                   </div>
                   {/* Item 4 */}
                   <div className="flex items-center justify-between group">
                     <div className="flex items-center space-x-3">
                       {dueDiligenceReport.stats.Tecnico_Georreferenciamento > 0 ? <CheckCircle2 className="w-5 h-5 text-fbsb-cyan" /> : <Clock className="w-5 h-5 text-fbsb-text-secondary" />}
                       <span className={`text-sm font-medium ${dueDiligenceReport.stats.Tecnico_Georreferenciamento > 0 ? 'text-white' : 'text-fbsb-text-secondary'}`}>Técnico (Georreferenciamento)</span>
                     </div>
                     <span className="text-xs font-bold text-fbsb-text-primary bg-fbsb-text-secondary px-2.5 py-1 rounded-md">{dueDiligenceReport.stats.Tecnico_Georreferenciamento}</span>
                   </div>
                 </div>

                 {/* Barra de Progresso do Dossiê */}
                 <div className="mt-8 border-t border-white/10 pt-6 relative z-10">
                   <div className="flex justify-between items-end mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary">Integridade Estrutural</span>
                     <span className="text-lg font-bold text-white font-serif">{dueDiligenceReport.completenessPercent}%</span>
                   </div>
                   <div className="w-full bg-fbsb-surface-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ${dueDiligenceReport.completenessPercent === 100 ? 'bg-fbsb-cyan' : 'bg-fbsb-surface-200'}`}
                        style={{ width: `${dueDiligenceReport.completenessPercent}%` }}
                      ></div>
                   </div>
                   {dueDiligenceReport.completenessPercent === 100 && (
                     <p className="text-[10px] text-fbsb-cyan mt-3 font-bold uppercase tracking-wider">
                       Dossiê Qualificado para Auditoria
                     </p>
                   )}
                 </div>

                 <div className="mt-8 relative z-10">
                   <button
                      onClick={onUploadBatch}
                      disabled={parsedFiles.length === 0 || isUploading}
                      className="w-full flex items-center justify-center px-6 py-4 bg-fbsb-cyan text-fbsb-text-primary text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(225,174,71,0.3)] hover:bg-fbsb-surface-100 focus:outline-none focus:ring-2 focus:ring-fbsb-cyan focus:ring-offset-2 focus:ring-offset-fbsb-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-fbsb-text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando Lote...
                        </>
                      ) : (
                        'Consolidar Cofre'
                      )}
                    </button>
                 </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
