"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Settings } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

export function DataTableSettings() {
  const [itemColor, setItemColor, removeItemColor] = useLocalStorage(
    "itemColor",
    false,
  );
  const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const [labelFlag, setLabelFlag, removeLabelFlag] = useLocalStorage(
    "labelFlag",
    true,
  );

  return (
    <div className="mx-2 flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"ghost"} className="h-8 px-2 lg:px-3">
            <Settings className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col gap-2 space-x-2">
          <h4 className="text-sm font-semibold">Custom style</h4>
          <Separator className="my-2" />
          {/* <div className="flex items-center justify-between"> */}
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="Active item color" className="flex-1 text-sm">
              Color
            </Label>
            <Switch
              id="Active item color"
              className="scale-75"
              checked={itemColor}
              onClick={() => setItemColor(!itemColor)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="Active dot color" className="flex-1 text-sm">
              Dot
            </Label>
            <Switch
              id="Active dot color"
              className="scale-75"
              checked={dot}
              onClick={() => setDot(!dot)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="Active label flag" className="flex-1 text-sm">
              Label flag
            </Label>
            <Switch
              id="Active label flag"
              className="scale-75"
              checked={labelFlag}
              onClick={() => setLabelFlag(!labelFlag)}
            />
          </div>
          {/* </div> */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
