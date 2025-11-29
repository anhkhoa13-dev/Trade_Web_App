# Bot Trading Metrics - SQL Formulas Documentation

## Overview

Tài liệu này mô tả chi tiết các công thức tính toán metrics cho bot trading system, được implement bằng SQL native query để tối ưu performance.

---

## 1. Subscription Metrics (Individual User)

### 1.1. Current PnL (Lời/Lỗ Hiện Tại)

```sql
current_pnl = latest.pnl
```

**Nguồn:** Lấy trực tiếp từ snapshot mới nhất

**Ý nghĩa:** Tổng lời/lỗ từ đầu đến hiện tại (tính bằng USDT)

**Công thức gốc (đã được tính trong snapshot):**

```
PnL = Total Equity - Net Investment
    = (Bot Wallet Balance + Bot Wallet Coin × Current Price) - Net Investment
```

---

### 1.2. Current ROI (Return on Investment)

```sql
current_roi = latest.roi
```

**Nguồn:** Lấy trực tiếp từ snapshot mới nhất

**Ý nghĩa:** Tỷ suất lợi nhuận tính từ đầu đến hiện tại (%)

**Công thức gốc (đã được tính trong snapshot):**

```
ROI = (PnL / Net Investment) × 100
```

**Ví dụ:**

- Net Investment = $1,000
- Current PnL = $150
- Current ROI = (150 / 1000) × 100 = 15%

---

### 1.3. PnL 24h (Lời/Lỗ trong 24 giờ qua)

```sql
pnl_24h = COALESCE(latest.pnl - snapshot_24h.pnl, latest.pnl)
```

**Giải thích:**

- Lấy PnL hiện tại trừ PnL từ 24h trước
- Nếu không có data 24h trước → dùng current PnL

**Ví dụ:**

- 24h trước: PnL = $100
- Hiện tại: PnL = $250
- PnL 24h = $250 - $100 = $150 (kiếm được $150 trong 24h)

---

### 1.4. ROI 24h (Tỷ suất lợi nhuận 24h)

```sql
roi_24h = COALESCE(
    CASE
        WHEN snapshot_24h.net_investment > 0
        THEN ((latest.pnl - snapshot_24h.pnl) / snapshot_24h.net_investment) * 100
        ELSE latest.roi
    END,
    latest.roi
)
```

**Giải thích:**

- Tính % lợi nhuận của delta PnL 24h so với vốn 24h trước
- Nếu không có data 24h trước → dùng current ROI

**Ví dụ:**

- Net Investment 24h trước = $1,000
- PnL 24h = $150
- ROI 24h = (150 / 1000) × 100 = 15%

---

### 1.5. PnL 7d (Lời/Lỗ trong 7 ngày qua)

```sql
pnl_7d = COALESCE(latest.pnl - snapshot_7d.pnl, latest.pnl)
```

**Tương tự PnL 24h, nhưng tính cho 7 ngày**

---

### 1.6. ROI 7d (Tỷ suất lợi nhuận 7 ngày)

```sql
roi_7d = COALESCE(
    CASE
        WHEN snapshot_7d.net_investment > 0
        THEN ((latest.pnl - snapshot_7d.pnl) / snapshot_7d.net_investment) * 100
        ELSE latest.roi
    END,
    latest.roi
)
```

**Tương tự ROI 24h, nhưng tính cho 7 ngày**

---

### 1.7. Max Drawdown (Khoản lỗ lớn nhất)

```sql
max_drawdown = MIN(total_equity - net_investment)
```

**Giải thích:**

- Tìm giá trị PnL thấp nhất trong toàn bộ lịch sử
- Giá trị âm → user từng lỗ bao nhiêu tối đa

**Ví dụ:**

- Max Drawdown = -$200 → User từng lỗ tối đa $200 trong lịch sử

---

### 1.8. Max Drawdown Percent (Tỷ lệ lỗ lớn nhất)

```sql
max_drawdown_percent = MIN(
    CASE
        WHEN net_investment > 0
        THEN ((total_equity - net_investment) / net_investment) * 100
        ELSE 0
    END
)
```

**Giải thích:**

- Tỷ lệ % của max drawdown so với vốn gốc
- Dùng để đánh giá rủi ro

**Ví dụ:**

- Net Investment = $1,000
- Max Drawdown = -$200
- Max Drawdown % = (-200 / 1000) × 100 = -20%

---

## 2. Bot Aggregate Metrics (Tổng hợp từ tất cả users)

### 2.1. Total Current PnL (Tổng PnL hiện tại)

```sql
total_current_pnl = SUM(latest_snapshots.pnl)
```

**Giải thích:**

- Cộng tổng current PnL của tất cả users đang subscribe bot

**Ví dụ:**

- User A: PnL = $100
- User B: PnL = $250
- User C: PnL = -$50
- Total PnL = $100 + $250 + (-$50) = $300

---

### 2.2. Average ROI (ROI trung bình)

```sql
average_roi = AVG(latest_snapshots.roi)
```

**Giải thích:**

- Tính trung bình ROI của tất cả users

**Ví dụ:**

- User A: ROI = 10%
- User B: ROI = 25%
- User C: ROI = -5%
- Average ROI = (10 + 25 + (-5)) / 3 = 10%

---

### 2.3. Total PnL 24h

```sql
total_pnl_24h = SUM(latest_snapshots.pnl - COALESCE(s24h.pnl, latest_snapshots.pnl))
```

**Giải thích:**

- Cộng tổng PnL 24h của tất cả users

---

### 2.4. Average ROI 24h

```sql
average_roi_24h = AVG(
    CASE
        WHEN COALESCE(s24h.net_investment, latest_snapshots.net_investment) > 0
        THEN ((latest_snapshots.pnl - COALESCE(s24h.pnl, 0)) /
              COALESCE(s24h.net_investment, latest_snapshots.net_investment)) * 100
        ELSE latest_snapshots.roi
    END
)
```

**Giải thích:**

- Tính trung bình ROI 24h của tất cả users

---

### 2.5. Total PnL 7d & Average ROI 7d

Tương tự như 24h metrics, nhưng tính cho 7 ngày

---

### 2.6. Bot Max Drawdown

```sql
max_drawdown = MIN(ss.total_equity - ss.net_investment)
```

**Giải thích:**

- Tìm drawdown tệ nhất trong tất cả users và tất cả thời điểm
- Cho biết bot từng gây ra khoản lỗ lớn nhất là bao nhiêu

---

### 2.7. Active Subscribers (Số người đang subscribe)

```sql
active_subscribers = COUNT(DISTINCT latest_snapshots.bot_subscription_id)
```

**Giải thích:**

- Đếm số subscription đang active cho bot này

---

### 2.8. Total Net Investment (Tổng vốn đầu tư)

```sql
total_net_investment = SUM(latest_snapshots.net_investment)
```

**Giải thích:**

- Tổng vốn của tất cả users đang đầu tư vào bot

---

### 2.9. Total Equity (Tổng tài sản)

```sql
total_equity = SUM(latest_snapshots.total_equity)
```

**Giải thích:**

- Tổng tài sản hiện tại của tất cả users (USDT + Coin value)

---

## 3. Performance Optimization

### 3.1. CTE (Common Table Expressions)

Sử dụng CTEs để:

- Tách logic thành các bước rõ ràng
- Tránh subquery lồng nhau phức tạp
- Tái sử dụng kết quả trung gian

### 3.2. Index Optimization

Đảm bảo các index sau tồn tại:

```sql
CREATE INDEX idx_sub_snapshot_time
ON subscription_snapshot(bot_subscription_id, recorded_at);

CREATE INDEX idx_bot_subscriptions_bot_active
ON bot_subscriptions(bot_id, is_active);
```

### 3.3. Query Execution Plan

- `latest_snapshots`: Lấy snapshot mới nhất của mỗi subscription
- `snapshots_24h`: Lấy snapshot gần nhất với thời điểm 24h trước
- `snapshots_7d`: Lấy snapshot gần nhất với thời điểm 7d trước
- `drawdown_calc`: Tính max drawdown từ toàn bộ lịch sử

---

## 4. Usage Examples

### 4.1. Get Subscription Metrics

```java
PnLCalculationService service;
UUID subscriptionId = ...;

SubscriptionMetrics metrics = service.calculateSubscriptionMetrics(subscriptionId);

System.out.println("Current PnL: " + metrics.getCurrentPnl());
System.out.println("Current ROI: " + metrics.getCurrentRoi() + "%");
System.out.println("24h PnL: " + metrics.getPnl24h());
System.out.println("7d PnL: " + metrics.getPnl7d());
System.out.println("Max Drawdown: " + metrics.getMaxDrawdown());
```

### 4.2. Get Bot Aggregate Metrics

```java
PnLCalculationService service;
UUID botId = ...;

BotAggregateMetrics metrics = service.calculateBotAggregateMetrics(botId);

System.out.println("Total PnL: " + metrics.getTotalCurrentPnl());
System.out.println("Average ROI: " + metrics.getAverageRoi() + "%");
System.out.println("Active Subscribers: " + metrics.getActiveSubscribers());
System.out.println("Total Investment: " + metrics.getTotalNetInvestment());
```

---

## 5. Edge Cases Handling

### 5.1. Không có snapshot 24h/7d trước

→ Sử dụng current metrics làm fallback

### 5.2. Net Investment = 0

→ ROI = 0% (tránh chia cho 0)

### 5.3. Không có active subscription

→ Trả về metrics với giá trị 0

### 5.4. Subscription mới tạo (< 24h)

→ PnL 24h = Current PnL, ROI 24h = Current ROI

---

## 6. Notes

- Tất cả PnL tính bằng USDT
- ROI tính bằng % (đã nhân 100)
- Max Drawdown là giá trị âm (negative = lỗ)
- Snapshot được tạo mỗi 10 phút
- Metrics được cache trong database (không cần tính lại mỗi lần query)
