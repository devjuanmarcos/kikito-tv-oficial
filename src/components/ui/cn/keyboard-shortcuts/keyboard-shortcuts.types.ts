export interface ShortcutEntry {
  label: string;
  keys: string[];
}

export interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutEntry[];
}

export interface KeyboardShortcutsProps {
  groups: ShortcutGroup[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}
