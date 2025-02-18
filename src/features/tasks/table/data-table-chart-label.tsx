"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TasksDataFiltered } from "../data/filters";

export const description = "A donut chart with text";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

type FillTable = {
  fill: string;
}[];

const fillTable: FillTable = [
  { fill: "var(--color-bug" },
  { fill: "var(--color-feature" },
  { fill: "var(--color-documentation" },
  { fill: "var(--color-update" },
  { fill: "var(--color-other" },
];

const chartConfig = {
  tasks: {
    label: "Visitors",
  },
  bug: {
    label: "Bugs",
    color: "hsl(var(--chart-1))",
  },
  feature: {
    label: "Features",
    color: "hsl(var(--chart-2))",
  },
  documentation: {
    label: "Docs",
    color: "hsl(var(--chart-3))",
  },
  update: {
    label: "Update",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type DataTableChartProps = {
  table: TasksDataFiltered["label"];
};

export function DataTableChartLabel({ table }: DataTableChartProps) {
  const totalVisitors = React.useMemo(() => {
    return table.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  const mergedTable = table.map((item, idx) => ({
    ...item,
    fill: fillTable[idx]?.fill || item.fill,
  }));

  return (
    <Card className="flex flex-col bg-zinc-900/30">
      <CardHeader className="items-center pb-0">
        <CardTitle>Labels Overview</CardTitle>
        <CardDescription>Distribution by label</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={mergedTable}
              dataKey="count"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          <Sigma className="size-4" />
          {"(task) = "}
          {reducer(table.map((t) => t.count))}{" "}
        </div> */}
        <div className="leading-none text-muted-foreground">
          <p>Distribution of tasks according to their status.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
