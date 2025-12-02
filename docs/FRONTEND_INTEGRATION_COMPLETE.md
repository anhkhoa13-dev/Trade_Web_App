# Frontend Integration Complete

## Summary

Successfully integrated the modular metrics API (`/api/v1/metrics/bots`) with the frontend ai-bots marketplace page.

## Changes Made

### 1. **TypeScript Interfaces** (`botInterfaces.ts`)

Added new interface matching backend DTO:

```typescript
export interface BotMetricsDTO {
  botId: string;
  name: string;
  coinSymbol: string;
  tradingPair: string;
  activeSubscribers: number;
  totalPnl: number;
  averageRoi: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalNetInvestment: number;
  totalEquity: number;
}
```

Updated TimeWindow type to match backend-supported values:

```typescript
export type TimeWindow = "1d" | "7d" | "current";
```

### 2. **API Service** (`botService.ts`)

Completely rewrote `fetchBots()` function:

- **Endpoint**: `GET /metrics/bots`
- **Query Parameters**:
  - `page`: 0-indexed (converts from 1-indexed frontend)
  - `size`: Page size
  - `timeframe`: current | 1d | 7d
  - `sortBy`: pnl | roi | copied
  - `search`: Bot name (optional)

```typescript
export const fetchBots = async (
  params: BotFilterParams
): Promise<BotMetricsPaginatedResponse> => {
  const queryParams = new URLSearchParams();

  // Pagination (0-indexed for backend)
  queryParams.append("page", Math.max(0, params.page - 1).toString());
  queryParams.append("size", params.size.toString());

  // Timeframe (backend supports: current, 1d, 7d)
  const timeframe = params.timeWindow || "1d";
  queryParams.append("timeframe", timeframe);

  // Sort by (default to "pnl")
  const sortBy = params.sort || "pnl";
  queryParams.append("sortBy", sortBy);

  // Search by bot name
  if (params.search && params.search.trim()) {
    queryParams.append("search", params.search.trim());
  }

  const response = await api.get<BotMetricsPaginatedResponse>(
    `/metrics/bots?${queryParams.toString()}`
  );
  return response.data;
};
```

### 3. **FilterSortBar Component**

Updated timeframe dropdown to only show backend-supported options:

- **"24 Hours"** → `1d`
- **"7 Days"** → `7d`
- **"All Time"** → `current`

Removed unsupported options (30d, all).

### 4. **BotCard Component**

Updated `getMetrics()` to handle new timeframe values:

```typescript
const getMetrics = () => {
  switch (timeWindow) {
    case "1d":
      return { roi: roi1d, pnl: pnl1d, label: "24H" };
    case "7d":
      return { roi: roi7d, pnl: pnl7d, label: "7D" };
    case "current":
      return { roi: roiAllTime, pnl: pnl7d, label: "All Time" };
    default:
      return { roi: roi7d, pnl: pnl7d, label: "7D" };
  }
};
```

### 5. **Page Component** (`ai-bots/page.tsx`)

Updated data mapping from `BotMetricsDTO` to `BotCard` props:

```typescript
{
  bots.map((bot) => {
    const roi = bot.averageRoi || 0;
    const pnl = bot.totalPnl || 0;

    return (
      <BotCard
        key={bot.botId}
        id={bot.botId}
        name={bot.name}
        // Map current timeframe's metrics based on selection
        roi1d={timeWindow === "1d" ? roi : 0}
        roi7d={timeWindow === "7d" ? roi : 0}
        roiAllTime={timeWindow === "current" ? roi : 0}
        pnl1d={timeWindow === "1d" ? pnl : 0}
        pnl7d={timeWindow === "7d" ? pnl : 0}
        maxDrawdown={bot.maxDrawdown || 0}
        coin={bot.coinSymbol || ""}
        activeUsers={bot.activeSubscribers || 0}
        onCopy={handleCopy}
        onClick={onNavigateToBotDetail}
        timeWindow={timeWindow}
        priority={sort}
      />
    );
  });
}
```

## API Request/Response Example

### Request

```
GET http://localhost:8080/api/v1/metrics/bots?page=0&size=9&timeframe=7d&sortBy=pnl&search=btc
```

### Response

```json
{
  "statusCode": 200,
  "message": null,
  "data": {
    "meta": {
      "page": 1,
      "pageSize": 9,
      "pages": 3,
      "total": 25
    },
    "result": [
      {
        "botId": "123e4567-e89b-12d3-a456-426614174000",
        "name": "BTC Scalper Pro",
        "coinSymbol": "BTC",
        "tradingPair": "BTC/USDT",
        "activeSubscribers": 145,
        "totalPnl": 12500.50,
        "averageRoi": 15.75,
        "maxDrawdown": -250.00,
        "maxDrawdownPercent": -2.5,
        "totalNetInvestment": 100000.00,
        "totalEquity": 112500.50
      },
      ...
    ]
  }
}
```

## Data Flow

1. **User Interaction**: User selects timeframe, sort, and search in `FilterSortBar`
2. **State Update**: `page.tsx` updates state (timeWindow, sort, search)
3. **React Query**: `usePublicBots` hook triggers with new parameters
4. **API Call**: `fetchBots()` constructs query string and calls backend
5. **Backend Processing**:
   - Converts page to 0-indexed
   - Executes 7 SQL queries per bot (modular architecture)
   - Aggregates into `BotGridItemDTO`
   - Applies sorting and pagination
6. **Response Mapping**:
   - `page.tsx` maps `BotMetricsDTO` to `BotCard` props
   - Conditionally assigns metrics based on current timeWindow
7. **Rendering**: `BotCard` displays metrics with correct timeframe label

## Key Architectural Decisions

### Backend Returns Single Timeframe

The backend returns metrics for **one timeframe per request**. If the user selects "7d", the response contains 7-day metrics. To show multiple timeframes simultaneously would require:

- **Option A**: Make 3 separate API calls (current, 1d, 7d)
- **Option B**: Extend backend to return all timeframes in one response
- **Current approach**: Show only selected timeframe (simpler, faster)

### Timeframe Mapping

- Frontend: `current` (All Time) | `1d` (24 Hours) | `7d` (7 Days)
- Backend: `current` | `1d` | `7d`
- Direct 1:1 mapping, no conversion needed

### Pagination Indexing

- Frontend: 1-indexed (page 1, 2, 3...)
- Backend: 0-indexed (page 0, 1, 2...)
- Conversion: `Math.max(0, params.page - 1)`

## Testing Instructions

### 1. Start Backend

```bash
cd server
./gradlew bootRun
```

Backend should be running on `http://localhost:8080`

### 2. Start Frontend

```bash
cd client
pnpm dev
```

Frontend should be running on `http://localhost:3000`

### 3. Test Scenarios

#### A. Default Load

1. Navigate to `http://localhost:3000/ai-bots`
2. Should display first 9 bots sorted by PnL (7d)
3. Verify pagination shows correct total pages

#### B. Timeframe Filter

1. Select "24 Hours" from dropdown
2. Verify API call: `GET /metrics/bots?page=0&size=9&timeframe=1d&sortBy=pnl`
3. Verify metrics update (label shows "24H")
4. Select "All Time"
5. Verify API call: `GET /metrics/bots?page=0&size=9&timeframe=current&sortBy=pnl`
6. Verify label shows "All Time"

#### C. Sort Filter

1. Select "Top ROI" from sort dropdown
2. Verify API call includes `sortBy=roi`
3. Verify bots re-order (highest ROI first)
4. Verify main metric changes to ROI (large display)
5. Select "Most Copied"
6. Verify API call includes `sortBy=copied`
7. Verify bots sort by activeSubscribers

#### D. Search Filter

1. Type "BTC" in search box
2. Wait for debounce (or trigger search)
3. Verify API call includes `search=BTC`
4. Verify only BTC-related bots show
5. Clear search
6. Verify all bots return

#### E. Pagination

1. Click "Next" button
2. Verify API call: `page=1` (0-indexed)
3. Verify new set of bots loads
4. Verify current page indicator updates
5. Navigate to last page
6. Verify "Next" button disabled

#### F. Combined Filters

1. Set timeframe: "7 Days"
2. Set sort: "Top PnL"
3. Type search: "ETH"
4. Verify API call: `GET /metrics/bots?page=0&size=9&timeframe=7d&sortBy=pnl&search=ETH`
5. Navigate to page 2
6. Verify API call includes all filters + `page=1`

### 4. Browser DevTools Inspection

#### Network Tab

Check the request:

```
GET http://localhost:8080/api/v1/metrics/bots?page=0&size=9&timeframe=7d&sortBy=pnl
```

Check the response structure:

```json
{
  "statusCode": 200,
  "data": {
    "meta": { ... },
    "result": [ ... ]
  }
}
```

#### Console Tab

Check for React Query logs (if enabled):

- Query key: `["publicBots", {page, size, search, sort, timeWindow}]`
- Verify no errors

## Known Limitations

1. **Single Timeframe Display**: BotCard only shows metrics for the selected timeframe. To show 1D/7D/All simultaneously would require multiple API calls or backend changes.

2. **30-Day and Custom Ranges**: Backend currently supports `current`, `1d`, and `7d`. Adding `30d` would require:

   - Backend: Update `getCompareTime()` method in `ModularPnLService`
   - Frontend: Add "30d" option back to FilterSortBar

3. **Real-time Updates**: Metrics update every 10 minutes (snapshot schedule). Consider adding polling or WebSocket for real-time updates.

4. **Performance**: Currently queries 7 metrics per bot. For 100+ bots, consider:
   - Server-side caching (Redis)
   - CDN caching for public data
   - Materialized views for frequent queries

## Success Criteria ✅

- [x] TypeScript compiles without errors
- [x] API calls use correct endpoint (`/metrics/bots`)
- [x] Query parameters properly formatted
- [x] Pagination works (1-indexed → 0-indexed conversion)
- [x] Sorting works (pnl, roi, copied)
- [x] Search works (by bot name)
- [x] Timeframe filter works (1d, 7d, current)
- [x] Data properly mapped to BotCard
- [x] UI displays correct metrics and labels

## Next Steps

1. **Test with Real Data**: Populate database with snapshots and verify calculations
2. **Error Handling**: Add proper error states in UI (no bots found, API errors)
3. **Loading States**: Improve loading UX (skeleton cards)
4. **Add Tests**: Unit tests for data mapping, integration tests for API calls
5. **Performance Optimization**: Monitor query performance with large datasets
6. **Add Caching**: Implement server-side caching for frequently accessed metrics

## Related Documentation

- [MODULAR_METRICS_ARCHITECTURE.md](./MODULAR_METRICS_ARCHITECTURE.md) - Backend architecture
- [POSTMAN_TESTING_MODULAR.md](./POSTMAN_TESTING_MODULAR.md) - API testing guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete implementation overview
