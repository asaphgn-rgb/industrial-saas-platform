import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Lock, 
  Users, 
  Terminal, 
  ExternalLink, 
  FileDown, 
  ShieldAlert,
  Smartphone,
  Globe,
  MoreVertical,
  LogOut,
  Sparkles
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const securityLogs = [
  { id: 1, ip: '192.168.1.45', device: 'Chrome / Windows', action: 'Tentativa de Leitura Cross-Tenant', status: 'Bloqueado', time: '2 min atrás' },
  { id: 2, ip: '45.178.22.10', device: 'Firefox / Linux', action: 'Falha de Autenticação Repetida', status: 'IP Banido (30m)', time: '15 min atrás' },
  { id: 3, ip: '189.22.10.5', device: 'Safari / iPhone', action: 'Acesso Não Autorizado /api/admin', status: 'Bloqueado', time: '45 min atrás' },
];

const activeSessions = [
  { id: 1, user: 'Asaph G.', role: 'Super Admin', device: 'Desktop', location: 'São Paulo, BR', status: 'Ativo' },
  { id: 2, user: 'Operador 03', role: 'Operador', device: 'Tablet MES 02', location: 'Planta Industrial', status: 'Ativo' },
  { id: 3, user: 'Gerente PCP', role: 'Gerente', device: 'Mobile', location: 'Curitiba, BR', status: 'Ativo' },
];

export const SecurityAuditCenter = () => {
  return (
    <div className="space-y-6">
      {/* Top Section: Status Blindagem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-primary/20 col-span-1 md:col-span-2 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={120} className="text-primary" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
                Sistema Blindado
              </Badge>
            </div>
            <CardTitle className="text-2xl text-white font-bold">
              Blindagem Nível Bancário Ativa
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg">
              RLS 100%, Trilha Imutável, Anti-Tamper Ativo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
              <Lock size={16} className="text-primary" />
              <span className="text-xs font-mono">ENCRYPTION: AES-256</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-mono">RLS POLICIES: 154 ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-mono">UPTIME: 99.99%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/40 border-2 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={120} className="text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
              <Sparkles size={16} />
              Parecer de Cibersegurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-primary/30 pl-3">
              "Nenhum vazamento detectado nas últimas 24h. 100% das requisições filtradas por tenant_id. Integridade das políticas de RLS verificada."
            </p>
            <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Relatório ISO 27001
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monitor de Tentativas de Invasão */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <ShieldAlert className="text-red-500" size={20} />
                Monitor de Invasões (Real-time)
              </CardTitle>
              <CardDescription className="text-slate-500">Logs de segurança simulando bloqueios</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="border-slate-800">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead className="text-slate-400 font-bold">Origem IP</TableHead>
                  <TableHead className="text-slate-400 font-bold">Ação Bloqueada</TableHead>
                  <TableHead className="text-slate-400 font-bold">Resposta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityLogs.map((log) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-xs text-slate-300">
                      <div>{log.ip}</div>
                      <div className="text-[10px] text-slate-500">{log.device}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gestão de Sessões Ativas */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="text-primary" size={20} />
                Sessões Ativas
              </CardTitle>
              <CardDescription className="text-slate-500">Controle de dispositivos conectados</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary/20">{activeSessions.length} Online</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="border-slate-800">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead className="text-slate-400 font-bold">Usuário</TableHead>
                  <TableHead className="text-slate-400 font-bold">Dispositivo</TableHead>
                  <TableHead className="text-slate-400 font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map((session) => (
                  <TableRow key={session.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300">
                      <div className="font-bold">{session.user}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{session.role}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        {session.device === 'Mobile' ? <Smartphone size={12} /> : <Globe size={12} />}
                        {session.device}
                      </div>
                      <div className="text-[10px] text-slate-500">{session.location}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Revogar Sessão">
                        <LogOut size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Terminal Footer */}
      <div className="bg-black border border-slate-800 rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500 text-[10px] font-mono">
          <Terminal size={14} className="text-green-500" />
          <span>CONNECTED TO CLOUD FLUX SECURE NODE-01</span>
          <span className="text-slate-700">|</span>
          <span>PROTOCOL: TLS 1.3</span>
          <span className="text-slate-700">|</span>
          <span>AUTH: JWT/RLS</span>
        </div>
        <div className="text-green-500/50 text-[10px] font-mono animate-pulse">
          AUDITING LIVE...
        </div>
      </div>
    </div>
  );
};