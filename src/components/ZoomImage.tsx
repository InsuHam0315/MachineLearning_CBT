"use client";
import { useEffect, useState } from "react";

export default function ZoomImage({ src, alt, maxWidth }: { src: string; alt: string; maxWidth?: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <img
        src={src} alt={alt} loading="lazy" onClick={() => setOpen(true)}
        className="zoomable"
        style={{ width: "100%", maxWidth: maxWidth || 560, borderRadius: 8 }}
      />
      {open ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button className="lightbox-close" aria-label="닫기" onClick={() => setOpen(false)}>✕</button>
          <img src={src} alt={alt} className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      ) : null}
    </>
  );
}
