// app/ai-bots/[id]/page.tsx
import BotDetailsContent from "./_components/BotDetailsContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BotDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      <BotDetailsContent botId={id} />
    </div>
  );
}
