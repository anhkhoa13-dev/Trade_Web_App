import { Suspense } from "react";
import VerifyCard from "./VerifyCard";
import { GlobalLoader } from "@/app/ui/my_components/GlobalLoader";

export default function Page() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <Suspense fallback={<GlobalLoader show={true} />}>
        <VerifyCard />
      </Suspense>
    </div>
  );
}
