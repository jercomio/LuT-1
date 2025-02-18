"use client";

import { Sigma } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { reducer } from "@/lib/utils";
import type { TasksFilteredByPriority } from "../data/filters";

export const barChart_description = "A bar chart with a label";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type DataTableChartProps = {
  table: TasksFilteredByPriority[];
};

export function DataTableChartPriority({ table }: DataTableChartProps) {
  return (
    <Card className="bg-zinc-900/30">
      <CardHeader>
        <CardTitle>Priorities Overview</CardTitle>
        <CardDescription>Distribution by priority</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={table}
            margin={{
              top: 20,
            }}
            barSize={50}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="priority"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickCount={5}
              name="Numbers of tasks"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="count" fill={"var(--color-desktop)"} radius={5}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-0 font-medium leading-none">
          <Sigma className="size-4" />
          {"(task) = "}
          {reducer(table.map((t) => t.count))}{" "}
        </div>
        <div className="leading-none text-muted-foreground">
          <p>Distribution of tasks according to their priority.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
