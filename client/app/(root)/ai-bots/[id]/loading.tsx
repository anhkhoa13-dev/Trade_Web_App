import { cn } from "@/lib/utils";
import { Spinner } from "@/app/ui/shadcn/spinner";

export default function Loading() {
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
