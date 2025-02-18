"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { labels, priorities, statuses } from "@/features/tasks/data/data";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import type { Task } from "../data/schema";
import { DataTableCreateTask } from "./create/data-table-new-task";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableSettings } from "./data-table-settings";
import { DataTableDeleteManyTasks } from "./delete/data-table-delete-many-tasks";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<Task[]>(
    "rowChecked",
    [],
  );
  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: tasks } = useQuery<Task[]>({ queryKey: ["tasks"] });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2 space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={table.getColumn("title")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {table.getColumn("label") && (
          <DataTableFacetedFilter
            column={table.getColumn("label")}
            title="Label"
            options={labels}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-0">
        {rowChecked.length > 0 ? (
          <DataTableDeleteManyTasks tasks={tasks ?? []} table={table} />
        ) : null}
        <DataTableCreateTask table={table} type={"icon"} />
        <DataTableViewOptions table={table} />
        <DataTableSettings />
      </div>
    </div>
  );
}
