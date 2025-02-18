import { type GlobalSettings, taskItemGap } from "@/types/settings.types";

export const globalSettings: GlobalSettings[] = [
  {
    id: 1,
    name: "settings",
    description: "Global settings for Lunar Tasks Application",
    createdAt: new Date(),
    updateAt: new Date(),
    theme: "dark",
    app: {
      name: "LuT-1",
    },
    tasks: {
      textSize: "text-sm",
      gap: taskItemGap.sm,
      color: "text-zinc-100",
    },
  },
];
