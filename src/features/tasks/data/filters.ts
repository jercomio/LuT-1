/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Task } from "./schema";

export type TasksFilteredByPriority = {
  priority: string;
  count: number;
};

export type TasksFilteredByStatus = {
  status: string;
  count: number;
};

export type TasksFilteredByLabel = {
  label: string;
  count: number;
  fill: string;
};

export type TasksDataFiltered = {
  priority: TasksFilteredByPriority[];
  status: TasksFilteredByStatus[];
  label: TasksFilteredByLabel[];
};

export type Filter = "priority" | "status" | "label";

// Filter tasks by priority
export const tasksFilteredByPriority = (
  data: Task[]
): TasksFilteredByPriority[] => {
  if (!data) {
    console.log("No data");
    return [];
  }

  const tasksFilteredByPriorityCount = new Map<string, number>();
  data.forEach((task) => {
    tasksFilteredByPriorityCount.set(
      task.priority,
      (tasksFilteredByPriorityCount.get(task.priority) ?? 0) + 1
    );
  });
  return Array.from(tasksFilteredByPriorityCount.entries()).map(
    ([priority, count]) => ({ priority, count })
  );
};

// Filter tasks by status
export const tasksFilteredByStatus = (
  data: Task[]
): TasksFilteredByStatus[] => {
  if (!data) {
    console.log("No data");
    return [];
  }

  const tasksFilteredByStatusCount = new Map<string, number>();
  data.forEach((task) => {
    tasksFilteredByStatusCount.set(
      task.status,
      (tasksFilteredByStatusCount.get(task.status) ?? 0) + 1
    );
  });
  return Array.from(tasksFilteredByStatusCount.entries()).map(
    ([status, count]) => ({ status, count })
  );
};

// Filter tasks by label
export const tasksFilteredByLabel = (data: Task[]): TasksFilteredByLabel[] => {
  if (!data) {
    console.log("No data");
    return [];
  }

  const tasksFilteredByLabelCount = new Map<string, number>();
  data.forEach((task) => {
    tasksFilteredByLabelCount.set(
      task.label,
      (tasksFilteredByLabelCount.get(task.label) ?? 0) + 1
    );
  });
  return Array.from(tasksFilteredByLabelCount.entries()).map(
    ([label, count]) => ({ label, count, fill: "var(--color-label)" })
  );
};
