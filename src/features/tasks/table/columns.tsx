/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";

import { labels, priorities, statuses } from "@/features/tasks/data/data";
import type { Task } from "@/features/tasks/data/schema";
import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { itemStyle } from "../utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TaskView } from "./task-view";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
        Task[]
      >("rowChecked", []);

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            // if (!rowChecked) {
            //   table.toggleAllPageRowsSelected(!!value);
            //   setRowChecked([]);
            // }

            if (value) {
              setRowChecked(
                table.getRowModel().rows.map((row) => row.original),
              );
            } else {
              setRowChecked([]);
            }
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => {
      const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
        Task[]
      >("rowChecked", []);

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              setRowChecked([...rowChecked, row.original]);
            } else {
              setRowChecked(
                rowChecked.filter((task) => task.id !== row.original.id),
              );
            }
          }}
          // onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "identifier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("identifier")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
      const [labelFlag, setLabelFlag, removeLabelFlag] = useLocalStorage(
        "labelFlag",
        true,
      );
      const label = labels.find((label) => label.value === row.original.label);
      const dotColor = itemStyle(row.original.priority);

      return (
        <div className="flex items-center space-x-2">
          <TaskView row={row} />
          {dot && <CircleDot className={cn(dotColor, "size-4")} />}
          {label && labelFlag && (
            <Badge variant="outline">{label?.label}</Badge>
          )}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 size-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority"),
      );
      const priorityColor = itemStyle(row.original.priority);

      if (!priority) {
        return null;
      }

      return (
        <div className={cn("flex items-center")}>
          {priority.icon && (
            <priority.icon
              className={cn("mr-2 size-4 text-muted-foreground")}
            />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label) => label.value === row.getValue("label"),
      );

      if (!label) {
        return null;
      }

      return (
        <div className="flex items-center">
          {/* {label.icon && (
            <label.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{label.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
