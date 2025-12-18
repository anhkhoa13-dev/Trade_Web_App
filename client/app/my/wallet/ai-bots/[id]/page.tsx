
import { getSubscriptionDetail } from "@/actions/botSub.actions";
import { Button } from "@/app/ui/shadcn/button";
import Link from "next/link";
import SubscriptionDetailClient from "./_components/SubscriptionDetailClient";
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MySubscriptionDetailPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const subscriptionId = params.id;

  const rawTimeframe = searchParams.timeframe;
  const timeframe: "current" | "1d" | "7d" =
    (typeof rawTimeframe === "string" && ["current", "1d", "7d"].includes(rawTimeframe))
      ? (rawTimeframe as "current" | "1d" | "7d")
      : "current";

  const subscription = await getSubscriptionDetail(subscriptionId, timeframe);

  if (subscription.status == "error") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Subscription Not Found</h2>
        <p className="text-muted-foreground">
          The requested bot subscription could not be loaded.
        </p>
        <Link href="/my/wallet/ai-bots">
          <Button variant="secondary">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <SubscriptionDetailClient
      subscription={subscription.data}
      subscriptionId={subscriptionId}
      currentTimeframe={timeframe}
    />
  );
}