import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert, Users, FolderLock, ToggleRight, ToggleLeft,
  AlertTriangle, CheckCircle2, PlusCircle, Trash2, Eye, EyeOff,
  RefreshCw, Search, Filter, Download, TrendingUp, BarChart2,
  Lock, Unlock, UserPlus, Activity, Clock, FileText, Upload,
  ChevronDown, ChevronUp, X, Save, Key, Shield
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

interface CeoAccessControlProps {
  currentTenantId: string;
}

interface VdrUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  last_login_at: string | null;
  login_count: number;
}

interface AuditEntry {
  id: string;
  user_email: string;
  user_name: string;
  user_role: string;
  action: string;
  target_type: string;
  target_id: string;
  target_name: string;
  details: Record<string, unknown>;
  created_at: string;
}

interface PermissionSet {
  canView: boolean;
  canUpload: boolean;
  canRequestDelete: boolean;
  canDirectDelete: boolean;
}

const TENANT_ID = 'tenant-industrial-demo-uuid';
const DATA_ROOMS = ['REGULARIZAÇÃO', 'CONTRATOS', 'FINANCEIRO', 'JURÍDICO'];

const CHART_COLORS = ['#00d4ff', '#a78bfa', '#34d399', '#fb923c', '#f87171'];

const ACTION_LABELS: Record<string, string> = {
  LOGIN: '🔑 Login',
  LOGOUT: '🚪 Logout',
  UPLOAD: '📤 Upload',
  VIEW: '👁 Visualização',
  DELETE_REQUEST: '🗑 Solicitação de Exclusão',
  DELETE: '❌ Exclusão',
  PERMISSION_CHANGE: '🔒 Alteração de Permissão',
  USER_CREATE: '👤 Criação de Usuário',
  USER_TOGGLE: '🔄 Status de Usuário',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function generatePassword(): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function logAudit(payload: Partial<AuditEntry>) {
  try {
    await (supabase as any).from('audit_trail').insert({
      tenant_id: TENANT_ID,
      created_at: new Date().toISOString(),
      ...payload,
    });
  } catch { /* silently ignore audit write errors */ }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="p-3 bg-fbsb-primary rounded-xl shadow-inner-gold">{icon}</div>
      <div>
        <h2 className="text-xl font-bold font-serif">{title}</h2>
        <p className="text-xs text-fbsb-text-secondary mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = 'cyan' }: { label: string; value: string | number; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'text-fbsb-cyan border-fbsb-cyan/30',
    purple: 'text-purple-400 border-purple-400/30',
    green: 'text-emerald-400 border-emerald-400/30',
    orange: 'text-orange-400 border-orange-400/30',
    red: 'text-red-400 border-red-400/30',
  };
  return (
    <div className={`bg-fbsb-bg-main border rounded-xl p-4 ${colorMap[color] || colorMap.cyan}`}>
      <p className="text-[10px] uppercase tracking-widest text-fbsb-text-secondary mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color]?.split(' ')[0]}`}>{value}</p>
      {sub && <p className="text-[11px] text-fbsb-text-secondary mt-1">{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function CeoAccessControl({ currentTenantId }: CeoAccessControlProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'permissions' | 'audit'>('overview');

  // ── State: Users ──
  const [users, setUsers] = useState<VdrUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', initials: '' });
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  // ── State: Permissions ──
  const [permMatrix, setPermMatrix] = useState<Record<string, Record<string, PermissionSet>>>({});
  const [permLoading, setPermLoading] = useState(true);
  const [savingPerm, setSavingPerm] = useState<string | null>(null);

  // ── State: Audit Trail ──
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditFilter, setAuditFilter] = useState({ user: '', action: '', search: '' });
  const [auditPage, setAuditPage] = useState(0);
  const AUDIT_PAGE_SIZE = 20;

  // ── State: Analytics ──
  const [analytics, setAnalytics] = useState<{
    totalDocs: number;
    approvedDocs: number;
    pendingDocs: number;
    deletionRequests: number;
    uploadsPerUser: Array<{ name: string; uploads: number }>;
    docsByCategory: Array<{ category: string; count: number }>;
    actionsOverTime: Array<{ date: string; uploads: number; views: number; deletions: number }>;
    compliance: number;
  } | null>(null);

  // ════════════════════════════════════════
  // DATA FETCHERS
  // ════════════════════════════════════════

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const { data } = await (supabase as any)
        .from('vdr_users')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false });
      if (data) setUsers(data);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    setPermLoading(true);
    try {
      const { data } = await (supabase as any)
        .from('vdr_permissions')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      const matrix: Record<string, Record<string, PermissionSet>> = {};
      DATA_ROOMS.forEach(room => {
        matrix[room] = {};
        // default permissions
        const defaultUsers = [
          'ceo@flechabsb.com', 'socio@flechabsb.com',
          'juridico@flechabsb.com', 'adm@flechabsb.com', 'operacional@flechabsb.com'
        ];
        defaultUsers.forEach(email => {
          matrix[room][email] = {
            canView: true,
            canUpload: email !== 'ceo@flechabsb.com',
            canRequestDelete: email !== 'ceo@flechabsb.com',
            canDirectDelete: email === 'ceo@flechabsb.com',
          };
        });
      });

      // overlay DB rows
      if (data) {
        data.forEach((row: any) => {
          if (!matrix[row.data_room]) matrix[row.data_room] = {};
          matrix[row.data_room][row.user_email] = {
            canView: row.can_view,
            canUpload: row.can_upload,
            canRequestDelete: row.can_request_delete,
            canDirectDelete: row.can_direct_delete,
          };
        });
      }
      setPermMatrix(matrix);
    } finally {
      setPermLoading(false);
    }
  }, []);

  const fetchAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const { data } = await (supabase as any)
        .from('audit_trail')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })
        .limit(500);
      if (data) setAuditEntries(data);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [docsRes, auditRes] = await Promise.all([
        (supabase as any).from('b2b_documents').select('id,status,category,uploader_email,uploader_name,deletion_requested,created_at').eq('tenant_id', TENANT_ID),
        (supabase as any).from('audit_trail').select('action,user_email,user_name,created_at').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false }).limit(300),
      ]);

      const docs: any[] = docsRes.data || [];
      const auditRows: any[] = auditRes.data || [];

      const approved = docs.filter(d => d.status === 'Aprovado').length;
      const pending = docs.filter(d => d.status !== 'Aprovado').length;
      const delReq = docs.filter(d => d.deletion_requested).length;
      const compliance = docs.length > 0 ? Math.round((approved / docs.length) * 100) : 0;

      // uploads per user
      const uploadsMap: Record<string, number> = {};
      docs.forEach(d => {
        const key = d.uploader_name || d.uploader_email || 'Desconhecido';
        uploadsMap[key] = (uploadsMap[key] || 0) + 1;
      });
      const uploadsPerUser = Object.entries(uploadsMap)
        .map(([name, uploads]) => ({ name, uploads }))
        .sort((a, b) => b.uploads - a.uploads)
        .slice(0, 6);

      // docs by category
      const catMap: Record<string, number> = {};
      docs.forEach(d => { catMap[d.category] = (catMap[d.category] || 0) + 1; });
      const docsByCategory = Object.entries(catMap).map(([category, count]) => ({ category, count }));

      // actions over time (last 7 days)
      const today = new Date();
      const actionsOverTime = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const dayRows = auditRows.filter(r => r.created_at?.startsWith(dateStr));
        return {
          date: label,
          uploads: dayRows.filter(r => r.action === 'UPLOAD').length,
          views: dayRows.filter(r => r.action === 'VIEW').length,
          deletions: dayRows.filter(r => r.action === 'DELETE' || r.action === 'DELETE_REQUEST').length,
        };
      });

      setAnalytics({ totalDocs: docs.length, approvedDocs: approved, pendingDocs: pending, deletionRequests: delReq, uploadsPerUser, docsByCategory, actionsOverTime, compliance });
    } catch (e) {
      console.error('Analytics error', e);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
    fetchAudit();
    fetchAnalytics();
  }, [fetchUsers, fetchPermissions, fetchAudit, fetchAnalytics]);

  // ════════════════════════════════════════
  // USER MANAGEMENT ACTIONS
  // ════════════════════════════════════════

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.initials || !newUserPassword) {
      alert('Preencha todos os campos obrigatórios.'); return;
    }
    setSavingUser(true);
    try {
      const { error } = await (supabase as any).from('vdr_users').insert({
        tenant_id: TENANT_ID,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        initials: newUser.initials.toUpperCase(),
        password_hash: newUserPassword,
        created_by: 'ceo@flechabsb.com',
        is_active: true,
      });
      if (error) throw error;
      await logAudit({
        user_email: 'ceo@flechabsb.com',
        user_name: 'Direção Executiva',
        user_role: 'Diretor (CEO)',
        action: 'USER_CREATE',
        target_type: 'user',
        target_name: newUser.email,
        details: { name: newUser.name, role: newUser.role },
      });
      setNewUser({ name: '', email: '', role: '', initials: '' });
      setNewUserPassword('');
      setShowNewUserForm(false);
      fetchUsers();
      fetchAudit();
    } catch (e: any) {
      alert('Erro ao criar usuário: ' + (e?.message || e));
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleUser = async (user: VdrUser) => {
    if (user.email === 'ceo@flechabsb.com') { alert('O CEO não pode ser desativado.'); return; }
    try {
      await (supabase as any).from('vdr_users').update({ is_active: !user.is_active }).eq('id', user.id);
      await logAudit({
        user_email: 'ceo@flechabsb.com',
        user_name: 'Direção Executiva',
        user_role: 'Diretor (CEO)',
        action: 'USER_TOGGLE',
        target_type: 'user',
        target_name: user.email,
        details: { new_status: !user.is_active ? 'ativo' : 'bloqueado' },
      });
      fetchUsers();
    } catch (e: any) {
      alert('Erro: ' + e?.message);
    }
  };

  // ════════════════════════════════════════
  // PERMISSION ACTIONS
  // ════════════════════════════════════════

  const handlePermChange = async (room: string, email: string, perm: keyof PermissionSet, value: boolean) => {
    if (email === 'ceo@flechabsb.com' && (perm === 'canDirectDelete' || perm === 'canView')) return;
    const key = `${room}__${email}__${perm}`;
    setSavingPerm(key);

    const updated = { ...permMatrix[room][email], [perm]: value };
    setPermMatrix(prev => ({ ...prev, [room]: { ...prev[room], [email]: updated } }));

    try {
      const { data: existing } = await (supabase as any)
        .from('vdr_permissions')
        .select('id')
        .eq('tenant_id', TENANT_ID)
        .eq('data_room', room)
        .eq('user_email', email)
        .single();

      if (existing) {
        await (supabase as any).from('vdr_permissions').update({
          can_view: updated.canView,
          can_upload: updated.canUpload,
          can_request_delete: updated.canRequestDelete,
          can_direct_delete: updated.canDirectDelete,
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
      } else {
        await (supabase as any).from('vdr_permissions').insert({
          tenant_id: TENANT_ID,
          data_room: room,
          user_email: email,
          can_view: updated.canView,
          can_upload: updated.canUpload,
          can_request_delete: updated.canRequestDelete,
          can_direct_delete: updated.canDirectDelete,
        });
      }

      await logAudit({
        user_email: 'ceo@flechabsb.com',
        user_name: 'Direção Executiva',
        user_role: 'Diretor (CEO)',
        action: 'PERMISSION_CHANGE',
        target_type: 'permission',
        target_name: `${room} / ${email}`,
        details: { permission: perm, new_value: value },
      });
    } catch (e: any) {
      alert('Erro ao salvar permissão: ' + e?.message);
    } finally {
      setSavingPerm(null);
    }
  };

  // ════════════════════════════════════════
  // AUDIT FILTERING
  // ════════════════════════════════════════

  const filteredAudit = auditEntries.filter(e => {
    const matchUser = !auditFilter.user || e.user_email.includes(auditFilter.user);
    const matchAction = !auditFilter.action || e.action === auditFilter.action;
    const matchSearch = !auditFilter.search
      || e.target_name?.toLowerCase().includes(auditFilter.search.toLowerCase())
      || e.user_name?.toLowerCase().includes(auditFilter.search.toLowerCase());
    return matchUser && matchAction && matchSearch;
  });

  const pagedAudit = filteredAudit.slice(auditPage * AUDIT_PAGE_SIZE, (auditPage + 1) * AUDIT_PAGE_SIZE);

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════

  const tabs = [
    { id: 'overview', label: 'Visão Executiva', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'users', label: 'Gestão de Usuários', icon: <Users className="w-4 h-4" /> },
    { id: 'permissions', label: 'Matriz de Permissões', icon: <FolderLock className="w-4 h-4" /> },
    { id: 'audit', label: 'Trilha de Auditoria', icon: <Activity className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-fbsb-text-primary">

      {/* Header */}
      <div className="bg-gradient-to-r from-fbsb-surface-100 to-fbsb-bg-deep border border-fbsb-border rounded-2xl p-6 shadow-premium">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-fbsb-primary rounded-xl shadow-inner-gold">
              <ShieldAlert className="w-8 h-8 text-fbsb-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif">Centro de Governança Executiva</h1>
              <p className="text-xs text-fbsb-text-secondary mt-0.5">
                Controle total de usuários, permissões, auditoria e analytics — exclusivo CEO
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-fbsb-text-secondary bg-fbsb-surface-200/50 px-4 py-2 rounded-lg border border-fbsb-border">
            <Shield className="w-3 h-3 text-fbsb-cyan" />
            <span>Sessão auditada · Todas as ações são registradas</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-fbsb-bg-main rounded-xl p-1 border border-fbsb-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-fbsb-primary text-white shadow'
                  : 'text-fbsb-text-secondary hover:text-white'
              }`}
            >
              {tab.icon}<span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ════ TAB: VISÃO EXECUTIVA ════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {analytics ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total de Documentos" value={analytics.totalDocs} sub="No cofre digital" color="cyan" />
                <StatCard label="Aprovados" value={analytics.approvedDocs} sub={`${analytics.compliance}% de conformidade`} color="green" />
                <StatCard label="Em Análise" value={analytics.pendingDocs} sub="Aguardando revisão" color="orange" />
                <StatCard label="Solicitações de Exclusão" value={analytics.deletionRequests} sub="Aguardam aprovação CEO" color="red" />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Atividade 7 dias */}
                <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">
                    Atividade nos Últimos 7 Dias
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={analytics.actionsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8b9cad' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#8b9cad' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a2535', border: '1px solid #2a3a4a', borderRadius: 8, fontSize: 11 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="uploads" stroke="#00d4ff" strokeWidth={2} dot={false} name="Uploads" />
                      <Line type="monotone" dataKey="views" stroke="#a78bfa" strokeWidth={2} dot={false} name="Visualizações" />
                      <Line type="monotone" dataKey="deletions" stroke="#f87171" strokeWidth={2} dot={false} name="Exclusões" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Uploads por usuário */}
                <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">
                    Uploads por Colaborador
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.uploadsPerUser} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#8b9cad' }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8b9cad' }} width={90} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a2535', border: '1px solid #2a3a4a', borderRadius: 8, fontSize: 11 }}
                      />
                      <Bar dataKey="uploads" fill="#00d4ff" radius={[0, 4, 4, 0]} name="Documentos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribuição por Categoria */}
                <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-5 lg:col-span-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">
                    Distribuição por Categoria
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={analytics.docsByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={70} label={(props: any) => `${props.category} ${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                        {analytics.docsByCategory.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a2535', border: '1px solid #2a3a4a', borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Parecer Consultivo */}
                <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-5 lg:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2 text-fbsb-cyan" />
                    Parecer Consultivo Executivo
                  </h3>
                  <div className="space-y-3 text-[13px] text-fbsb-text-secondary leading-relaxed">
                    <div className={`p-3 rounded-lg border-l-4 ${analytics.compliance >= 80 ? 'border-emerald-500 bg-emerald-500/10' : analytics.compliance >= 50 ? 'border-orange-400 bg-orange-400/10' : 'border-red-500 bg-red-500/10'}`}>
                      <span className="font-bold text-white">Conformidade Documental:</span>{' '}
                      {analytics.compliance >= 80
                        ? `${analytics.compliance}% dos documentos estão aprovados. O cofre encontra-se em estado de conformidade adequado para apresentação a auditores externos.`
                        : analytics.compliance >= 50
                        ? `${analytics.compliance}% de aprovação. Recomenda-se priorizar a análise dos ${analytics.pendingDocs} documentos pendentes antes de qualquer due diligence.`
                        : `Apenas ${analytics.compliance}% aprovados. Ação imediata requerida: revise os documentos pendentes e escale para o jurídico.`}
                    </div>
                    {analytics.deletionRequests > 0 && (
                      <div className="p-3 rounded-lg border-l-4 border-orange-400 bg-orange-400/10">
                        <span className="font-bold text-white">Solicitações Pendentes:</span>{' '}
                        {analytics.deletionRequests} documento(s) aguardam sua aprovação de exclusão. Acesse o módulo de Validação para revisar e autorizar ou rejeitar cada solicitação.
                      </div>
                    )}
                    <div className="p-3 rounded-lg border-l-4 border-fbsb-cyan/50 bg-fbsb-cyan/5">
                      <span className="font-bold text-white">Recomendação de Governança:</span>{' '}
                      Mantenha a trilha de auditoria revisada mensalmente. Todos os acessos, uploads e visualizações estão sendo rastreados em tempo real com identificação completa do colaborador.
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-fbsb-text-secondary">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando analytics...
            </div>
          )}
        </div>
      )}

      {/* ════ TAB: GESTÃO DE USUÁRIOS ════ */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader
                icon={<Users className="w-7 h-7 text-fbsb-cyan" />}
                title="Gestão de Logins & Credenciais"
                subtitle="Crie, bloqueie e gerencie os acessos dos colaboradores ao sistema"
              />
              <button
                onClick={() => setShowNewUserForm(v => !v)}
                className="flex items-center space-x-2 bg-fbsb-primary hover:bg-fbsb-primary/80 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Novo Usuário</span>
              </button>
            </div>

            {/* Form Novo Usuário */}
            {showNewUserForm && (
              <div className="mb-6 bg-fbsb-surface-100 border border-fbsb-border rounded-xl p-5">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-fbsb-cyan" />
                  Cadastrar Novo Acesso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block">Nome Completo *</label>
                    <input
                      className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fbsb-cyan"
                      placeholder="Ex: João Silva"
                      value={newUser.name}
                      onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block">E-mail *</label>
                    <input
                      type="email"
                      className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fbsb-cyan"
                      placeholder="usuario@flechabsb.com"
                      value={newUser.email}
                      onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block">Cargo / Função *</label>
                    <input
                      className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fbsb-cyan"
                      placeholder="Ex: Compliance & Contratos"
                      value={newUser.role}
                      onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block">Iniciais (sigla) *</label>
                    <input
                      className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fbsb-cyan"
                      placeholder="Ex: JUR"
                      maxLength={4}
                      value={newUser.initials}
                      onChange={e => setNewUser(p => ({ ...p, initials: e.target.value.toUpperCase() }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block">Senha de Acesso *</label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fbsb-cyan pr-10"
                          placeholder="Senha segura"
                          value={newUserPassword}
                          onChange={e => setNewUserPassword(e.target.value)}
                        />
                        <button
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-fbsb-text-secondary hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        onClick={() => { const p = generatePassword(); setNewUserPassword(p); setShowPassword(true); }}
                        className="flex items-center space-x-1 bg-fbsb-surface-200 hover:bg-fbsb-surface-100 border border-fbsb-border text-xs text-fbsb-text-secondary px-3 py-2 rounded-lg transition-colors"
                      >
                        <Key className="w-3 h-3" /><span>Gerar</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleCreateUser}
                    disabled={savingUser}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors"
                  >
                    {savingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{savingUser ? 'Salvando...' : 'Criar Acesso'}</span>
                  </button>
                  <button
                    onClick={() => setShowNewUserForm(false)}
                    className="flex items-center space-x-2 bg-fbsb-surface-200 hover:bg-fbsb-surface-100 border border-fbsb-border text-xs text-fbsb-text-secondary px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /><span>Cancelar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Users Table */}
            {usersLoading ? (
              <div className="flex items-center justify-center h-32 text-fbsb-text-secondary">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando usuários...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-fbsb-border text-[10px] uppercase tracking-widest text-fbsb-text-secondary">
                      <th className="text-left pb-3 pr-4">Colaborador</th>
                      <th className="text-left pb-3 pr-4">Cargo</th>
                      <th className="text-left pb-3 pr-4">Último Login</th>
                      <th className="text-center pb-3 pr-4">Logins</th>
                      <th className="text-center pb-3 pr-4">Status</th>
                      <th className="text-center pb-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-fbsb-surface-200/30 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-fbsb-primary/30 border border-fbsb-primary/50 flex items-center justify-center text-[10px] font-bold text-fbsb-cyan">
                              {user.initials}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-[13px]">{user.name}</p>
                              <p className="text-[11px] text-fbsb-text-secondary">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-[12px] text-fbsb-text-secondary">{user.role}</td>
                        <td className="py-3 pr-4 text-[11px] text-fbsb-text-secondary">{fmtDate(user.last_login_at)}</td>
                        <td className="py-3 pr-4 text-center">
                          <span className="text-fbsb-cyan font-bold text-[13px]">{user.login_count ?? 0}</span>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          {user.is_active ? (
                            <span className="inline-flex items-center text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] uppercase font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Bloqueado
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {user.email !== 'ceo@flechabsb.com' ? (
                            <button
                              onClick={() => handleToggleUser(user)}
                              className={`inline-flex items-center space-x-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                user.is_active
                                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                              }`}
                            >
                              {user.is_active ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              <span>{user.is_active ? 'Bloquear' : 'Ativar'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-fbsb-text-secondary opacity-40">Inalienável</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ TAB: MATRIZ DE PERMISSÕES ════ */}
      {activeTab === 'permissions' && (
        <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-6">
          <SectionHeader
            icon={<FolderLock className="w-7 h-7 text-fbsb-cyan" />}
            title="Matriz Granular de Permissões por Pasta"
            subtitle="Defina quais ações cada colaborador pode realizar em cada Data Room"
          />

          {permLoading ? (
            <div className="flex items-center justify-center h-32 text-fbsb-text-secondary">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando permissões...
            </div>
          ) : (
            <div className="space-y-8">
              {DATA_ROOMS.map(room => (
                <div key={room}>
                  <div className="flex items-center space-x-2 bg-fbsb-surface-200 px-4 py-2 rounded-t-lg border border-b-0 border-fbsb-border">
                    <FolderLock className="w-4 h-4 text-fbsb-cyan" />
                    <span className="text-xs font-bold text-fbsb-cyan uppercase tracking-widest">Pasta:</span>
                    <span className="text-sm font-bold text-white">{room}</span>
                  </div>
                  <div className="bg-fbsb-surface-100 border border-fbsb-border rounded-b-lg overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-white/5 text-fbsb-text-secondary uppercase tracking-widest">
                          <th className="text-left py-2 px-4">Colaborador</th>
                          <th className="text-center py-2 px-3">
                            <div className="flex flex-col items-center">
                              <Eye className="w-3 h-3 mb-0.5" />Visualizar
                            </div>
                          </th>
                          <th className="text-center py-2 px-3">
                            <div className="flex flex-col items-center">
                              <Upload className="w-3 h-3 mb-0.5" />Upload
                            </div>
                          </th>
                          <th className="text-center py-2 px-3">
                            <div className="flex flex-col items-center">
                              <FileText className="w-3 h-3 mb-0.5" />Solicitar Excl.
                            </div>
                          </th>
                          <th className="text-center py-2 px-3">
                            <div className="flex flex-col items-center">
                              <Trash2 className="w-3 h-3 mb-0.5" />Excluir Direta
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {Object.keys(permMatrix[room] || {}).map(email => {
                          const perms = permMatrix[room][email];
                          const isCeo = email === 'ceo@flechabsb.com';
                          const userObj = users.find(u => u.email === email);
                          const displayName = userObj?.name || email;

                          const PermToggle = ({ field, value, locked }: { field: keyof PermissionSet; value: boolean; locked?: boolean }) => {
                            const key = `${room}__${email}__${field}`;
                            const saving = savingPerm === key;
                            return (
                              <button
                                disabled={locked || saving}
                                onClick={() => handlePermChange(room, email, field, !value)}
                                className={`mx-auto flex items-center justify-center transition-opacity ${locked ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
                              >
                                {saving ? (
                                  <RefreshCw className="w-5 h-5 animate-spin text-fbsb-cyan" />
                                ) : value ? (
                                  <ToggleRight className="w-6 h-6 text-fbsb-cyan drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
                                ) : (
                                  <ToggleLeft className="w-6 h-6 text-fbsb-text-secondary" />
                                )}
                              </button>
                            );
                          };

                          return (
                            <tr key={email} className="hover:bg-fbsb-surface-200/30 transition-colors">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-semibold text-white">{displayName}</p>
                                  <p className="text-fbsb-text-secondary">{email}</p>
                                  {isCeo && <span className="text-[9px] text-fbsb-cyan uppercase">Acesso Supremo</span>}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <PermToggle field="canView" value={perms?.canView ?? true} locked={isCeo} />
                              </td>
                              <td className="py-3 px-3 text-center">
                                <PermToggle field="canUpload" value={perms?.canUpload ?? true} locked={isCeo} />
                              </td>
                              <td className="py-3 px-3 text-center">
                                <PermToggle field="canRequestDelete" value={perms?.canRequestDelete ?? true} locked={isCeo} />
                              </td>
                              <td className="py-3 px-3 text-center">
                                <PermToggle field="canDirectDelete" value={perms?.canDirectDelete ?? false} locked={!isCeo && false} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ TAB: TRILHA DE AUDITORIA ════ */}
      {activeTab === 'audit' && (
        <div className="bg-fbsb-bg-main border border-fbsb-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <SectionHeader
              icon={<Activity className="w-7 h-7 text-fbsb-cyan" />}
              title="Trilha de Auditoria Imutável"
              subtitle="Registro completo de todas as ações realizadas no sistema"
            />
            <button
              onClick={fetchAudit}
              className="flex items-center space-x-2 bg-fbsb-surface-200 hover:bg-fbsb-surface-100 border border-fbsb-border text-xs text-fbsb-text-secondary px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" /><span>Atualizar</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 bg-fbsb-surface-100 p-4 rounded-xl border border-fbsb-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fbsb-text-secondary" />
              <input
                className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-fbsb-cyan"
                placeholder="Buscar por nome ou documento..."
                value={auditFilter.search}
                onChange={e => { setAuditFilter(p => ({ ...p, search: e.target.value })); setAuditPage(0); }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fbsb-text-secondary" />
              <input
                className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-fbsb-cyan"
                placeholder="Filtrar por e-mail..."
                value={auditFilter.user}
                onChange={e => { setAuditFilter(p => ({ ...p, user: e.target.value })); setAuditPage(0); }}
              />
            </div>
            <select
              className="w-full bg-fbsb-bg-deep border border-fbsb-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-fbsb-cyan"
              value={auditFilter.action}
              onChange={e => { setAuditFilter(p => ({ ...p, action: e.target.value })); setAuditPage(0); }}
            >
              <option value="">Todas as ações</option>
              {Object.entries(ACTION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between mb-3 text-[11px] text-fbsb-text-secondary">
            <span>{filteredAudit.length} registros encontrados</span>
            <div className="flex items-center space-x-2">
              <button disabled={auditPage === 0} onClick={() => setAuditPage(p => p - 1)} className="px-2 py-1 bg-fbsb-surface-200 rounded disabled:opacity-30 hover:bg-fbsb-surface-100 transition-colors">← Anterior</button>
              <span>Pág. {auditPage + 1} / {Math.max(1, Math.ceil(filteredAudit.length / AUDIT_PAGE_SIZE))}</span>
              <button disabled={(auditPage + 1) * AUDIT_PAGE_SIZE >= filteredAudit.length} onClick={() => setAuditPage(p => p + 1)} className="px-2 py-1 bg-fbsb-surface-200 rounded disabled:opacity-30 hover:bg-fbsb-surface-100 transition-colors">Próxima →</button>
            </div>
          </div>

          {auditLoading ? (
            <div className="flex items-center justify-center h-32 text-fbsb-text-secondary">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando trilha...
            </div>
          ) : pagedAudit.length === 0 ? (
            <div className="text-center py-12 text-fbsb-text-secondary text-sm">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
              Nenhum registro encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="space-y-2">
              {pagedAudit.map(entry => (
                <div key={entry.id} className="bg-fbsb-surface-100 border border-white/5 rounded-xl p-4 hover:border-fbsb-border transition-colors">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-fbsb-primary/20 border border-fbsb-primary/30 flex items-center justify-center text-[10px] font-bold text-fbsb-cyan shrink-0 mt-0.5">
                        {(entry.user_name || entry.user_email || '?').slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <span className="text-[11px] font-bold text-white">{entry.user_name || entry.user_email}</span>
                          <span className="text-[10px] text-fbsb-text-secondary">{entry.user_role}</span>
                          <span className="text-[10px] text-fbsb-text-secondary">·</span>
                          <span className="text-[10px] text-fbsb-text-secondary">{entry.user_email}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                          <span className="text-[11px] font-semibold text-fbsb-cyan">
                            {ACTION_LABELS[entry.action] || entry.action}
                          </span>
                          {entry.target_name && (
                            <>
                              <span className="text-[10px] text-fbsb-text-secondary">→</span>
                              <span className="text-[11px] text-white">{entry.target_name}</span>
                            </>
                          )}
                          {entry.target_type && (
                            <span className="text-[9px] uppercase tracking-wider text-fbsb-text-secondary bg-fbsb-surface-200 px-1.5 py-0.5 rounded">
                              {entry.target_type}
                            </span>
                          )}
                        </div>
                        {entry.details && Object.keys(entry.details).length > 0 && (
                          <div className="mt-1 text-[10px] text-fbsb-text-secondary font-mono bg-fbsb-bg-deep/50 px-2 py-1 rounded">
                            {JSON.stringify(entry.details)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-fbsb-text-secondary shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{fmtDate(entry.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
