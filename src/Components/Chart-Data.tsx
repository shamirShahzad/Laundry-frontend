import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  orders: {
    label: "Orders",
  },
  order: {
    label: "Order",
    color: "#1994d1",
  },
} satisfies ChartConfig;

//TODO :GET FROM API / MAKE THE API FOR IT
const chartData = [
  { date: "2024-04-01", order: 222 },
  { date: "2024-04-02", order: 97 },
  { date: "2024-04-03", order: 167 },
  { date: "2024-04-04", order: 242 },
  { date: "2024-04-05", order: 373 },
  { date: "2024-04-06", order: 301 },
  { date: "2024-04-07", order: 245 },
  { date: "2024-04-08", order: 409 },
  { date: "2024-04-09", order: 59 },
  { date: "2024-04-10", order: 261 },
  { date: "2024-04-11", order: 327 },
  { date: "2024-04-12", order: 292 },
  { date: "2024-04-13", order: 342 },
  { date: "2024-04-14", order: 137 },
  { date: "2024-04-15", order: 120 },
  { date: "2024-04-16", order: 138 },
  { date: "2024-04-17", order: 446 },
  { date: "2024-04-18", order: 364 },
  { date: "2024-04-19", order: 243 },
  { date: "2024-04-20", order: 89 },
  { date: "2024-04-21", order: 137 },
  { date: "2024-04-22", order: 224 },
  { date: "2024-04-23", order: 138 },
  { date: "2024-04-24", order: 387 },
  { date: "2024-04-25", order: 215 },
  { date: "2024-04-26", order: 75 },
  { date: "2024-04-27", order: 383 },
  { date: "2024-04-28", order: 122 },
  { date: "2024-04-29", order: 315 },
  { date: "2024-04-30", order: 454 },
  { date: "2024-05-01", order: 165 },
  { date: "2024-05-02", order: 293 },
  { date: "2024-05-03", order: 247 },
  { date: "2024-05-04", order: 385 },
  { date: "2024-05-05", order: 481 },
  { date: "2024-05-06", order: 498 },
  { date: "2024-05-07", order: 388 },
  { date: "2024-05-08", order: 149 },
  { date: "2024-05-09", order: 227 },
  { date: "2024-05-10", order: 293 },
  { date: "2024-05-11", order: 335 },
  { date: "2024-05-12", order: 197 },
  { date: "2024-05-13", order: 197 },
  { date: "2024-05-14", order: 448 },
  { date: "2024-05-15", order: 473 },
  { date: "2024-05-16", order: 338 },
  { date: "2024-05-17", order: 499 },
  { date: "2024-05-18", order: 315 },
  { date: "2024-05-19", order: 235 },
  { date: "2024-05-20", order: 177 },
  { date: "2024-05-21", order: 82 },
  { date: "2024-05-22", order: 81 },
  { date: "2024-05-23", order: 252 },
  { date: "2024-05-24", order: 294 },
  { date: "2024-05-25", order: 201 },
  { date: "2024-05-26", order: 213 },
  { date: "2024-05-27", order: 420 },
  { date: "2024-05-28", order: 233 },
  { date: "2024-05-29", order: 78 },
  { date: "2024-05-30", order: 340 },
  { date: "2024-05-31", order: 178 },
  { date: "2024-06-01", order: 178 },
  { date: "2024-06-02", order: 470 },
  { date: "2024-06-03", order: 103 },
  { date: "2024-06-04", order: 439 },
  { date: "2024-06-05", order: 88 },
  { date: "2024-06-06", order: 294 },
  { date: "2024-06-07", order: 323 },
  { date: "2024-06-08", order: 385 },
  { date: "2024-06-09", order: 438 },
  { date: "2024-06-10", order: 155 },
  { date: "2024-06-11", order: 92 },
  { date: "2024-06-12", order: 492 },
  { date: "2024-06-13", order: 81 },
  { date: "2024-06-14", order: 426 },
  { date: "2024-06-15", order: 307 },
  { date: "2024-06-16", order: 371 },
  { date: "2024-06-17", order: 475 },
  { date: "2024-06-18", order: 107 },
  { date: "2024-06-19", order: 341 },
  { date: "2024-06-20", order: 408 },
  { date: "2024-06-21", order: 169 },
  { date: "2024-06-22", order: 317 },
  { date: "2024-06-23", order: 480 },
  { date: "2024-06-24", order: 132 },
  { date: "2024-06-25", order: 141 },
  { date: "2024-06-26", order: 434 },
  { date: "2024-06-27", order: 448 },
  { date: "2024-06-28", order: 149 },
  { date: "2024-06-29", order: 103 },
  { date: "2024-06-30", order: 446 },
];
const ChartData = () => {
  const [timeRange, setTimeRange] = useState("90d");
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Orders for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOrder" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-order)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-order)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={"order"}
              type={"natural"}
              fill="url(#fillOrder)"
              stroke="var(--color-order)"
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartData;
