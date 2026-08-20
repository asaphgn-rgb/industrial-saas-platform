import { supabase } from '../lib/supabase';
import { AuditTrailService } from './audit-trail.service';
import type { Database } from '../types/database.types';
import type {
  ProductionEntry,
  ScrapEntry,
  DowntimeEntry,
  OeeMetrics,
} from '../types/industrial-mes.types';

type ProductionOrderRow = Database['public']['Tables']['production_orders']['Row'];
type WorkCenterRow = Database['public']['Tables']['industrial_work_centers']['Row'];

export class IndustrialMesService {
  /**
   * 1. Cálculo Determinístico de OEE (Padrão ISA-95)
   */
  static calculateOeeMetrics(params: {
    plannedMinutes: number;
    downtimeMinutes: number;
    nominalHourlyCapacity: number;
    goodParts: number;
    scrapParts: number;
  }): OeeMetrics {
    const { plannedMinutes, downtimeMinutes, nominalHourlyCapacity, goodParts, scrapParts } = params;

    // Tempo Operacional (Operating Time)
    const operatingMinutes = Math.max(0, plannedMinutes - downtimeMinutes);

    // 1. Disponibilidade = (Tempo Operacional / Tempo Planejado) * 100
    const availability = plannedMinutes > 0 ? (operatingMinutes / plannedMinutes) * 100 : 0;

    // 2. Peças Totais Produzidas = Boas + Refugo
    const totalPartsProduced = goodParts + scrapParts;

    // Capacidade esperada no tempo operacional = (Capacidade Horária / 60) * operatingMinutes
    const expectedPartsInOperatingTime =
      nominalHourlyCapacity > 0 ? (nominalHourlyCapacity / 60) * operatingMinutes : 0;

    // Performance = (Peças Totais Produzidas / Peças Esperadas) * 100
    const performance =
      expectedPartsInOperatingTime > 0
        ? Math.min(100, (totalPartsProduced / expectedPartsInOperatingTime) * 100)
        : 0;

    // 3. Qualidade = (Peças Boas / Peças Totais) * 100
    const quality = totalPartsProduced > 0 ? (goodParts / totalPartsProduced) * 100 : 100;

    // 4. OEE Global = (A% * P% * Q%) / 10.000
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

    return {
      availability: Number(availability.toFixed(2)),
      performance: Number(performance.toFixed(2)),
      quality: Number(quality.toFixed(2)),
      oee: Number(oee.toFixed(2)),
      plannedTimeMinutes: plannedMinutes,
      operatingTimeMinutes: operatingMinutes,
      downtimeMinutes,
      targetHourlyCapacity: nominalHourlyCapacity,
      actualProducedCount: totalPartsProduced,
      scrapCount: scrapParts,
      goodPartsCount: goodParts,
    };
  }

  /**
   * 2. Apontamento de Peças Boas na Ordem de Produção
   */
  static async recordProduction(entry: ProductionEntry): Promise<ProductionOrderRow> {
    const { data: order, error: fetchError } = await supabase
      .from('production_orders')
      .select('*')
      .eq('id', entry.productionOrderId)
      .single();

    if (fetchError || !order) {
      throw new Error(`Ordem de produção não encontrada: ${fetchError?.message}`);
    }

    const newProducedQuantity = (((order as unknown) as any).produced_quantity || 0) + entry.quantityProduced;
    const isCompleted = newProducedQuantity >= ((order as unknown) as any).planned_quantity;

    const { data: updatedOrder, error: updateError } = await supabase
      .from('production_orders')
      .update({ /* @ts-ignore */ 
        /* @ts-ignore */
produced_quantity: newProducedQuantity,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', entry.productionOrderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      throw new Error(`Falha ao registrar apontamento: ${updateError?.message}`);
    }

    const row = updatedOrder as unknown as ProductionOrderRow;

    // Trilha de Auditoria
    await AuditTrailService.logEvent({
      tenantId: entry.tenantId,
      unitId: entry.unitId,
      tableName: 'production_orders',
      recordId: row.id,
      action: 'UPDATE',
      oldData: order as any,
      newData: row as any,
      reason: `Apontamento de ${entry.quantityProduced} peças boas pelo operador ${entry.operatorBadge}`,
    } as never);

    return row;
  }

  /**
   * 3. Registro de Refugo (Scrap)
   */
  static async recordScrap(entry: ScrapEntry): Promise<ProductionOrderRow> {
    const { data: order, error: fetchError } = await supabase
      .from('production_orders')
      .select('*')
      .eq('id', entry.productionOrderId)
      .single();

    if (fetchError || !order) {
      throw new Error(`Ordem de produção não encontrada: ${fetchError?.message}`);
    }

    const newScrapQuantity = (((order as unknown) as any).scrap_quantity || 0) + entry.quantityScrap;

    const { data: updatedOrder, error: updateError } = await supabase
      .from('production_orders')
      .update({ /* @ts-ignore */ 
        /* @ts-ignore */
scrap_quantity: newScrapQuantity,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', entry.productionOrderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      throw new Error(`Falha ao registrar refugo: ${updateError?.message}`);
    }

    const row = updatedOrder as unknown as ProductionOrderRow;

    // Trilha de Auditoria
    await AuditTrailService.logEvent({
      tenantId: entry.tenantId,
      unitId: entry.unitId,
      tableName: 'production_orders',
      recordId: row.id,
      action: 'UPDATE',
      oldData: order as any,
      newData: row as any,
      reason: `Refugo de ${entry.quantityScrap} peças (${entry.reasonCategory} as never) - ${entry.description}`,
    });

    return row;
  }
}
