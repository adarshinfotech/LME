"use client";

import { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions: React.ReactNode;
};

/** Accessible dialog built on the native <dialog> element (focus trap + Esc for free). */
export function Modal({ open, title, children, onClose, actions }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] bg-sand p-0 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <h2 id="modal-title" className="font-display text-2xl">
          {title}
        </h2>
        <div className="mt-3 leading-relaxed text-muted">{children}</div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{actions}</div>
      </div>
    </dialog>
  );
}
