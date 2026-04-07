import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Upload, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, File } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  searchKeys?: (keyof T & string)[];
  pageSize?: number;
  exportable?: boolean;
  importable?: boolean;
  onImport?: (data: any[]) => void;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, title, searchable = true, searchKeys, pageSize = 10,
  exportable = true, importable = false, onImport, actions
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    let result = [...data];
    if (search) {
      const keys = searchKeys || columns.map(c => c.key);
      const q = search.toLowerCase();
      result = result.filter(row =>
        keys.some(k => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, searchKeys, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const exportCSV = () => {
    const headers = columns.map(c => c.label).join(",");
    const rows = filteredData.map(r => columns.map(c => `"${String(r[c.key] ?? "")}"`).join(","));
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    saveAs(blob, `${title || "export"}.csv`);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(r => {
      const obj: Record<string, any> = {};
      columns.forEach(c => obj[c.label] = r[c.key]);
      return obj;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `${title || "export"}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title || "Report", 14, 16);
    autoTable(doc, {
      head: [columns.map(c => c.label)],
      body: filteredData.map(r => columns.map(c => String(r[c.key] ?? ""))),
      startY: 24,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 60, 42] },
    });
    doc.save(`${title || "export"}.pdf`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target?.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      onImport(json);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          {title && <h3 className="font-semibold text-foreground">{title}</h3>}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{filteredData.length} records</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="pl-8 h-8 text-sm w-full sm:w-52"
              />
            </div>
          )}
          {importable && (
            <label>
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleImport} />
              <Button variant="outline" size="sm" className="h-8 cursor-pointer" asChild>
                <span><Upload className="h-3.5 w-3.5 mr-1.5" />Import</span>
              </Button>
            </label>
          )}
          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-3.5 w-3.5 mr-1.5" />Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportCSV}><FileText className="h-3.5 w-3.5 mr-2" />CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportExcel}><FileSpreadsheet className="h-3.5 w-3.5 mr-2" />Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}><File className="h-3.5 w-3.5 mr-2" />PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.sortable !== false ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
              ))}
              {actions && <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  {columns.map(col => (
                    <TableCell key={col.key} className="text-sm">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
