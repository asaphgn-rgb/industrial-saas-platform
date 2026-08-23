import React, { useState, useMemo } from 'react';
import { SecureChat } from './SecureChat';
import { VideoConferenceRoom } from './VideoConferenceRoom';
import {
  Users, MessageSquare, Video, Phone, Plus, Search,
  Shield, X, Check, User, Group
} from 'lucide-react';
import { ntfyRelay } from '../../lib/ntfySync';
import { encryptE2E } from '../../lib/crypto';
import { deriveKey } from '../../lib/crypto';
import { supabase } from '../../lib/supabase';

// ------- Tipos -------
interface Participant {
  id: string;
  name: string;
  role: string;
  initials: string;
  email?: string;
}

interface Room {
  id: string;
  name: string;
  type: 'global' | 'direct' | 'group';
  participants: Participant[];
  unread?: number;
}

interface CommunicationHubProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
    initials: string;
    email?: string;
  };
  globalRoomId: string;
}

// Lista estática dos usuários do sistema (espelha a tabela de credenciais do SecureLogin)
const SYSTEM_USERS: Participant[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Direção Executiva', role: 'Diretor (CEO)', initials: 'CEO', email: 'ceo@flechabsb.com' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Administrativo',    role: 'Gestão & Backoffice', initials: 'ADM', email: 'adm@flechabsb.com' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Jurídico',          role: 'Compliance & Contratos', initials: 'JUR', email: 'juridico@flechabsb.com' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Sócio',             role: 'Auditoria & Investimentos', initials: 'SOC', email: 'socio@flechabsb.com' },
  { id: '77777777-7777-7777-7777-777777777777', name: 'Operações',         role: 'Campo & Técnico', initials: 'OPS', email: 'operacional@flechabsb.com' },
];

// Gera um roomId determinístico para uma sala 1:1 (igual nos dois lados)
function directRoomId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_').replace(/-/g, '').substring(0, 36);
}

// Gera roomId para grupo personalizado baseado nos participantes
function groupRoomId(participantIds: string[]): string {
  return participantIds.sort().join('_').replace(/-/g, '').substring(0, 36);
}

export function CommunicationHub({ currentUser, globalRoomId }: CommunicationHubProps) {
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState<Room | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupSelection, setGroupSelection] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [customRooms, setCustomRooms] = useState<Room[]>([]);

  // Sala geral sempre no topo
  const globalRoom: Room = useMemo(() => ({
    id: globalRoomId,
    name: 'Sala Geral — REGULARIZAÇÃO',
    type: 'global',
    participants: SYSTEM_USERS,
  }), [globalRoomId]);

  // Salas 1:1 derivadas dos outros usuários do sistema (excluindo o próprio)
  const directRooms: Room[] = useMemo(() => {
    return SYSTEM_USERS
      .filter(u => u.id !== currentUser.id)
      .map(u => ({
        id: directRoomId(currentUser.id, u.id),
        name: u.name,
        type: 'direct' as const,
        participants: [
          { id: currentUser.id, name: currentUser.name, role: currentUser.role, initials: currentUser.initials },
          u,
        ],
      }));
  }, [currentUser]);

  const allRooms: Room[] = useMemo(() => {
    return [globalRoom, ...directRooms, ...customRooms];
  }, [globalRoom, directRooms, customRooms]);

  const filteredRooms = useMemo(() => {
    if (!search.trim()) return allRooms;
    return allRooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  }, [allRooms, search]);

  // Selecionar sala inicial
  React.useEffect(() => {
    if (!selectedRoom) setSelectedRoom(globalRoom);
  }, [globalRoom]);

  const handleOpenVideo = (room: Room) => {
    setActiveVideoRoom(room);
    // Envia convite de reunião no canal da sala
    const sendInvite = async () => {
      const key = await deriveKey(room.id, 'SaaS-B2B-Secure-Salt');
      const cipherB64 = await encryptE2E(`📹 Videoconferência iniciada por ${currentUser.name}. Clique em "Entrar na Reunião" para participar.`, key);
      const inviteMsg = {
        id: crypto.randomUUID(),
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_role: currentUser.role,
        content: cipherB64,
        created_at: new Date().toISOString(),
        is_read: false,
        attachment_type: 'invite',
      };
      ntfyRelay.connect(room.id, () => {});
      await ntfyRelay.pushMessage(inviteMsg);
      supabase.from('b2b_secure_chat').insert({
        ...inviteMsg,
        room_id: room.id,
        tenant_id: 'tenant-industrial-demo-uuid',
      } as any).then(() => {});
    };
    sendInvite().catch(console.error);
  };

  const handleAtaGenerated = async (ataText: string) => {
    if (!selectedRoom) return;
    const key = await deriveKey(selectedRoom.id, 'SaaS-B2B-Secure-Salt');
    const cipherB64 = await encryptE2E(ataText, key);
    const ataMsg = {
      id: crypto.randomUUID(),
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      content: cipherB64,
      created_at: new Date().toISOString(),
      is_read: false,
      attachment_type: 'ata',
    };
    ntfyRelay.pushMessage({ ...ataMsg });
    supabase.from('b2b_secure_chat').insert({
      ...ataMsg,
      room_id: selectedRoom.id,
      tenant_id: 'tenant-industrial-demo-uuid',
    } as any).then(() => {});
    setActiveVideoRoom(null);
    alert('Ata ISO 9001 gerada e enviada para a sala com sucesso!');
  };

  const handleCreateGroup = () => {
    if (groupSelection.length < 2 || !groupName.trim()) {
      alert('Selecione pelo menos 2 participantes e dê um nome ao grupo.');
      return;
    }
    const allIds = [currentUser.id, ...groupSelection];
    const newRoom: Room = {
      id: groupRoomId(allIds),
      name: groupName.trim(),
      type: 'group',
      participants: [
        { id: currentUser.id, name: currentUser.name, role: currentUser.role, initials: currentUser.initials },
        ...SYSTEM_USERS.filter(u => groupSelection.includes(u.id)),
      ],
    };
    setCustomRooms(prev => [...prev, newRoom]);
    setSelectedRoom(newRoom);
    setShowNewGroupModal(false);
    setGroupSelection([]);
    setGroupName('');
  };

  const otherParticipants = selectedRoom?.participants.filter(p => p.id !== currentUser.id) ?? [];

  const getRoomIcon = (room: Room) => {
    if (room.type === 'global') return <Shield className="w-4 h-4 text-fbsb-cyan" />;
    if (room.type === 'group') return <Users className="w-4 h-4 text-purple-400" />;
    return <User className="w-4 h-4 text-fbsb-text-secondary" />;
  };

  const getRoomSubtitle = (room: Room) => {
    if (room.type === 'global') return `${room.participants.length} participantes · Sala Geral`;
    if (room.type === 'group') return `Grupo · ${room.participants.length} pessoas`;
    const other = room.participants.find(p => p.id !== currentUser.id);
    return other?.role ?? 'Chat Privado';
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative bg-fbsb-bg-deep dark text-fbsb-text-primary">

      {/* ====== SIDEBAR ESQUERDA: Lista de Salas ====== */}
      <div className="w-80 flex-shrink-0 bg-fbsb-bg-main border-r border-white/5 flex flex-col overflow-hidden">

        {/* Header Sidebar */}
        <div className="px-5 py-4 border-b border-white/5 bg-fbsb-surface-100/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-fbsb-text-primary font-serif tracking-wide flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-fbsb-cyan" />
              Canais Seguros
            </h2>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="p-1.5 rounded-lg bg-fbsb-cyan/10 hover:bg-fbsb-cyan/20 text-fbsb-cyan transition-colors"
              title="Criar Novo Grupo"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fbsb-text-secondary" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar sala ou contato..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-fbsb-bg-deep border border-fbsb-border text-fbsb-text-primary outline-none focus:border-fbsb-cyan transition-colors"
            />
          </div>
        </div>

        {/* Lista de Salas */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredRooms.map(room => {
            const isActive = selectedRoom?.id === room.id;
            const other = room.participants.find(p => p.id !== currentUser.id);
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full flex items-center px-4 py-3 transition-all group ${
                  isActive
                    ? 'bg-fbsb-surface-100 border-r-2 border-fbsb-cyan'
                    : 'hover:bg-fbsb-surface-100/50'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mr-3 ${
                  room.type === 'global'
                    ? 'bg-fbsb-cyan/10 border border-fbsb-cyan/30 text-fbsb-cyan'
                    : room.type === 'group'
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                    : 'bg-fbsb-surface-200 border border-fbsb-border text-fbsb-text-primary'
                }`}>
                  {room.type === 'global' ? <Shield className="w-4 h-4" /> :
                   room.type === 'group' ? <Users className="w-4 h-4" /> :
                   (other?.initials ?? '?')}
                </div>

                {/* Info */}
                <div className="flex-1 text-left overflow-hidden">
                  <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-fbsb-text-primary'}`}>
                    {room.name}
                  </p>
                  <p className="text-[10px] text-fbsb-text-secondary truncate mt-0.5">
                    {getRoomSubtitle(room)}
                  </p>
                </div>

                {/* Badge */}
                {room.type === 'global' && (
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Rodapé Sidebar */}
        <div className="px-4 py-3 border-t border-white/5 bg-fbsb-surface-100/10">
          <p className="text-[9px] text-fbsb-text-secondary/60 uppercase tracking-widest text-center font-bold">
            E2E · AES-GCM · Zero-Trace
          </p>
        </div>
      </div>

      {/* ====== ÁREA PRINCIPAL: Chat da Sala Selecionada ====== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedRoom ? (
          <>
            {/* Top Bar da Sala */}
            <div className="flex items-center justify-between px-6 py-3 bg-fbsb-surface-100/50 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedRoom.type === 'global' ? 'bg-fbsb-cyan/10' :
                  selectedRoom.type === 'group' ? 'bg-purple-500/10' : 'bg-fbsb-surface-200'
                }`}>
                  {getRoomIcon(selectedRoom)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-fbsb-text-primary">{selectedRoom.name}</h3>
                  <p className="text-[10px] text-fbsb-text-secondary uppercase tracking-widest">
                    {getRoomSubtitle(selectedRoom)}
                  </p>
                </div>
              </div>

              {/* Botões de Chamada */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenVideo(selectedRoom)}
                  className="flex items-center px-3 py-2 bg-fbsb-cyan/10 hover:bg-fbsb-cyan/20 text-fbsb-cyan rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-fbsb-cyan/20"
                  title="Iniciar Videoconferência"
                >
                  <Video className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Vídeo</span>
                </button>
                <button
                  onClick={() => handleOpenVideo(selectedRoom)}
                  className="flex items-center px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-green-500/20"
                  title="Chamada de Áudio"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Áudio</span>
                </button>
              </div>
            </div>

            {/* Chat da Sala */}
            <div className="flex-1 overflow-hidden relative">
              <SecureChat
                key={selectedRoom.id}
                roomId={selectedRoom.id}
                currentUserId={currentUser.id}
                currentUserRole={currentUser.role}
                currentUserName={currentUser.name}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-fbsb-text-secondary">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-serif text-lg">Selecione uma sala para começar</p>
          </div>
        )}
      </div>

      {/* ====== MODAL CRIAR GRUPO ====== */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-fbsb-bg-main border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-fbsb-surface-100">
              <h3 className="font-bold text-fbsb-text-primary font-serif flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                Criar Grupo Privado
              </h3>
              <button onClick={() => setShowNewGroupModal(false)} className="p-1.5 rounded-lg hover:bg-fbsb-surface-200 text-fbsb-text-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Nome do grupo */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-fbsb-text-secondary block mb-2">Nome do Grupo</label>
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Ex: Equipe Jurídico-Financeiro"
                  className="w-full px-4 py-3 rounded-xl bg-fbsb-bg-deep border border-fbsb-border text-fbsb-text-primary text-sm outline-none focus:border-fbsb-cyan transition-colors"
                />
              </div>

              {/* Seleção de participantes */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-fbsb-text-secondary block mb-2">
                  Participantes ({groupSelection.length} selecionados)
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {SYSTEM_USERS.filter(u => u.id !== currentUser.id).map(user => {
                    const isSelected = groupSelection.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => setGroupSelection(prev =>
                          isSelected ? prev.filter(id => id !== user.id) : [...prev, user.id]
                        )}
                        className={`w-full flex items-center p-3 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-fbsb-cyan/10 border-fbsb-cyan/40 text-fbsb-text-primary'
                            : 'bg-fbsb-surface-100/30 border-white/5 text-fbsb-text-secondary hover:border-white/20'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-fbsb-surface-200 border border-fbsb-border flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                          {user.initials}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-bold">{user.name}</p>
                          <p className="text-[10px] opacity-70">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-fbsb-cyan flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={groupSelection.length < 1 || !groupName.trim()}
                className="w-full py-3 bg-fbsb-cyan text-fbsb-bg-deep font-bold text-sm rounded-xl uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-cyan"
              >
                Criar Grupo Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL VIDEOCONFERÊNCIA (Fullscreen) ====== */}
      {activeVideoRoom && (
        <VideoConferenceRoom
          roomId={activeVideoRoom.id}
          roomName={activeVideoRoom.name}
          currentUserName={currentUser.name}
          onClose={() => setActiveVideoRoom(null)}
          onAtaGenerated={handleAtaGenerated}
        />
      )}
    </div>
  );
}
