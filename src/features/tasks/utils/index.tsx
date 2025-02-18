import { cn } from "@/lib/utils";
import { type Row } from "@tanstack/react-table";
import { labels, priorities, statuses } from "../data/data";
import { type Task } from "../data/schema";

// Styles for the priority items
export type PrioritiesItemStyle = {
  Urgent: string;
  High: string;
  Medium: string;
  Low: string;
};

export const priorityItemStyle: PrioritiesItemStyle = {
  Urgent: "text-red-400 stroke-red-400 color-red-400",
  High: "text-amber-400 stroke-amber-400 color-amber-400",
  Medium: "text-blue-400 stroke-blue-400 color-blue-400",
  Low: "text-zinc-400 stroke-zinc-400 color-zinc-400",
};

export const itemStyle = (priority: string, bg?: boolean) => {
  let style = "";
  switch (priority) {
    case "urgent":
      style = priorityItemStyle.Urgent;
      if (bg) return (style = `${style} border-red-400`);
      break;
    case "high":
      style = priorityItemStyle.High;
      if (bg) return (style = `${style} border-amber-400`);
      break;
    case "medium":
      style = priorityItemStyle.Medium;
      if (bg) return (style = `${style} border-blue-400`);
      break;
    case "low":
      style = priorityItemStyle.Low;
      if (bg) return (style = `${style} border-zinc-400`);
      break;
    default:
      style = "";
      break;
  }
  return style;
};

export const statusWithIcon = (table: Task[], className?: string) => {
  const tableFilteredByStatus = table.map((task) => task.status);
  const status = statuses.find(
    (status) => status.value === tableFilteredByStatus[0],
  );

  if (!status) {
    return null;
  }

  return (
    <div className={cn("flex items-center")}>
      {
        <status.icon
          className={cn("mr-2 size-4 text-muted-foreground", className)}
        />
      }
      <span>{status.label}</span>
    </div>
  );
};

export const priorityWithIcon = (table: Task[], className?: string) => {
  const tableFilteredByPriority = table.map((task) => task.priority);
  const priority = priorities.find(
    (priority) => priority.value === tableFilteredByPriority[0],
  );

  if (!priority) {
    return null;
  }

  return (
    <div className={cn("flex items-center")}>
      <priority.icon
        className={cn("mr-2 size-4 text-muted-foreground", className)}
      />
      <span>{priority.label}</span>
    </div>
  );
};

export const labelWithIcon = (table: Task[], className?: string) => {
  const tableFilteredByLabel = table.map((task) => task.label);
  const label = labels.find((label) => label.value === tableFilteredByLabel[0]);

  if (!label) {
    return null;
  }

  return (
    <div className={cn("flex items-center")}>
      <span>{label.label}</span>
    </div>
  );
};

export const getValueFromData = (data: Task[] | Row<Task>, value: string) => {
  // Vérifie si 'data' est un tableau de tâches
  if (Array.isArray(data)) {
    return data.map((task: Task) => task[value as keyof Task]);
  }

  // Si 'data' est une seule ligne de tâche, retourne la valeur correspondante
  return data[value as keyof Row<Task>];
};
