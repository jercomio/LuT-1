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
import { Form, useZodForm } from "@/components/ui/form";
import { LoaderCircle } from "@/components/ui/loader-circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, daysRemaining } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Table as TableOrigin } from "@tanstack/react-table";
import { CircleDot, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import { type Task } from "../../data/schema";
import { itemStyle } from "../../utils";
import { deleteManyTasksAction } from "./task-delete.action";

export const DeleteManyTasksSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "Task ID is required" }),
    title: z.string().optional(),
    userId: z.string(),
  }),
);

export type DeleteManyTasksType = z.infer<typeof DeleteManyTasksSchema>;

type ActionResult =
  | { success: true; serverError?: never }
  | { success?: never; serverError: string };

export type DataTableDeleteTaskProps<TData> = {
  tasks: Task[];
  table?: TableOrigin<TData>;
  className?: string;
};

export function DataTableDeleteManyTasks<TData>({
  tasks,
  table,
  className,
}: DataTableDeleteTaskProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<Task[]>(
    "rowChecked",
    [],
  );
  const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const taskPriority = rowChecked.map((task) => task.priority);

  const dataToDelete = rowChecked.map((task) => ({
    id: task.id,
    title: task.title,
    userId: session.data?.user?.id ?? "",
  }));

  const form = useZodForm({
    schema: DeleteManyTasksSchema,
    values: dataToDelete,
  });

  const mutation = useMutation({
    mutationFn: async (values: DeleteManyTasksType) => {
      const result = (await deleteManyTasksAction(values)) as ActionResult;

      if (result.serverError) {
        // toast.error(result.serverError);
        throw new Error(result.serverError);
      }
      return values;
    },
    onSuccess: async (deletedTasks) => {
      setOpen(false);
      removeRowChecked();
      if (table) {
        table.toggleAllPageRowsSelected(false);
      }
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // router.refresh();
      toast.success("Tasks deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while deleting the task");
      setOpen(false);
      removeRowChecked();
      if (table) {
        table.toggleAllPageRowsSelected(false);
      }
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  const rowCheckedIds = rowChecked.map((task) => task.id);
  const selectedTasks = tasks
    .filter((task) => rowCheckedIds.includes(task.id))
    .sort((a, b) => a.identifier.localeCompare(b.identifier));

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="mr-2 flex w-full items-center justify-start text-sm"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div
                className="relative flex grow items-center"
                style={{
                  width: `${18 + rowChecked.slice(0, 3).length}px`,
                }}
              >
                {dot &&
                  rowChecked.length > 0 &&
                  rowChecked.slice(0, 3).map((row, idx) => (
                    <span
                      key={row.id}
                      className={cn("absolute")}
                      style={{ left: `${idx * 5}px` }}
                    >
                      <CircleDot
                        className={cn(
                          itemStyle(row.priority),
                          "size-3 bg-zinc-700 rounded-full",
                        )}
                      />
                    </span>
                  ))}
              </div>
              <div className="flex items-center">
                <span className="text-xs font-light text-zinc-300">
                  {rowChecked.length} {rowChecked.length > 1 ? "tasks" : "task"}
                </span>
              </div>
            </div>
            <div>
              <Trash2 className="size-3" />
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-zinc-300" />
            <span>Delete tasks</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <div className="font-semibold">
              Are you sure to delete these tasks ?
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-muted p-4">
              <div className="flex">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">Tasks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ScrollArea className="h-1/2 md:h-72">
                      {selectedTasks.length > 0 ? (
                        selectedTasks.map((task) => (
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
                                  {daysRemaining(
                                    task.dueOfDate as Date,
                                    new Date(),
                                  )}
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
                    </ScrollArea>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  removeRowChecked();
                  table?.toggleAllPageRowsSelected(false);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Delete All"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
