import { cn } from "@/lib/utils";
import { Spinner } from "../shadcn/spinner";

export function GlobalLoader() {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/70 backdrop-blur-sm",
      )}
    >
      <Spinner />
    </div>
  );
}
