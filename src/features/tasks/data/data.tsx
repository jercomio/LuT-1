import { HighBars } from "@/../public/assets/svg/high-bars";
import { LowBars } from "@/../public/assets/svg/low-bars";
import { MediumBars } from "@/../public/assets/svg/medium-bars";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  LightningBoltIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "update",
    label: "Update",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
  {
    value: "others",
    label: "Others",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "No priority",
    value: "no priority",
    icon: DotsHorizontalIcon,
    color: "gray",
  },
  {
    label: "Low",
    value: "low",
    icon: LowBars,
    color: "green",
  },
  {
    label: "Medium",
    value: "medium",
    icon: MediumBars,
    color: "yellow",
  },
  {
    label: "High",
    value: "high",
    icon: HighBars,
    color: "orange",
  },
  {
    label: "Urgent",
    value: "urgent",
    icon: LightningBoltIcon,
    color: "red",
  },
];
