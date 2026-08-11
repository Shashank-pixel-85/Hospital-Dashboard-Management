import { Plus } from "lucide-react";
import { Button, Card, ErrorState } from "./common";
import { DataTable } from "./DataTable";

export function EntityPage({
  title,
  description,
  rows,
  columns,
  onAdd,
  onEdit,
  onDelete,
  filterOptions,
  filterValue,
  onFilterChange,
  error,
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>

        <Button onClick={onAdd}>
          <span className="flex items-center gap-2">
            <Plus size={17} />
            Add New
          </span>
        </Button>
      </div>

      {error && <ErrorState message={error} />}

      <Card>
        <DataTable
          rows={rows}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
          filterOptions={filterOptions}
          filterValue={filterValue}
          onFilterChange={onFilterChange}
        />
      </Card>
    </div>
  );
}

export function FormGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
