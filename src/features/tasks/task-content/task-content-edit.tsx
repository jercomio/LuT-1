"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { tasksPropertiesComponents } from "../../tasks/tasks-toolbar/tasks-properties-components";
import { type Task } from "../data/schema";
import { editTaskAction } from "../table/edit/task-edit.actions";
import { TaskContentEditor } from "./task-content-editor";

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

type TaskContentEditProps = {
  task: Task;
  params: {
    orgSlug: string;
    taskIdentifier: string;
    slug: string;
  };
  className?: string;
};

export function TaskContentEdit({
  task,
  params,
  className,
}: TaskContentEditProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    task.dueOfDate ? new Date(task.dueOfDate) : undefined,
  );
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: EditTaskSchema,
    defaultValues: {
      id: task.id,
      title: task.title,
      content: task.content ?? "",
      status: task.status,
      priority: task.priority,
      label: task.label,
      dueOfDate: task.dueOfDate,
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
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while updating the task");
    },
  });

  const {
    isPending,
    isError,
    data: dataTask,
    error,
  } = useQuery({
    queryKey: ["task"],
    queryFn: () => task,
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

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Layout size="xl" className="m-0">
      <div className="mx-auto w-2/3">
        <LayoutHeader className={cn("my-4", className)}>
          <LayoutTitle className="font-sans text-lg text-zinc-500">
            {dataTask.identifier}
          </LayoutTitle>
        </LayoutHeader>
        <LayoutContent>
          <Form
            form={form}
            onSubmit={async (v) => {
              return mutation.mutateAsync(v);
            }}
          >
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-2">
                <div className="w-2/3">
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
                </div>
                {/* // Combobox */}
                <div className="flex w-1/3 flex-col">
                  <div className="mt-4 flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="status"
                      defaultValue={task.status}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.status
                              value={field.value}
                              defaultValue={task.status}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      defaultValue={task.priority}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.priority
                              value={field.value}
                              defaultValue={task.priority}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="label"
                      defaultValue={task.label}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.label
                              value={field.value}
                              defaultValue={task.label}
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
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                  field.onChange(newDate);
                                  setDate(newDate);
                                }}
                                disabled={(d) => d < new Date()}
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
              </div>
            </div>
            <div className="h-12"></div>
            <div className="my-4 flex items-center gap-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  window.location.href = `/org/${params.orgSlug}/tasks`;
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-24"
              >
                {mutation.isPending ? <LoaderCircle /> : "Save"}
              </Button>
            </div>
          </Form>
        </LayoutContent>
      </div>
    </Layout>
  );
}
