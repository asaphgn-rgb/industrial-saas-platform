import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileSignature,
  Fingerprint,
  Building2,
  TreePine,
  Scale,
  MapPin,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  FileBadge,
  Trash2,
  User,
  ShieldAlert,
  Check
} from 'lucide-react';

// --- Utilitário IndexedDB para suportar dezenas de MegaBytes ---
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


interface AnalyzedDocument {
  id: string;
  title: string;
  category: 'Juridico' | 'Ambiental' | 'Fiscal' | 'Tecnico';
  status: 'Aprovado' | 'Pendente';
  uploadDate: string;
  regulatoryAnalysis: string;
  resolutionAction?: string;
  issuingAuthority: string;
  fileData?: string;
  fileType?: string;
  isTooLarge?: boolean;
  uploaderName?: string;
  uploaderRole?: string;
  uploaderEmail?: string;
  deletionRequested?: boolean;
}

interface SecureDocumentValidationProps {
  currentUser?: any;
}

export function SecureDocumentValidation({ currentUser }: SecureDocumentValidationProps = {}) {
  // Inicial limpo (0 documentos) para a sensação de estar começando do zero
  const [mockDocuments, setMockDocuments] = useState<AnalyzedDocument[]>([]);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Estado para visualização do PDF (modal)
  const [viewingDoc, setViewingDoc] = useState<AnalyzedDocument | null>(null);

  // Buscar os documentos na nuvem
  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await (supabase as any).from('b2b_documents').select('*').eq('tenant_id', 'tenant-industrial-demo-uuid');

      if (data && !error) {
        const docs = data;

        const parsed: AnalyzedDocument[] = docs.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          status: d.status,
          uploadDate: d.upload_date,
          regulatoryAnalysis: d.regulatory_analysis,
          resolutionAction: d.resolution_action,
          issuingAuthority: d.issuing_authority,
          fileData: d.file_data,
          fileType: d.file_type,
          isTooLarge: d.is_too_large,
          uploaderName: d.uploader_name,
          uploaderRole: d.uploader_role,
          uploaderEmail: d.uploader_email,
          deletionRequested: d.deletion_requested,
        }));

        setMockDocuments(parsed);
        if (parsed.length > 0) setExpandedDocId(parsed[0].id);
      }
    };
    fetchDocuments();
  }, []);

  // Lógica de ícones por categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Juridico': return <Scale className="w-5 h-5 text-fbsb-text-primary" />;
      case 'Ambiental': return <TreePine className="w-5 h-5 text-emerald-600" />;
      case 'Fiscal': return <Building2 className="w-5 h-5 text-fbsb-text-secondary" />;
      case 'Tecnico': return <MapPin className="w-5 h-5 text-fbsb-cyan" />;
      default: return <FileText className="w-5 h-5 text-fbsb-text-secondary" />;
    }
  };

  const handleDeleteDocument = async (id: string) => {
    // Busca o caminho no bucket antes de deletar o registro
    const { data: docData } = await (supabase as any).from('b2b_documents').select('file_data').eq('id', id).single();
    
    // Apaga o registro
    const { error } = await (supabase as any).from('b2b_documents').delete().eq('id', id);
    
    // Tenta apagar o binário se existir
    if (!error && docData && docData.file_data && docData.file_data.startsWith('vdr_uploads/')) {
       await supabase.storage.from('vdr_secure_files').remove([docData.file_data]);
    }
    const updatedDocs = mockDocuments.filter(doc => doc.id !== id);

    if (!error) {
      setMockDocuments(updatedDocs);
      if (expandedDocId === id) setExpandedDocId(null);
    } else {
      alert('Erro ao excluir documento na nuvem.');
    }
  };

  const handleRequestDeletion = async (id: string) => {
    const updatedDocs = mockDocuments.map(doc => doc.id === id ? { ...doc, deletionRequested: true, deletion_requested: true } : doc);
    const { error } = await (supabase as any).from('b2b_documents').update({ deletion_requested: true }).eq('id', id);

    if (!error) {
      setMockDocuments(updatedDocs as AnalyzedDocument[]);
      alert('Solicitação de exclusão enviada para a Direção Executiva.');
    } else {
      alert('Erro ao solicitar exclusão na nuvem.');
    }
  };

  const handleRejectDeletion = async (id: string) => {
    const updatedDocs = mockDocuments.map(doc => doc.id === id ? { ...doc, deletionRequested: false, deletion_requested: false } : doc);
    const { error } = await (supabase as any).from('b2b_documents').update({ deletion_requested: false }).eq('id', id);

    if (!error) {
      setMockDocuments(updatedDocs as AnalyzedDocument[]);
    } else {
      alert('Erro ao rejeitar exclusão na nuvem.');
    }
  };

  const isCEO = currentUser?.initials === 'CEO';

  const hasCriticalIssues = mockDocuments.some(doc => doc.status === 'Pendente');

  // --- COMPONENTES INTERNOS ---

  // Modal Visualizador de Documento Bloqueado
    const DocumentViewerModal = () => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!viewingDoc || !viewingDoc.fileData) return;

      let revoke: string | null = null;

      const load = async () => {
        const fd = viewingDoc.fileData!;

        // Caso 1: caminho no Supabase Storage (novo padrão)
        if (fd.startsWith('vdr_uploads/')) {
          try {
            const { data, error } = await supabase.storage
              .from('vdr_secure_files')
              .createSignedUrl(fd, 120); // URL expira em 120 segundos
            if (data && !error) {
              setBlobUrl(data.signedUrl);
            } else {
              console.error('Erro ao gerar SignedURL:', error);
              setBlobUrl(null);
            }
          } catch (e) {
            console.error('Falha de rede ao gerar SignedURL:', e);
            setBlobUrl(null);
          }
          return;
        }

        // Caso 2: legado Base64 (data:application/pdf;base64,...)
        if (fd.startsWith('data:')) {
          try {
            const res = await fetch(fd);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            revoke = url;
            setBlobUrl(url);
          } catch {
            setBlobUrl(fd);
          }
          return;
        }

        // Fallback genérico
        setBlobUrl(fd);
      };

      load();

      return () => {
        if (revoke) URL.revokeObjectURL(revoke);
        setBlobUrl(null);
      };
    }, [viewingDoc]);

    if (!viewingDoc) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-fbsb-surface-200/80 backdrop-blur-sm p-4">
        <div className="bg-fbsb-surface-100 rounded-2xl shadow-premium w-full md:max-w-5xl h-[95vh] md:h-[85vh] flex flex-col overflow-hidden relative" onContextMenu={(e) => e.preventDefault()}>
          {/* Header do Viewer */}
          <div className="px-6 py-4 bg-fbsb-primary text-white flex items-center justify-between z-10 shadow-md">
            <div className="flex items-center space-x-4">
               <div className="p-2 bg-fbsb-surface-200 rounded-lg shadow-inner-gold">
                  <Lock className="w-5 h-5 text-fbsb-cyan" />
               </div>
               <div>
                  <h3 className="font-bold font-serif text-sm md:text-base truncate max-w-[200px] md:max-w-md">{viewingDoc.title}</h3>
                  <p className="text-[10px] text-fbsb-text-secondary uppercase tracking-widest mt-1 font-semibold">Visualização Restrita • Proibido Download</p>
               </div>
            </div>
            <button onClick={() => setViewingDoc(null)} className="text-fbsb-text-secondary hover:text-white transition-colors bg-fbsb-surface-200 p-2 rounded-xl">
               <X className="w-6 h-6" />
            </button>
          </div>

          {/* Corpo do Viewer - Simulação de PDF (CSS para impedir seleção e download) */}
          <div className="flex-1 bg-[#525659] overflow-hidden flex flex-col items-center select-none relative">
            {viewingDoc.isTooLarge ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-fbsb-surface-100 p-8 text-center">
                 <ShieldAlert className="w-20 h-20 text-orange-500 mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                 <h2 className="text-xl font-bold text-white font-serif mb-2">Arquivo Gigante Interceptado</h2>
                 <p className="text-sm text-fbsb-text-secondary max-w-md mb-6 leading-relaxed">
                   Para não causar congestionamento e lentidão na rede dos auditores, este arquivo (por ser muito grande) não teve seus bytes brutos transportados. Sua **trilha de auditoria ISO 9001 e status estão preservados**.
                 </p>
              </div>
            ) : viewingDoc.fileData ? (
              viewingDoc.fileType?.startsWith('image/') ? (
                <div className="w-full h-full flex items-center justify-center bg-[#2d3032] overflow-auto p-4">
                   <img src={blobUrl || viewingDoc.fileData} alt="Documento Visualizado" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-[#525659]">
                  <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-fbsb-surface-100 z-0">
                    <FileText className="w-16 h-16 text-fbsb-text-secondary mb-4 opacity-50" />
                    <h2 className="text-lg font-bold text-fbsb-text-primary font-serif mb-2">Visualizador Mobile</h2>
                    <p className="text-sm text-fbsb-text-secondary mb-6 max-w-xs">
                      Para melhor leitura em dispositivos móveis, abra o documento nativamente usando o botão abaixo.
                    </p>
                  </div>

                  <iframe
                    src={blobUrl ? `${blobUrl}#toolbar=0&navpanes=0` : ''}
                    className="w-full h-full border-0 pointer-events-auto z-10 hidden md:block bg-white"
                    title="Visualizador Seguro"
                  />

                  <div className="absolute bottom-8 right-0 left-0 flex justify-center z-20 md:hidden">
                    {(blobUrl || viewingDoc.fileData) && (
                      <a
                        href={blobUrl || viewingDoc.fileData}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-4 bg-fbsb-cyan text-fbsb-bg-deep rounded-2xl shadow-premium font-bold text-sm uppercase tracking-widest flex items-center shadow-[0_0_30px_rgba(0,212,255,0.6)]"
                      >
                        <Eye className="w-5 h-5 mr-2" /> Visualizar Documento
                      </a>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="bg-fbsb-surface-100 w-full max-w-3xl min-h-[1056px] shadow-2xl p-16 flex flex-col items-center justify-center text-center z-0">
                 <AlertTriangle className="w-16 h-16 text-fbsb-text-secondary mb-4" />
                 <h2 className="text-xl font-bold text-fbsb-text-secondary font-serif">Documento Original Indisponível</h2>
                 <p className="text-fbsb-text-secondary mt-2">O arquivo base não foi processado ou está indisponível na sessão de visualização segura.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


    return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-full font-sans">
      <DocumentViewerModal />

      {/* Esquerda: Lista de Documentos Analisados */}
      <div className="flex-1 bg-fbsb-surface-100 border border-fbsb-border rounded-2xl shadow-premium p-4 md:p-8 overflow-y-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-4 border-b border-fbsb-border gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-fbsb-text-primary font-serif flex items-center">
              Auditoria de Conformidade <ShieldCheck className="ml-3 w-5 h-5 md:w-6 md:h-6 text-fbsb-cyan" />
            </h1>
            <p className="text-xs md:text-sm text-fbsb-text-secondary mt-1">
              Base de Dados Segura. Pareceres consultivos emitidos com base na matriz regulatória.
            </p>
          </div>
          <div className="px-4 py-3 bg-fbsb-surface-200 rounded-lg border border-fbsb-border w-full md:w-auto flex items-center space-x-4">
            <div>
              <span className="text-[10px] font-bold text-fbsb-text-secondary uppercase tracking-widest block mb-1">Status Global do Dossiê</span>
              {mockDocuments.length === 0 ? (
                <span className="text-sm font-bold text-fbsb-text-secondary flex items-center">Cofre Vazio</span>
              ) : hasCriticalIssues ? (
                <span className="text-sm font-bold text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Risco de Negociação</span>
              ) : (
                <span className="text-sm font-bold text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Apto para Aquisição</span>
              )}
            </div>
            {isCEO && mockDocuments.length > 0 && (
              <button
                onClick={async () => {
                   if(window.confirm("Deseja apagar TODOS os documentos da Nuvem e esvaziar o cofre?")) {
                      // Busca todos os arquivos no Storage primeiro
                      const { data: allDocs } = await (supabase as any).from('b2b_documents').select('file_data').eq('tenant_id', 'tenant-industrial-demo-uuid');
                      const filesToRemove = allDocs?.map((d: any) => d.file_data).filter((f: string) => f && f.startsWith('vdr_uploads/')) || [];
                      
                      // Apaga do Postgres
                      await (supabase as any).from('b2b_documents').delete().eq('tenant_id', 'tenant-industrial-demo-uuid');
                      
                      // Apaga do Storage (Lote)
                      if (filesToRemove.length > 0) {
                         await supabase.storage.from('vdr_secure_files').remove(filesToRemove);
                      }
                      setMockDocuments([]);
                      alert("Cofre esvaziado com sucesso!");
                   }
                }}
                className="px-3 py-1.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
                title="Função Especial de Limpeza"
              >
                Limpar Cofre
              </button>
            )}
          </div>
        </div>

        {mockDocuments.length === 0 ? (
          <div className="min-h-[250px] md:min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-fbsb-border rounded-2xl bg-fbsb-surface-200 text-center p-4 md:p-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-fbsb-surface-100 rounded-full flex items-center justify-center shadow-sm mb-4">
               <Lock className="w-6 h-6 md:w-8 md:h-8 text-fbsb-text-secondary" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-fbsb-text-primary font-serif mb-2">Base de Dados Limpa</h3>
            <p className="text-xs md:text-sm text-fbsb-text-secondary max-w-md">
              Não há documentos processados. Utilize o painel de upload seguro (Dossiê Documental) para enviar matrizes rurais, laudos e certidões.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockDocuments.map((doc) => {
              const isExpanded = expandedDocId === doc.id;
              const isPending = doc.status === 'Pendente';

              return (
                <div
                  key={doc.id}
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-fbsb-cyan shadow-md' : 'border-fbsb-border hover:border-fbsb-border'
                  }`}
                >
                  {/* Header do Card (Clickable) */}
                  <div
                    className={`px-4 md:px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                      isExpanded ? 'bg-fbsb-bg-main' : 'bg-fbsb-surface-100'
                    }`}
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                  >
                    <div className="flex items-start md:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                      <div className="p-2.5 bg-fbsb-surface-100 rounded-xl shadow-sm border border-fbsb-border flex-shrink-0">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-fbsb-text-primary text-sm break-words line-clamp-2 md:line-clamp-none pr-2">{doc.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[10px] bg-fbsb-surface-200 text-fbsb-text-secondary px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap">{doc.category}</span>
                          <span className="text-[10px] text-fbsb-text-secondary whitespace-nowrap">Inserido em {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 md:space-x-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-fbsb-border/30">
                      {isPending ? (
                        <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-md text-[11px] font-bold border border-red-100">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Pendência
                        </div>
                      ) : (
                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md text-[11px] font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Conforme
                        </div>
                      )}
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-fbsb-text-secondary" /> : <ChevronDown className="w-5 h-5 text-fbsb-text-secondary" />}
                    </div>
                  </div>

                  {/* Conteúdo Expandido (Resumo Didático e Técnico) */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 py-6 bg-fbsb-surface-100 border-t border-fbsb-border">

                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                        <div className="w-full md:w-auto flex flex-col space-y-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary block mb-2">Órgão Regulador / Autoridade Emissora</span>
                            <div className="text-sm font-semibold text-fbsb-text-primary flex items-center break-words">
                              <ShieldCheck className="w-4 h-4 mr-2 text-fbsb-text-secondary flex-shrink-0" />
                              <span className="flex-1">{doc.issuingAuthority}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary block mb-2">Trilha de Auditoria (Upload via)</span>
                            <div className="text-sm font-semibold text-fbsb-text-primary flex items-center break-words bg-fbsb-surface-200 px-3 py-2 rounded-lg border border-fbsb-border">
                              <User className="w-4 h-4 mr-2 text-fbsb-cyan flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="flex-1 text-xs text-white">{doc.uploaderRole || 'Usuário Sistema'}</span>
                                <span className="flex-1 text-[10px] text-fbsb-text-secondary font-normal">{doc.uploaderName || 'Não Identificado'} • <span className="text-fbsb-cyan">{doc.uploaderEmail || 'N/A'}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botoes de Ação */}
                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end flex-wrap gap-y-2">

                          {/* Lógica de Exclusão por Permissão */}
                          {isCEO ? (
                            <>
                              {doc.deletionRequested && (
                                <div className="flex items-center space-x-2 mr-2 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">
                                  <ShieldAlert className="w-4 h-4 text-red-500" />
                                  <span className="text-[10px] text-red-500 font-bold uppercase">Solicitação Pendente</span>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition" title="Aprovar Exclusão">
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleRejectDeletion(doc.id); }} className="p-1 bg-fbsb-surface-300 text-fbsb-text-secondary rounded hover:text-white transition" title="Rejeitar Exclusão">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(window.confirm('Tem certeza que deseja excluir este documento PERMANENTEMENTE?')) {
                                    handleDeleteDocument(doc.id);
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-fbsb-surface-200 text-fbsb-danger text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-fbsb-danger/10 transition-colors border border-fbsb-border"
                                title="Exclusão Direta (CEO)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (doc.deletionRequested) {
                                    alert('Você já solicitou a exclusão deste arquivo. Aguardando aprovação da Direção.');
                                    return;
                                  }
                                  if(window.confirm('Você não tem permissão para exclusão direta. Deseja solicitar que a Direção Executiva exclua este documento?')) {
                                    handleRequestDeletion(doc.id);
                                  }
                                }}
                                className={`flex items-center px-4 py-2 ${doc.deletionRequested ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-fbsb-surface-200 text-fbsb-text-secondary border-fbsb-border hover:bg-fbsb-surface-300'} text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border`}
                                title="Solicitar Exclusão"
                            >
                                {doc.deletionRequested ? <ShieldAlert className="w-4 h-4 mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                {doc.deletionRequested ? 'Exclusão Solicitada' : 'Solicitar Exclusão'}
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingDoc(doc);
                            }}
                            className="flex items-center px-4 py-2 bg-fbsb-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-premium hover:bg-fbsb-surface-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2 text-fbsb-cyan" />
                            Ler Documento
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-fbsb-surface-200 rounded-xl border border-fbsb-border">
                        <h4 className="text-xs font-bold text-fbsb-text-primary uppercase tracking-widest mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-fbsb-cyan" />
                          Parecer Consultivo Técnico
                        </h4>
                        <p className="text-sm text-fbsb-text-secondary leading-relaxed text-justify">
                          {doc.regulatoryAnalysis}
                        </p>
                      </div>

                      {isPending && doc.resolutionAction && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                          <h4 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Instrução Normativa para Resolução
                          </h4>
                          <p className="text-sm text-red-900 leading-relaxed">
                            {doc.resolutionAction}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direita: Painel de Aceite e Proposta de Compra e Venda */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6">

        {/* Sumário Executivo */}
        <div className="bg-fbsb-primary rounded-2xl p-8 shadow-premium relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-fbsb-cyan opacity-10 rounded-full blur-2xl"></div>

          <h2 className="text-white font-serif text-xl font-bold mb-4">Mesa de Fechamento</h2>
          <p className="text-fbsb-text-secondary text-sm leading-relaxed mb-6">
            O ambiente criptografado da Vault consolida os ativos e emite a minuta final de negociação B2B com amparo de <i>Smart Contracts</i>.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-fbsb-text-secondary">Total Auditado</span>
              <span className="text-white font-bold">{mockDocuments.length} Documentos</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-fbsb-text-secondary">Certificações</span>
              <span className="text-emerald-400 font-bold">{mockDocuments.filter(d => d.status === 'Aprovado').length} Válidas</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-fbsb-text-secondary">Pendências Críticas</span>
              <span className={hasCriticalIssues ? "text-red-400 font-bold" : "text-white font-bold"}>
                {mockDocuments.filter(d => d.status === 'Pendente').length} Encontradas
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}