"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, HTMLAttributes, forwardRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "fixed inset-0 z-50 m-0 h-full w-full max-w-full max-h-full bg-transparent p-0 backdrop:bg-black/50",
        "md:m-auto md:h-auto md:max-h-[85vh] md:w-full md:max-w-lg md:rounded-2xl",
        className
      )}
    >
      <div className="flex h-full flex-col bg-background md:rounded-2xl">
        {children}
      </div>
    </dialog>
  );
}

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b border-border px-6 py-4",
        className
      )}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

export const DialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto p-6", className)}
      {...props}
    />
  )
);
DialogBody.displayName = "DialogBody";

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 border-t border-border px-6 py-4",
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";
