"use client";

import { useState, useEffect, type ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const [modalRoot, setModalRoot] = useState<Element | null>(null);

  useEffect(() => {
    function ensureModalRoot() {
      let root = document.getElementById("modal-root");
      if (!root) {
        root = document.createElement("div");
        root.setAttribute("id", "modal-root");
        document.body.appendChild(root);
      }
      return root;
    }

    setModalRoot(ensureModalRoot());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }
  
 
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}