# Bot Detail Page API Documentation

## Overview

API endpoint to fetch bot details including metrics and chart data for the bot detail page.

## Endpoint

### Get Bot Detail with Chart Data

```
GET /api/v1/metrics/bots/{botId}/detail?timeframe={1d|7d}
```

## Request Parameters

### Path Parameters

- `botId` (UUID, required): The unique identifier of the bot

### Query Parameters

- `timeframe` (string, optional, default: "7d"): Time range for chart data and metrics
  - `"1d"`: Last 24 hours
  - `"7d"`: Last 7 days

## Response Structure

### Success Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Bot detail with chart data fetched successfully",
  "data": {
    "botId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "BTC Scalper Pro",
    "coinSymbol": "BTC",
    "tradingPair": "BTC/USDT",
    "activeSubscribers": 145,
    "totalPnl": 12500.5,
    "averageRoi": 15.75,
    "maxDrawdown": -250.0,
    "maxDrawdownPercent": -2.5,
    "totalNetInvestment": 100000.0,
    "totalEquity": 112500.5,
    "chartData": [
      {
        "timestamp": "2024-11-22T10:00:00Z",
        "totalPnl": 10000.0
      },
      {
        "timestamp": "2024-11-22T10:10:00Z",
        "totalPnl": 10500.0
      },
      {
        "timestamp": "2024-11-22T10:20:00Z",
        "totalPnl": 11000.0
      }
      // ... more data points every 10 minutes
    ]
  }
}
```

## Response Fields

### Bot Information

- `botId` (string): Bot unique identifier
- `name` (string): Bot name
- `coinSymbol` (string): Trading coin symbol (e.g., "BTC", "ETH")
- `tradingPair` (string): Trading pair (e.g., "BTC/USDT")

### Metrics (calculated for selected timeframe)

- `activeSubscribers` (integer): Number of active users copying this bot
- `totalPnl` (decimal): Total profit/loss for the timeframe
- `averageRoi` (decimal): Average return on investment percentage
- `maxDrawdown` (decimal): Maximum drawdown in absolute value
- `maxDrawdownPercent` (decimal): Maximum drawdown percentage
- `totalNetInvestment` (decimal): Total capital invested across all subscriptions
- `totalEquity` (decimal): Total current equity (investment + PnL)

### Chart Data

- `chartData` (array): Array of data points for PnL chart
  - `timestamp` (ISO 8601): Snapshot recording time
  - `totalPnl` (decimal): Aggregated PnL across all active subscriptions at that time

## Postman Testing

### 1. Get Bot Detail (7 days)

```
GET http://localhost:8080/api/v1/metrics/bots/{botId}/detail?timeframe=7d
```

**Example:**

```
GET http://localhost:8080/api/v1/metrics/bots/123e4567-e89b-12d3-a456-426614174000/detail?timeframe=7d
```

### 2. Get Bot Detail (24 hours)

```
GET http://localhost:8080/api/v1/metrics/bots/{botId}/detail?timeframe=1d
```

**Example:**

```
GET http://localhost:8080/api/v1/metrics/bots/123e4567-e89b-12d3-a456-426614174000/detail?timeframe=1d
```

### 3. Get Bot Detail (default timeframe)

```
GET http://localhost:8080/api/v1/metrics/bots/{botId}/detail
```

_Uses default timeframe of 7d_

## Frontend Integration

### TypeScript Interface

```typescript
export interface BotDetailDTO {
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
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  timestamp: string; // ISO 8601
  totalPnl: number;
}
```

### API Service Function

```typescript
export const fetchBotDetail = async (
  botId: string,
  timeframe: "1d" | "7d" = "7d"
): Promise<ApiResponse<BotDetailDTO>> => {
  const response = await api.get<ApiResponse<BotDetailDTO>>(
    `/metrics/bots/${botId}/detail?timeframe=${timeframe}`
  );
  return response.data;
};
```

### React Query Hook

```typescript
export const useBotDetail = (botId: string, timeframe: "1d" | "7d") => {
  return useQuery({
    queryKey: ["botDetail", botId, timeframe],
    queryFn: () => fetchBotDetail(botId, timeframe),
    staleTime: 30000, // 30 seconds
  });
};
```

### Chart Component Example (Recharts)

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BotPnLChart({ chartData }: { chartData: ChartDataPoint[] }) {
  const formattedData = chartData.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    pnl: point.totalPnl,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="pnl"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## Architecture Details

### Query Reusability

The endpoint reuses existing modular queries:

1. `countActiveSubsByBotId` - Count active subscribers
2. `calcBotPnl` - Calculate PnL for timeframe
3. `calcBotRoi` - Calculate average ROI
4. `calcBotMaxDrawdown` - Get maximum drawdown
5. `calcBotMaxDrawdownPct` - Get maximum drawdown percentage
6. `calcBotTotalInvestment` - Get total net investment
7. `calcBotTotalEquity` - Get total equity
8. `getBotChartData` - **NEW**: Get time-series PnL data

### Chart Data Query

```sql
SELECT ss.recorded_at, SUM(ss.pnl) as total_pnl
FROM subscription_snapshot ss
JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
  AND bs.is_active = true
  AND ss.recorded_at >= :fromTime
GROUP BY ss.recorded_at
ORDER BY ss.recorded_at ASC
```

**Key Points:**

- Aggregates PnL from all active subscriptions
- Groups by snapshot timestamp (every 10 minutes)
- Filters by timeframe (1d or 7d)
- Returns ordered time-series data

### Data Flow

1. **Controller** receives request with `botId` and `timeframe`
2. **Service** calls 8 repository queries:
   - 7 existing queries for metrics
   - 1 new query for chart data
3. **Repository** executes SQL queries and returns results
4. **Service** aggregates results into `BotDetailDTO`
5. **Controller** wraps in standard API response

## Performance Considerations

### Expected Data Points

- **1d timeframe**: ~144 data points (10-minute intervals × 24 hours)
- **7d timeframe**: ~1008 data points (10-minute intervals × 7 days)

### Response Size Estimate

- Small response (~144 points): ~10-15 KB
- Large response (~1008 points): ~70-100 KB

### Optimization Tips

1. **Frontend**: Implement data point thinning for large datasets
2. **Backend**: Add caching for frequently accessed bots
3. **Database**: Ensure indexes on `recorded_at` and `bot_id` columns

## Error Handling

### Bot Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Bot not found with id: 123e4567-e89b-12d3-a456-426614174000",
  "data": null
}
```

### Invalid Timeframe (400)

```json
{
  "statusCode": 400,
  "message": "Invalid timeframe: 30d. Use '1d' or '7d'",
  "data": null
}
```

## Testing Checklist

- [ ] Test with valid bot ID and timeframe=1d
- [ ] Test with valid bot ID and timeframe=7d
- [ ] Test with default timeframe (should use 7d)
- [ ] Test with invalid bot ID (should return 404)
- [ ] Test with invalid timeframe (should return 400)
- [ ] Test with bot that has no subscriptions
- [ ] Test with bot that has multiple active subscriptions
- [ ] Verify chart data is sorted by timestamp ascending
- [ ] Verify metrics match the timeframe selected
- [ ] Verify chartData array contains expected number of points

## Related Endpoints

- `GET /metrics/bots` - List all bots with pagination
- `GET /metrics/bots/{botId}` - Get bot metrics only (no chart)
- `GET /metrics/subscriptions/{subscriptionId}` - Get subscription metrics

## Notes

1. **Chart Data Aggregation**: The chart shows the combined PnL of all active subscriptions for the bot
2. **Timeframe Consistency**: Both metrics and chart data use the same timeframe parameter
3. **Snapshot Interval**: Data points are captured every 10 minutes by the scheduled service
4. **Active Only**: Only active subscriptions are included in calculations
