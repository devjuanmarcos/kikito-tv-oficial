# Guia Avançado: Criação de Tabelas (Data Table)

Este documento ensina a usar o sistema de tabelas do projeto: desde o fluxo mínimo (dados + colunas + `useReactTable` + `DataTable`/Toolbar) até filtros por URL, ordenação múltipla, pinning de colunas, skeleton e referência de todos os subcomponentes.

## Índice

- [Visão geral e arquitetura](#visão-geral-e-arquitetura)
- [Fluxo mínimo para uma tabela](#fluxo-mínimo-para-uma-tabela)
- [Definição de colunas em profundidade](#definição-de-colunas-em-profundidade)
- [Filtros na toolbar](#filtros-na-toolbar-datatabletoolbar)
- [Catálogo dos componentes do data-table](#catálogo-dos-componentes-do-data-table)
- [Recursos avançados](#recursos-avançados)
- [Skeleton e estados de loading](#skeleton-e-estados-de-loading)
- [Tipos e configuração](#tipos-e-configuração)
- [Exemplo completo comentado](#exemplo-completo-comentado)
- [Boas práticas e referências](#boas-práticas-e-referências)

---

## Visão geral e arquitetura

O sistema de tabelas combina:

- **TanStack React Table** (`@tanstack/react-table`): modelo de dados, ordenação, filtros, paginação e estado.
- **Componentes UI** do projeto: `Table`, `Button`, `Checkbox`, `Popover`, `Command`, `Select`, `Input`, `Calendar`, `Slider`, etc.
- **Componentes específicos** em `@/components/data-table`: `DataTable`, `DataTableToolbar`, `DataTableColumnHeader`, `DataTablePagination`, filtros (faceted, date, range, slider), `DataTableFilterList`, `DataTableFilterMenu`, `DataTableSortList`, `DataTableViewOptions`, `DataTableSkeleton`.
- **Tipos e config**: `@/@types/data-table` (estende `ColumnMeta` e `TableMeta` do TanStack) e `@/config/data-table` (operadores, variantes de filtro, join operators).

Fluxo de dados e UI:

```mermaid
flowchart LR
  subgraph dados [Dados]
    Data[TData[]]
  end
  subgraph def [Definição]
    Cols[ColumnDef]
  end
  subgraph table [TanStack Table]
    useReactTable[useReactTable]
  end
  subgraph ui [UI]
    DataTable[DataTable]
    Toolbar[DataTableToolbar]
    Pagination[DataTablePagination]
  end
  Data --> useReactTable
  Cols --> useReactTable
  useReactTable --> DataTable
  DataTable --> Toolbar
  DataTable --> Pagination
```

Arquivos principais:

| Papel | Caminho |
|-------|--------|
| Container da tabela | `src/components/data-table/data-table.tsx` |
| Toolbar com filtros por coluna | `src/components/data-table/data-table-toolbar.tsx` |
| Header com sort/hide | `src/components/data-table/data-table-column-header.tsx` |
| Paginação | `src/components/data-table/data-table-pagination.tsx` |
| Tipos estendidos | `src/@types/data-table.ts` |
| Config (operadores, variantes) | `src/config/data-table.ts` |
| Helpers (pinning, operadores) | `src/lib/data-table.ts` |

---

## Fluxo mínimo para uma tabela

Siga estes passos para montar uma tabela funcional.

### 1. Definir o tipo da linha

Crie uma interface que representa uma linha (ex.: `UserRow`).

```ts
export interface UserRow {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "pendente" | "bloqueado" | "inativo";
  role: "admin" | "membro" | "moderador";
  createdAt: Date;
}
```

### 2. Definir as colunas

Use `ColumnDef<TData>[]`. Para cabeçalhos com ordenação e ocultar coluna, use `DataTableColumnHeader`.

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columns: ColumnDef<UserRow>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Nome" />,
    cell: ({ row }) => row.original.name,
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
    cell: ({ row }) => row.original.email,
  },
];
```

### 3. Criar a instância da tabela

Use `useReactTable` com os row models necessários e um `getRowId` estável (recomendado quando há `id`).

```tsx
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
  },
});
```

### 4. Renderizar DataTable e Toolbar

O `DataTable` recebe a instância da tabela; o toolbar é um filho que adiciona filtros e “View options”.

```tsx
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

return (
  <DataTable table={table} className="w-full">
    <DataTableToolbar table={table} />
  </DataTable>
);
```

Exemplo completo de referência: [users-table.tsx](../src/app/[locale]/(with-dashboard-layout)/administrador/dashboard/(root)/_components/users-table.tsx).

---

## Definição de colunas em profundidade

### id e accessorKey

- **id**: identificador da coluna (obrigatório para colunas sem `accessorKey`, ex.: `select`, `actions`).
- **accessorKey**: chave no objeto da linha para acesso automático ao valor e para filtros/ordenação.

### header

- Pode ser string ou função que retorna React node.
- Para sort e “ocultar coluna”, use `DataTableColumnHeader`:

```tsx
header: ({ column }) => <DataTableColumnHeader column={column} label="Nome" />,
```

### cell

- Função `({ row }) => ReactNode`. Use `row.original` para acessar a linha tipada.
- Exemplos: Badge por status, ícone + texto, data formatada com `date-fns`:

```tsx
cell: ({ row }) =>
  format(row.original.createdAt, "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
```

### Meta da coluna (ColumnMeta)

O projeto estende `ColumnMeta` em [src/@types/data-table.ts](../src/@types/data-table.ts). Use `meta` na definição da coluna para:

| Propriedade | Uso |
|-------------|-----|
| `label` | Nome exibido no header, View options e filtros |
| `placeholder` | Placeholder em inputs de filtro (text, number, etc.) |
| `variant` | Tipo de filtro na toolbar: `text`, `number`, `range`, `date`, `dateRange`, `boolean`, `select`, `multiSelect` |
| `options` | Lista `{ value, label, icon?, count? }` para `select` / `multiSelect` |
| `range` | `[min, max]` para filtros numéricos/range/slider |
| `unit` | Sufixo (ex.: "kg", "anos") em filtros numéricos/slider |
| `icon` | Ícone (ex.: Lucide) usado em filtros e em algumas UIs |

Exemplo:

```tsx
{
  id: "status",
  accessorKey: "status",
  header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
  cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  meta: {
    label: "Status",
    variant: "multiSelect",
    options: [
      { value: "ativo", label: "Ativo" },
      { value: "pendente", label: "Pendente" },
    ],
  },
  enableColumnFilter: true,
  filterFn: "includesString",
}
```

### Flags e tamanho

- **enableSorting** (default true): permite ordenar pelo header.
- **enableHiding**: permite ocultar coluna no View options (ex.: colunas de ação costumam ter `enableHiding: false`).
- **enableColumnFilter**: quando `true`, o `DataTableToolbar` mostra um filtro para essa coluna, baseado em `meta.variant`.
- **size**: largura em pixels (ex.: `40` para checkbox, `48` para coluna de ações).

### filterFn e sortingFn

- **filterFn**: ex.: `"includesString"` para busca por substring (texto). O TanStack oferece outros built-ins; filtros avançados (FilterList/FilterMenu) usam operadores da config.
- **sortingFn**: ex.: `"datetime"` para datas; default é comparação alfanumérica.

---

## Filtros na toolbar (DataTableToolbar)

O `DataTableToolbar` percorre as colunas com `enableColumnFilter` e renderiza um controle por coluna conforme `meta.variant`. As variantes vêm de [config/data-table.ts](../src/config/data-table.ts) (`filterVariants`).

### Variantes e o que colocar em meta

| variant | Uso | Meta recomendada |
|--------|-----|--------------------|
| `text` | Input de texto (busca) | `label`, `placeholder`, `icon` (opcional) |
| `number` | Input numérico | `label`, `placeholder`, `unit` (opcional) |
| `range` | Slider min/max | `label`, `range: [min, max]`, `unit` (opcional) |
| `date` | Um único dia | `label` |
| `dateRange` | Intervalo de datas | `label` |
| `boolean` | Sim/Não | `label` |
| `select` | Uma opção | `label`, `options: Option[]` |
| `multiSelect` | Várias opções | `label`, `options: Option[]` |

`Option` em [src/@types/data-table.ts](../src/@types/data-table.ts):

```ts
interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
```

Exemplo para status e função (multiSelect):

```tsx
const statusOptions = [
  { value: "ativo", label: "Ativo", icon: CheckCircle2 },
  { value: "pendente", label: "Pendente", icon: Clock },
];

// Na coluna:
meta: {
  label: "Status",
  variant: "multiSelect",
  options: statusOptions,
},
enableColumnFilter: true,
filterFn: "includesString",
```

Quando há filtros ativos, o toolbar exibe um botão “Reset” que chama `table.resetColumnFilters()`.

---

## Catálogo dos componentes do data-table

### DataTable

- **Arquivo**: [data-table.tsx](../src/components/data-table/data-table.tsx)
- **Props**: `table`, `actionBar?` (ReactNode exibido quando há linhas selecionadas), `insideCard?` (default `true`: considera padding do card no cálculo de largura máxima).
- **Conteúdo**: Renderiza filhos (ex.: toolbar), a tabela (header + body), `DataTablePagination` e, se existir, `actionBar` quando `getFilteredSelectedRowModel().rows.length > 0`.
- Use `insideCard={true}` quando a tabela estiver dentro de `TableCard`/`BaseCard`.

### DataTableToolbar

- **Arquivo**: [data-table-toolbar.tsx](../src/components/data-table/data-table-toolbar.tsx)
- **Props**: `table`, `children?`, `className`, etc.
- **Comportamento**: Para cada coluna com `getCanFilter()`, renderiza um controle conforme `meta.variant` (Input texto/número, `DataTableDateFilter`, `DataTableFacetedFilter`, `DataTableSliderFilter`). Inclui botão “Reset” quando há filtros e, à direita, `children` e `DataTableViewOptions`.

### DataTableAdvancedToolbar

- **Arquivo**: [data-table-advanced-toolbar.tsx](../src/components/data-table/data-table-advanced-toolbar.tsx)
- **Uso**: Layout com área flex para filhos à esquerda e `DataTableViewOptions` à direita. Não renderiza filtros por coluna; use quando quiser apenas View options e conteúdo customizado (ex.: FilterList, SortList, botões).

### DataTableColumnHeader

- **Arquivo**: [data-table-column-header.tsx](../src/components/data-table/data-table-column-header.tsx)
- **Props**: `column`, `label`.
- **Comportamento**: Se a coluna pode ordenar ou ocultar, mostra um dropdown com “Asc”, “Desc”, “Reset” e “Hide”; caso contrário, só o `label`.

### DataTablePagination

- **Arquivo**: [data-table-pagination.tsx](../src/components/data-table/data-table-pagination.tsx)
- **Props**: `table`, `pageSizeOptions?` (default `[10, 20, 30, 40, 50]`).
- **Comportamento**: “X of Y row(s) selected”, select de linhas por página, “Page N of M” e botões primeira/anterior/próxima/última página.

### DataTableViewOptions

- **Arquivo**: [data-table-view-options.tsx](../src/components/data-table/data-table-view-options.tsx)
- **Comportamento**: Popover “View” com lista de colunas que têm `accessorFn` e `getCanHide()`; checkbox para mostrar/ocultar cada coluna.

### Filtros usados pelo toolbar (ou custom)

- **DataTableFacetedFilter**: [data-table-faceted-filter.tsx](../src/components/data-table/data-table-faceted-filter.tsx) — select/multiSelect com Command e badges.
- **DataTableDateFilter**: [data-table-date-filter.tsx](../src/components/data-table/data-table-date-filter.tsx) — data única ou intervalo (Calendar).
- **DataTableSliderFilter**: [data-table-slider-filter.tsx](../src/components/data-table/data-table-slider-filter.tsx) — range numérico com slider e inputs min/max.
- **DataTableRangeFilter**: [data-table-range-filter.tsx](../src/components/data-table/data-table-range-filter.tsx) — dois inputs numéricos (min/max); usado internamente no FilterList/FilterMenu para operador “isBetween”.

### DataTableFilterList e DataTableFilterMenu

- **FilterList**: [data-table-filter-list.tsx](../src/components/data-table/data-table-filter-list.tsx) — lista de filtros em popover, com campo + operador + valor, ordenável (drag), persistido na **URL** via `nuqs` e `getFiltersStateParser` ([lib/parsers.ts](../src/lib/parsers.ts)). Atalho: Ctrl+Shift+F.
- **FilterMenu**: [data-table-filter-menu.tsx](../src/components/data-table/data-table-filter-menu.tsx) — filtros como “pills” na toolbar + comando para adicionar (campo → valor), também em URL.
- **Quando usar**: Listagens avançadas em que filtros devem ser compartilháveis/bookmarkáveis via query params. A tabela do dashboard de usuários usa apenas filtros por coluna (DataTableToolbar), não URL.
- **Query keys**: Se precisar de chaves de URL por tabela, use `table.options.meta?.queryKeys` (ex.: `queryKeys.filters`) e passe o mesmo em `useQueryState`; os parsers validam pelos IDs das colunas.

### DataTableSortList

- **Arquivo**: [data-table-sort-list.tsx](../src/components/data-table/data-table-sort-list.tsx)
- **Comportamento**: Popover com lista ordenável de critérios de ordenação (campo + asc/desc). Atalho: Ctrl+Shift+S.
- Use dentro de `DataTableAdvancedToolbar` quando quiser multi-sort explícito.

### DataTableSkeleton

- **Arquivo**: [data-table-skeleton.tsx](../src/components/data-table/data-table-skeleton.tsx)
- **Props**: `columnCount`, `rowCount?` (default 10), `filterCount?` (default 0), `cellWidths?` (array de larguras, ex.: `["auto", "120px"]`), `withViewOptions?` (default true), `withPagination?` (default true), `shrinkZero?` (default false).
- **Uso**: Estado de carregamento; alinhe `columnCount` e, se possível, `cellWidths` à tabela real.

---

## Recursos avançados

### Column pinning

Fixar colunas à esquerda ou direita (ex.: ações sempre à direita):

```ts
initialState: {
  columnPinning: { right: ["actions"] },
},
```

Os estilos de posição e sombra vêm de `getColumnPinningStyle` em [lib/data-table.ts](../src/lib/data-table.ts), já usados no `DataTable` para `TableHead` e `TableCell`.

### Seleção de linhas e actionBar

- Adicione uma coluna `id: "select"` com header (checkbox “selecionar todos”) e cell (checkbox por linha), usando `table.toggleAllPageRowsSelected` e `row.toggleSelected`. Defina `enableSorting: false` e `enableHiding: false`.
- Passe um `actionBar` para o `DataTable`: ele só é exibido quando há linhas selecionadas (`getFilteredSelectedRowModel().rows.length > 0`), por exemplo para “Excluir selecionados” ou “Exportar”.

### Filtros na URL (FilterList / FilterMenu)

- FilterList e FilterMenu usam `useQueryState` com parser `getFiltersStateParser<TData>(columnIds)` e, no FilterList, `parseAsStringEnum(["and", "or"])` para o operador de junção.
- O parâmetro de URL é `table.options.meta?.queryKeys?.filters ?? "filters"`. Para múltiplas tabelas na mesma página, defina `meta.queryKeys` por tabela (ex.: `filters: "usersFilters"`).
- Os filtros na URL são um estado separado do estado de filtros por coluna do TanStack; em cenários server-side ou com dados já filtrados no backend, você pode ler os query params e aplicar no servidor ou sincronizar com `table.setColumnFilters`.

### Operadores de filtro

Para FilterList/FilterMenu, os operadores por tipo vêm de [config/data-table.ts](../src/config/data-table.ts) (textOperators, numericOperators, dateOperators, selectOperators, multiSelectOperators, booleanOperators). Helpers em [lib/data-table.ts](../src/lib/data-table.ts): `getFilterOperators(filterVariant)` e `getDefaultFilterOperator(filterVariant)`.

---

## Skeleton e estados de loading

Use `DataTableSkeleton` enquanto os dados estão carregando:

```tsx
if (isLoading) {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={10}
      filterCount={3}
      cellWidths={["40px", "auto", "200px", "120px", "120px", "48px"]}
      withViewOptions
      withPagination
    />
  );
}
return <DataTable table={table}>...</DataTable>;
```

Mantenha `columnCount` e, se possível, `cellWidths` alinhados à tabela real para evitar “pulo” de layout.

---

## Tipos e configuração

### Tipos ([src/@types/data-table.ts](../src/@types/data-table.ts))

- **ColumnMeta** (estendido): `label`, `placeholder`, `variant`, `options`, `range`, `unit`, `icon`.
- **TableMeta**: `queryKeys?` (page, perPage, sort, filters, joinOperator).
- **Option**: `label`, `value`, `count?`, `icon?`.
- **FilterVariant**, **FilterOperator**, **JoinOperator**: derivados de `DataTableConfig`.
- **ExtendedColumnFilter**, **ExtendedColumnSort**: filtros/ordenação com IDs tipados às chaves de `TData`.

### Config global ([src/config/data-table.ts](../src/config/data-table.ts))

- **filterVariants**: lista de variantes de filtro.
- **operators**: lista de operadores (eq, ne, iLike, isBetween, etc.).
- **joinOperators**: `["and", "or"]`.
- **sortOrders**: `[{ label: "Asc", value: "asc" }, ...]`.
- **textOperators**, **numericOperators**, **dateOperators**, **selectOperators**, **multiSelectOperators**, **booleanOperators**: usados pelo FilterList/FilterMenu e por `getFilterOperators` / `getDefaultFilterOperator`.

---

## Exemplo completo comentado

O arquivo [users-table.tsx](../src/app/[locale]/(with-dashboard-layout)/administrador/dashboard/(root)/_components/users-table.tsx) implementa uma tabela de usuários com:

- **Tipo da linha**: `UserRow` (id, name, email, status, role, createdAt, tag?).
- **Colunas**:
  - **select**: Checkbox “selecionar todos” / por linha; `enableSorting: false`, `enableHiding: false`, `size: 40`.
  - **name**: `DataTableColumnHeader` + cell com badge opcional (tag) e nome; `meta.variant: "text"`, `meta.placeholder: "Buscar por nome..."`, `filterFn: "includesString"`.
  - **email**: Header + ícone Mail + valor; `meta.variant: "text"`, placeholder de email.
  - **status**: Badge com ícone por status; `meta.variant: "multiSelect"`, `meta.options: statusOptions` (value, label, icon); `filterFn: "includesString"`.
  - **role**: Badge outline com ícone; `meta.variant: "multiSelect"`, `meta.options: roleOptions`.
  - **createdAt**: Data formatada com `date-fns` + `ptBR`; `enableColumnFilter: false`, `sortingFn: "datetime"`.
  - **actions**: Dropdown (Ver detalhes, Editar, Desativar, Remover); `enableSorting: false`, `enableHiding: false`, `size: 48`.
- **Configurações de exibição**: `STATUS_CONFIG`, `ROLE_CONFIG`, `TAG_CONFIG` mapeiam valor → label, ícone e variant (Badge).
- **useReactTable**: `getRowId: (row) => row.id`, `initialState`: pagination 10, sorting por `createdAt` desc, `columnPinning: { right: ["actions"] }`.
- **Render**: `<DataTable table={table}><DataTableToolbar table={table} /></DataTable>`.

Trecho essencial da definição da coluna “name” com meta para filtro de texto:

```tsx
{
  id: "name",
  accessorKey: "name",
  header: ({ column }) => <DataTableColumnHeader column={column} label="Nome" />,
  cell: ({ row }) => {
    const tag = row.original.tag;
    const tagConfig = tag ? TAG_CONFIG[tag] : null;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {tagConfig && <Badge variant={tagConfig.variant}>{tagConfig.label}</Badge>}
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
}
```

---

## Boas práticas e referências

- **Estabilidade das colunas**: Defina `columns` com `useMemo` e dependências corretas (ex.: `[]` se não depender de estado externo), para evitar re-criação desnecessária da tabela.
- **Labels**: Prefira `meta.label` para exibição em headers, View options e filtros; use `id`/`accessorKey` para lógica.
- **Design system**: Para tabelas e listagens, siga [.docs/DESIGN_SYSTEM.md](.docs/DESIGN_SYSTEM.md) (tipografia, cores, componentes de layout).
- **Exemplo de referência**: [users-table.tsx](../src/app/[locale]/(with-dashboard-layout)/administrador/dashboard/(root)/_components/users-table.tsx).
- **Parsers e URL**: [lib/parsers.ts](../src/lib/parsers.ts) (`getFiltersStateParser`, `getSortingStateParser`) para integração com nuqs em FilterList/FilterMenu e ordenação persistida.
