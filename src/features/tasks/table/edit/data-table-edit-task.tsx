"use client";
import { DateTimePicker } from "@/components/ui-datetime/datetime-picker";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "@/components/ui/loader-circle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { addDays, format } from "date-fns";
import { CalendarIcon, ListPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { type Task } from "../../data/schema";
import { TaskContentEditor } from "../../task-content/task-content-editor";
import { tasksPropertiesComponents } from "../../tasks-toolbar/tasks-properties-components";
import { editTaskAction } from "./task-edit.actions";

export const EditTaskSchema = z.object({
  id: z.string().min(1, "Title is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  label: z.string().optional(),
  dueOfDate: z.coerce.date().optional(),
  userId: z.string(),
});

export type EditTaskType = z.infer<typeof EditTaskSchema>;

export type DataTableTaskEditProps<TData extends Task> = {
  row: Row<TData>;
  icon?: boolean;
  className?: string;
};

export function DataTableEditTask<TData extends Task>({
  row,
  icon = false,
  className,
}: DataTableTaskEditProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(
    row.original.dueOfDate ? new Date(row.original.dueOfDate) : undefined,
  );
  const session = useSession();
  const router = useRouter();

  const taskData = row.original;

  const form = useZodForm({
    schema: EditTaskSchema,
    defaultValues: {
      id: taskData.id,
      title: taskData.title,
      content: taskData.content ?? "",
      status: taskData.status,
      priority: taskData.priority,
      label: taskData.label,
      dueOfDate: taskData.dueOfDate,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: EditTaskType) => {
      const result = await editTaskAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while updating the task");
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={icon ? "outline" : "ghost"}
          size={"sm"}
          className={cn(
            icon
              ? cn("flex justify-between bg-orange-500 mr-2", className)
              : cn("flex w-full items-center justify-start text-sm", className),
          )}
        >
          {icon ? (
            <ListPlus className="size-5" />
          ) : (
            <div className="flex w-full items-center justify-between">
              <span>Edit</span>
              <span className="text-xs">⌘e</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Edit
          </DialogTitle>
          <DialogDescription>To update this task</DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* <Textarea placeholder="Description..." {...field} /> */}
                    <TaskContentEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // Combobox */}
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="status"
                defaultValue={taskData.status}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <tasksPropertiesComponents.status
                        value={field.value}
                        defaultValue={taskData.status}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                defaultValue={taskData.priority}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <tasksPropertiesComponents.priority
                        value={field.value}
                        defaultValue={taskData.priority}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                defaultValue={taskData.label}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <tasksPropertiesComponents.label
                        value={field.value}
                        defaultValue={taskData.label}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Date Picker */}
              <FormField
                control={form.control}
                name="dueOfDate"
                // defaultValue={date}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    {/* <FormLabel>Due of date</FormLabel> */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "text-left text-xs font-normal h-8 justify-between border-dashed",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Due of date</span>
                            )}
                            {/* {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )} */}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="flex w-auto flex-col space-y-2 p-2"
                        align="start"
                      >
                        <Select
                          onValueChange={(value) =>
                            setDate(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            field.onChange(newDate);
                            setDate(newDate);
                          }}
                          disabled={(d) => d < new Date()}
                          className="text-xs"
                        /> */}
                        <DateTimePicker
                          clearable
                          value={date}
                          onChange={(newDate) => {
                            field.onChange(newDate);
                            setDate(newDate);
                          }}
                          hideTime
                          className="text-xs"
                        />
                      </PopoverContent>
                    </Popover>
                    {/* <FormDescription>
                      Pick a date for the task to be due
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Update"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
