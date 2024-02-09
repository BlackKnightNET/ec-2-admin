"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"


export type FullfillColumn = {
  id: string;
  user: string;
  orderItem: string;
  status: string;
  createdAt: string;
}

export const columns: ColumnDef<FullfillColumn>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "orderItem",
    header: "OrderItem",
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
