"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle } from "@/components/ui/loader-circle";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import loa from "@/lib/loa";
import { cn, daysRemaining } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleDot, Eye, Tag } from "lucide-react";
import { type TasksDataFiltered } from "../data/filters";
import type { Task } from "../data/schema";
import { itemStyle } from "../utils";

type DataTableDialog__labelProps = {
  table: TasksDataFiltered;
  label: string;
};

const DataTableDialog__label = ({
  table,
  label,
}: DataTableDialog__labelProps) => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tasks"],
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

  const tasks = data as Task[];
  // Filter tasks by label
  const getTasksByLabel = (label: string) => {
    return tasks.filter((task) => task.label.includes(label));
  };
  const taskFilteredByLabel = getTasksByLabel(label);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="xs">
          <Eye className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="size-4" />
            {loa.capitalize(label)}
          </DialogTitle>
          <DialogDescription>
            Tasks List filtered by this label
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-[50vh] overflow-y-auto">
          <Table>
            <TableCaption>List of tasks</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">Tasks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {taskFilteredByLabel.length > 0 ? (
                taskFilteredByLabel.map((task) => (
                  <TableRow
                    key={task.id}
                    className="flex items-center gap-1 text-sm"
                  >
                    <div className="flex w-28 items-center justify-start">
                      <TableCell className="w-28 bg-zinc-900/50 py-2 text-start text-zinc-500">
                        {task.identifier}
                      </TableCell>
                    </div>
                    <TableCell className="py-2 font-medium">
                      <CircleDot
                        className={cn(itemStyle(task.priority), "h-4")}
                      />
                    </TableCell>
                    <div className="flex w-full items-center justify-between gap-1">
                      <TableCell className="flex items-center justify-start py-2 font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell className="flex w-28 items-center justify-end py-2">
                        <Badge
                          variant={"outline"}
                          className="font-light text-zinc-400"
                        >
                          {daysRemaining(task.dueOfDate as Date, new Date())}
                        </Badge>
                      </TableCell>
                    </div>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataTableDialog__label;
