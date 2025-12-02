# Bot Trading Metrics - Simplified Architecture

## Overview
Hệ thống tính toán metrics cho bot trading được đơn giản hóa để phù hợp với 2 trang chính của frontend.

---

## Frontend Pages

### 1. Bot Grid Page (Danh sách Bots)
**URL:** `/bots`

**Features:**
- Hiển thị grid của tất cả bots
- Filter timeframe: `current` | `1d` | `7d`
- Sort by: `pnl` | `roi` | `most_copied`

**Metrics hiển thị cho mỗi bot:**
- Total PnL
- Average ROI
- Max Drawdown & Max Drawdown %
- Number of Active Subscribers

### 2. Subscription Detail Page (Chi tiết Subscription)
**URL:** `/subscription/{id}`

**Features:**
- Hiển thị chi tiết của 1 subscription
- Filter timeframe: `current` | `1d` | `7d`

**Metrics hiển thị:**
- PnL
- ROI
- Max Drawdown & Max Drawdown %
- Net Investment
- Total Equity

---

## API Endpoints

### 1. Get All Bots Metrics (Grid Display)
```
GET /api/bots/metrics?timeframe={current|1d|7d}
```

**Response:**
```json
[
  {
    "botId": "uuid",
    "activeSubscribers": 15,
    "totalNetInvestment": 50000,
    "totalEquity": 55000,
    "totalPnl": 5000,
    "averageRoi": 10.5,
    "maxDrawdown": -500,
    "maxDrawdownPercent": -1.2
  }
]
```

**Frontend sorting:** Sort array by field sau khi nhận data

### 2. Get Single Bot Metrics
```
GET /api/bots/{botId}/metrics?timeframe={current|1d|7d}
```

**Response:** Same structure as above, single object

### 3. Get Subscription Metrics
```
GET /api/subscriptions/{subscriptionId}/metrics?timeframe={current|1d|7d}
```

**Response:**
```json
{
  "subscriptionId": "uuid",
  "userId": "uuid",
  "botId": "uuid",
  "netInvestment": 1000,
  "totalEquity": 1150,
  "pnl": 150,
  "roi": 15.0,
  "maxDrawdown": -50,
  "maxDrawdownPercent": -5.0
}
```

---

## Timeframe Logic

### Parameter Values:
- `current`: All-time PnL/ROI (từ đầu đến giờ)
- `1d`: PnL/ROI trong 24h qua
- `7d`: PnL/ROI trong 7 ngày qua

### Backend Implementation:
```java
private Instant getCompareTime(String timeframe) {
    return switch (timeframe) {
        case "1d" -> Instant.now().minus(1, ChronoUnit.DAYS);
        case "7d" -> Instant.now().minus(7, ChronoUnit.DAYS);
        case "current" -> Instant.EPOCH; // Compare with first snapshot
        default -> throw new IllegalArgumentException("Invalid timeframe");
    };
}
```

---

## SQL Formulas (Simplified)

### 1. Subscription Metrics Query

**CTE Structure:**
- `latest`: Snapshot mới nhất
- `compare_snapshot`: Snapshot tại thời điểm compare (24h/7d trước hoặc đầu tiên)
- `drawdown`: Max drawdown trong toàn bộ lịch sử

**PnL Calculation:**
```sql
pnl = COALESCE(latest.pnl - compare_snapshot.pnl, latest.pnl)
```
- Nếu có compare snapshot → Delta PnL
- Nếu không → Current PnL

**ROI Calculation:**
```sql
roi = CASE 
    WHEN compare_snapshot.net_investment > 0 
    THEN ((latest.pnl - compare_snapshot.pnl) / compare_snapshot.net_investment) * 100
    ELSE latest.roi 
END
```

**Max Drawdown:**
```sql
max_drawdown = MIN(total_equity - net_investment)
max_drawdown_percent = MIN(
    ((total_equity - net_investment) / net_investment) * 100
)
```

---

### 2. Bot Aggregate Metrics Query

**CTE Structure:**
- `latest`: Latest snapshot của tất cả subscriptions active
- `compare`: Compare snapshot của tất cả subscriptions
- `drawdown`: Max drawdown tổng hợp

**Total PnL:**
```sql
total_pnl = SUM(latest.pnl - COALESCE(compare.pnl, latest.pnl))
```

**Average ROI:**
```sql
average_roi = AVG(
    CASE WHEN compare.net_investment > 0 
        THEN ((latest.pnl - compare.pnl) / compare.net_investment) * 100
        ELSE latest.roi 
    END
)
```

**Active Subscribers:**
```sql
active_subscribers = COUNT(DISTINCT latest.bot_subscription_id)
```

---

## Performance Optimizations

### 1. Index Requirements
```sql
-- Subscription snapshot queries
CREATE INDEX idx_sub_snapshot_time 
ON subscription_snapshot(bot_subscription_id, recorded_at);

-- Bot aggregate queries
CREATE INDEX idx_bot_subscriptions_bot_active
ON bot_subscriptions(bot_id, is_active);
```

### 2. Query Optimization Strategy
- **Single CTE per timeframe**: Không tính all timeframes cùng lúc
- **Lazy loading**: Frontend request timeframe khi cần
- **Client-side sorting**: Frontend sort array after fetching
- **Reuse compare logic**: Same SQL structure cho all timeframes

### 3. Caching Strategy (Optional)
```java
@Cacheable(value = "botMetrics", key = "#botId + '_' + #timeframe")
public BotAggregateMetrics getBotMetrics(UUID botId, String timeframe) {
    // ... query logic
}
```

---

## Frontend Integration Examples

### React/Next.js Example:

#### 1. Bot Grid Component
```typescript
const BotGrid = () => {
  const [timeframe, setTimeframe] = useState<'current' | '1d' | '7d'>('current');
  const [sortBy, setSortBy] = useState<'pnl' | 'roi' | 'subscribers'>('pnl');
  
  const { data: bots } = useQuery({
    queryKey: ['bots', timeframe],
    queryFn: () => api.getAllBotsMetrics(timeframe)
  });

  const sortedBots = useMemo(() => {
    return [...(bots || [])].sort((a, b) => {
      switch(sortBy) {
        case 'pnl': return b.totalPnl - a.totalPnl;
        case 'roi': return b.averageRoi - a.averageRoi;
        case 'subscribers': return b.activeSubscribers - a.activeSubscribers;
      }
    });
  }, [bots, sortBy]);

  return (
    <div>
      <FilterBar>
        <TimeframeFilter value={timeframe} onChange={setTimeframe} />
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </FilterBar>
      
      <Grid>
        {sortedBots.map(bot => (
          <BotCard key={bot.botId} bot={bot} />
        ))}
      </Grid>
    </div>
  );
};
```

#### 2. Subscription Detail Component
```typescript
const SubscriptionDetail = ({ subscriptionId }) => {
  const [timeframe, setTimeframe] = useState<'current' | '1d' | '7d'>('current');
  
  const { data: metrics } = useQuery({
    queryKey: ['subscription', subscriptionId, timeframe],
    queryFn: () => api.getSubscriptionMetrics(subscriptionId, timeframe)
  });

  return (
    <div>
      <TimeframeFilter value={timeframe} onChange={setTimeframe} />
      
      <MetricsCard>
        <MetricRow label="PnL" value={metrics?.pnl} unit="USDT" />
        <MetricRow label="ROI" value={metrics?.roi} unit="%" />
        <MetricRow label="Max Drawdown" value={metrics?.maxDrawdown} unit="USDT" />
        <MetricRow label="Max DD %" value={metrics?.maxDrawdownPercent} unit="%" />
      </MetricsCard>
    </div>
  );
};
```

---

## Edge Cases Handling

### 1. Không có snapshot compare (bot mới < 24h)
→ Fallback to current PnL/ROI
```sql
COALESCE(latest.pnl - compare.pnl, latest.pnl)
```

### 2. Net Investment = 0
→ ROI = 0 (tránh chia 0)
```sql
CASE WHEN net_investment > 0 THEN ... ELSE 0 END
```

### 3. Không có active subscription cho bot
→ Return metrics với giá trị 0
```sql
COALESCE(SUM(...), 0)
COUNT(DISTINCT ...) -- Returns 0 if empty
```

### 4. Invalid timeframe parameter
→ Throw IllegalArgumentException
```java
default -> throw new IllegalArgumentException("Invalid timeframe: " + timeframe);
```

---

## Testing Checklist

### Unit Tests:
- [ ] `getCompareTime()` returns correct Instant for each timeframe
- [ ] Invalid timeframe throws exception
- [ ] Edge cases: no snapshot, zero investment

### Integration Tests:
- [ ] Bot grid query returns all active bots
- [ ] Subscription metrics query returns correct data
- [ ] Timeframe filtering works correctly
- [ ] Max drawdown calculation is accurate

### Performance Tests:
- [ ] Query execution time < 100ms for bot grid
- [ ] Query execution time < 50ms for single subscription
- [ ] Index usage verified via EXPLAIN
