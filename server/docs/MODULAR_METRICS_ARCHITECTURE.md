# Bot Metrics API - Modular Architecture Guide

## 📋 Overview

Hệ thống metrics được refactor theo kiến trúc modular với:

- **Mỗi metric = 1 SQL query riêng** (dễ hiểu, dễ maintain, dễ scale)
- **Service layer tổng hợp** các kết quả từ nhiều queries
- **Pagination, search, và sorting** cho bot grid
- **3 parameters chính**: timeframe, sortBy, search

---

## 🏗️ Kiến Trúc Modular

### Old Approach (Monolithic)

```sql
-- Tính TẤT CẢ metrics trong 1 query duy nhất
WITH latest AS (...),
     compare AS (...),
     drawdown AS (...)
SELECT
    bot_id,
    COUNT(...) as active_subscribers,
    SUM(...) as total_pnl,
    AVG(...) as average_roi,
    MIN(...) as max_drawdown,
    ...
FROM latest JOIN compare JOIN drawdown
```

**Vấn đề:**

- Query phức tạp, khó đọc
- Khó debug khi 1 metric sai
- Không linh hoạt khi cần thêm/bớt metrics
- Performance overhead khi chỉ cần 1 vài metrics

### New Approach (Modular)

```java
// Repository: Mỗi metric = 1 query riêng
Integer activeSubscribers = repo.countActiveSubsByBotId(botId);
BigDecimal totalPnl = repo.calcBotPnl(botId, compareTime);
BigDecimal averageRoi = repo.calcBotRoi(botId, compareTime);
BigDecimal maxDrawdown = repo.calcBotMaxDrawdown(botId);

// Service: Tổng hợp thành DTO
BotGridItemDTO dto = BotGridItemDTO.builder()
    .activeSubscribers(activeSubscribers)
    .totalPnl(totalPnl)
    .averageRoi(averageRoi)
    .maxDrawdown(maxDrawdown)
    .build();
```

**Ưu điểm:**

- Mỗi query đơn giản, dễ hiểu
- Dễ test từng metric riêng lẻ
- Dễ thêm metrics mới (chỉ cần thêm 1 query method)
- Flexible: Chỉ gọi metrics cần thiết

---

## 📦 Components

### 1. SnapshotMetricsRepository

**Location:** `repository/SnapshotMetricsRepository.java`

**Purpose:** Chứa tất cả queries modular cho từng metric riêng biệt

**Bot Metrics Methods:**

```java
// 1. Đếm subscribers
Integer countActiveSubsByBotId(String botId);

// 2. Tính PnL theo timeframe
BigDecimal calcBotPnl(String botId, Instant compareTime);

// 3. Tính ROI trung bình
BigDecimal calcBotRoi(String botId, Instant compareTime);

// 4. Tính max drawdown (all-time)
BigDecimal calcBotMaxDrawdown(String botId);
BigDecimal calcBotMaxDrawdownPct(String botId);

// 5. Tính tổng investment và equity
BigDecimal calcBotTotalInvestment(String botId);
BigDecimal calcBotTotalEquity(String botId);
```

**Subscription Metrics Methods:**

```java
// 1. Tính PnL subscription theo timeframe
BigDecimal calcSubPnl(String subscriptionId, Instant compareTime);

// 2. Tính ROI subscription
BigDecimal calcSubRoi(String subscriptionId, Instant compareTime);

// 3. Tính max drawdown subscription
BigDecimal calcSubMaxDrawdown(String subscriptionId);
BigDecimal calcSubMaxDrawdownPct(String subscriptionId);

// 4. Lấy values mới nhất
BigDecimal getLatestNetInvestment(String subscriptionId);
BigDecimal getLatestTotalEquity(String subscriptionId);
```

---

### 2. ModularPnLService

**Location:** `service/subscription/ModularPnLService.java`

**Purpose:** Tổng hợp kết quả từ nhiều queries thành DTOs

**Key Methods:**

#### a) `getAllBotsWithPagination()`

```java
public Page<BotGridItemDTO> getAllBotsWithPagination(
    String timeframe,    // "current" | "1d" | "7d"
    String sortBy,       // "pnl" | "roi" | "copied"
    String searchName,   // Bot name search (optional)
    Pageable pageable    // Pagination
)
```

**Logic Flow:**

1. Lấy tất cả bots từ database (filter by name nếu có search)
2. For each bot: Gọi từng query metric riêng biệt
3. Tạo `BotGridItemDTO` từ các kết quả
4. Sort theo `sortBy` parameter
5. Apply pagination
6. Return `Page<BotGridItemDTO>`

#### b) `getSingleBotMetrics()`

```java
public BotGridItemDTO getSingleBotMetrics(
    UUID botId,
    String timeframe
)
```

**Logic:** Tương tự `getAllBots` nhưng chỉ cho 1 bot

#### c) `getSubscriptionMetrics()`

```java
public SubscriptionMetricsDTO getSubscriptionMetrics(
    UUID subscriptionId,
    String timeframe
)
```

**Logic:** Gọi các subscription metric queries và tổng hợp

---

### 3. BotMetricsController

**Location:** `controller/BotMetricsController.java`

**Purpose:** Expose REST API với pagination, search, sorting

---

## 🔌 API Endpoints

### 1. Get Bots với Pagination, Search, Sorting

```http
GET /metrics/bots?timeframe={timeframe}&sortBy={sortBy}&search={search}&page={page}&size={size}
```

**Parameters:**

| Parameter | Type  | Required | Default | Values           | Description                |
| --------- | ----- | -------- | ------- | ---------------- | -------------------------- |
| timeframe | Query | No       | current | current, 1d, 7d  | PnL/ROI calculation period |
| sortBy    | Query | No       | pnl     | pnl, roi, copied | Sort by which metric       |
| search    | Query | No       | -       | string           | Search by bot name         |
| page      | Query | No       | 0       | integer          | Page number (0-indexed)    |
| size      | Query | No       | 10      | integer          | Page size                  |

**Examples:**

```bash
# Get page 1, 10 items, sorted by PnL (1d timeframe)
GET /metrics/bots?timeframe=1d&sortBy=pnl&page=0&size=10

# Search "BTC", sorted by ROI (7d timeframe)
GET /metrics/bots?timeframe=7d&sortBy=roi&search=BTC&page=0&size=20

# Get all bots sorted by most copied (current/all-time)
GET /metrics/bots?sortBy=copied

# Page 2, only bots with "ETH" in name
GET /metrics/bots?search=ETH&page=1&size=15
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "meta": {
      "page": 1,
      "pageSize": 10,
      "pages": 5,
      "total": 42
    },
    "result": [
      {
        "botId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "BTC Scalper Pro",
        "coinSymbol": "BTC",
        "tradingPair": "BTC/USDT",
        "activeSubscribers": 25,
        "totalPnl": 15000.50,
        "averageRoi": 12.5,
        "maxDrawdown": -500.00,
        "maxDrawdownPercent": -1.2,
        "totalNetInvestment": 120000.00,
        "totalEquity": 135000.50
      },
      ...
    ]
  },
  "message": "Bots metrics fetched successfully"
}
```

---

### 2. Get Single Bot Metrics

```http
GET /metrics/bots/{botId}?timeframe={timeframe}
```

**Example:**

```bash
GET /metrics/bots/550e8400-e29b-41d4-a716-446655440000?timeframe=1d
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "botId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "BTC Scalper Pro",
    "coinSymbol": "BTC",
    "tradingPair": "BTC/USDT",
    "activeSubscribers": 25,
    "totalPnl": 5000.0,
    "averageRoi": 8.5,
    "maxDrawdown": -500.0,
    "maxDrawdownPercent": -1.2,
    "totalNetInvestment": 120000.0,
    "totalEquity": 125000.0
  },
  "message": "Bot metrics fetched successfully"
}
```

---

### 3. Get Subscription Metrics

```http
GET /metrics/subscriptions/{subscriptionId}?timeframe={timeframe}
```

**Example:**

```bash
GET /metrics/subscriptions/770e8400-e29b-41d4-a716-446655440000?timeframe=current
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "subscriptionId": "770e8400-e29b-41d4-a716-446655440000",
    "userId": "880e8400-e29b-41d4-a716-446655440000",
    "botId": "550e8400-e29b-41d4-a716-446655440000",
    "netInvestment": 1000.0,
    "totalEquity": 1150.0,
    "pnl": 150.0,
    "roi": 15.0,
    "maxDrawdown": -50.0,
    "maxDrawdownPercent": -5.0
  },
  "message": "Subscription metrics fetched successfully"
}
```

---

## 🧪 Postman Testing

### Setup Environment

**Variables:**

```
base_url = http://localhost:8080
bot_id = <your-bot-uuid>
subscription_id = <your-subscription-uuid>
```

### Test Collection

**Request 1: Get Bots - Page 1, Sort by PnL (1d)**

```
GET {{base_url}}/metrics/bots?timeframe=1d&sortBy=pnl&page=0&size=10
```

**Request 2: Get Bots - Search "BTC", Sort by ROI**

```
GET {{base_url}}/metrics/bots?timeframe=7d&sortBy=roi&search=BTC&page=0&size=20
```

**Request 3: Get Bots - Most Copied (All-time)**

```
GET {{base_url}}/metrics/bots?timeframe=current&sortBy=copied&page=0&size=10
```

**Request 4: Get Single Bot - 24h Metrics**

```
GET {{base_url}}/metrics/bots/{{bot_id}}?timeframe=1d
```

**Request 5: Get Subscription - All-time Metrics**

```
GET {{base_url}}/metrics/subscriptions/{{subscription_id}}?timeframe=current
```

**Request 6: Test Pagination - Get Page 2**

```
GET {{base_url}}/metrics/bots?page=1&size=10
```

**Request 7: Test Invalid Timeframe**

```
GET {{base_url}}/metrics/bots?timeframe=invalid
Expected: 400 Bad Request hoặc error message
```

---

## 🔍 Query Performance Analysis

### Performance So Sánh

#### Old Monolithic Query

- **1 query phức tạp**: Calculate ALL metrics cùng lúc
- **Execution time**: ~200-500ms (depends on data size)
- **Pros**: Chỉ 1 database round-trip
- **Cons**: Slow nếu không cần tất cả metrics

#### New Modular Queries

- **7-8 queries nhỏ**: Mỗi metric 1 query
- **Execution time per query**: ~20-50ms
- **Total time**: ~150-400ms (parallelizable)
- **Pros**:
  - Mỗi query đơn giản, dễ optimize
  - Có thể parallel execution (future improvement)
  - Chỉ query metrics cần thiết
- **Cons**: Nhiều database round-trips

### Optimization Strategies

#### 1. Database Indexing

```sql
-- Tăng tốc join và filter by bot_id
CREATE INDEX idx_bot_sub_bot_active
ON bot_subscriptions(bot_id, is_active);

-- Tăng tốc order by recorded_at
CREATE INDEX idx_snapshot_sub_time
ON subscription_snapshot(bot_subscription_id, recorded_at);
```

#### 2. Caching (Future)

```java
@Cacheable(value = "botMetrics", key = "#botId + '_' + #timeframe")
public BotGridItemDTO getSingleBotMetrics(UUID botId, String timeframe) {
    // ... query logic
}
```

#### 3. Parallel Query Execution (Future)

```java
CompletableFuture<Integer> subsFuture =
    CompletableFuture.supplyAsync(() -> repo.countActiveSubsByBotId(botId));

CompletableFuture<BigDecimal> pnlFuture =
    CompletableFuture.supplyAsync(() -> repo.calcBotPnl(botId, compareTime));

// Wait for all
CompletableFuture.allOf(subsFuture, pnlFuture).join();
```

---

## 🎯 Sorting Logic

### Client-side vs Server-side

**Current Implementation:** Server-side sorting in Java

```java
private List<BotGridItemDTO> sortBots(List<BotGridItemDTO> bots, String sortBy) {
    return switch (sortBy.toLowerCase()) {
        case "pnl" -> bots.stream()
                .sorted(Comparator.comparing(BotGridItemDTO::getTotalPnl).reversed())
                .collect(Collectors.toList());
        case "roi" -> bots.stream()
                .sorted(Comparator.comparing(BotGridItemDTO::getAverageRoi).reversed())
                .collect(Collectors.toList());
        case "copied" -> bots.stream()
                .sorted(Comparator.comparing(BotGridItemDTO::getActiveSubscribers).reversed())
                .collect(Collectors.toList());
        default -> bots;
    };
}
```

**Why not SQL ORDER BY?**

- Metrics được tính ở service layer (từ nhiều queries)
- Không thể ORDER BY trong SQL vì data chưa aggregate
- Có thể move về SQL nếu refactor queries thành subqueries

---

## 📊 Frontend Integration

### React/Next.js Example

```typescript
// Hook: useBotMetrics.ts
export const useBotMetrics = (
  timeframe: "current" | "1d" | "7d",
  sortBy: "pnl" | "roi" | "copied",
  search?: string,
  page = 0,
  size = 10
) => {
  return useQuery({
    queryKey: ["botMetrics", timeframe, sortBy, search, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeframe,
        sortBy,
        page: page.toString(),
        size: size.toString(),
        ...(search && { search }),
      });

      const res = await fetch(`/metrics/bots?${params}`);
      return res.json();
    },
  });
};

// Component: BotGrid.tsx
const BotGrid = () => {
  const [timeframe, setTimeframe] = useState<"current" | "1d" | "7d">(
    "current"
  );
  const [sortBy, setSortBy] = useState<"pnl" | "roi" | "copied">("pnl");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useBotMetrics(
    timeframe,
    sortBy,
    search,
    page,
    10
  );

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        <TimeframeSelect value={timeframe} onChange={setTimeframe} />
        <SortSelect value={sortBy} onChange={setSortBy} />
        <SearchInput value={search} onChange={setSearch} />
      </div>

      {/* Grid */}
      <div className="grid">
        {data?.data?.result?.map((bot) => (
          <BotCard key={bot.botId} bot={bot} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={data?.data?.meta?.page}
        totalPages={data?.data?.meta?.pages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

---

## ✅ Testing Checklist

### Unit Tests (Repository Layer)

- [ ] `countActiveSubsByBotId()` returns correct count
- [ ] `calcBotPnl()` with timeframe "current" returns all-time PnL
- [ ] `calcBotPnl()` with timeframe "1d" returns 24h PnL
- [ ] `calcBotRoi()` calculates percentage correctly
- [ ] `calcBotMaxDrawdown()` returns most negative value
- [ ] `calcSubPnl()` handles no compare snapshot (new subscription)
- [ ] All queries return 0 or default when no data

### Integration Tests (Service Layer)

- [ ] `getAllBotsWithPagination()` returns paginated results
- [ ] Sorting by "pnl" orders correctly (highest first)
- [ ] Sorting by "roi" orders correctly
- [ ] Sorting by "copied" orders correctly
- [ ] Search filters bots by name (case-insensitive)
- [ ] Pagination calculates pages correctly
- [ ] Empty result returns empty page (not error)

### API Tests (Controller Layer)

- [ ] GET `/metrics/bots` returns 200 with pagination
- [ ] Query param `timeframe=1d` filters correctly
- [ ] Query param `sortBy=roi` sorts correctly
- [ ] Query param `search=BTC` filters correctly
- [ ] Invalid timeframe returns 400/error
- [ ] Invalid sortBy defaults to no sorting
- [ ] Page out of range returns empty results

---

## 🚀 Future Improvements

### 1. Parallel Query Execution

Use `CompletableFuture` to execute multiple queries simultaneously:

```java
CompletableFuture<Integer> subs = supplyAsync(() -> repo.countActiveSubsByBotId(id));
CompletableFuture<BigDecimal> pnl = supplyAsync(() -> repo.calcBotPnl(id, time));
CompletableFuture.allOf(subs, pnl).join();
```

### 2. Redis Caching

Cache bot metrics với TTL = 10 minutes (snapshot interval):

```java
@Cacheable(value = "botMetrics", key = "#botId + '_' + #timeframe")
```

### 3. Batch Queries (Alternative)

Thay vì query từng bot, query tất cả bots cùng lúc:

```sql
SELECT bot_id, COUNT(*) as subscribers
FROM bot_subscriptions
WHERE is_active = true
GROUP BY bot_id
```

### 4. GraphQL API (Optional)

Allow frontend to request only needed fields:

```graphql
query {
  bots(timeframe: "1d", sortBy: "pnl", page: 0, size: 10) {
    items {
      botId
      name
      totalPnl
      # Only request what you need
    }
    pageInfo {
      totalPages
      totalItems
    }
  }
}
```

---

## 📝 Summary

### Key Changes from Old Architecture:

| Aspect          | Old                 | New                      |
| --------------- | ------------------- | ------------------------ |
| Query Structure | 1 complex CTE query | 7-8 simple queries       |
| Calculation     | SQL-only            | SQL + Java aggregation   |
| Pagination      | ❌ Not supported    | ✅ Supported             |
| Search          | ❌ Not supported    | ✅ By bot name           |
| Sorting         | ❌ Client-side only | ✅ Server-side           |
| Scalability     | Hard to add metrics | Easy to add queries      |
| Testability     | Hard to test        | Easy to test each metric |
| Readability     | Complex SQL         | Simple SQL + Clear Java  |

### Benefits:

- ✅ **Modular**: Mỗi metric độc lập
- ✅ **Maintainable**: Dễ sửa/thêm metrics
- ✅ **Testable**: Test từng query riêng
- ✅ **Flexible**: Chỉ query metrics cần thiết
- ✅ **Feature-rich**: Pagination, search, sorting

### Trade-offs:

- ⚠️ More database round-trips (có thể optimize bằng parallel execution)
- ⚠️ Service layer phức tạp hơn (nhưng dễ hiểu hơn SQL phức tạp)
