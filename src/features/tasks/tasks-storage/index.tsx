"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle } from "lucide-react";
import type { Task } from "../data/schema";
import { TasksNavigation } from "../tasks-navigation";

type Props = {
  tasks: Task[];
  columns: ColumnDef<Task>[];
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

export const TasksStorage = ({ tasks, columns, members }: Props) => {
  const {
    isPending,
    isError,
    data: dataTasks,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasks,
  });

  if (isPending) {
    return <LoaderCircle className="size-4" />;
  }

  if (isError) {
    return (
      <span className="text-sm font-medium text-red-500">
        Error: {error.message}
      </span>
    );
  }

  return (
    <TasksNavigation data={dataTasks} columns={columns} members={members} />
  );
};
