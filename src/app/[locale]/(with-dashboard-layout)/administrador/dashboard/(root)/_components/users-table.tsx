"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Clock,
  Mail,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type UserStatus = "ativo" | "pendente" | "bloqueado" | "inativo";
export type UserRole = "admin" | "membro" | "moderador";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  /** Tag opcional exibida como badge ao lado do nome (ex: "Novo", "Verificado") */
  tag?: "novo" | "verificado" | "premium";
}

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "muted" }
> = {
  ativo: { label: "Ativo", icon: CheckCircle2, variant: "success" },
  pendente: { label: "Pendente", icon: Clock, variant: "secondary" },
  bloqueado: { label: "Bloqueado", icon: XCircle, variant: "destructive" },
  inativo: { label: "Inativo", icon: XCircle, variant: "muted" },
};

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  admin: { label: "Admin", icon: ShieldCheck },
  moderador: { label: "Moderador", icon: Shield },
  membro: { label: "Membro", icon: User },
};

const TAG_CONFIG: Record<
  NonNullable<UserRow["tag"]>,
  { label: string; variant: "info" | "success" | "warning" }
> = {
  novo: { label: "Novo", variant: "info" },
  verificado: { label: "Verificado", variant: "success" },
  premium: { label: "Premium", variant: "warning" },
};

const MOCK_USERS: UserRow[] = [
  { id: "1", name: "Maria Silva", email: "maria.silva@email.com", status: "ativo", role: "admin", createdAt: new Date("2025-01-15"), tag: "verificado" },
  { id: "2", name: "João Santos", email: "joao.santos@email.com", status: "pendente", role: "membro", createdAt: new Date("2026-01-28"), tag: "novo" },
  { id: "3", name: "Ana Oliveira", email: "ana.oliveira@email.com", status: "ativo", role: "moderador", createdAt: new Date("2025-06-10") },
  { id: "4", name: "Pedro Costa", email: "pedro.costa@email.com", status: "bloqueado", role: "membro", createdAt: new Date("2024-11-20") },
  { id: "5", name: "Carla Ferreira", email: "carla.ferreira@email.com", status: "ativo", role: "membro", createdAt: new Date("2026-01-10"), tag: "premium" },
  { id: "6", name: "Lucas Martins", email: "lucas.martins@email.com", status: "inativo", role: "membro", createdAt: new Date("2024-08-05") },
  { id: "7", name: "Fernanda Lima", email: "fernanda.lima@email.com", status: "ativo", role: "moderador", createdAt: new Date("2025-03-22"), tag: "verificado" },
  { id: "8", name: "Ricardo Alves", email: "ricardo.alves@email.com", status: "pendente", role: "membro", createdAt: new Date("2026-01-25"), tag: "novo" },
  { id: "9", name: "Juliana Rocha", email: "juliana.rocha@email.com", status: "ativo", role: "admin", createdAt: new Date("2025-01-02") },
  { id: "10", name: "Marcos Souza", email: "marcos.souza@email.com", status: "ativo", role: "membro", createdAt: new Date("2025-09-14") },
  { id: "11", name: "Patricia Mendes", email: "patricia.mendes@email.com", status: "pendente", role: "membro", createdAt: new Date("2026-01-20") },
  { id: "12", name: "Roberto Dias", email: "roberto.dias@email.com", status: "bloqueado", role: "membro", createdAt: new Date("2024-12-01") },
  { id: "13", name: "Camila Nascimento", email: "camila.nascimento@email.com", status: "ativo", role: "membro", createdAt: new Date("2025-07-08"), tag: "verificado" },
  { id: "14", name: "Bruno Carvalho", email: "bruno.carvalho@email.com", status: "inativo", role: "moderador", createdAt: new Date("2024-05-30") },
  { id: "15", name: "Amanda Ribeiro", email: "amanda.ribeiro@email.com", status: "ativo", role: "membro", createdAt: new Date("2026-01-05"), tag: "novo" },
];

const statusOptions: { value: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = Object.entries(
  STATUS_CONFIG
).map(([value, { label, icon }]) => ({ value, label, icon: icon as React.FC<React.SVGProps<SVGSVGElement>> }));

const roleOptions: { value: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = Object.entries(
  ROLE_CONFIG
).map(([value, { label, icon }]) => ({ value, label, icon: icon as React.FC<React.SVGProps<SVGSVGElement>> }));

export function UsersTable() {
  const [data] = React.useState<UserRow[]>(MOCK_USERS);

  const columns = React.useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Selecionar todos"
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Selecionar linha"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Nome" />,
        cell: ({ row }) => {
          const tag = row.original.tag;
          const tagConfig = tag ? TAG_CONFIG[tag] : null;
          return (
            <div className="flex flex-wrap items-center gap-2">
              {tagConfig && (
                <Badge variant={tagConfig.variant} className="text-xs">
                  {tagConfig.label}
                </Badge>
              )}
              <span className="font-medium">{row.original.name}</span>
            </div>
          );
        },
        meta: {
          label: "Nome",
          placeholder: "Buscar por nome...",
          variant: "text",
          icon: User,
        },
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            {row.original.email}
          </div>
        ),
        meta: {
          label: "Email",
          placeholder: "Buscar por email...",
          variant: "text",
          icon: Mail,
        },
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
        cell: ({ row }) => {
          const status = row.original.status;
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <Badge variant={config.variant} className="gap-1.5 font-normal">
              <Icon className="size-3.5" />
              {config.label}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptions,
        },
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Função" />,
        cell: ({ row }) => {
          const role = row.original.role;
          const config = ROLE_CONFIG[role];
          const Icon = config.icon;
          return (
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Icon className="size-3.5" />
              {config.label}
            </Badge>
          );
        },
        meta: {
          label: "Função",
          variant: "multiSelect",
          options: roleOptions,
        },
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Cadastro" />,
        cell: ({ row }) =>
          format(row.original.createdAt, "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
        meta: {
          label: "Cadastro",
        },
        enableColumnFilter: false,
        sortingFn: "datetime",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 48,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  return (
    <DataTable table={table} className="w-full">
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
