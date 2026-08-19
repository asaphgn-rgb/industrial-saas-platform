import React, { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { UploadCloud, File, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';

interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  error?: string;
}

export function SecureUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentGroup, setDocumentGroup] = useState<string>('');
  const [customGroup, setCustomGroup] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);

  // Parecer consultivo gerado pelo sistema ao analisar o tipo de documento
  const [consultativeAdvice, setConsultativeAdvice] = useState<string | null>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    if (!documentTitle) {
      setDocumentTitle(file.name);
    }
    analyzeFileForConsultativeAdvice(file);
  };

  // Lógica inteligente (simulada) para Parecer Consultivo de Gestão
  const analyzeFileForConsultativeAdvice = (file: File) => {
    const name = file.name.toLowerCase();
    if (name.includes('car') || name.includes('cadastro_ambiental')) {
      setDocumentGroup('Ambiental');
      setConsultativeAdvice("Identificamos que este arquivo se assemelha a um recibo de Cadastro Ambiental Rural (CAR). Aconselhamos vincular este documento a uma etapa de 'Análise de Restrições Ambientais' na pipeline de Negociações (Kanban). Este documento ficará restrito a analistas ambientais por segurança.");
    } else if (name.includes('matricula') || name.includes('cartorio') || name.includes('transcricao')) {
      setDocumentGroup('Cartorio');
      setConsultativeAdvice("Este documento possui características de Transcrição ou Matrícula Imobiliária. Recomendamos checar e adicionar aos metadados o Cartório de Registro e o número do Livro/Folha. Na pipeline, deve estar sob o guarda-chuva de 'Due Diligence Jurídica'.");
    } else if (name.includes('laudo') || name.includes('tecnico')) {
      setDocumentGroup('Laudos');
      setConsultativeAdvice("Parece ser um Laudo Técnico (Cadeia Sucessória ou Agronômico). Sugerimos agrupar sob 'Análise Técnica' e exigir assinatura digital na próxima fase da Pipeline. Certifique-se de que a ART (Anotação de Responsabilidade Técnica) está anexa.");
    } else if (name.includes('ccir')) {
      setDocumentGroup('Impostos/INCRA');
      setConsultativeAdvice("Documento CCIR identificado. É uma etapa obrigatória para desmembramento ou venda. Sugerimos agrupar este comprovante à certidão de quitação de ITR e alocar na etapa 'Regularidade Fiscal' do Kanban.");
    } else {
      setDocumentGroup('');
      setConsultativeAdvice(null);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentTitle('');
    setDocumentGroup('');
    setCustomGroup('');
    setConsultativeAdvice(null);
    setUploadStatus(null);
  };

  const onUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) throw new Error("Usuário não autenticado.");

      const { data: tenantData } = await supabase.from('users').select('tenant_id').eq('id', userData.user.id).single();
      const tenantId = (tenantData as SafeAny)?.tenant_id;

      if (!tenantId) throw new Error("Tenant ID não encontrado. Falha de segurança no isolamento.");

      // 1. Resolver o grupo do documento no BD
      let finalGroupId = null;
      const groupNameToUse = documentGroup === 'Outros' ? customGroup : documentGroup;

      if (groupNameToUse) {
        // Tenta achar o grupo
        let { data: existingGroup } = await supabase
          .from('document_groups')
          .select('id')
          .eq('name', groupNameToUse)
          .single();

        if (!existingGroup) {
          // Cria o grupo se nao existir
          const { data: newGroup, error: groupErr } = await (supabase.from('document_groups').insert as SafeAny)([{
            tenant_id: tenantId,
            name: groupNameToUse,
            description: 'Criado via fluxo inteligente de upload'
          }]).select().single();

          if (!groupErr && newGroup) {
            finalGroupId = (newGroup as SafeAny).id;
          }
        } else {
          finalGroupId = (existingGroup as SafeAny).id;
        }
      }

      // 2. Upload para o Storage Blindado
      // O path *deve* começar com tenantId para satisfazer as políticas RLS do Storage criadas na migration
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${tenantId}/${groupNameToUse || 'Geral'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('secure_documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Registrar metadata na tabela documents
      const { error: dbError } = await (supabase.from('documents').insert as SafeAny)([{
        tenant_id: tenantId,
        title: documentTitle,
        file_path: filePath,
        file_type: fileExt,
        document_group_id: finalGroupId,
        status: 'under_review'
      }]);

      if (dbError) {
         // Tentativa de rollback no storage em caso de falha no DB
         await supabase.storage.from('secure_documents').remove([filePath]);
         throw dbError;
      }

      setUploadStatus({
        success: true,
        message: 'Documento encriptado, armazenado e classificado com sucesso no cofre digital.'
      });

    } catch (err: any) {
      console.error(err);
      setUploadStatus({
        success: false,
        message: 'Falha ao fazer upload',
        error: err.message || 'Falha no armazenamento seguro.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            Upload Blindado e Gestão Contextual
            <ShieldCheck className="w-6 h-6 ml-2 text-emerald-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Módulo de envio restrito. O sistema agrupa e analisa automaticamente os arquivos para tomada de decisão no Kanban.
          </p>
        </div>
      </div>

      {uploadStatus && uploadStatus.success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-start border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Sucesso</h3>
            <p className="text-sm mt-1">{uploadStatus.message}</p>
            <button onClick={resetForm} className="mt-3 text-sm font-medium underline">Enviar outro arquivo</button>
          </div>
        </div>
      )}

      {uploadStatus && !uploadStatus.success && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-start border border-red-200">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Erro de Segurança / Upload</h3>
            <p className="text-sm mt-1">{uploadStatus.error}</p>
          </div>
        </div>
      )}

      {!uploadStatus?.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zona de Drag & Drop */}
          <div>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors h-[280px]
                ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 bg-slate-50'}
                ${selectedFile ? 'border-solid border-slate-300 bg-white' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                disabled={isUploading}
              />

              {!selectedFile ? (
                <>
                  <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">Arraste um documento ou clique aqui</p>
                  <p className="text-slate-400 text-sm mt-2">Suporte para PDF, DOCX, Imagens (Matrículas, CAR, CCIR)</p>
                  <div className="mt-6 flex items-center justify-center px-4 py-1.5 bg-slate-200 text-slate-600 rounded text-xs font-semibold uppercase tracking-wider">
                    Criptografado em Repouso
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center relative w-full h-full justify-center">
                  <File className="w-16 h-16 text-emerald-500 mb-4" />
                  <p className="font-semibold text-slate-700 truncate max-w-full px-4">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>

                  {!isUploading && (
                    <button
                      onClick={(e) => { e.preventDefault(); resetForm(); }}
                      className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-500 transition z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Formulário e Inteligência Contextual */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título do Documento</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                disabled={!selectedFile || isUploading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Agrupamento / Categoria</label>
              <select
                value={documentGroup}
                onChange={(e) => setDocumentGroup(e.target.value)}
                disabled={!selectedFile || isUploading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">Selecione um Agrupamento</option>
                <option value="Ambiental">Ambiental (CAR, Licenças)</option>
                <option value="Cartorio">Cartório (Matrículas, Transcrições)</option>
                <option value="Laudos">Laudos (Técnicos, Agronômicos)</option>
                <option value="Impostos/INCRA">Fiscal / INCRA (CCIR, ITR)</option>
                <option value="Outros">Outro (Especificar)</option>
              </select>
            </div>

            {documentGroup === 'Outros' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especifique o Grupo</label>
                <input
                  type="text"
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  disabled={!selectedFile || isUploading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            )}

            {/* Parecer Consultivo */}
            {consultativeAdvice && (
              <div className="mt-6 bg-slate-900 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-24 h-24" />
                </div>
                <h4 className="text-emerald-400 font-semibold flex items-center text-sm mb-2 relative z-10">
                  Parecer Consultivo Sistêmico
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                  {consultativeAdvice}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={onUpload}
                disabled={!selectedFile || isUploading || (!documentGroup)}
                className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando Upload Seguro...
                  </>
                ) : (
                  'Confirmar e Enviar para o Cofre'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}