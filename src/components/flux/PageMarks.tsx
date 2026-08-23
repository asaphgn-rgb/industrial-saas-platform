import { useEffect, useRef } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "flux:page-marks";

type Mark = { url: string; scroll: number; savedAt: number };
type Marks = Record<string, Mark>;

/**
 * Vim-style page marks. Press `m` then any letter (a–z) to bookmark
 * the current URL + scroll position under that letter. Press `'` (apos­
 * trophe) then the same letter to jump back — same tab, restored
 * scroll. Marks are per-browser and persist in localStorage, so a
 * "controller" set of pages (m d = DRE, m e = estoque, m p = PCP) is
 * always one keystroke away.
 *
 * Skips typing contexts (inputs/textareas/contenteditable) so it never
 * hijacks normal writing.
 */
export function PageMarks() {
  // Tracks whether we're waiting for the second key ("m<letter>" or "'<letter>").
  const pending = useRef<"set" | "jump" | null>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function clearPending() {
      pending.current = null;
      if (pendingTimeout.current) {
        clearTimeout(pendingTimeout.current);
        pendingTimeout.current = null;
      }
    }

    function armPending(mode: "set" | "jump") {
      pending.current = mode;
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      // Give the operator ~1.5s to complete the second key.
      pendingTimeout.current = setTimeout(clearPending, 1500);
    }

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (pending.current) {
        const key = e.key.toLowerCase();
        if (/^[a-z]$/.test(key)) {
          e.preventDefault();
          if (pending.current === "set") saveMark(key);
          else jumpMark(key);
        }
        clearPending();
        return;
      }

      if (e.key === "m") {
        e.preventDefault();
        armPending("set");
      } else if (e.key === "'") {
        e.preventDefault();
        armPending("jump");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    };
  }, []);

  return null;
}

function readMarks(): Marks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Marks) : {};
  } catch {
    return {};
  }
}

function writeMarks(marks: Marks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
  } catch {
    /* storage disabled — ignore */
  }
}

function saveMark(letter: string) {
  const marks = readMarks();
  marks[letter] = {
    url: window.location.pathname + window.location.search + window.location.hash,
    scroll: window.scrollY,
    savedAt: Date.now(),
  };
  writeMarks(marks);
  toast.success(`Marcador "${letter}" salvo`, {
    description: window.location.pathname,
  });
}

function jumpMark(letter: string) {
  const marks = readMarks();
  const mark = marks[letter];
  if (!mark) {
    toast.error(`Marcador "${letter}" não existe`, {
      description: "Use m + letra para salvar o atual",
    });
    return;
  }
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (current === mark.url) {
    window.scrollTo({ top: mark.scroll, behavior: "smooth" });
    return;
  }
  // Navigate first, then restore scroll after next paint.
  const target = mark.url;
  const scroll = mark.scroll;
  sessionStorage.setItem("flux:page-marks:pending-scroll", String(scroll));
  window.history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
  // Fallback: attempt scroll after route change likely completed.
  setTimeout(() => window.scrollTo({ top: scroll }), 400);
  toast.message(`Marcador "${letter}"`, { description: target });
}
