import { searchCoins } from "@/actions/gecko.actions";
import { auth } from "@/auth";
import AdvancedRealTimeChartWidget from "@/app/ui/widgets/AdvancedRealTimeChartWidget";
import TradeHeader from "../_components/TradeHeader";
import TradePageContent from "../_components/TradePageContent";

interface TradePageProps {
  params: Promise<{ symbol: string }>;
}

export default async function TradePage({ params }: TradePageProps) {
  const { symbol } = await params;

  const [initialCoins, session] = await Promise.all([
    searchCoins(),
    auth(),
  ]);

  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col bg-background text-foreground gap-3">
      {/* Header */}
      <TradeHeader
        symbol={symbol}
        initialCoins={initialCoins}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content */}
      <TradePageContent symbol={symbol} isLoggedIn={isLoggedIn} />
    </div>
  );
}
