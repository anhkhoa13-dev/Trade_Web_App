# Quick Testing Guide - Bot Detail API

## Postman Collection Setup

### 1. Create New Request: "Get Bot Detail (7d)"

**Request:**

```
GET http://localhost:8080/api/v1/metrics/bots/{{botId}}/detail?timeframe=7d
```

**Steps:**

1. Set method to `GET`
2. Enter URL: `http://localhost:8080/api/v1/metrics/bots/{botId}/detail`
3. Add query param: `timeframe` = `7d`
4. Replace `{botId}` with actual bot UUID from your database

**Expected Response:**

```json
{
  "statusCode": 200,
  "message": "Bot detail with chart data fetched successfully",
  "data": {
    "botId": "...",
    "name": "...",
    "coinSymbol": "BTC",
    "tradingPair": "BTC/USDT",
    "activeSubscribers": 10,
    "totalPnl": 5000.0,
    "averageRoi": 12.5,
    "maxDrawdown": -100.0,
    "maxDrawdownPercent": -1.5,
    "totalNetInvestment": 50000.0,
    "totalEquity": 55000.0,
    "chartData": [
      {
        "timestamp": "2024-11-22T10:00:00Z",
        "totalPnl": 4800.0
      }
      // ... more data points
    ]
  }
}
```

---

### 2. Create New Request: "Get Bot Detail (1d)"

**Request:**

```
GET http://localhost:8080/api/v1/metrics/bots/{{botId}}/detail?timeframe=1d
```

**Expected Difference:**

- Fewer data points in `chartData` (~144 instead of ~1008)
- Metrics calculated only for last 24 hours

---

## SQL Query to Get Bot ID

If you need to find a bot ID for testing:

```sql
SELECT
    LOWER(CONCAT(
        SUBSTR(HEX(b.id), 1, 8), '-',
        SUBSTR(HEX(b.id), 9, 4), '-',
        SUBSTR(HEX(b.id), 13, 4), '-',
        SUBSTR(HEX(b.id), 17, 4), '-',
        SUBSTR(HEX(b.id), 21)
    )) AS bot_uuid,
    b.name,
    COUNT(DISTINCT bs.id) AS active_subscriptions
FROM bots b
LEFT JOIN bot_subscriptions bs ON bs.bot_id = b.id AND bs.is_active = TRUE
GROUP BY b.id, b.name
HAVING active_subscriptions > 0
LIMIT 5;
```

---

## Testing Scenarios

### ✅ Scenario 1: Valid Bot with Active Subscriptions

- **Request**: `GET /metrics/bots/{valid-bot-id}/detail?timeframe=7d`
- **Expected**: 200 OK with full data and chart points
- **Verify**:
  - `activeSubscribers` > 0
  - `chartData` is an array with multiple points
  - All metrics are non-null

### ✅ Scenario 2: Different Timeframes

- **Request 1**: `GET /metrics/bots/{bot-id}/detail?timeframe=1d`
- **Request 2**: `GET /metrics/bots/{bot-id}/detail?timeframe=7d`
- **Expected**: Different number of chart data points
- **Verify**:
  - 1d has ~144 points
  - 7d has ~1008 points
  - Metrics differ based on timeframe

### ✅ Scenario 3: Default Timeframe

- **Request**: `GET /metrics/bots/{bot-id}/detail`
- **Expected**: Uses 7d by default
- **Verify**: Same result as explicitly setting `timeframe=7d`

### ❌ Scenario 4: Invalid Bot ID

- **Request**: `GET /metrics/bots/00000000-0000-0000-0000-000000000000/detail`
- **Expected**: 404 Not Found
- **Response**:

```json
{
  "statusCode": 404,
  "message": "Bot not found with id: 00000000-0000-0000-0000-000000000000",
  "data": null
}
```

### ❌ Scenario 5: Invalid Timeframe

- **Request**: `GET /metrics/bots/{bot-id}/detail?timeframe=30d`
- **Expected**: 400 Bad Request
- **Response**:

```json
{
  "statusCode": 400,
  "message": "Invalid timeframe: 30d",
  "data": null
}
```

---

## Chart Data Validation

### Check Data Points Are Sorted

```javascript
// Postman Tests tab
pm.test("Chart data is sorted by timestamp", function () {
  const chartData = pm.response.json().data.chartData;
  for (let i = 1; i < chartData.length; i++) {
    const prev = new Date(chartData[i - 1].timestamp);
    const curr = new Date(chartData[i].timestamp);
    pm.expect(curr.getTime()).to.be.above(prev.getTime());
  }
});
```

### Check Data Points Have 10-Minute Intervals

```javascript
pm.test("Chart data has ~10 minute intervals", function () {
  const chartData = pm.response.json().data.chartData;
  if (chartData.length < 2) return;

  const first = new Date(chartData[0].timestamp);
  const second = new Date(chartData[1].timestamp);
  const diffMinutes = (second - first) / (1000 * 60);

  pm.expect(diffMinutes).to.be.within(9, 11); // Allow 9-11 minutes
});
```

### Check Metrics Match Timeframe

```javascript
pm.test("Metrics are for correct timeframe", function () {
  const data = pm.response.json().data;
  pm.expect(data.totalPnl).to.exist;
  pm.expect(data.averageRoi).to.exist;
  pm.expect(data.chartData.length).to.be.above(0);
});
```

---

## cURL Examples

### 7-Day Chart

```bash
curl -X GET "http://localhost:8080/api/v1/metrics/bots/{botId}/detail?timeframe=7d" \
  -H "Accept: application/json"
```

### 1-Day Chart

```bash
curl -X GET "http://localhost:8080/api/v1/metrics/bots/{botId}/detail?timeframe=1d" \
  -H "Accept: application/json"
```

---

## Frontend Testing

### 1. Create Bot Detail Page

```typescript
// app/(root)/ai-bots/[botId]/page.tsx
"use client";

import { useBotDetail } from "@/hooks/bot/useBotDetail";
import { BotPnLChart } from "./_components/BotPnLChart";
import { useState } from "react";

export default function BotDetailPage({
  params,
}: {
  params: { botId: string };
}) {
  const [timeframe, setTimeframe] = useState<"1d" | "7d">("7d");
  const { data, isLoading } = useBotDetail(params.botId, timeframe);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Bot not found</div>;

  const bot = data.data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{bot.name}</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Total PnL</p>
          <p className="text-2xl font-bold">${bot.totalPnl.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Average ROI</p>
          <p className="text-2xl font-bold">{bot.averageRoi.toFixed(2)}%</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Max Drawdown</p>
          <p className="text-2xl font-bold">
            {bot.maxDrawdownPercent.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold">{bot.activeSubscribers}</p>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="mb-4">
        <button onClick={() => setTimeframe("1d")}>1D</button>
        <button onClick={() => setTimeframe("7d")}>7D</button>
      </div>

      {/* Chart */}
      <BotPnLChart chartData={bot.chartData} />
    </div>
  );
}
```

### 2. Test Navigation

- Click on a BotCard in the marketplace
- Verify URL changes to `/ai-bots/{botId}`
- Verify bot details load
- Verify chart displays
- Switch between 1D and 7D timeframes
- Verify chart updates

---

## Success Criteria

- ✅ Endpoint returns 200 for valid bot ID
- ✅ Chart data contains time-series PnL points
- ✅ Metrics match selected timeframe
- ✅ Chart data is sorted chronologically
- ✅ Data points have ~10 minute intervals
- ✅ Returns 404 for invalid bot ID
- ✅ Returns 400 for invalid timeframe
- ✅ Frontend chart renders correctly
- ✅ Timeframe filter updates chart
