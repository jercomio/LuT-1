import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

type Props = {
  className?: string;
  size?: number;
};

export function LoaderCircle({ className, size }: Props) {
  return (
    <LoaderCircleIcon className={cn("animate-spin", className)} size={size} />
  );
}
