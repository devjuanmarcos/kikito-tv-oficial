"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmKeyword?: string;
  confirmPlaceholder?: string;
  cancelText?: string;
  confirmText?: string;
  pendingText?: string;
  isPending?: boolean;
  onConfirm: () => Promise<void> | void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmKeyword = "deletar",
  confirmPlaceholder,
  cancelText = "Cancelar",
  confirmText = "Deletar",
  pendingText = "Deletando...",
  isPending = false,
  onConfirm,
}: Readonly<DeleteConfirmDialogProps>) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setValue("");
    }
  }, [open]);

  const canConfirm = value.trim().toLowerCase() === confirmKeyword.trim().toLowerCase();

  async function handleConfirm() {
    if (!canConfirm || isPending) return;
    await onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Digite <b>{confirmKeyword}</b> para confirmar.
          </span>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={confirmPlaceholder ?? confirmKeyword}
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!canConfirm || isPending}>
            {isPending ? pendingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
