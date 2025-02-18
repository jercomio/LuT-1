import { Tag } from "lucide-react";

import loa from "@/lib/loa";
import { cn } from "@/lib/utils";
import type { TasksDataFiltered, TasksFilteredByLabel } from "../data/filters";
import DataTableDialog__label from "./data-table-dialog__label";

type DataTableChartProps = {
  table: TasksDataFiltered;
  label: TasksFilteredByLabel["label"];
  className?: string;
};

const DataTableCardSmall = ({
  table,
  label,
  className,
}: DataTableChartProps) => {
  const labelCounter = (label: string): number => {
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    table.label.filter((task) => {
      if (task.label === label) {
        count += task.count;
      }
    });
    return count;
  };
  const labelCount = labelCounter(label);

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-zinc-100/15 p-4 hover:border-solid hover:border-zinc-100/30",
        className,
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Tag className="size-4" />
          <p className="text-2xl font-semibold">
            {label.length > 7
              ? loa.capitalize(`${label.slice(0, 8)}...`)
              : loa.capitalize(label)}
          </p>
        </div>
        <p className="text-2xl font-semibold">{labelCount}</p>
      </div>
      <div className="flex justify-end">
        <DataTableDialog__label table={table} label={label} />
      </div>
    </div>
  );
};

export default DataTableCardSmall;
