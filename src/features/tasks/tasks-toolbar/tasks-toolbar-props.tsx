"use client";

import { type Table } from "@tanstack/react-table";
import { labels, priorities, statuses } from "../data/data";
import { TasksToolbarPropsFilters } from "./tasks-toolbar-props-filters";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export type ComboBoxProps = {
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};

export function TasksToolbarProps<TData>({
  table,
  value,
  onChange,
}: DataTableToolbarProps<TData> & ComboBoxProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {table.getColumn("status") && (
        <TasksToolbarPropsFilters
          column={table.getColumn("status")}
          title="Status"
          options={statuses}
          value={value}
          defaultValue={value}
          onChange={onChange}
        />
      )}
      {table.getColumn("priority") && (
        <TasksToolbarPropsFilters
          column={table.getColumn("priority")}
          title="Priority"
          options={priorities}
          value={value}
          defaultValue={value}
          onChange={onChange}
        />
      )}
      {table.getColumn("label") && (
        <TasksToolbarPropsFilters
          column={table.getColumn("label")}
          title="Label"
          options={labels}
          value={value}
          defaultValue={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
