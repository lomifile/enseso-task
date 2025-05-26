import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../../utils/merge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table-base";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MainDrawer } from "../drawer/create-drawer";

interface DataTableProps<T, V> {
  columns: ColumnDef<T, V>[];
  data: T[];
}

function DataTable<T, V>({ data, columns }: DataTableProps<T, V>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<{
    id?: string;
    isOpen: boolean;
  }>({
    id: undefined,
    isOpen: false,
  });
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  style={{
                    width: header.getSize(),
                  }}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header?.toString().includes(".")
                          ? t(header.column.columnDef.header as string)
                          : header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            className="overflow-x-auto hover:cursor-pointer hover:bg-teal-800 hover:text-white transition-all duration-75"
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            onClick={() => {
              setOpen(() => ({
                id: row.getValue<string>("id"),
                isOpen: true,
              }));
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell className={cn("flex-1 py-5")} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, {
                  ...cell.getContext(),
                  id: cell.row.getValue("id"),
                })}
              </TableCell>
            ))}
          </TableRow>
        ))}
        <MainDrawer
          useCustomTrigger
          onClose={() =>
            setOpen({
              id: undefined,
              isOpen: false,
            })
          }
          customTrigger={open.isOpen}
          id={open.id}
        />
      </TableBody>
    </Table>
  );
}

export { type DataTableProps, DataTable };
