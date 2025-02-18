import { ListPlus, Plus, type LucideProps } from "lucide-react";

const CreateTaskButton = {
  icon: "icon",
  simple: "simple",
  text: "text",
} as const;

export type CreateTaskButton = typeof CreateTaskButton[keyof typeof CreateTaskButton];

type CreateTaskButtonStyleProps = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  simple: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  text: string;
}

export const CreateTaskButtonStyle: CreateTaskButtonStyleProps = {
  icon: ListPlus,
  simple: Plus,
  text: "Add Task",
};
