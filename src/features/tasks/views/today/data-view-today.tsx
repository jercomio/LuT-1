"use client";

import { UserCircleDashedFill } from "@/components/svg/user-dashed";
import { DateTimePicker } from "@/components/ui-datetime/datetime-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, daysRemaining, slugify } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon, CircleDot } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { statuses } from "../../data/data";
import type { Task } from "../../data/schema";
import { editTaskAction } from "../../table/edit/task-edit.actions";
import {
  EditTaskSchema,
  type EditTaskType,
} from "../../task-content/task-content-edit";
import { TaskContentEditor } from "../../task-content/task-content-editor";
import { tasksPropertiesComponents } from "../../tasks-toolbar/tasks-properties-components";
import { itemStyle, priorityWithIcon } from "../../utils";

export type DataTableProps = {
  data: Task[];
  className?: string;
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

export function DataViewToday({ data, className, members }: DataTableProps) {
  const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const [itemColor, setItemColor, removeItemColor] = useLocalStorage(
    "itemColor",
    false,
  );
  const [labelFlag, setLabelFlag, removeLabelFlag] = useLocalStorage(
    "labelFlag",
    true,
  );
  const [cancelTaskButton, setCancelTaskButton] = useLocalStorage(
    "cancelTaskButton",
    false,
  );

  const [viewTaskSelected, setViewTaskSelected] = React.useState<Task | null>(
    null,
  );
  console.log("viewTaskSelected", viewTaskSelected);

  const [open, setOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(
    viewTaskSelected?.dueOfDate
      ? new Date(viewTaskSelected.dueOfDate)
      : undefined,
  );

  const params = useParams<{ orgSlug: string }>();
  const session = useSession();
  const router = useRouter();

  const tasksToday = data.filter((task) => {
    return (
      task.dueOfDate?.toISOString().split("T")[0] ===
      new Date().toISOString().split("T")[0]
    );
  });

  // Add the first task of the list tasksToday to viewTaskSelected when tasksToday is not empty
  React.useEffect(() => {
    if (tasksToday.length > 0) {
      setViewTaskSelected(tasksToday[0]);
    }
  }, []);

  // Update viewTaskSelected when task is selected
  const handleTaskSelect = (task: Task): void => {
    setViewTaskSelected(task);
  };

  const handleClick = ({
    identifier,
    title,
  }: {
    identifier: string;
    title: string;
  }) => {
    const slugifiedTitle = slugify(title);
    return router.push(
      `/orgs/${params.orgSlug}/tasks/${identifier.toLowerCase()}/${slugifiedTitle}`,
    );
  };

  const form = useZodForm({
    schema: EditTaskSchema,
    defaultValues: {
      id: viewTaskSelected?.id,
      title: viewTaskSelected?.title,
      content: viewTaskSelected?.content ?? "",
      status: viewTaskSelected?.status,
      priority: viewTaskSelected?.priority,
      label: viewTaskSelected?.label,
      dueOfDate: viewTaskSelected?.dueOfDate,
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

  const member = members.find(
    (member) => member.email === session.data.user?.email,
  );

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4 flex flex-col gap-4">
        <ScrollArea className="h-[750px] rounded-lg">
          <div className="flex flex-col gap-2">
            {tasksToday.length > 0 ? (
              tasksToday.map((task) => (
                <Card
                  key={task.identifier}
                  className={cn(
                    "rounded-lg bg-zinc-900/50 w-80 hover:bg-zinc-900/75 overflow-hidden",
                    itemColor ? itemStyle(task.priority, true) : null,
                  )}
                  onClick={() => handleTaskSelect(task)}
                >
                  <CardHeader className="flex flex-row items-center justify-between p-3">
                    <div className="flex items-center gap-1">
                      <span>
                        {dot && (
                          <CircleDot
                            className={cn(itemStyle(task.priority), "size-3")}
                          />
                        )}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {task.identifier}
                      </span>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="z-50 size-6 rounded-full bg-zinc-900 p-1 hover:cursor-pointer hover:bg-zinc-950"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {member?.image ? (
                            <img
                              src={member.image}
                              width={100}
                              height={100}
                              alt={member.name ?? ""}
                            />
                          ) : (
                            <UserCircleDashedFill />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-52 items-start gap-3 bg-zinc-900 shadow-sm">
                        <div>
                          {member?.image ? (
                            <img
                              src={member.image}
                              width={100}
                              height={100}
                              alt={member.name ?? ""}
                            />
                          ) : (
                            <UserCircleDashedFill />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold">
                            {session.data.user?.name}
                          </div>
                          <div className="text-xs font-normal">
                            {session.data.user?.email}
                          </div>
                          <Link
                            href={"/account"}
                            className="text-xs text-zinc-500 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Profile
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardHeader>
                  {/* <CardDescription>optional</CardDescription> */}
                  <CardContent className="p-3 pt-0">
                    <div className="flex flex-col gap-1 rounded-lg">
                      <div className="mb-2 flex items-center gap-0 text-sm font-semibold text-zinc-300">
                        {(() => {
                          const StatusIcon = statuses.find(
                            (s) => s.value === task.status,
                          )?.icon;
                          return StatusIcon ? (
                            <StatusIcon
                              className={cn(
                                "mr-2 size-4 text-muted-foreground stroke-zinc-300/70",
                              )}
                            />
                          ) : null;
                        })()}
                        <p className="whitespace-break-spaces">
                          {task.title && task.title.length > 70
                            ? `${task.title.slice(0, 70)}...`
                            : task.title}
                        </p>
                      </div>
                      {/* <div className="mb-2 text-sm font-light text-zinc-500">
                            {task.content && task.content.length > 50
                              ? `${task.content.slice(0, 50)}...`
                              : task.content}
                          </div> */}
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs text-zinc-500">
                          <Badge
                            variant={"outline"}
                            className="text-xs font-light text-zinc-400"
                          >
                            {priorityWithIcon([task], "size-3")}
                          </Badge>
                        </span>
                        <span>
                          <Badge
                            variant={"outline"}
                            className="text-xs font-light text-zinc-400"
                          >
                            <CalendarIcon className="mr-1 size-3 opacity-50" />
                            {daysRemaining(task.dueOfDate as Date, new Date())}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div>No tasks found</div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="col-span-8 flex flex-col gap-4">
        <ScrollArea className="h-[750px] rounded-lg">
          {viewTaskSelected ? (
            <div>
              <Form
                form={form}
                onSubmit={async (v) => {
                  await mutation.mutateAsync(v);
                }}
              >
                <div className="flex w-full flex-col gap-4">
                  <p className="text-base font-semibold">
                    {viewTaskSelected.identifier}
                  </p>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            // placeholder="Enter title..."
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
                          <TaskContentEditor {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="status"
                      defaultValue={viewTaskSelected.status}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.status
                              value={field.value}
                              defaultValue={viewTaskSelected.status}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      defaultValue={viewTaskSelected.priority}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.priority
                              value={field.value}
                              defaultValue={viewTaskSelected.priority}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="label"
                      defaultValue={viewTaskSelected.label}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <tasksPropertiesComponents.label
                              value={field.value}
                              defaultValue={viewTaskSelected.label}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueOfDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  {/* <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.reset();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button> */}
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-24"
                  >
                    {mutation.isPending ? <LoaderCircle /> : "Save"}
                  </Button>
                </div>
              </Form>
            </div>
          ) : (
            <div>No tasks found</div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
