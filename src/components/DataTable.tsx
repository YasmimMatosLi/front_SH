// src/components/DataTable.tsx
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[] | undefined;
    columns: Column<T>[];
    caption?: string;
    isLoading?: boolean;
}

export function DataTable<T>({ data, columns, caption, isLoading }: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Nenhum registro encontrado
            </div>
        );
    }

    return (
        <Table>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
                <TableRow>
                    {columns.map((col, i) => (
                        <TableHead key={i}>{col.header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <TableCell key={colIndex}>
                                {col.cell
                                    ? col.cell(item)
                                    : typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor as keyof T] as React.ReactNode)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}