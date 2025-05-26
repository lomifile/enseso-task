import { ComponentPropsWithRef } from "react";
import { cn } from "../../utils/merge";

interface InputProps extends ComponentPropsWithRef<"input"> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 mb-5">
      {label && <label className="text-md">{label}</label>}
      <input
        className={cn(
          "border-1 border-gray-200 p-1 rounded-md active:outline-teal-500 focus:outline-teal-500",
          props.className && props.className,
          error &&
            "border-red-800 outline-red-800 active:outline-red-800 focus:outline-red-800",
        )}
        {...props}
      />
      {error && (
        <span className="text-red-800 text-xs mt-1/2 ml-4 h-4 leading-4 overflow-hidden whitespace-nowrap text-ellipsis">
          {error}
        </span>
      )}
    </div>
  );
};

export { Input };
