import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Badge, EmptyState, SearchBox } from "./common";

export function DataTable({
  rows,
  columns,
  onEdit,
  onDelete,
  searchPlaceholder = "Search records...",
  filterOptions = [],
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  // Search and filter the records.
  const filteredRows = rows.filter((row) => {
    const matchesSearch = Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    );

    const matchesFilter =
      selectedFilter === "All" || row.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Sort the filtered records.
  const sortedRows = [...filteredRows].sort((firstRow, secondRow) => {
    if (!sortColumn) {
      return 0;
    }

    const firstValue = firstRow[sortColumn];
    const secondValue = secondRow[sortColumn];

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return sortDirection === "asc"
        ? firstValue - secondValue
        : secondValue - firstValue;
    }

    const result = String(firstValue ?? "").localeCompare(
      String(secondValue ?? ""),
      undefined,
      { numeric: true }
    );

    return sortDirection === "asc" ? result : -result;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));

  // If search/filter/delete makes the current page empty, go back to page 1.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedRows.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  function changeSort(columnKey) {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  }

  function changeSearch(value) {
    setSearchText(value);
    setCurrentPage(1);
  }

  function changeFilter(value) {
    setSelectedFilter(value);
    setCurrentPage(1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="w-full sm:max-w-md">
          <SearchBox
            value={searchText}
            onChange={changeSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        {filterOptions.length > 0 && (
          <select
            value={selectedFilter}
            onChange={(event) => changeFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="All">All</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              {columns.map((column) => (
                <th key={String(column.key)} className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => changeSort(String(column.key))}
                    className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    {column.label}
                    {sortColumn === String(column.key) &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </button>
                </th>
              ))}

              {(onEdit || onDelete) && <th className="px-3 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="whitespace-nowrap px-3 py-3">
                    {column.render
                      ? column.render(row)
                      : String(row[String(column.key)] ?? "")}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="text-blue-600"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {currentRows.length === 0 && <EmptyState />}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {sortedRows.length === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="rounded border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export { Badge };
