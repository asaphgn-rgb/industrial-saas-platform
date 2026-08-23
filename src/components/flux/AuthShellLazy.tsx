// Lazy-loaded bundle of non-critical authenticated shell widgets.
// Split out of _authenticated/route.tsx to shrink the initial post-login chunk.
// Loaded via React.lazy — first paint of the app skips these modules.

import { KeyboardShortcuts } from "@/components/flux/KeyboardShortcuts";
import { BackToTop } from "@/components/flux/BackToTop";
import { PrintFooter } from "@/components/flux/PrintButton";
import { ReadingProgress } from "@/components/flux/ReadingProgress";
import { ExportTableButton } from "@/components/flux/ExportTableButton";
import { AltClickCopy } from "@/components/flux/AltClickCopy";
import { PageMarks } from "@/components/flux/PageMarks";
import { PageMarksList } from "@/components/flux/PageMarksList";
import { PresentationMode } from "@/components/flux/PresentationMode";
import { Scratchpad } from "@/components/flux/Scratchpad";
import { TableFilter } from "@/components/flux/TableFilter";
import { ToolboxMenu } from "@/components/flux/ToolboxMenu";
import { FavoriteQuickJump } from "@/components/flux/FavoriteQuickJump";
import { FxAssistant } from "@/components/flux/FxAssistant";
import { ZenMode } from "@/components/flux/ZenMode";
import { DuplicateTabWarning } from "@/components/flux/DuplicateTabWarning";
import { WidgetErrorBoundary } from "@/components/flux/WidgetErrorBoundary";

// Topbar minimalista — engenharia SaaS sênior:
// mantém APENAS o essencial visível (busca, criar, notificações, tema, perfil
// já estão no shell). Widgets utilitários (relógio, ping, print, fullscreen,
// notas, screen-lock, zoom, calculadora, QR, acessibilidade, densidade, etc.)
// ficam agrupados dentro do ToolboxMenu — um único ícone.
function TopBarExtrasBefore() {
  return null;
}

// Único ponto de entrada para ferramentas avançadas: ToolboxMenu.
function TopBarExtrasAfter() {
  return (
    <div className="hidden md:contents">
      <WidgetErrorBoundary name="ToolboxMenu" compact>
        <ToolboxMenu />
      </WidgetErrorBoundary>
    </div>
  );
}

// Floating widgets rendered at the layout root (below sidebar/main).
function FloatingExtras() {
  return (
    <>
      <WidgetErrorBoundary name="ReadingProgress" compact>
        <ReadingProgress />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="KeyboardShortcuts" compact>
        <KeyboardShortcuts />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="BackToTop" compact>
        <BackToTop />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="ExportTableButton" compact>
        <ExportTableButton />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="AltClickCopy" compact>
        <AltClickCopy />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="PageMarks" compact>
        <PageMarks />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="PageMarksList" compact>
        <PageMarksList />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="PresentationMode" compact>
        <PresentationMode />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="Scratchpad" compact>
        <Scratchpad />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="TableFilter" compact>
        <TableFilter />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="FavoriteQuickJump" compact>
        <FavoriteQuickJump />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="DuplicateTabWarning" compact>
        <DuplicateTabWarning />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="ZenMode" compact>
        <ZenMode />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="PrintFooter" compact>
        <PrintFooter />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary name="FxAssistant" compact>
        <FxAssistant />
      </WidgetErrorBoundary>
    </>
  );
}

export { TopBarExtrasBefore, TopBarExtrasAfter, FloatingExtras };
export default { TopBarExtrasBefore, TopBarExtrasAfter, FloatingExtras };
