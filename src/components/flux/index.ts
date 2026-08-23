/**
 * Barrel export dos primitivos visuais FLUX.
 *
 * Regra: toda página nova consome estes componentes daqui — não
 * copiar/adaptar HTML/CSS ad-hoc. Isso garante identidade visual única.
 */
export { PageHeader } from "./PageHeader";
export { KpiCard, KpiCardSkeleton } from "./KpiCard";
export type { KpiCardProps, KpiTone } from "./KpiCard";
export { DataTable } from "./DataTable";
export type { DataTableColumn, DataTableProps } from "./DataTable";
export {
  ResponsiveDataTable,
  COLUMN_MIN,
  type ResponsiveColumn,
  type ColumnAlign,
} from "./ResponsiveDataTable";
export { ResponsiveTableWrapper } from "./ResponsiveTableWrapper";
export {
  TableInspectToggle,
  useTableInspect,
  auditTableAlignment,
} from "./TableInspector";
export { TableActionsMenu, type RowAction } from "./TableActionsMenu";
export { StatusBadge, type StatusTone } from "./StatusBadge";
export { EmptyState } from "./EmptyState";
export { LoadingState } from "./LoadingState";
export { PermissionDenied } from "./PermissionDenied";

/* --- Camada de design system global (§2 do padrão visual) --- */
export {
  DashboardPage,
  DashboardSection,
  DashboardGrid,
  SectionHeader,
} from "./DashboardGrid";
export { ChartCard } from "./ChartCard";
export {
  FinancialKpiCard,
  OperationalKpiCard,
  AlertKpiCard,
  MetricCard,
  StatCard,
  toneFromVariant,
  type KpiVariant,
} from "./KpiCardVariants";
export {
  MoneyValue,
  PercentValue,
  formatBRL,
  formatBRLCompact,
  type MoneyValueProps,
} from "./MoneyValue";
export { TrendIndicator } from "./TrendIndicator";
export { SeverityBadge, IconBadge, type Severity } from "./SeverityBadge";
export {
  ErrorState,
  NoDataState,
  PartialDataState,
  OfflineState,
  SyncPendingState,
} from "./ErrorState";
export { TextClamp, TooltipText } from "./TextClamp";
export {
  auditVisualQuality,
  summarizeVisualIssues,
  type VisualIssue,
} from "@/lib/visual-quality";
