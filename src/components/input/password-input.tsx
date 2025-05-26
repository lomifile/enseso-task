import { cn } from "../../utils/merge";
import { Eye, EyeOff } from "lucide-react";
import { useState, ComponentPropsWithRef } from "react";

interface PasswordInputProps
  extends Omit<ComponentPropsWithRef<"input">, "type"> {
  label?: string;
  error?: string;
}

const PasswordInput = ({ label, error, ...props }: PasswordInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 justify-center mb-5">
      {label && <label className="text-md">{label}</label>}
      <div
        className={cn(
          "border-1 border-gray-200 p-1 rounded-md flex flex-row items-center",
          focus && "border-teal-500",
          props.className && props.className,
          error &&
            "border-red-800 active:outline-red-800 focus:outline-red-800",
        )}
      >
        <input
          className="focus:outline-none active:outline-none"
          type={passwordVisible ? "text" : "password"}
          {...props}
          onFocus={(ev) => {
            setFocus(true);
            if (props.onFocus) props.onFocus(ev);
          }}
          onBlur={(ev) => {
            setFocus(false);
            if (props.onBlur) props.onBlur(ev);
          }}
        />
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? (
            <Eye className="text-gray-700" />
          ) : (
            <EyeOff className="text-gray-700" />
          )}
        </button>
      </div>
      {error && (
        <span className="text-red-800 text-xs mt-1/2 ml-4 h-4 leading-4 overflow-hidden whitespace-nowrap text-ellipsis">
          {error}
        </span>
      )}
    </div>
  );
};

export { PasswordInput };
