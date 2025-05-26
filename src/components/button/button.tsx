import { ComponentPropsWithRef } from "react";
import { cn } from "../../utils/merge";
import { Loader2 } from "lucide-react";

interface ButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "disabled"> {
  isLoading?: boolean;
}

const Button = ({ isLoading, children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "flex flex-row py-3 px-5 rounded-2xl bg-teal-800 text-white text-md disabled:bg-teal-500 hover:cursor-pointer disabled:cursor-not-allowed",
        className && className,
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

export { Button, type ButtonProps };
