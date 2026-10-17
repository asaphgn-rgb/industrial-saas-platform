import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  ShieldCheck,
  PlusCircle,
  FileSignature,
  FileCheck,
  Building,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { ContratoDigital, StatusContratoDigital } from '@/types/habitacional';

export default function GestaoContratosDigitais() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [contratoVisualizado, setContratoVisualizado] = useState<ContratoDigital | null>(null);

  const [contratos, setContratos] = useState<ContratoDigital[]>([
    {
      id: 'ctr-5001',
      titulo: 'Termo de Adesão e Subscrição de Cota-Parte Habitacional',
      tipo_contrato: 'ADESAO_ASSOCIATIVA',
      associado_nome: 'Marcos Vinicius Almeida',
      associado_cpf_mascarado: '***.482.918-**',
      unidade_identificacao: 'Residencial Diamante Sul · Apto 102 (Bloco A)',
      valor_contrato: 215000.00,
      status: 'ASSINADO',
      hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      assinado_associado_em: '15/10/2026 14:22',
      ip_assinatura: '189.120.45.10 (Brasília-DF)',
      assinado_diretoria_em: '15/10/2026 16:05',
      criado_em: '14/10/2026'
    },
    {
      id: 'ctr-5002',
      titulo: 'Instrumento Particular de Promessa de Compra e Venda',
      tipo_contrato: 'PROMESSA_COMPRA_VENDA',
      associado_nome: 'Ana Cláudia Fontes',
      associado_cpf_mascarado: '***.723.101-**',
      unidade_identificacao: 'Residencial Diamante Sul · Apto 103 (Bloco A)',
      valor_contrato: 185000.00,
      status: 'AGUARDANDO_ASSINATURAS',
      criado_em: '16/10/2026'
    },
    {
      id: 'ctr-5003',
      titulo: 'Termo de Entrega de Chaves e Posse Provisória',
      tipo_contrato: 'TERMO_HABITACIONAL',
      associado_nome: 'Patrícia Mendes Castro',
      associado_cpf_mascarado: '***.889.332-**',
      unidade_identificacao: 'Residencial Diamante Sul · Apto 202 (Bloco A)',
      valor_contrato: 218000.00,
      status: 'REGISTRADO_CARTORIO',
      hash_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      assinado_associado_em: '10/09/2026 09:15',
      ip_assinatura: '201.88.192.4 (Goiânia-GO)',
      assinado_diretoria_em: '10/09/2026 11:30',
      criado_em: '08/09/2026'
    },
    {
      id: 'ctr-5004',
      titulo: 'Termo de Adesão ao Programa Morar Bem',
      tipo_contrato: 'COTA_PARTE',
      associado_nome: 'Roberto Carlos Silveira',
      associado_cpf_mascarado: '***.195.448-**',
      unidade_identificacao: 'Residencial Diamante Sul · Apto 104 (Bloco A)',
      valor_contrato: 185000.00,
      status: 'RASCUNHO',
      criado_em: '16/10/2026'
    }
  ]);

  const statusBadges: Record<StatusContratoDigital, { label: string; classe: string }> = {
    RASCUNHO: { label: 'Minuta / Rascunho', classe: 'bg-slate-100 text-slate-700' },
    AGUARDANDO_ASSINATURAS: { label: 'Aguardando Assinatura', classe: 'bg-amber-100 text-amber-800' },
    ASSINADO: { label: 'Assinado Eletronicamente', classe: 'bg-emerald-100 text-emerald-800' },
    REGISTRADO_CARTORIO: { label: 'Averbado em Cartório', classe: 'bg-purple-100 text-purple-800' },
    CANCELADO: { label: 'Distratado / Cancelado', classe: 'bg-red-100 text-red-800' }
  };

  const contratosFiltrados = contratos.filter(c => {
    const matchBusca =
      c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      c.associado_nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.associado_cpf_mascarado.includes(busca) ||
      (c.unidade_identificacao && c.unidade_identificacao.toLowerCase().includes(busca.toLowerCase()));
    const matchTipo = filtroTipo === 'TODOS' || c.tipo_contrato === filtroTipo;
    const matchStatus = filtroStatus === 'TODOS' || c.status === filtroStatus;
    return matchBusca && matchTipo && matchStatus;
  });

  const assinarComoDiretoria = (id: string) => {
    setContratos(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'ASSINADO',
            assinado_diretoria_em: new Date().toLocaleString('pt-BR'),
            hash_sha256: '7d793037a0760186574b0282f2f435e7b1e50774690571313171809058b8552b'
          };
        }
        return c;
      })
    );
    alert('Contrato homologado e assinado digitalmente com certificado ICP-Brasil / Trilha MP 2.200-2/2001!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Contratos Digitais & Formalização Habitacional
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Validade Jurídica MP 2.200-2
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Geração de termos de adesão, promessas de compra e venda, carimbo de tempo, IP e assinatura criptográfica SHA-256.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Exportar Livro Razão
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <PlusCircle className="h-4 w-4" /> Gerar Novo Contrato
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total de Contratos</span>
          <p className="text-3xl font-black text-slate-900 mt-2">312</p>
          <p className="text-xs text-slate-400 mt-1">Acervo digitalizado</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assinados Eletronicamente</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">284</p>
          <p className="text-xs text-emerald-600 mt-1">91.0% de conversão</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Aguardando Signatários</span>
          <p className="text-3xl font-black text-amber-600 mt-2">24</p>
          <p className="text-xs text-slate-400 mt-1">Lembrete via WhatsApp ativo</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">VGV Formalizado</span>
          <p className="text-3xl font-black text-blue-600 mt-2">R$ 58.4 M</p>
          <p className="text-xs text-slate-400 mt-1">Garantias registradas</p>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, associado, CPF ou unidade habitacional..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Instrumentos</option>
            <option value="ADESAO_ASSOCIATIVA">Adesão Associativa</option>
            <option value="PROMESSA_COMPRA_VENDA">Compra e Venda</option>
            <option value="TERMO_HABITACIONAL">Entrega de Chaves</option>
            <option value="COTA_PARTE">Cota-Parte</option>
          </select>

          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ASSINADO">Assinados</option>
            <option value="AGUARDANDO_ASSINATURAS">Aguardando Assinatura</option>
            <option value="REGISTRADO_CARTORIO">Registrados em Cartório</option>
            <option value="RASCUNHO">Minuta</option>
          </select>
        </div>
      </div>

      {/* Tabela de Contratos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Identificação do Instrumento</th>
                <th className="py-4 px-6">Associado Signatário</th>
                <th className="py-4 px-6">Unidade Vinculada</th>
                <th className="py-4 px-6">Valor Declarado</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contratosFiltrados.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                        <FileSignature className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-snug">{c.titulo}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {c.id} · Criado em {c.criado_em}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{c.associado_nome}</p>
                    <p className="text-xs text-slate-400 font-mono">CPF {c.associado_cpf_mascarado}</p>
                  </td>

                  <td className="py-4 px-6">
                    {c.unidade_identificacao ? (
                      <p className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                        {c.unidade_identificacao}
                      </p>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Não alocado</span>
                    )}
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900">
                    R$ {c.valor_contrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadges[c.status].classe}`}>
                      {c.status === 'ASSINADO' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {c.status === 'AGUARDANDO_ASSINATURAS' && <Clock className="h-3.5 w-3.5" />}
                      {statusBadges[c.status].label}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setContratoVisualizado(c)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver Trilha de Auditoria"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {c.status === 'AGUARDANDO_ASSINATURAS' && (
                        <button
                          onClick={() => assinarComoDiretoria(c.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <FileCheck className="h-3.5 w-3.5" /> Assinar
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Baixando PDF assinado com carimbo criptográfico do contrato ${c.id}`)}
                        className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Trilha de Integridade Criptográfica do Contrato */}
      {contratoVisualizado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Certidão de Assinatura & Trilha de Auditoria
              </h3>
              <button
                onClick={() => setContratoVisualizado(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold">Documento</span>
                <p className="font-bold text-slate-800 text-sm">{contratoVisualizado.titulo}</p>
                <p className="text-slate-500">Valor: R$ {contratoVisualizado.valor_contrato.toLocaleString('pt-BR')}</p>
              </div>

              {contratoVisualizado.hash_sha256 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <span className="text-purple-900 font-bold block flex items-center gap-1">
                    <KeyRound className="h-3.5 w-3.5 text-purple-600" />
                    Hash Criptográfico de Integridade (SHA-256)
                  </span>
                  <p className="font-mono text-purple-700 break-all select-all text-[11px]">
                    {contratoVisualizado.hash_sha256}
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <span className="text-slate-600 font-bold block">Signatários & Carimbos de Tempo</span>
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div>
                    <p className="font-semibold text-slate-800">1. Associado: {contratoVisualizado.associado_nome}</p>
                    <p className="text-slate-400">IP: {contratoVisualizado.ip_assinatura || 'Aguardando'}</p>
                  </div>
                  <span className="font-mono text-slate-600">{contratoVisualizado.assinado_associado_em || 'Pendente'}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="font-semibold text-slate-800">2. Representante: Diretoria Executiva</p>
                    <p className="text-slate-400">Assinatura Institucional Autenticada</p>
                  </div>
                  <span className="font-mono text-slate-600">{contratoVisualizado.assinado_diretoria_em || 'Pendente'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setContratoVisualizado(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              >
                Concluir Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
