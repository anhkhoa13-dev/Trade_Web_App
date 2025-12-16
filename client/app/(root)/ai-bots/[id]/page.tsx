import BotDetailsContent from "./_components/BotDetailsContent";
import { TimeWindow } from "@/backend/bot/bot.types";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BotDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const timeframe = (search.timeframe as TimeWindow) || "7d";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      <BotDetailsContent botId={id} timeframe={timeframe} />
    </div>
  );
}
