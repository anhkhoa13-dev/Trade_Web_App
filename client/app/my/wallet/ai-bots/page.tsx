import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { getUserSubscriptions } from "@/actions/botSub.actions";
import SubscriptionListClient from "./_components/SubscriptionListClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MySubscriptionsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  // 3. Fetch Data trực tiếp từ Server Action
  const subscriptionResponse = await getUserSubscriptions({
    page,
    size: pageSize,
  });

  if (subscriptionResponse.status == "error") {
    throw new Error(subscriptionResponse.message)
  }

  const subscriptionData = subscriptionResponse.data

  const hasSubscriptions = subscriptionData.result && subscriptionData.result.length > 0;

  if (!hasSubscriptions && page === 1) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Active Bots</h1>
            <p className="text-muted-foreground">
              Manage your subscribed trading bots and monitor performance
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-muted/20">
          <Bot className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Bots Yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            You haven't copied any trading bots yet. Browse our marketplace to
            find the perfect bot for your trading strategy.
          </p>
          <Link href="/ai-bots">
            <Button size="lg" className="gap-2">
              <Bot className="h-5 w-5" />
              Browse Trading Bots
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Active Bots</h1>
          <p className="text-muted-foreground">
            Manage your subscribed trading bots and monitor performance
          </p>
        </div>
      </div>

      <SubscriptionListClient
        data={subscriptionData}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  );
}