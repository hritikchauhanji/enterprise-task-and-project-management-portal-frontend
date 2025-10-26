"use client";

import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  id?: string; // ✅ add support for id
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean; // ✅ add support for disabled
}

export function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Select items...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleItem = (val: string) => {
    if (disabled) return;
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeItem = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div id={id} className="w-full relative">
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex flex-wrap gap-2 items-center border rounded-md px-3 py-2 bg-white cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value.length > 0 ? (
          value.map((val) => (
            <Badge
              key={val}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {options.find((o) => o.value === val)?.label || val}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => removeItem(val, e)}
              />
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 w-full border rounded-md mt-1 p-1 bg-white shadow-md">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList className="max-h-40 overflow-y-auto">
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleItem(option.value)}
                    className="flex justify-between"
                  >
                    {option.label}
                    {value.includes(option.value) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
