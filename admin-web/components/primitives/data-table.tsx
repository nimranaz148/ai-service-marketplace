import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export interface Column {
  key: string;
  header: string;
  align?: "left" | "right";
}

export interface DataTableProps<Row> {
  columns: Column[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  renderRow: (row: Row) => React.ReactNode[];
  state?: "ready" | "loading" | "empty";
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  renderRow,
  state = "ready",
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: DataTableProps<Row>) {
  return (
    <ScrollArea className="w-full rounded-md border border-hairline bg-surface-raised">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={cn("text-xs text-ink-muted", c.align === "right" && "text-right")}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === "loading" ? (
            Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i} data-testid="data-table-skeleton-row">
                {columns.map((c) => (
                  <TableCell key={c.key}><Skeleton className="h-4 w-24" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : state === "empty" || rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState title={emptyTitle} description={emptyDescription} className="border-0" />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const cells = renderRow(row);
              return (
                <TableRow key={getRowKey(row)}>
                  {columns.map((c, i) => (
                    <TableCell key={c.key} className={cn(c.align === "right" && "text-right font-mono")}>
                      {cells[i]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
