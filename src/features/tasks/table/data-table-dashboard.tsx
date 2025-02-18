"use client";
import {
  type TasksDataFiltered,
  tasksFilteredByLabel,
  tasksFilteredByPriority,
  tasksFilteredByStatus,
} from "../data/filters";
import type { Task } from "../data/schema";
import type { DataTableProps } from "./data-table";
import { DataTableChartPriority } from "./data-table-chart-priority";
import { DataTableChartStatus } from "./data-table-chart-status";
import { DataTableLabelCard } from "./data-table-label-view";

export function DashboardLayout<TData extends Task, TValue>({
  columns,
  data,
  className,
}: DataTableProps<TData, TValue>) {
  // Filter tasks by priority
  const tasksByPriorityFiltered = tasksFilteredByPriority(data);

  // Filter tasks by status
  const tasksByStatusFiltered = tasksFilteredByStatus(data);

  // Filter tasks by label
  const tasksByLabelFiltered = tasksFilteredByLabel(data);
  const tasksDataFiltered: TasksDataFiltered = {
    priority: tasksByPriorityFiltered,
    status: tasksByStatusFiltered,
    label: tasksByLabelFiltered,
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      {/* <h1 className="text-2xl font-semibold">Dashboard</h1> */}
      <div className="my-4 h-[500px]">
        <DataTableChartStatus table={tasksByStatusFiltered} />
      </div>
      <div className="my-4 h-[500px]">
        {/* <DataTableChartLabel table={tasksByLabelFiltered} /> */}
        <DataTableLabelCard table={tasksDataFiltered} />
      </div>
      <div className="my-4 h-[500px]">
        <DataTableChartPriority table={tasksByPriorityFiltered} />
      </div>
    </div>
  );
}
