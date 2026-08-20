import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, FolderLock, ToggleRight, ToggleLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CeoAccessControlProps {
  currentTenantId: string;
}

export function CeoAccessControl({ currentTenantId }: CeoAccessControlProps) {
  // Lista central de pastas
  const dataRooms = ['REGULARIZAÇÃO'];

  // Lista base de usuários (A mesma do Login)
  const baseUsers = [
    { email: 'ceo@flechabsb.com', name: 'Direção Executiva', role: 'Diretor (CEO)', canBeBlocked: false },
    { email: 'socio@flechabsb.com', name: 'Sócio', role: 'Auditoria & Investimentos', canBeBlocked: true },
    { email: 'juridico@flechabsb.com', name: 'Jurídico', role: 'Compliance & Contratos', canBeBlocked: true },
    { email: 'adm@flechabsb.com', name: 'Administrativo', role: 'Gestão & Backoffice', canBeBlocked: true },
    { email: 'operacional@flechabsb.com', name: 'Operações', role: 'Campo & Técnico', canBeBlocked: true }
  ];

  // Estado que gerencia quem tem acesso a qual pasta (Banco DB Real RBAC)
  const [accessMatrix, setAccessMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessControl = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('tenants')
          .select('settings')
          .eq('id', currentTenantId)
          .single();

        const newMatrix: Record<string, Record<string, boolean>> = {};

        // Inicializa com todos liberados como fallback seguro
        dataRooms.forEach(room => {
          newMatrix[room] = {};
          baseUsers.forEach(u => {
            newMatrix[room][u.email] = true;
          });
        });

        // Aplica revogações encontradas no banco de dados real
        if (data && !error && (data as any).settings) {
          const settings = (data as any).settings;
          const rbac = settings.vdr_access_control || [];

          rbac.forEach((row: any) => {
            if (newMatrix[row.data_room_name] && newMatrix[row.data_room_name][row.user_email] !== undefined) {
               newMatrix[row.data_room_name][row.user_email] = !row.is_revoked;
            }
          });
        }
        setAccessMatrix(newMatrix);
      } catch (err) {
        console.error("Falha ao buscar matriz RBAC no DB:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccessControl();
  }, [currentTenantId]);

  const toggleAccess = async (room: string, email: string) => {
    // Evita o CEO de bloquear a si mesmo
    if (email === 'ceo@flechabsb.com') {
      alert("Aviso: A credencial primária do CEO é inalienável e não pode ser revogada.");
      return;
    }

    const currentAccess = accessMatrix[room][email];
    const newRevokedState = currentAccess; // Se tinha acesso, vamos revogar (true). Se não tinha, vamos revogar=false.

    // Otimista Update UI
    setAccessMatrix(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [email]: !currentAccess
      }
    }));

    // Persiste no banco Supabase
    try {
      const { data: tenantData } = await (supabase as any).from('tenants').select('settings').eq('id', currentTenantId).single();
      const existingSettings = (tenantData as any)?.settings || {};
      const rbac = existingSettings.vdr_access_control || [];

      const existingIndex = rbac.findIndex((r: any) => r.data_room_name === room && r.user_email === email);
      if (existingIndex >= 0) {
          rbac[existingIndex].is_revoked = newRevokedState;
      } else {
          rbac.push({ tenant_id: currentTenantId, data_room_name: room, user_email: email, is_revoked: newRevokedState });
      }

      const { error } = await (supabase as any).from('tenants').update({ settings: { ...existingSettings, vdr_access_control: rbac } }).eq('id', currentTenantId);

      if (error) throw error;
    } catch (err) {
      console.error("Falha ao salvar restrição no BD", err);
      alert("Erro ao aplicar bloqueio persistente de RBAC na nuvem.");
      // Reverte o optimistic update em caso de falha do DB
      setAccessMatrix(prev => ({ ...prev, [room]: { ...prev[room], [email]: currentAccess } }));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-fbsb-text-primary">
      <div className="bg-gradient-to-r from-fbsb-surface-100 to-fbsb-bg-deep border border-fbsb-border rounded-2xl p-8 shadow-premium">
        <div className="flex items-center space-x-4 mb-6">
           <div className="p-3 bg-fbsb-primary rounded-xl shadow-inner-gold">
             <ShieldAlert className="w-8 h-8 text-fbsb-cyan" />
           </div>
           <div>
             <h2 className="text-2xl font-bold font-serif">Governança & Controle de Acesso Global (RBAC)</h2>
             <p className="text-sm text-fbsb-text-secondary mt-1">Gerencie a liberação de usuários em cada Data Room / Pasta.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

          {/* Matriz de Perfis (O que cada um faz) */}
          <div className="bg-fbsb-bg-main border border-white/5 rounded-xl p-6 shadow-inner">
             <h3 className="text-sm font-bold uppercase tracking-widest text-fbsb-text-secondary mb-6 flex items-center">
               <Users className="w-4 h-4 mr-2" /> Matriz de Permissões
             </h3>

             <div className="space-y-4">
                <div className="p-4 bg-fbsb-surface-200/50 rounded-lg border-l-4 border-fbsb-cyan">
                  <h4 className="text-xs font-bold text-white uppercase mb-1">Direção Executiva (CEO)</h4>
                  <ul className="text-[11px] text-fbsb-text-secondary space-y-1 list-disc pl-4">
                     <li>Visualiza dashboards e indicadores globais fabris.</li>
                     <li>Detém poder exclusivo de <strong>EXCLUSÃO DIRETA</strong> de documentos e evidências.</li>
                     <li>Aprova/rejeita solicitações de exclusão enviadas por terceiros.</li>
                     <li>Gerencia a liberação de acessos (Esta página).</li>
                  </ul>
                </div>

                <div className="p-4 bg-fbsb-surface-200/50 rounded-lg border-l-4 border-fbsb-primary-light">
                  <h4 className="text-xs font-bold text-white uppercase mb-1">Jurídico / Sócio / Administrativo / Operacional</h4>
                  <ul className="text-[11px] text-fbsb-text-secondary space-y-1 list-disc pl-4">
                     <li>Não visualizam painéis táticos de OEE ou Gestão.</li>
                     <li>Bloqueados de deletar documentos. O botão vira "Solicitar Exclusão".</li>
                     <li>Podem fazer <strong>Uploads</strong> que ficam rastreados em seus nomes.</li>
                     <li>Podem participar de reuniões no Chat E2E.</li>
                  </ul>
                </div>
             </div>
          </div>

          {/* Matriz de Liberação de Acesso por Pasta */}
          <div className="bg-fbsb-bg-main border border-white/5 rounded-xl p-6 shadow-inner">
             <h3 className="text-sm font-bold uppercase tracking-widest text-fbsb-text-secondary mb-6 flex items-center">
               <FolderLock className="w-4 h-4 mr-2" /> Liberação por Data Room (Pasta)
             </h3>

             {dataRooms.map(room => (
               <div key={room} className="mb-8 last:mb-0">
                  <div className="flex items-center space-x-2 bg-fbsb-surface-200 px-4 py-2 rounded-t-lg border border-b-0 border-fbsb-border">
                    <span className="text-xs font-bold text-fbsb-cyan uppercase tracking-widest">Pasta:</span>
                    <span className="text-sm font-bold text-white">{room}</span>
                  </div>

                  <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-b-lg divide-y divide-white/5">
                    {baseUsers.map(user => {
                      const hasAccess = accessMatrix[room]?.[user.email];
                      const canBlock = user.canBeBlocked;

                      return (
                        <div key={user.email} className="flex items-center justify-between p-4 hover:bg-fbsb-surface-200 transition-colors">
                           <div className="flex flex-col">
                             <span className="text-xs font-bold text-white">{user.name} <span className="text-[10px] text-fbsb-text-secondary font-normal uppercase tracking-wider ml-2">({user.role})</span></span>
                             <span className={`text-[11px] font-medium mt-0.5 ${hasAccess ? 'text-fbsb-cyan' : 'text-red-400'}`}>{user.email}</span>
                           </div>

                           <div className="flex items-center space-x-4">
                             {hasAccess ? (
                               <span className="hidden md:flex items-center text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                 <CheckCircle2 className="w-3 h-3 mr-1" /> Autorizado
                               </span>
                             ) : (
                               <span className="hidden md:flex items-center text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">
                                 <AlertTriangle className="w-3 h-3 mr-1" /> Bloqueado
                               </span>
                             )}

                             <button
                               onClick={() => toggleAccess(room, user.email)}
                               className={`transition-colors p-1 ${!canBlock ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
                               disabled={!canBlock}
                               title={!canBlock ? 'O acesso do CEO não pode ser revogado' : 'Mudar status de acesso'}
                             >
                                {hasAccess ? (
                                   <ToggleRight className="w-8 h-8 text-fbsb-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                                ) : (
                                   <ToggleLeft className="w-8 h-8 text-fbsb-text-secondary" />
                                )}
                             </button>
                           </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
             ))}

          </div>

        </div>
      </div>
    </div>
  );
}