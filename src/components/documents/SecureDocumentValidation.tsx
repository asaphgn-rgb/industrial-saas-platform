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
  FileBadge
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

  // Fluxo de assinatura do contrato Sênior
  const [signatureStep, setSignatureStep] = useState<'idle' | 'reading' | 'validating' | 'signed'>('idle');

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
      case 'Juridico': return <Scale className="w-5 h-5 text-elite-navy" />;
      case 'Ambiental': return <TreePine className="w-5 h-5 text-emerald-600" />;
      case 'Fiscal': return <Building2 className="w-5 h-5 text-slate-700" />;
      case 'Tecnico': return <MapPin className="w-5 h-5 text-elite-gold" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleSignature = () => {
    setSignatureStep('validating');
    setTimeout(() => {
      setSignatureStep('signed');
    }, 800); // Handshake ultrarrápido
  };

  const hasCriticalIssues = mockDocuments.some(doc => doc.status === 'Pendente');

  // --- COMPONENTES INTERNOS ---

  // Modal Visualizador de Documento Bloqueado
    const DocumentViewerModal = () => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!viewingDoc || !viewingDoc.fileData) return;
      
      // Otimização de Engenharia: Transformar Base64 gigante em Blob URL levíssima e instantânea
      try {
        const base64Data = viewingDoc.fileData.split(',')[1];
        if (!base64Data) {
          setBlobUrl(viewingDoc.fileData); // Fallback caso não seja data URI
          return;
        }
        
        const contentType = viewingDoc.fileType || 'application/pdf';
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: contentType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => URL.revokeObjectURL(url); // Previne vazamento de memória
      } catch (err) {
        console.error("Falha ao otimizar PDF:", err);
        setBlobUrl(viewingDoc.fileData); // Fallback
      }
    }, [viewingDoc]);

    if (!viewingDoc) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-premium w-full md:max-w-5xl h-[95vh] md:h-[85vh] flex flex-col overflow-hidden relative" onContextMenu={(e) => e.preventDefault()}>
          {/* Header do Viewer */}
          <div className="px-6 py-4 bg-elite-navy text-white flex items-center justify-between z-10 shadow-md">
            <div className="flex items-center space-x-4">
               <div className="p-2 bg-slate-800 rounded-lg shadow-inner-gold">
                  <Lock className="w-5 h-5 text-elite-gold" />
               </div>
               <div>
                  <h3 className="font-bold font-serif text-sm md:text-base truncate max-w-[200px] md:max-w-md">{viewingDoc.title}</h3>
                  <p className="text-[10px] text-elite-sand uppercase tracking-widest mt-1 font-semibold">Visualização Restrita • Proibido Download</p>
               </div>
            </div>
            <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-xl">
               <X className="w-6 h-6" />
            </button>
          </div>

          {/* Corpo do Viewer - Simulação de PDF (CSS para impedir seleção e download) */}
          <div className="flex-1 bg-[#525659] overflow-hidden flex flex-col items-center select-none relative">
            {/* Overlay transparente para bloquear o clique com botão direito e interações no iframe, reforçando a segurança */}
            {/* Overlay removido para permitir rolagem nativa do documento */}

            {viewingDoc.fileData ? (
              <iframe
                src={blobUrl ? `${blobUrl}#toolbar=0&navpanes=0` : ''}
                className="w-full h-full border-0 pointer-events-auto z-0"
                title="Visualizador Seguro"
              />
            ) : (
              <div className="bg-white w-full max-w-3xl min-h-[1056px] shadow-2xl p-16 flex flex-col items-center justify-center text-center z-0">
                 <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
                 <h2 className="text-xl font-bold text-slate-600 font-serif">Documento Original Indisponível</h2>
                 <p className="text-slate-500 mt-2">O arquivo base não foi processado ou está indisponível na sessão de visualização segura.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


  // Minuta de Contrato Jurídico Sênior (Exibida no Painel Direito)
  const SeniorContractDraft = () => (
    <div className="bg-slate-50 border border-elite-sand/40 rounded-xl p-5 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar relative">
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
         <FileBadge className="w-24 h-24" />
      </div>

      <h4 className="text-sm font-bold text-elite-navy font-serif mb-4 text-center border-b border-elite-sand/30 pb-3">
        INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE IMÓVEL RURAL COM CLÁUSULA RESOLUTIVA
      </h4>

      <div className="text-[11px] text-slate-700 leading-relaxed text-justify space-y-3 font-serif">
        <p>
          <strong>CLÁUSULA PRIMEIRA – DO OBJETO:</strong> O presente instrumento tem por objeto a alienação da propriedade rural
          identificada na documentação anexa, doravante denominada simplesmente "IMÓVEL", compreendendo sua posse, domínio,
          benfeitorias, semoventes e cotas de reserva ambiental legalmente estabelecidas pelo Código Florestal (Lei 12.651/12).
        </p>
        <p>
          <strong>CLÁUSULA SEGUNDA – DA DUE DILIGENCE (Diligência Prévia):</strong> As partes reconhecem, em caráter irrevogável
          e irretratável, que os documentos listados e validados eletronicamente nesta plataforma compõem a matriz de risco da negociação.
          A aprovação deste dossiê atesta a inexistência de ônus reais, hipotecas, penhoras, litígios trabalhistas, passivos ambientais ou embargos
          lavrados pelo IBAMA/ICMBio, ressalvadas apenas as pendências expressamente admitidas e destacadas no status global do cofre.
        </p>
        <p>
          <strong>CLÁUSULA TERCEIRA – DA ASSINATURA ELETRÔNICA B2B:</strong> Em observância ao disposto na Medida Provisória nº 2.200-2/2001
          e no artigo 10, § 2º, as Partes elegem a tecnologia de Assinatura Criptografada ponta a ponta deste ambiente como meio comprobatório
          válido. O clique no botão "Assinar Proposta" captura o <i>timestamp</i>, IP, hash dos documentos validados e token de sessão das partes
          autorizadas, constituindo plena validade jurídica.
        </p>
        <p>
          <strong>CLÁUSULA QUARTA – DA CONDIÇÃO SUSPENSIVA E RESOLUTIVA:</strong> Caso o dossiê apresente alertas classificados como "Pendente",
          a concretização da posse e transcrição no Cartório de Registro de Imóveis competente ficará sobrestada até a respectiva
          regularização perante o INCRA (CCIR) ou Secretaria da Receita Federal do Brasil (ITR), recaindo sobre a PARTE VENDEDORA o ônus
          da resolução das não-conformidades técnicas apuradas.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-full font-sans">
      <DocumentViewerModal />

      {/* Esquerda: Lista de Documentos Analisados */}
      <div className="flex-1 bg-white border border-elite-sand/20 rounded-2xl shadow-premium p-8 overflow-y-auto">

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-elite-sand/30">
          <div>
            <h1 className="text-2xl font-bold text-elite-navy font-serif flex items-center">
              Auditoria de Conformidade <ShieldCheck className="ml-3 w-6 h-6 text-elite-gold" />
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Base de Dados Segura. Pareceres consultivos emitidos com base na matriz regulatória.
            </p>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status Global do Dossiê</span>
            {mockDocuments.length === 0 ? (
              <span className="text-sm font-bold text-slate-500 flex items-center">Cofre Vazio</span>
            ) : hasCriticalIssues ? (
              <span className="text-sm font-bold text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Risco de Negociação</span>
            ) : (
              <span className="text-sm font-bold text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Apto para Aquisição</span>
            )}
          </div>
        </div>

        {mockDocuments.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-elite-sand/40 rounded-2xl bg-slate-50 text-center p-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Lock className="w-8 h-8 text-elite-sand" />
            </div>
            <h3 className="text-lg font-bold text-elite-navy font-serif mb-2">Base de Dados Limpa</h3>
            <p className="text-sm text-slate-500 max-w-md">
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
                    isExpanded ? 'border-elite-gold shadow-md' : 'border-elite-sand/30 hover:border-elite-sand'
                  }`}
                >
                  {/* Header do Card (Clickable) */}
                  <div
                    className={`px-5 py-4 flex items-center justify-between cursor-pointer ${
                      isExpanded ? 'bg-elite-paper' : 'bg-white'
                    }`}
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-elite-navy text-sm">{doc.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{doc.category}</span>
                          <span className="text-[10px] text-slate-400">Inserido em {doc.uploadDate}</span>
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
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Conteúdo Expandido (Resumo Didático e Técnico) */}
                  {isExpanded && (
                    <div className="px-5 py-6 bg-white border-t border-elite-sand/20">

                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-elite-sand block mb-2">Órgão Regulador / Autoridade Emissora</span>
                          <div className="text-sm font-semibold text-elite-navy flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />
                            {doc.issuingAuthority}
                          </div>
                        </div>

                        {/* Botão de Visualização Restrita */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDoc(doc);
                          }}
                          className="flex items-center px-4 py-2 bg-elite-navy text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-premium hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2 text-elite-gold" />
                          Ler Documento
                        </button>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-elite-navy uppercase tracking-widest mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-elite-gold" />
                          Parecer Consultivo Técnico
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed text-justify">
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
        <div className="bg-elite-navy rounded-2xl p-8 shadow-premium relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-elite-gold opacity-10 rounded-full blur-2xl"></div>

          <h2 className="text-white font-serif text-xl font-bold mb-4">Mesa de Fechamento</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            O ambiente criptografado da Vault consolida os ativos e emite a minuta final de negociação B2B com amparo de <i>Smart Contracts</i>.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-slate-400">Total Auditado</span>
              <span className="text-white font-bold">{mockDocuments.length} Documentos</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-slate-400">Certificações</span>
              <span className="text-emerald-400 font-bold">{mockDocuments.filter(d => d.status === 'Aprovado').length} Válidas</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-slate-400">Pendências Críticas</span>
              <span className={hasCriticalIssues ? "text-red-400 font-bold" : "text-white font-bold"}>
                {mockDocuments.filter(d => d.status === 'Pendente').length} Encontradas
              </span>
            </div>
          </div>
        </div>

        {/* Módulo de Aceite Criptografado com Contrato Jurídico Sênior */}
        <div className="bg-white border border-elite-sand/30 rounded-2xl p-8 shadow-sm flex-1 flex flex-col">

          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-3">
               <div className="p-2 bg-elite-paper rounded-lg border border-elite-sand/40">
                 <Scale className="w-6 h-6 text-elite-navy" />
               </div>
               <div>
                 <h3 className="font-bold text-elite-navy text-base">Contrato Principal</h3>
                 <p className="text-[10px] uppercase text-elite-sand font-bold tracking-widest mt-0.5">Minuta Sênior • Compra e Venda</p>
               </div>
             </div>
          </div>

          <div className="flex-1">
            <SeniorContractDraft />

            {hasCriticalIssues && signatureStep === 'idle' && mockDocuments.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-amber-800 text-xs leading-relaxed flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>RISCO FUNDIÁRIO IDENTIFICADO:</strong> Há pendências fiscais/ambientais. Assinar este termo incorre em confissão de dívida ou aceite do passivo rural segundo a <i>Cláusula Quarta</i>.
                </span>
              </div>
            )}

            {signatureStep === 'signed' && (
              <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-emerald-800 mb-2 font-serif">Negócio Jurídico Perfeito</h4>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">Hash E2E: 0x8F9B2...A14C</p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Contrato selado criptograficamente com sucesso. Trilha de auditoria gerada e partes notificadas.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSignature}
            disabled={signatureStep !== 'idle' || mockDocuments.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm flex justify-center items-center transition-all duration-300
              ${signatureStep === 'idle' && mockDocuments.length > 0
                ? 'bg-elite-navy text-white hover:bg-slate-800 shadow-[0_4px_20px_rgba(34,67,102,0.2)]'
                : signatureStep === 'validating'
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : signatureStep === 'signed'
                ? 'bg-emerald-500 text-white cursor-not-allowed shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed' // empty state
              }
            `}
          >
            {signatureStep === 'idle' && (
              <>
                <Fingerprint className="w-5 h-5 mr-3 text-elite-gold" />
                Assinar Proposta (Digital)
              </>
            )}
            {signatureStep === 'validating' && (
              <>
                <Lock className="w-5 h-5 mr-3 animate-pulse text-slate-400" />
                Processando Criptografia...
              </>
            )}
            {signatureStep === 'signed' && (
              <>
                <ShieldCheck className="w-5 h-5 mr-3 text-white" />
                Aprovado e Firmado
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}