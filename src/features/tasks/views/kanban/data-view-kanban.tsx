"use client";

import { UserCircleDashedFill } from "@/components/svg/user-dashed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, daysRemaining, slugify } from "@/lib/utils";
import {
  ArrowDownUp,
  CalendarIcon,
  CircleDot,
  CircleX,
  EllipsisVertical,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { statuses } from "../../data/data";
import { type Task } from "../../data/schema";
import { sortDataByIdentifier } from "../../data/sorting";
import { DataTableCreateTask } from "../../table/create";
import { itemStyle, priorityWithIcon } from "../../utils";
import { updateStatus } from "./kanban.action";

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

export function DataViewKanban({ data, className, members }: DataTableProps) {
  const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const [dateTimeToggle, setDateTimeToggle] = React.useState(false);
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
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc",
  );

  const params = useParams<{ orgSlug: string }>();
  const session = useSession();
  const router = useRouter();

  const tableFilteredByStatus = data.map((task) => task.status);
  const status = statuses.find(
    (status) => status.value === tableFilteredByStatus[0],
  );

  const taskCountByStatus = statuses.reduce(
    (acc, status) => {
      acc[status.value] = data.filter(
        (task) => task.status === status.value,
      ).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tasks = sortDataByIdentifier(data);

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  const member = members.find(
    (member) => member.email === session.data.user?.email,
  );

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

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-2 rounded-lg",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-8">
        {statuses.length > 0 ? (
          statuses.map((status) => (
            <div key={status.value} className="flex flex-col gap-4">
              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <status.icon className="size-4" />
                  <span>{status.label}</span>
                  <span className="ml-1 flex min-w-8 cursor-default items-center justify-center rounded-full border border-zinc-500 bg-zinc-800/50 px-1 text-xs text-zinc-500">
                    {taskCountByStatus[status.value]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DataTableCreateTask
                    table={data}
                    type={"simple"}
                    status={status.value}
                    className="scale-75"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 p-1"
                    onClick={() =>
                      setSortDirection(
                        sortDirection === "desc" ? "asc" : "desc",
                      )
                    }
                  >
                    <ArrowDownUp className="size-auto" />
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <Button variant={"ghost"} className="scale-75 px-1">
                        <EllipsisVertical className="size-auto" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit px-3 py-2 text-xs">
                      <p className="mb-1 flex items-center justify-between text-sm font-semibold">
                        Options
                      </p>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between gap-2 py-1">
                        <Label className="flex-1 text-sm">
                          All DateTime Badge
                        </Label>
                        <Switch
                          checked={dateTimeToggle}
                          onClick={() => setDateTimeToggle(!dateTimeToggle)}
                          className="scale-75"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 py-1">
                        <Label
                          htmlFor="Active dot color"
                          className="flex-1 text-sm"
                        >
                          Dot
                        </Label>
                        <Switch
                          id="Active dot color"
                          className="scale-75"
                          checked={dot}
                          onClick={() => setDot(!dot)}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 py-1">
                        <Label
                          htmlFor="Active item color"
                          className="flex-1 text-sm"
                        >
                          Color
                        </Label>
                        <Switch
                          id="Active item color"
                          className="scale-75"
                          checked={itemColor}
                          onClick={() => setItemColor(!itemColor)}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 py-1">
                        <Label
                          htmlFor="Active label flag"
                          className="flex-1 text-sm"
                        >
                          Label flag
                        </Label>
                        <Switch
                          id="Active label flag"
                          className="scale-75"
                          checked={labelFlag}
                          onClick={() => setLabelFlag(!labelFlag)}
                        />
                      </div>
                      {status.value !== "canceled" ? (
                        <div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between gap-2 py-1">
                            <Label
                              htmlFor="Active label flag"
                              className="flex-1 text-sm"
                            >
                              Show Cancel Button
                            </Label>
                            <Switch
                              id="Active label flag"
                              className="scale-75"
                              checked={cancelTaskButton}
                              onClick={() =>
                                setCancelTaskButton(!cancelTaskButton)
                              }
                            />
                          </div>
                        </div>
                      ) : null}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {tasks
                  .filter((task) => task.status === status.value)
                  .sort((a, b) => {
                    if (sortDirection === "desc") {
                      if (a.identifier < b.identifier) return 1;
                      if (a.identifier > b.identifier) return -1;
                    } else {
                      if (a.identifier < b.identifier) return -1;
                      if (a.identifier > b.identifier) return 1;
                    }
                    return 0;
                  })
                  .map((task) => (
                    <Card
                      key={task.identifier}
                      className={cn(
                        "rounded-lg bg-zinc-900/50 w-80 hover:bg-zinc-900/75 overflow-hidden",
                        itemColor ? itemStyle(task.priority, true) : null,
                      )}
                      onClick={() =>
                        handleClick({
                          identifier: task.identifier,
                          title: task.title,
                        })
                      }
                    >
                      <CardHeader className="flex flex-row items-center justify-between p-3">
                        <div className="flex items-center gap-1">
                          <span>
                            {dot && (
                              <CircleDot
                                className={cn(
                                  itemStyle(task.priority),
                                  "size-3",
                                )}
                              />
                            )}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {task.identifier}
                          </span>
                          <div className="flex items-center gap-1">
                            {cancelTaskButton && status.value !== "canceled" ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant={"ghost"}
                                      className="group m-0 size-6 p-0"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        await updateStatus(task);
                                        router.refresh();
                                      }}
                                    >
                                      <CircleX className="stroke-gray-500 p-[0.1rem]" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="rounded-lg bg-zinc-950">
                                    <p className="text-xs">
                                      Move to Canceled status
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : null}
                          </div>
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
                            <status.icon
                              className={cn(
                                "mr-2 size-4 text-muted-foreground stroke-zinc-300/70",
                              )}
                            />
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
                            {(task.dueOfDate as Date) >= new Date() ||
                            dateTimeToggle ? (
                              <span>
                                <Badge
                                  variant={"outline"}
                                  className="text-xs font-light text-zinc-400"
                                >
                                  <CalendarIcon className="mr-1 size-3 opacity-50" />
                                  {daysRemaining(
                                    task.dueOfDate as Date,
                                    new Date(),
                                  )}
                                </Badge>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 p-2">
            <p className="text-sm font-semibold">No statuses detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
