import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert, Users, FolderLock,
  AlertTriangle, CheckCircle2, Trash2, Eye, EyeOff,
  RefreshCw, Search, Filter, TrendingUp, BarChart2,
  Lock, Unlock, UserPlus, Activity, Clock, FileText, Upload,
  X, Save, Key, Shield, Mail, Copy, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

/* ═══ TIPOS ═══ */
interface CeoAccessControlProps { currentTenantId: string }
interface VdrUser {
  id: string; name: string; email: string; role: string; initials: string;
  is_active: boolean; created_by: string; created_at: string;
  last_login_at: string | null; login_count: number;
}
interface AuditEntry {
  id: string; user_email: string; user_name: string; user_role: string;
  action: string; target_type: string; target_id: string; target_name: string;
  details: Record<string, unknown>; created_at: string;
}
interface PermissionSet {
  canView: boolean; canUpload: boolean; canRequestDelete: boolean; canDirectDelete: boolean;
}

/* ═══ CONSTANTES ═══ */
const TENANT_ID = 'tenant-industrial-demo-uuid';
const DATA_ROOMS = ['REGULARIZAÇÃO', 'CONTRATOS', 'FINANCEIRO', 'JURÍDICO'];
const COLORS = ['#00d4ff', '#a78bfa', '#34d399', '#fb923c', '#f87171', '#818cf8'];
const ACTION_LABELS: Record<string, string> = {
  LOGIN: '🔑 Login', LOGOUT: '🚪 Logout', UPLOAD: '📤 Upload',
  VIEW: '👁 Visualização', DELETE_REQUEST: '🗑 Solicitação Exclusão',
  DELETE: '❌ Exclusão', PERMISSION_CHANGE: '🔒 Alteração Permissão',
  USER_CREATE: '👤 Criação Usuário', USER_TOGGLE: '🔄 Status Usuário',
};
const ROLES = ['Gestão & Backoffice', 'Compliance & Contratos', 'Auditoria & Investimentos', 'Campo & Técnico', 'Financeiro', 'Diretoria'];

/* ═══ HELPERS ═══ */
function genPwd(): string {
  const c = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$!';
  return Array.from({ length: 14 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}
function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
async function logAudit(p: Partial<AuditEntry>) {
  try { await (supabase as any).from('audit_trail').insert({ tenant_id: TENANT_ID, created_at: new Date().toISOString(), ...p }); } catch {}
}

/* ═══ ANEL DE PROGRESSO SVG ═══ */
function ProgressRing({ pct, size = 80, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#34d399' : pct >= 50 ? '#fb923c' : '#f87171';
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a324a" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="fill-white text-lg font-bold">{pct}%</text>
    </svg>
  );
}

/* ═══ TOGGLE MODERNO ═══ */
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button onClick={onChange} disabled={disabled}
      className={`w-10 h-[22px] rounded-full relative transition-colors ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${on ? 'bg-fbsb-cyan' : 'bg-fbsb-surface-300'}`}>
      <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${on ? 'left-[20px]' : 'left-[2px]'}`} />
    </button>
  );
}

/* ═══════════════════════════════════════ COMPONENTE PRINCIPAL ═══ */
export function CeoAccessControl({ currentTenantId }: CeoAccessControlProps) {
  const [tab, setTab] = useState<'overview'|'users'|'permissions'|'audit'>('overview');

  /* Estado Usuários */
  const [users, setUsers] = useState<VdrUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: ROLES[0], initials: '' });
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  /* Permissões do novo usuário no formulário */
  const [newPerms, setNewPerms] = useState<Record<string, PermissionSet>>(() => {
    const m: Record<string, PermissionSet> = {};
    DATA_ROOMS.forEach(r => { m[r] = { canView: true, canUpload: true, canRequestDelete: true, canDirectDelete: false }; });
    return m;
  });

  /* Estado Permissões */
  const [permMatrix, setPermMatrix] = useState<Record<string, Record<string, PermissionSet>>>({});
  const [permLoading, setPermLoading] = useState(true);
  const [savingPerm, setSavingPerm] = useState<string|null>(null);

  /* Estado Auditoria */
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [af, setAf] = useState({ user: '', action: '', search: '' });
  const [page, setPage] = useState(0);
  const PG = 15;

  /* Estado Analytics */
  const [an, setAn] = useState<{
    totalDocs: number; approvedDocs: number; pendingDocs: number; deletionRequests: number;
    uploadsPerUser: { name: string; uploads: number }[];
    docsByCategory: { category: string; count: number }[];
    actionsOverTime: { date: string; uploads: number; views: number; deletions: number }[];
    compliance: number;
  }|null>(null);

  /* ═══ FETCHERS ═══ */
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try { const { data } = await (supabase as any).from('vdr_users').select('*').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false }); if (data) setUsers(data); } finally { setUsersLoading(false); }
  }, []);

  const fetchPerms = useCallback(async () => {
    setPermLoading(true);
    try {
      const { data } = await (supabase as any).from('vdr_permissions').select('*').eq('tenant_id', TENANT_ID);
      const mx: Record<string, Record<string, PermissionSet>> = {};
      const defEmails = ['ceo@flechabsb.com','socio@flechabsb.com','juridico@flechabsb.com','adm@flechabsb.com','operacional@flechabsb.com'];
      DATA_ROOMS.forEach(room => { mx[room] = {}; defEmails.forEach(e => { mx[room][e] = { canView: true, canUpload: e !== 'ceo@flechabsb.com', canRequestDelete: e !== 'ceo@flechabsb.com', canDirectDelete: e === 'ceo@flechabsb.com' }; }); });
      if (data) data.forEach((r: any) => { if (!mx[r.data_room]) mx[r.data_room] = {}; mx[r.data_room][r.user_email] = { canView: r.can_view, canUpload: r.can_upload, canRequestDelete: r.can_request_delete, canDirectDelete: r.can_direct_delete }; });
      setPermMatrix(mx);
    } finally { setPermLoading(false); }
  }, []);

  const fetchAudit = useCallback(async () => {
    setAuditLoading(true);
    try { const { data } = await (supabase as any).from('audit_trail').select('*').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false }).limit(500); if (data) setAudit(data); } finally { setAuditLoading(false); }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [dr, ar] = await Promise.all([
        (supabase as any).from('b2b_documents').select('id,status,category,uploader_email,uploader_name,deletion_requested,created_at').eq('tenant_id', TENANT_ID),
        (supabase as any).from('audit_trail').select('action,user_email,user_name,created_at').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false }).limit(300),
      ]);
      const docs: any[] = dr.data || [], rows: any[] = ar.data || [];
      const approved = docs.filter(d => d.status === 'Aprovado').length;
      const pending = docs.filter(d => d.status !== 'Aprovado').length;
      const delReq = docs.filter(d => d.deletion_requested).length;
      const compliance = docs.length > 0 ? Math.round((approved / docs.length) * 100) : 0;
      const um: Record<string,number> = {};
      docs.forEach(d => { const k = d.uploader_name || d.uploader_email || '?'; um[k] = (um[k]||0)+1; });
      const uploadsPerUser = Object.entries(um).map(([name,uploads]) => ({name,uploads})).sort((a,b)=>b.uploads-a.uploads).slice(0,6);
      const cm: Record<string,number> = {};
      docs.forEach(d => { cm[d.category] = (cm[d.category]||0)+1; });
      const docsByCategory = Object.entries(cm).map(([category,count])=>({category,count}));
      const today = new Date();
      const actionsOverTime = Array.from({length:7},(_,i) => {
        const d = new Date(today); d.setDate(d.getDate()-(6-i));
        const ds = d.toISOString().slice(0,10), lb = d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
        const dr2 = rows.filter(r => r.created_at?.startsWith(ds));
        return { date: lb, uploads: dr2.filter(r=>r.action==='UPLOAD').length, views: dr2.filter(r=>r.action==='VIEW').length, deletions: dr2.filter(r=>r.action==='DELETE'||r.action==='DELETE_REQUEST').length };
      });
      setAn({ totalDocs: docs.length, approvedDocs: approved, pendingDocs: pending, deletionRequests: delReq, uploadsPerUser, docsByCategory, actionsOverTime, compliance });
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => { fetchUsers(); fetchPerms(); fetchAudit(); fetchAnalytics(); }, [fetchUsers, fetchPerms, fetchAudit, fetchAnalytics]);

  /* ═══ AÇÕES USUÁRIOS ═══ */
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.initials || !pwd) { alert('Preencha todos os campos.'); return; }
    setSaving(true);
    try {
      const { error } = await (supabase as any).from('vdr_users').insert({ tenant_id: TENANT_ID, name: form.name, email: form.email, role: form.role, initials: form.initials.toUpperCase(), password_hash: pwd, created_by: 'ceo@flechabsb.com', is_active: true });
      if (error) throw error;
      // Salvar permissões para cada pasta
      for (const room of DATA_ROOMS) {
        const p = newPerms[room];
        await (supabase as any).from('vdr_permissions').insert({ tenant_id: TENANT_ID, data_room: room, user_email: form.email, can_view: p.canView, can_upload: p.canUpload, can_request_delete: p.canRequestDelete, can_direct_delete: p.canDirectDelete });
      }
      await logAudit({ user_email: 'ceo@flechabsb.com', user_name: 'Direção Executiva', user_role: 'Diretor (CEO)', action: 'USER_CREATE', target_type: 'user', target_name: form.email, details: { name: form.name, role: form.role, permissions: newPerms } });
      setForm({ name: '', email: '', role: ROLES[0], initials: '' }); setPwd(''); setShowForm(false);
      fetchUsers(); fetchPerms(); fetchAudit();
    } catch (e: any) { alert('Erro: ' + (e?.message || e)); } finally { setSaving(false); }
  };

  const toggleUser = async (u: VdrUser) => {
    if (u.email === 'ceo@flechabsb.com') { alert('O CEO não pode ser desativado.'); return; }
    await (supabase as any).from('vdr_users').update({ is_active: !u.is_active }).eq('id', u.id);
    await logAudit({ user_email: 'ceo@flechabsb.com', user_name: 'Direção Executiva', user_role: 'Diretor (CEO)', action: 'USER_TOGGLE', target_type: 'user', target_name: u.email, details: { novo_status: !u.is_active ? 'ativo' : 'bloqueado' } });
    fetchUsers();
  };

  /* ═══ AÇÕES PERMISSÕES ═══ */
  const changePerm = async (room: string, email: string, perm: keyof PermissionSet, val: boolean) => {
    if (email === 'ceo@flechabsb.com' && (perm === 'canDirectDelete' || perm === 'canView')) return;
    setSavingPerm(`${room}__${email}__${perm}`);
    const upd = { ...permMatrix[room][email], [perm]: val };
    setPermMatrix(prev => ({ ...prev, [room]: { ...prev[room], [email]: upd } }));
    try {
      const { data: ex } = await (supabase as any).from('vdr_permissions').select('id').eq('tenant_id', TENANT_ID).eq('data_room', room).eq('user_email', email).single();
      if (ex) { await (supabase as any).from('vdr_permissions').update({ can_view: upd.canView, can_upload: upd.canUpload, can_request_delete: upd.canRequestDelete, can_direct_delete: upd.canDirectDelete, updated_at: new Date().toISOString() }).eq('id', ex.id); }
      else { await (supabase as any).from('vdr_permissions').insert({ tenant_id: TENANT_ID, data_room: room, user_email: email, can_view: upd.canView, can_upload: upd.canUpload, can_request_delete: upd.canRequestDelete, can_direct_delete: upd.canDirectDelete }); }
      await logAudit({ user_email: 'ceo@flechabsb.com', user_name: 'Direção Executiva', user_role: 'Diretor (CEO)', action: 'PERMISSION_CHANGE', target_type: 'permission', target_name: `${room} / ${email}`, details: { permissao: perm, novo_valor: val } });
    } catch (e: any) { alert('Erro: ' + e?.message); } finally { setSavingPerm(null); }
  };

  /* Filtro auditoria */
  const fa = audit.filter(e => {
    if (af.user && !e.user_email.includes(af.user)) return false;
    if (af.action && e.action !== af.action) return false;
    if (af.search && !e.target_name?.toLowerCase().includes(af.search.toLowerCase()) && !e.user_name?.toLowerCase().includes(af.search.toLowerCase())) return false;
    return true;
  });
  const pa = fa.slice(page * PG, (page + 1) * PG);

  /* Copiar credenciais */
  const copyCredentials = () => {
    const txt = `Acesso FlechaBSB\nE-mail: ${form.email}\nSenha: ${pwd}\nURL: https://www.flechabsb.com`;
    navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  /* ═══ TABS ═══ */
  const tabs = [
    { id: 'overview' as const, label: 'Visão Executiva', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'users' as const, label: 'Gestão de Usuários', icon: <Users className="w-4 h-4" /> },
    { id: 'permissions' as const, label: 'Permissões', icon: <FolderLock className="w-4 h-4" /> },
    { id: 'audit' as const, label: 'Auditoria', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto text-fbsb-text-primary">

      {/* ══ HEADER ══ */}
      <div className="glass-card rounded-2xl p-6 anim-fade-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fbsb-primary to-fbsb-cyan/40 flex items-center justify-center shadow-glow-cyan">
                <ShieldAlert className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-fbsb-bg-deep animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-fbsb-cyan bg-clip-text text-transparent">
                Centro de Governança Executiva
              </h1>
              <p className="text-xs text-fbsb-text-secondary mt-0.5">Controle total · Exclusivo CEO · Sessão auditada</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Shield className="w-3 h-3" />
            <span className="font-semibold uppercase tracking-wider">Sessão criptografada</span>
          </div>
        </div>

        {/* Tabs flutuantes */}
        <div className="flex mt-6 bg-fbsb-bg-deep/60 rounded-2xl p-1.5 border border-white/5 gap-1 overflow-x-auto modern-scroll">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-fbsb-primary to-fbsb-cyan/60 text-white shadow-lg shadow-fbsb-cyan/20'
                  : 'text-fbsb-text-secondary hover:text-white hover:bg-white/5'
              }`}>
              {t.icon}<span className="inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ VISÃO EXECUTIVA ══════════ */}
      {tab === 'overview' && an && (
        <div className="space-y-5 anim-fade-up">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Documentos', value: an.totalDocs, color: '#00d4ff', icon: <FileText className="w-5 h-5" /> },
              { label: 'Aprovados', value: an.approvedDocs, color: '#34d399', icon: <CheckCircle2 className="w-5 h-5" /> },
              { label: 'Pendentes', value: an.pendingDocs, color: '#fb923c', icon: <Clock className="w-5 h-5" /> },
              { label: 'Exclusões', value: an.deletionRequests, color: '#f87171', icon: <Trash2 className="w-5 h-5" /> },
            ].map((kpi, i) => (
              <div key={i} className={`glass-card rounded-2xl p-5 anim-fade-scale delay-${i+1}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl" style={{ background: kpi.color + '15' }}>
                    <span style={{ color: kpi.color }}>{kpi.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-fbsb-text-secondary mt-1">{kpi.label}</p>
              </div>
            ))}
            {/* Anel de conformidade */}
            <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center anim-fade-scale delay-5">
              <ProgressRing pct={an.compliance} size={72} />
              <p className="text-[10px] uppercase tracking-widest text-fbsb-text-secondary mt-2">Conformidade</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card rounded-2xl p-5 anim-fade-up delay-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">Atividade · 7 dias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={an.actionsOverTime}>
                  <defs>
                    <linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3}/><stop offset="100%" stopColor="#00d4ff" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gVw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3}/><stop offset="100%" stopColor="#a78bfa" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gDl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" stopOpacity={0.3}/><stop offset="100%" stopColor="#f87171" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8b9cad' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b9cad' }} />
                  <Tooltip contentStyle={{ background: '#0d2235ee', border: '1px solid #1a324a', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(12px)' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="uploads" stroke="#00d4ff" fill="url(#gUp)" strokeWidth={2} name="Uploads" />
                  <Area type="monotone" dataKey="views" stroke="#a78bfa" fill="url(#gVw)" strokeWidth={2} name="Visualizações" />
                  <Area type="monotone" dataKey="deletions" stroke="#f87171" fill="url(#gDl)" strokeWidth={2} name="Exclusões" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-2xl p-5 anim-fade-up delay-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">Uploads por Colaborador</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={an.uploadsPerUser} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8b9cad' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8b9cad' }} width={85} />
                  <Tooltip contentStyle={{ background: '#0d2235ee', border: '1px solid #1a324a', borderRadius: 12, fontSize: 11 }} />
                  <Bar dataKey="uploads" fill="#00d4ff" radius={[0,6,6,0]} name="Documentos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Donut */}
            <div className="glass-card rounded-2xl p-5 anim-fade-up delay-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4">Por Categoria</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={an.docsByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                    label={(p: any) => `${p.category} ${((p.percent??0)*100).toFixed(0)}%`} labelLine={false}>
                    {an.docsByCategory.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d2235ee', border: '1px solid #1a324a', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Parecer */}
            <div className="glass-card rounded-2xl p-5 lg:col-span-2 anim-fade-up delay-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fbsb-text-secondary mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-fbsb-cyan" /> Parecer Consultivo
              </h3>
              <div className="space-y-3 text-[13px] text-fbsb-text-secondary">
                <div className={`p-4 rounded-xl border-l-4 ${an.compliance >= 80 ? 'border-emerald-500 bg-emerald-500/5' : an.compliance >= 50 ? 'border-orange-400 bg-orange-400/5' : 'border-red-500 bg-red-500/5'}`}>
                  <span className="font-bold text-white">Conformidade:</span>{' '}
                  {an.compliance >= 80 ? `${an.compliance}% aprovados. Cofre em conformidade para auditores externos.` : `${an.compliance}% aprovados. Priorize os ${an.pendingDocs} documentos pendentes.`}
                </div>
                {an.deletionRequests > 0 && (
                  <div className="p-4 rounded-xl border-l-4 border-orange-400 bg-orange-400/5">
                    <span className="font-bold text-white">Atenção:</span> {an.deletionRequests} exclusão(ões) pendentes de aprovação.
                  </div>
                )}
                <div className="p-4 rounded-xl border-l-4 border-fbsb-cyan/40 bg-fbsb-cyan/5">
                  <span className="font-bold text-white">Governança:</span> Auditoria ativa. Acessos, uploads e visualizações rastreados em tempo real.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === 'overview' && !an && (
        <div className="flex items-center justify-center h-48 text-fbsb-text-secondary"><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando...</div>
      )}

      {/* ══════════ GESTÃO DE USUÁRIOS ══════════ */}
      {tab === 'users' && (
        <div className="space-y-5 anim-fade-up">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fbsb-primary to-purple-600/40 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Gestão de Usuários & Credenciais</h2>
                  <p className="text-xs text-fbsb-text-secondary">Cadastre, bloqueie e defina permissões dos colaboradores</p>
                </div>
              </div>
              <button onClick={() => { setShowForm(v => !v); if (!pwd) setPwd(genPwd()); }}
                className="flex items-center gap-2 bg-gradient-to-r from-fbsb-primary to-fbsb-cyan/60 hover:opacity-90 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-fbsb-cyan/10">
                <UserPlus className="w-4 h-4" /> Novo Usuário
              </button>
            </div>

            {/* ── FORMULÁRIO NOVO USUÁRIO ── */}
            {showForm && (
              <div className="mb-6 bg-fbsb-bg-deep/60 border border-white/5 rounded-2xl p-6 anim-fade-scale">
                <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-fbsb-cyan" /> Cadastrar Novo Acesso
                </h4>

                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block tracking-wider">Nome completo *</label>
                    <input className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fbsb-cyan/50 transition-colors" placeholder="Ex: João Silva" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block tracking-wider">E-mail *</label>
                    <input type="email" className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fbsb-cyan/50 transition-colors" placeholder="usuario@flechabsb.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block tracking-wider">Cargo / Função *</label>
                    <select className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fbsb-cyan/50" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block tracking-wider">Iniciais (sigla) *</label>
                    <input className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fbsb-cyan/50" placeholder="JUR" maxLength={4} value={form.initials} onChange={e => setForm(p => ({...p, initials: e.target.value.toUpperCase()}))} />
                  </div>
                </div>

                {/* Senha */}
                <div className="mb-5">
                  <label className="text-[10px] uppercase text-fbsb-text-secondary mb-1 block tracking-wider">Senha gerada automaticamente</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type={showPwd ? 'text' : 'password'} className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fbsb-cyan/50 pr-10 font-mono" value={pwd} onChange={e => setPwd(e.target.value)} />
                      <button onClick={() => setShowPwd(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-fbsb-text-secondary hover:text-white">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button onClick={() => { setPwd(genPwd()); setShowPwd(true); }} className="flex items-center gap-1 bg-fbsb-surface-200 hover:bg-fbsb-surface-300 border border-white/5 text-xs px-4 py-2.5 rounded-xl text-fbsb-text-secondary transition-colors">
                      <Key className="w-3 h-3" /> Gerar
                    </button>
                    <button onClick={copyCredentials} className={`flex items-center gap-1 text-xs px-4 py-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-fbsb-surface-200 hover:bg-fbsb-surface-300 border border-white/5 text-fbsb-text-secondary'}`}>
                      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Permissões do novo usuário por pasta */}
                <div className="mb-5">
                  <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <FolderLock className="w-3.5 h-3.5 text-fbsb-cyan" /> Definir Permissões por Pasta
                  </h5>
                  <div className="bg-fbsb-surface-100/50 rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-white/5 text-fbsb-text-secondary uppercase tracking-wider">
                          <th className="text-left py-2.5 px-4">Pasta</th>
                          <th className="text-center py-2.5 px-2"><Eye className="w-3 h-3 mx-auto" /></th>
                          <th className="text-center py-2.5 px-2"><Upload className="w-3 h-3 mx-auto" /></th>
                          <th className="text-center py-2.5 px-2"><FileText className="w-3 h-3 mx-auto" /></th>
                          <th className="text-center py-2.5 px-2"><Trash2 className="w-3 h-3 mx-auto" /></th>
                        </tr>
                        <tr className="border-b border-white/5 text-[9px] text-fbsb-text-secondary">
                          <th></th><th className="py-1">Ver</th><th className="py-1">Upload</th><th className="py-1">Solicitar Excl.</th><th className="py-1">Excluir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DATA_ROOMS.map(room => (
                          <tr key={room} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                            <td className="py-2.5 px-4 font-semibold text-white">{room}</td>
                            {(['canView','canUpload','canRequestDelete','canDirectDelete'] as const).map(f => (
                              <td key={f} className="py-2.5 px-2 text-center">
                                <Toggle on={newPerms[room][f]} onChange={() => setNewPerms(prev => ({...prev, [room]: {...prev[room], [f]: !prev[room][f]}}))} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button onClick={handleCreate} disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/10">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Salvando...' : 'Criar Acesso & Permissões'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-fbsb-surface-200 hover:bg-fbsb-surface-300 border border-white/5 text-xs text-fbsb-text-secondary px-5 py-2.5 rounded-xl transition-colors">
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* ── TABELA DE USUÁRIOS ── */}
            {usersLoading ? (
              <div className="flex items-center justify-center h-32 text-fbsb-text-secondary"><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando...</div>
            ) : (
              <div className="space-y-3">
                {users.map((u, i) => (
                  <div key={u.id} className={`glass-card rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 anim-fade-up delay-${Math.min(i+1,6)}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold border ${u.is_active ? 'bg-fbsb-primary/20 border-fbsb-cyan/30 text-fbsb-cyan' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {u.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-[13px]">{u.name}</p>
                        <p className="text-[11px] text-fbsb-text-secondary">{u.email} · {u.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center hidden md:block">
                        <p className="text-xs font-bold text-fbsb-cyan">{u.login_count ?? 0}</p>
                        <p className="text-[9px] text-fbsb-text-secondary uppercase">Logins</p>
                      </div>
                      <div className="hidden md:block text-[10px] text-fbsb-text-secondary">
                        {fmt(u.last_login_at)}
                      </div>
                      {u.is_active
                        ? <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Ativo</span>
                        : <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20"><AlertTriangle className="w-3 h-3" /> Bloqueado</span>
                      }
                      {u.email !== 'ceo@flechabsb.com' ? (
                        <button onClick={() => toggleUser(u)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${u.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}>
                          {u.is_active ? <><Lock className="w-3 h-3" /> Bloquear</> : <><Unlock className="w-3 h-3" /> Ativar</>}
                        </button>
                      ) : <span className="text-[10px] text-fbsb-text-secondary opacity-40">Inalienável</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ PERMISSÕES ══════════ */}
      {tab === 'permissions' && (
        <div className="space-y-5 anim-fade-up">
          {permLoading ? <div className="flex items-center justify-center h-32 text-fbsb-text-secondary"><RefreshCw className="w-5 h-5 animate-spin mr-2" /></div> : (
            DATA_ROOMS.map(room => (
              <div key={room} className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 bg-gradient-to-r from-fbsb-primary/20 to-transparent px-5 py-3 border-b border-white/5">
                  <FolderLock className="w-4 h-4 text-fbsb-cyan" />
                  <span className="text-xs font-bold text-fbsb-cyan uppercase tracking-widest">{room}</span>
                </div>
                <div className="overflow-x-auto modern-scroll">
                  <table className="w-full text-[11px] min-w-[600px]">
                    <thead><tr className="border-b border-white/5 text-fbsb-text-secondary uppercase tracking-wider">
                      <th className="text-left py-2.5 px-5">Colaborador</th>
                      <th className="text-center py-2.5 px-2">Ver</th>
                      <th className="text-center py-2.5 px-2">Upload</th>
                      <th className="text-center py-2.5 px-2">Solic. Excl.</th>
                      <th className="text-center py-2.5 px-2">Excluir</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.keys(permMatrix[room]||{}).map(email => {
                        const p = permMatrix[room][email]; const isCeo = email === 'ceo@flechabsb.com';
                        const usr = users.find(u => u.email === email);
                        return (
                          <tr key={email} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-5 whitespace-nowrap"><span className="font-semibold text-white">{usr?.name || email}</span>{isCeo && <span className="text-[9px] text-fbsb-cyan ml-2">SUPREMO</span>}</td>
                            {(['canView','canUpload','canRequestDelete','canDirectDelete'] as const).map(f => (
                              <td key={f} className="py-3 px-2 text-center">
                                {savingPerm === `${room}__${email}__${f}` ? <RefreshCw className="w-4 h-4 animate-spin text-fbsb-cyan mx-auto" /> :
                                <div className="flex justify-center"><Toggle on={p?.[f]??true} onChange={() => changePerm(room, email, f, !(p?.[f]??true))} disabled={isCeo && (f==='canView'||f==='canDirectDelete')} /></div>}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════════ AUDITORIA ══════════ */}
      {tab === 'audit' && (
        <div className="glass-card rounded-2xl p-6 anim-fade-up">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Trilha de Auditoria Imutável</h2>
                <p className="text-xs text-fbsb-text-secondary">{fa.length} registros</p>
              </div>
            </div>
            <button onClick={fetchAudit} className="flex items-center gap-1 bg-fbsb-surface-200 text-xs text-fbsb-text-secondary px-3 py-2 rounded-xl hover:bg-fbsb-surface-300 transition-colors border border-white/5">
              <RefreshCw className="w-3 h-3" /> Atualizar
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fbsb-text-secondary" />
              <input className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-fbsb-cyan/50" placeholder="Buscar..." value={af.search} onChange={e => { setAf(p=>({...p,search:e.target.value})); setPage(0); }} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fbsb-text-secondary" />
              <input className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-fbsb-cyan/50" placeholder="Filtrar e-mail..." value={af.user} onChange={e => { setAf(p=>({...p,user:e.target.value})); setPage(0); }} />
            </div>
            <select className="w-full bg-fbsb-surface-100 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-fbsb-cyan/50" value={af.action} onChange={e => { setAf(p=>({...p,action:e.target.value})); setPage(0); }}>
              <option value="">Todas as ações</option>
              {Object.entries(ACTION_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* Timeline */}
          {auditLoading ? <div className="flex items-center justify-center h-32 text-fbsb-text-secondary"><RefreshCw className="w-5 h-5 animate-spin" /></div> : pa.length === 0 ? (
            <div className="text-center py-12 text-fbsb-text-secondary text-sm"><Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />Nenhum registro encontrado.</div>
          ) : (
            <div className="relative modern-scroll max-h-[500px] overflow-y-auto">
              {/* Linha vertical da timeline */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-fbsb-cyan/30 via-fbsb-primary/20 to-transparent" />
              <div className="space-y-1">
                {pa.map((e, i) => (
                  <div key={e.id} className={`relative pl-10 py-3 hover:bg-white/[0.02] rounded-xl transition-colors anim-fade-up delay-${Math.min(i+1,6)}`}>
                    {/* Dot */}
                    <div className="absolute left-[14px] top-[18px] w-[9px] h-[9px] rounded-full bg-fbsb-cyan border-2 border-fbsb-bg-deep" />
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-white">{e.user_name || e.user_email}</span>
                          <span className="text-[10px] text-fbsb-text-secondary">{e.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-fbsb-cyan">{ACTION_LABELS[e.action]||e.action}</span>
                          {e.target_name && <><ChevronRight className="w-3 h-3 text-fbsb-text-secondary" /><span className="text-[11px] text-white">{e.target_name}</span></>}
                        </div>
                        {e.details && Object.keys(e.details).length > 0 && (
                          <p className="mt-1 text-[10px] text-fbsb-text-secondary font-mono bg-fbsb-bg-deep/50 px-2 py-1 rounded-lg inline-block">{JSON.stringify(e.details)}</p>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-fbsb-text-secondary shrink-0"><Clock className="w-3 h-3" />{fmt(e.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4 text-[11px] text-fbsb-text-secondary">
            <span>Página {page+1} / {Math.max(1,Math.ceil(fa.length/PG))}</span>
            <div className="flex gap-2">
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="px-3 py-1.5 bg-fbsb-surface-200 rounded-lg disabled:opacity-30 hover:bg-fbsb-surface-300 transition-colors border border-white/5">← Anterior</button>
              <button disabled={(page+1)*PG >= fa.length} onClick={()=>setPage(p=>p+1)} className="px-3 py-1.5 bg-fbsb-surface-200 rounded-lg disabled:opacity-30 hover:bg-fbsb-surface-300 transition-colors border border-white/5">Próxima →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
