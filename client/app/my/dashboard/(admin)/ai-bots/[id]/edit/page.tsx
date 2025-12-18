import { getBotForEditAction } from "@/actions/bot.actions"; // Import Action fetch
import AdminBotEditClient from "./_components/AdminBotEdit"; // Đổi tên component import cho rõ nghĩa
import { Button } from "@/app/ui/shadcn/button";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBotEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const botId = resolvedParams.id;


  const botResponse = await getBotForEditAction(botId);

  if (botResponse.status == "error") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">Bot Not Found</h2>
        <p className="text-muted-foreground">
          Could not find the bot with ID: {botId}
        </p>
        <Link href="/my/dashboard/ai-bots/overview">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
      </div>
    );
  }


  return <AdminBotEditClient bot={botResponse.data} botId={botId} />;
}