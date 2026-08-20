import React, { useState, useEffect } from 'react';
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
  Trash2
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
}

export function SecureDocumentValidation() {
  // Inicial limpo (0 documentos) para a sensação de estar começando do zero
  const [mockDocuments, setMockDocuments] = useState<AnalyzedDocument[]>([]);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Estado para visualização do PDF (modal)
  const [viewingDoc, setViewingDoc] = useState<AnalyzedDocument | null>(null);

  // Buscar os documentos fictícios no LocalStorage quando montar
  useEffect(() => {
    vaultDB.get('B2B_MOCK_VAULT').then((savedMock: any) => {
      if (savedMock) {
        try {
          const parsed = typeof savedMock === 'string' ? JSON.parse(savedMock) : savedMock;
          setMockDocuments(parsed);
          if (parsed.length > 0) setExpandedDocId(parsed[0].id);
        } catch (e) {}
      }
    });
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
    const updatedDocs = mockDocuments.filter(doc => doc.id !== id);
    await vaultDB.set('B2B_MOCK_VAULT', updatedDocs);
    setMockDocuments(updatedDocs);
    if (expandedDocId === id) setExpandedDocId(null);
  };

  const hasCriticalIssues = mockDocuments.some(doc => doc.status === 'Pendente');

  // --- COMPONENTES INTERNOS ---

  // Modal Visualizador de Documento Bloqueado
    const DocumentViewerModal = () => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!viewingDoc || !viewingDoc.fileData) return;

      // Otimização de Engenharia: Transformar Base64 em Blob URL nativamente (mais rápido e sem falhas)
      try {
        if (viewingDoc.fileData.startsWith('data:')) {
          fetch(viewingDoc.fileData)
            .then(res => res.blob())
            .then(blob => {
              const url = URL.createObjectURL(blob);
              setBlobUrl(url);
            })
            .catch(err => {
              console.error("Falha ao gerar blob via fetch:", err);
              setBlobUrl(viewingDoc.fileData || null); // Fallback direto para o Base64
            });
        } else {
          setBlobUrl(viewingDoc.fileData || null);
        }
      } catch (err) {
        console.error("Falha ao otimizar visualização do documento:", err);
        setBlobUrl(viewingDoc.fileData || null); // Fallback
      }

      return () => {
        if (blobUrl && blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blobUrl);
        }
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

            {viewingDoc.fileData ? (
              viewingDoc.fileType?.startsWith('image/') ? (
                <div className="w-full h-full flex items-center justify-center bg-[#2d3032] overflow-auto p-4">
                   <img src={blobUrl || viewingDoc.fileData} alt="Documento Visualizado" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <iframe
                    src={blobUrl ? `${blobUrl}#toolbar=0&navpanes=0` : ''}
                    className="w-full h-full border-0 pointer-events-auto z-0"
                    title="Visualizador Seguro"
                  />
                  <div className="absolute bottom-4 right-4 z-10 md:hidden">
                    {blobUrl && (
                      <a
                        href={blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-fbsb-cyan text-fbsb-bg-deep rounded-xl shadow-premium font-bold text-xs uppercase tracking-wider flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" /> Forçar Abertura
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
          <div className="px-4 py-3 bg-fbsb-surface-200 rounded-lg border border-fbsb-border w-full md:w-auto">
            <span className="text-[10px] font-bold text-fbsb-text-secondary uppercase tracking-widest block mb-1">Status Global do Dossiê</span>
            {mockDocuments.length === 0 ? (
              <span className="text-sm font-bold text-fbsb-text-secondary flex items-center">Cofre Vazio</span>
            ) : hasCriticalIssues ? (
              <span className="text-sm font-bold text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Risco de Negociação</span>
            ) : (
              <span className="text-sm font-bold text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Apto para Aquisição</span>
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
                    className={`px-5 py-4 flex items-center justify-between cursor-pointer ${
                      isExpanded ? 'bg-fbsb-bg-main' : 'bg-fbsb-surface-100'
                    }`}
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-fbsb-surface-100 rounded-xl shadow-sm border border-fbsb-border">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-fbsb-text-primary text-sm">{doc.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[10px] bg-fbsb-surface-200 text-fbsb-text-secondary px-2 py-0.5 rounded font-bold uppercase">{doc.category}</span>
                          <span className="text-[10px] text-fbsb-text-secondary">Inserido em {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
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
                    <div className="px-5 py-6 bg-fbsb-surface-100 border-t border-fbsb-border">

                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-fbsb-text-secondary block mb-2">Órgão Regulador / Autoridade Emissora</span>
                          <div className="text-sm font-semibold text-fbsb-text-primary flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-2 text-fbsb-text-secondary" />
                            {doc.issuingAuthority}
                          </div>
                        </div>

                        {/* Botoes de Ação */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if(window.confirm('Tem certeza que deseja excluir este documento?')) {
                                handleDeleteDocument(doc.id);
                              }
                            }}
                            className="flex items-center px-4 py-2 bg-fbsb-surface-200 text-fbsb-danger text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-fbsb-danger/10 transition-colors border border-fbsb-border"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

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