import React, { useState } from 'react';
import {
  Factory,
  Play,
  Pause,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  Clock,
  User,
  Plus,
  RefreshCw,
  Zap,
  Gauge
} from 'lucide-react';
import { IndustrialMesService } from '../services/industrial-mes.service';
import type { OeeMetrics, DowntimeReasonCategory, ScrapReasonCategory } from '../types/industrial-mes.types';

interface IndustrialMesModuleProps {
  tenantId: string;
  unitId: string;
}

export const IndustrialMesModule: React.FC<IndustrialMesModuleProps> = ({
  tenantId,
  unitId
}) => {
  // Centro de Trabalho / Máquina Selecionada
  const [selectedWorkCenter, setSelectedWorkCenter] = useState({
    id: 'wc-cnc-01-uuid',
    code: 'CNC-01',
    name: 'Torno CNC Mazak Quick Turn 250',
    nominalHourlyCapacity: 60, // 60 peças/hora (1 peça/minuto)
    oeeTarget: 85.0
  });

  // Ordem de Produção Ativa
  const [activeOrder, setActiveOrder] = useState({
    id: 'po-4892-uuid',
    code: 'OP-2026-084',
    itemCode: 'EIXO-IND-320',
    itemDescription: 'Eixo de Transmissão Industrial Aço 4140',
    quantityPlanned: 400,
    quantityProduced: 245,
    quantityScrap: 8,
    status: 'IN_PROGRESS',
    startTime: '07:30:00'
  });

  // Variáveis de Turno / Tempo (Turno de 8h = 480 min)
  const [shiftPlannedMinutes, setShiftPlannedMinutes] = useState(360); // 6 horas decorridas
  const [accumulatedDowntimeMinutes, setAccumulatedDowntimeMinutes] = useState(35); // 35 min parados
  const [isMachineRunning, setIsMachineRunning] = useState(true);

  // Modais de Ação
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);

  // Inputs dos Formulários Rápidos
  const [prodQty, setProdQty] = useState(10);
  const [operatorBadge, setOperatorBadge] = useState('OP-4102');
  const [scrapQty, setScrapQty] = useState(1);
  const [scrapCategory, setScrapCategory] = useState<ScrapReasonCategory>('DEFEITO_DIMENSIONAL');
  const [scrapDesc, setScrapDesc] = useState('');
  const [downtimeCategory, setDowntimeCategory] = useState<DowntimeReasonCategory>('SETUP_FERRAMENTAL');
  const [downtimeDesc, setDowntimeDesc] = useState('');

  // Cálculo Dinâmico de OEE
  const oeeMetrics: OeeMetrics = IndustrialMesService.calculateOeeMetrics({
    plannedMinutes: shiftPlannedMinutes,
    downtimeMinutes: accumulatedDowntimeMinutes,
    nominalHourlyCapacity: selectedWorkCenter.nominalHourlyCapacity,
    goodParts: activeOrder.quantityProduced,
    scrapParts: activeOrder.quantityScrap
  });

  const handleRecordProduction = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveOrder(prev => ({
      ...prev,
      quantityProduced: prev.quantityProduced + Number(prodQty)
    }));
    setIsProductionModalOpen(false);
  };

  const handleRecordScrap = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveOrder(prev => ({
      ...prev,
      quantityScrap: prev.quantityScrap + Number(scrapQty)
    }));
    setIsScrapModalOpen(false);
    setScrapDesc('');
  };

  const handleToggleDowntime = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMachineRunning) {
      setIsMachineRunning(false);
      setAccumulatedDowntimeMinutes(prev => prev + 15); // Exemplo de incremento
    } else {
      setIsMachineRunning(true);
    }
    setIsDowntimeModalOpen(false);
    setDowntimeDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header do Terminal de Chão de Fábrica */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600/20 text-blue-400 font-mono font-bold text-sm px-3 py-1 rounded-lg border border-blue-500/30">
              {selectedWorkCenter.code}
            </span>
            <h2 className="text-xl font-bold text-white">{selectedWorkCenter.name}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isMachineRunning
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${isMachineRunning ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              {isMachineRunning ? 'EM OPERAÇÃO' : 'MÁQUINA PARADA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ordem de Produção Atual: <strong className="text-slate-200">{activeOrder.code}</strong> • Item: <strong className="text-slate-200">{activeOrder.itemCode} - {activeOrder.itemDescription}</strong>
          </p>
        </div>

        {/* Botões de Ação Rápida do Operador */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsProductionModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Apontar Peças Boas</span>
          </button>
          <button
            onClick={() => setIsScrapModalOpen(true)}
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-600/20"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Registrar Refugo</span>
          </button>
          <button
            onClick={() => setIsDowntimeModalOpen(true)}
            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2.5 rounded-xl transition ${
              isMachineRunning
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isMachineRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isMachineRunning ? 'Parar Máquina' : 'Retomar Linha'}</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas de OEE em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Card 1: OEE Global */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OEE Global</span>
            <Gauge className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-4xl font-extrabold ${oeeMetrics.oee >= selectedWorkCenter.oeeTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
              {oeeMetrics.oee}%
            </span>
            <span className="text-xs text-slate-400">Meta: {selectedWorkCenter.oeeTarget}%</span>
          </div>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${oeeMetrics.oee >= selectedWorkCenter.oeeTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, oeeMetrics.oee)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Disponibilidade */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disponibilidade (A)</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{oeeMetrics.availability}%</span>
            <span className="text-xs text-slate-400">({oeeMetrics.operatingTimeMinutes}m / {oeeMetrics.plannedTimeMinutes}m)</span>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Tempo Parado: <strong className="text-red-400">{oeeMetrics.downtimeMinutes} min</strong>
          </div>
        </div>

        {/* Card 3: Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance (P)</span>
            <Zap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{oeeMetrics.performance}%</span>
            <span className="text-xs text-slate-400">({selectedWorkCenter.nominalHourlyCapacity} pçs/h nominal)</span>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Produção Total: <strong className="text-blue-400">{oeeMetrics.actualProducedCount} peças</strong>
          </div>
        </div>

        {/* Card 4: Qualidade */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualidade (Q)</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{oeeMetrics.quality}%</span>
            <span className="text-xs text-slate-400">({oeeMetrics.goodPartsCount} boas / {oeeMetrics.scrapCount} refugo)</span>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Índice de Scrap: <strong className="text-amber-400">{(100 - oeeMetrics.quality).toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* Progresso da Ordem de Produção Ativa */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Progresso da Ordem: {activeOrder.code}</h3>
            <p className="text-xs text-slate-400">Iniciada às {activeOrder.startTime} • Operador Atual: <strong>{operatorBadge}</strong></p>
          </div>
          <span className="text-sm font-bold text-blue-400">
            {activeOrder.quantityProduced} de {activeOrder.quantityPlanned} peças ({((activeOrder.quantityProduced / activeOrder.quantityPlanned) * 100).toFixed(1)}%)
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (activeOrder.quantityProduced / activeOrder.quantityPlanned) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Modal 1: Apontamento de Produção Rápido */}
      {isProductionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center">
              <Plus className="w-4 h-4 text-emerald-400 mr-2" /> Apontar Peças Boas
            </h3>
            <form onSubmit={handleRecordProduction} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Quantidade Concluída *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={prodQty}
                  onChange={e => setProdQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold text-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Crachá/Matrícula do Operador *</label>
                <input
                  type="text"
                  required
                  value={operatorBadge}
                  onChange={e => setOperatorBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirmar Apontamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Registro de Refugo (Scrap) */}
      {isScrapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center text-amber-400">
              <AlertOctagon className="w-4 h-4 mr-2" /> Registrar Refugo / Scrap
            </h3>
            <form onSubmit={handleRecordScrap} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Quantidade Refugada *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={scrapQty}
                  onChange={e => setScrapQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold text-amber-300 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Categoria do Defeito *</label>
                <select
                  value={scrapCategory}
                  onChange={e => setScrapCategory(e.target.value as ScrapReasonCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="DEFEITO_DIMENSIONAL">Defeito Dimensional</option>
                  <option value="ACABAMENTO_SUPERFICIAL">Rugosidade / Acabamento</option>
                  <option value="TRINCA_MATERIAL">Trinca no Material</option>
                  <option value="AJUSTE_SETUP">Peça de Ajuste / Setup</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Descrição / Motivo</label>
                <input
                  type="text"
                  placeholder="Ex: Rebarba excessiva na rosca..."
                  value={scrapDesc}
                  onChange={e => setScrapDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScrapModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Registrar Scrap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Parada de Máquina / Downtime */}
      {isDowntimeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center text-red-400">
              <Pause className="w-4 h-4 mr-2" /> {isMachineRunning ? 'Apontar Parada de Linha' : 'Retomar Operação'}
            </h3>
            <form onSubmit={handleToggleDowntime} className="space-y-4 text-xs">
              {isMachineRunning && (
                <>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Motivo da Parada *</label>
                    <select
                      value={downtimeCategory}
                      onChange={e => setDowntimeCategory(e.target.value as DowntimeReasonCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    >
                      <option value="SETUP_FERRAMENTAL">Troca de Ferramental / Setup</option>
                      <option value="MANUTENCAO_MECANICA">Manutenção Mecânica Corretiva</option>
                      <option value="MANUTENCAO_ELETRICA">Manutenção Elétrica</option>
                      <option value="FALTA_MATERIAL">Falta de Matéria-Prima</option>
                      <option value="QUALIDADE_AJUSTE">Ajuste de Qualidade / Amostragem</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Observações da Causa</label>
                    <input
                      type="text"
                      placeholder="Detalhes adicionais da ocorrência..."
                      value={downtimeDesc}
                      onChange={e => setDowntimeDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDowntimeModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-bold text-white ${isMachineRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                >
                  {isMachineRunning ? 'Confirmar Parada' : 'Retomar Produção'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
