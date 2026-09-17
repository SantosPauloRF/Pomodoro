import { useRef, type PointerEvent } from "react";
import { COPY } from "./constants/copy";
import { isTauri, restaurarPrincipal } from "./overlay/tauriOverlay";

const LIMIAR_ARRASTO_PX = 6;

export default function FloatApp() {
  const origem = useRef<{ x: number; y: number } | null>(null);
  const arrastou = useRef(false);

  function onPointerDown(evento: PointerEvent<HTMLButtonElement>) {
    origem.current = { x: evento.clientX, y: evento.clientY };
    arrastou.current = false;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  async function onPointerMove(evento: PointerEvent<HTMLButtonElement>) {
    if (!origem.current || arrastou.current) {
      return;
    }
    const dx = evento.clientX - origem.current.x;
    const dy = evento.clientY - origem.current.y;
    if (dx * dx + dy * dy < LIMIAR_ARRASTO_PX * LIMIAR_ARRASTO_PX) {
      return;
    }
    arrastou.current = true;
    if (!isTauri()) {
      return;
    }
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    await getCurrentWindow().startDragging();
  }

  function onPointerUp() {
    const clique = origem.current != null && !arrastou.current;
    origem.current = null;
    if (clique) {
      void restaurarPrincipal();
    }
  }

  return (
    <button
      type="button"
      className="icone-flutuante"
      aria-label={COPY.iconeFlutuante}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      P
    </button>
  );
}
