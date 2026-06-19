export interface CommandItem {
  id:           string
  label:        string
  description?: string
  icon?:        React.ReactNode
  shortcut?:    string
  onSelect:     () => void
  keywords?:    string[]
  disabled?:    boolean
}

export interface CommandGroup {
  heading?: string
  items:    CommandItem[]
}

export interface CommandProps {
  groups:         CommandGroup[]
  placeholder?:   string
  open?:          boolean
  defaultOpen?:   boolean
  onOpenChange?:  (open: boolean) => void
  keybinding?:    string
  emptyMessage?:  string
}
