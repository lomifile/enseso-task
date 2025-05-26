import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";

const Select = React.forwardRef<HTMLButtonElement, SelectPrimitive.SelectProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={forwardedRef}
          className="flex flex-row w-full justify-between mb-4 border-gray-300 p-1.5 rounded-md border-1 text-sm items-center cursor-pointer"
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="bg-white rounded-xl z-[999] p-2 border-1 border-gray-300 shadow-xl">
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      className="flex flex-col gap-2 p-2 hover:cursor-pointer hover:bg-teal-800 hover:text-white rounded-sm"
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText className="text-sm">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

export { Select, SelectItem };
