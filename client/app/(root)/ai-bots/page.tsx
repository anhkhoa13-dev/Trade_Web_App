import React from "react";
import AiBotIntro from "./_components/AiBotIntro";
import { FilterSortBar } from "./_components/FilterSortBar";
import { BotCard } from "./_components/BotCard";
import { BotConfigDialog } from "./_components/BotConfigDialog";
import { PaginationBar } from "../../ui/my_components/PaginationBar";
import { getPublicBotsAction } from "@/actions/bot.actions";
import { SortOption, TimeWindow } from "@/backend/bot/bot.types";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AiBotPage({ searchParams }: Props) {
  const search = await searchParams;

  // Parse URL parameters with defaults
  const searchQuery = (search.search as string) || "";
  const sort = (search.sort as SortOption) || "pnl";
  const timeWindow = (search.timeWindow as TimeWindow) || "7d";
  const currentPage = parseInt((search.page as string) || "1", 10);
  const pageSize = 9;

  // Fetch data server-side
  const data = await getPublicBotsAction({
    page: currentPage,
    size: pageSize,
    search: searchQuery,
    sort,
    timeWindow,
  });

  const bots = data?.data?.result || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages || 1;
  const totalItems = meta?.total || 0;

  return (
    <main className="flex flex-col w-full max-w-6xl mx-auto px-4 py-8 bg-background">
      {/* Intro section */}
      <AiBotIntro
        totalBots={totalItems}
        activeTraders={53244}
        totalValue={351000}
      />

      {/* Sort / Filter Bar */}
      <section className="mb-6 w-full flex flex-col justify-between">
        <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>
        <FilterSortBar
          enableSearch={true}
          searchValue={searchQuery}
          sortValue={sort}
          timeWindow={timeWindow}
          pageNumber={currentPage}
        />
      </section>

      {/* Bot Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {bots.map((bot) => (
          <BotCard
            key={bot.botId}
            id={bot.botId}
            name={bot.name}
            roi={bot.averageRoi || 0}
            pnl={bot.totalPnl || 0}
            maxDrawdown={bot.maxDrawdown || 0}
            coin={bot.coinSymbol || ""}
            activeUsers={bot.activeSubscribers || 0}
            timeWindow={timeWindow}
            priority={sort}
          />
        ))}
      </section>

      {/* Pagination */}
      <PaginationBar
        totalItems={totalItems}
        itemsPerPage={pageSize}
        currentPage={currentPage}
      />

      <section id="how-to">
        <h2>How To Use</h2>
        <p>Here is the tutorial...</p>
      </section>
    </main>
  );
}
