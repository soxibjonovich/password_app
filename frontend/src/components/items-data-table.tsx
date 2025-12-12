"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps {
  Data: any[]
  Headers: string[]
  Actions?: {
    main: { Icon: React.ComponentType<any> }
    cell: { Icon: React.ComponentType<any> }
  }
  onActionClick?: (passwordId: number) => void
}

export default function DataTable({ Data, Headers, Actions, onActionClick }: DataTableProps) {
  // Dynamically generate columns based on Headers
  const columns: ColumnDef<any>[] = React.useMemo(() => {
    return Headers.map((header) => {
      // Special handling for actions column
      if (header === "actions" && Actions) {
        const MainIcon = Actions.main.Icon
        const CellIcon = Actions.cell.Icon
        
        return {
          accessorKey: header,
          header: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MainIcon className="h-4 w-4" />
            </Button>
          ),
          cell: ({ row }: any) => (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onActionClick?.(row.original.id)}
            >
              <CellIcon className="h-4 w-4" />
            </Button>
          ),
        }
      }
      
      return {
        accessorKey: header,
        header: header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, " "),
        cell: ({ row }: any) => {
          const value = row.getValue(header)
          
          // Format created_at timestamps
          if (header === "created_at" && value) {
            const date = new Date(value)
            const formatted = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            return <div>{formatted}</div>
          }
          
          // Display logo as image if URL is valid
          if (header === "logo" && value && typeof value === 'string' && value.startsWith('http')) {
            return (
              <img
                src={value}
                alt="logo"
                className="h-12 w-12 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )
          }
          
          return <div>{String(value ?? "")}</div>
        },
      }
    })
  }, [Headers, Actions])

  const table = useReactTable({
    data: Data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50 h-14">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-foreground text-base">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-16">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-base">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
