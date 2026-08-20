import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertTriangle, Search, Activity, Layers, UploadCloud } from 'lucide-react';

export function SecureAboutPage() {
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto h-full font-sans text-fbsb-text-secondary pb-32 overflow-y-auto">
      <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-fbsb-border">
         <div className="w-16 h-16 flex items-center justify-center">
            
<svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
  <g transform="translate(10, 10) scale(0.9)">
    <path d="M50 10 L85 25 V60 C85 85 65 105 50 115 C35 105 15 85 15 60 V25 L50 10 Z" fill="#0c2c5c" stroke="#061c40" strokeWidth="2"/>
    <path d="M35 25 H65 V85 H35 V25 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
    <path d="M40 35 H60 M40 45 H60 M40 55 H50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
    <rect x="45" y="70" width="10" height="10" rx="2" fill="#0c2c5c"/>
    <path d="M47 70 V67 C47 65 53 65 53 67 V70" stroke="#0c2c5c" strokeWidth="2" fill="none"/>
    <path d="M0 60 H10 M-5 70 H15 M5 80 H10" stroke="#00b4b4" strokeWidth="4" strokeLinecap="round"/>
    <path d="M5 65 Q 45 45 80 50 L 70 40 L 95 55 L 75 75 L 80 60 Q 45 65 5 65 Z" fill="#00b4b4" />
  </g>
  <text x="110" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#0c2c5c" letterSpacing="-1">FLECHA</text>
  <text x="295" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#00b4b4" letterSpacing="-1">BSB</text>
  <text x="110" y="100" fontFamily="sans-serif" fontWeight="500" fontSize="14" fill="#475569">Compartilhamento Seguro de Documentos</text>
</svg>

         </div>
         <div>
           <h1 className="text-3xl font-bold text-fbsb-text-primary tracking-tight">FLECHA <span className="text-fbsb-cyan">BSB</span></h1>
           <p className="text-sm font-medium text-fbsb-cyan tracking-widest uppercase mt-1">Compartilhamento Privado e Inteligente de Documentos B2B</p>
         </div>
      </div>

      <div className="space-y-12">
        <section className="bg-fbsb-surface-100 p-8 rounded-2xl border border-fbsb-border shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fbsb-primary opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
          <p className="text-base leading-relaxed text-fbsb-text-secondary">
            A <strong className="text-fbsb-text-primary">FLECHA BSB</strong> é uma plataforma empresarial desenvolvida para o compartilhamento privado de documentos entre usuários autorizados, com foco em confidencialidade, segurança da informação, análise documental e apoio às negociações de compra e venda.
          </p>
          <p className="text-base leading-relaxed text-fbsb-text-secondary mt-4">
            O sistema permite que usuários autorizados realizem upload e compartilhem documentos dentro de ambientes restritos. Cada arquivo enviado pode passar por uma análise inteligente automática, que identifica possíveis erros, inconsistências, informações ausentes e não conformidades.
          </p>
          <p className="text-base leading-relaxed text-fbsb-text-secondary mt-4">
            Sempre que aplicável, a análise deverá confrontar o documento com legislação, normas, requisitos técnicos e fontes oficiais dos órgãos reguladores correspondentes, gerando imediatamente um Parecer Consultivo FLECHA com os pontos encontrados e orientações para correção.
          </p>
          <p className="text-base leading-relaxed text-fbsb-text-secondary mt-4">
            O objetivo é permitir que o usuário ajuste o documento antes de encaminhá-lo formalmente, reduzindo retrabalho, devoluções e riscos que possam impedir o avanço de uma negociação.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-fbsb-surface-100 p-8 rounded-2xl border border-fbsb-border shadow-premium relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-fbsb-cyan opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-fbsb-cyan" />
              <h2 className="text-xl font-bold text-fbsb-text-primary">Privacidade das Conversas</h2>
            </div>
            <p className="text-sm mb-6">As mensagens trocadas dentro da FLECHA BSB são exclusivamente temporárias e vinculadas à sessão ativa. Ao sair, encerrar a sessão ou realizar logout do aplicativo:</p>
            <ul className="space-y-3">
              {[
                "As mensagens desaparecem automaticamente;",
                "Não permanecem armazenadas no aplicativo;",
                "Não ficam retidas no banco de dados;",
                "Não são preservadas em histórico de conversas;",
                "Não são mantidas em logs de conteúdo;",
                "Não poderão ser consultadas ou recuperadas posteriormente."
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-fbsb-cyan mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-fbsb-surface-200 border border-fbsb-border rounded-xl">
              <p className="text-xs font-bold text-fbsb-text-primary uppercase tracking-wider mb-1 flex items-center">
                 <ShieldCheck className="w-4 h-4 mr-2 text-fbsb-primary-light" /> Arquitetura Zero-Trace
              </p>
              <p className="text-xs">A arquitetura deverá ser desenvolvida para que o conteúdo das conversas seja efêmero por padrão, sem retenção após o encerramento da sessão.</p>
            </div>
          </section>

          <section className="bg-fbsb-surface-100 p-8 rounded-2xl border border-fbsb-border shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fbsb-primary opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-fbsb-primary-light" />
              <h2 className="text-xl font-bold text-fbsb-text-primary">Gestão de Documentos</h2>
            </div>
            <p className="text-sm mb-4">Somente o Administrador poderá excluir definitivamente documentos da plataforma.</p>
            <p className="text-sm mb-4">Os demais usuários poderão:</p>
            <ul className="space-y-3">
              {[
                "Realizar upload;",
                "Receber documentos;",
                "Visualizar documentos autorizados;",
                "Receber análises;",
                "Consultar o parecer consultivo;",
                "Corrigir e reenviar novas versões."
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-fbsb-primary-light mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 border-l-2 border-fbsb-danger bg-fbsb-surface-200 rounded-r-xl">
              <p className="text-xs">Quando o Administrador determinar a exclusão de um documento, o sistema deverá executar sua remoção conforme a política técnica de exclusão segura da plataforma.</p>
            </div>
          </section>
        </div>

        <section className="bg-fbsb-surface-100 p-8 rounded-2xl border border-fbsb-border shadow-premium">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-6 h-6 text-fbsb-ai" />
            <h2 className="text-xl font-bold text-fbsb-text-primary">Inteligência Documental</h2>
          </div>
          <p className="text-sm mb-8">Cada documento poderá passar pelo <strong className="text-fbsb-text-primary">FLECHA CHECK</strong>, verificando, entre outros pontos:</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
             {[
               "Ausência de informações", "Inconsistências", "Validade",
               "Documentação incompleta", "Divergências", "Possíveis não conformidades",
               "Requisitos técnicos", "Requisitos regulatórios", "Adequação para prosseguimento"
             ].map((req, i) => (
               <div key={i} className="bg-fbsb-surface-200 border border-fbsb-border p-3 rounded-xl flex items-center space-x-3 hover:border-fbsb-ai/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-fbsb-ai"></div>
                  <span className="text-xs font-medium text-fbsb-text-primary">{req}</span>
               </div>
             ))}
          </div>

          <p className="text-sm mb-4">O resultado será apresentado em forma de parecer, indicando:</p>
          <div className="flex flex-wrap gap-3">
             <span className="px-3 py-1.5 bg-fbsb-success/10 text-fbsb-success border border-fbsb-success/20 rounded-full text-xs font-bold uppercase tracking-wider">Adequado</span>
             <span className="px-3 py-1.5 bg-fbsb-warning/10 text-fbsb-warning border border-fbsb-warning/20 rounded-full text-xs font-bold uppercase tracking-wider">Requer Correção</span>
             <span className="px-3 py-1.5 bg-fbsb-danger/10 text-fbsb-danger border border-fbsb-danger/20 rounded-full text-xs font-bold uppercase tracking-wider">Não Conforme</span>
             <span className="px-3 py-1.5 bg-fbsb-text-muted/10 text-fbsb-text-muted border border-fbsb-border rounded-full text-xs font-bold uppercase tracking-wider">Documentação Incompleta</span>
             <span className="px-3 py-1.5 bg-fbsb-primary/10 text-fbsb-primary border border-fbsb-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">Validação Externa Necessária</span>
          </div>
        </section>

        <section className="bg-gradient-to-br from-fbsb-surface-200 to-fbsb-surface-100 p-10 rounded-2xl border border-fbsb-cyan/30 shadow-glow-cyan text-center relative overflow-hidden">
          
<svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 mx-auto mb-4 relative z-10 object-contain">
  <g transform="translate(10, 10) scale(0.9)">
    <path d="M50 10 L85 25 V60 C85 85 65 105 50 115 C35 105 15 85 15 60 V25 L50 10 Z" fill="#0c2c5c" stroke="#061c40" strokeWidth="2"/>
    <path d="M35 25 H65 V85 H35 V25 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
    <path d="M40 35 H60 M40 45 H60 M40 55 H50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
    <rect x="45" y="70" width="10" height="10" rx="2" fill="#0c2c5c"/>
    <path d="M47 70 V67 C47 65 53 65 53 67 V70" stroke="#0c2c5c" strokeWidth="2" fill="none"/>
    <path d="M0 60 H10 M-5 70 H15 M5 80 H10" stroke="#00b4b4" strokeWidth="4" strokeLinecap="round"/>
    <path d="M5 65 Q 45 45 80 50 L 70 40 L 95 55 L 75 75 L 80 60 Q 45 65 5 65 Z" fill="#00b4b4" />
  </g>
  <text x="110" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#0c2c5c" letterSpacing="-1">FLECHA</text>
  <text x="295" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#00b4b4" letterSpacing="-1">BSB</text>
  <text x="110" y="100" fontFamily="sans-serif" fontWeight="500" fontSize="14" fill="#475569">Compartilhamento Seguro de Documentos</text>
</svg>

          <p className="text-sm text-fbsb-cyan font-bold tracking-[0.2em] uppercase mb-8 relative z-10">
            Privacidade para compartilhar. Inteligência para validar. Segurança para negociar.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-4xl mx-auto relative z-10">
             <div className="bg-fbsb-surface-300/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-fbsb-border flex-1 w-full flex flex-col items-center justify-center">
                <Lock className="w-5 h-5 text-fbsb-cyan mb-2" />
                <p className="text-xs font-medium text-fbsb-text-primary text-center">A informação é compartilhada<br/>somente entre usuários autorizados.</p>
             </div>
             <div className="bg-fbsb-surface-300/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-fbsb-border flex-1 w-full flex flex-col items-center justify-center">
                <Activity className="w-5 h-5 text-fbsb-primary-light mb-2" />
                <p className="text-xs font-medium text-fbsb-text-primary text-center">A conversa existe somente<br/>durante a sessão.</p>
             </div>
             <div className="bg-fbsb-surface-300/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-fbsb-border flex-1 w-full flex flex-col items-center justify-center">
                <Layers className="w-5 h-5 text-fbsb-success mb-2" />
                <p className="text-xs font-medium text-fbsb-text-primary text-center">O documento é analisado<br/>antes do envio definitivo.</p>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-fbsb-border flex flex-wrap items-center justify-center gap-4 relative z-10">
             <span className="text-xs font-bold text-fbsb-text-muted flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> As irregularidades são identificadas.</span>
             <span className="text-fbsb-border hidden md:block">|</span>
             <span className="text-xs font-bold text-fbsb-text-muted flex items-center"><UploadCloud className="w-3 h-3 mr-1" /> O usuário corrige.</span>
             <span className="text-fbsb-border hidden md:block">|</span>
             <span className="text-xs font-bold text-fbsb-cyan flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> A negociação avança.</span>
          </div>
        </section>
      </div>
    </div>
  );
}