import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-900 border border-border hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
