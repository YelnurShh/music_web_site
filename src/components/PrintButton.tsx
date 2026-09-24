"use client";

/** PrintButton — бетті басып шығару (мәзір мен батырмалар шықпайды) */
export function PrintButton({ label = "🖨️ Басып шығару" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-sm btn-ghost" onClick={() => window.print()}>
      {label}
    </button>
  );
}
