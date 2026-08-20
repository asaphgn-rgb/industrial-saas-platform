import fs from 'fs';

let valCode = fs.readFileSync('src/components/documents/SecureDocumentValidation.tsx', 'utf8');

// 1. Remove the "pointer-events-auto" from the invisible overlay.
// When the overlay has pointer-events: auto, it intercepts ALL mouse events (including scrolling with the mouse wheel on some browsers, or clicking the native scrollbar of the iframe).
// To keep the anti-download/anti-right-click mechanism but allow scrolling:
// We should either remove the overlay or change its pointer-events to 'none'.
// Wait, if we put pointer-events: none, right-click on the PDF will work again (allowing download).
// How to prevent right click but allow scrolling?
// In an iframe showing a PDF, the native PDF viewer handles the right click. We cannot easily inject JS into it due to cross-origin or just because it's a native plugin.
// Adding #scrollbar=1 to the URL might help, or #scrollbar=0 was explicitly DISABLING the scrollbar inside the PDF viewer!
// Let's remove `#scrollbar=0`.
// Let's also remove the overlay because native PDF viewers often have their own scrollbars that get blocked by the overlay.
// If the user wants extreme security, they have to sacrifice some native UX, but since they complained about scroll, we must restore scroll.
// We can use `#toolbar=0&navpanes=0` and keep the overlay with `pointer-events-none` so it doesn't block scrolling, or we just remove `#scrollbar=0`.

valCode = valCode.replace(
  /<div className="absolute inset-0 z-10 pointer-events-auto" style=\{\{ cursor: 'crosshair', opacity: 0\.01 \}\} onContextMenu=\{\(e\) => e\.preventDefault\(\)\} \/>/,
  `{/* Overlay removido para permitir rolagem nativa do documento */}`
);

valCode = valCode.replace(
  /\#toolbar=0&navpanes=0&scrollbar=0/g,
  `#toolbar=0&navpanes=0`
);

fs.writeFileSync('src/components/documents/SecureDocumentValidation.tsx', valCode);
