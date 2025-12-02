# Postman Testing Guide - Modular Metrics API

## 🚀 Quick Start

### Base URL

```
http://localhost:8080
```

---

## 📋 Test Requests

### 1. Get Bots with Pagination (Default)

**Request:**

```
GET /metrics/bots
```

**Parameters:** None (uses defaults)

**Expected Defaults:**

- timeframe = current (all-time)
- sortBy = pnl
- page = 0
- size = 10

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "meta": {
      "page": 1,
      "pageSize": 10,
      "pages": 3,
      "total": 25
    },
    "result": [...]
  },
  "message": "Bots metrics fetched successfully"
}
```

---

### 2. Get Bots - 24h PnL, Sorted by PnL

**Request:**

```
GET /metrics/bots?timeframe=1d&sortBy=pnl&page=0&size=10
```

**Use Case:** Xem top bots có profit cao nhất trong 24h qua

**Expected:** List bots sorted by totalPnl descending (highest first)

---

### 3. Get Bots - 7 Days ROI, Sorted by ROI

**Request:**

```
GET /metrics/bots?timeframe=7d&sortBy=roi&page=0&size=20
```

**Use Case:** Xem bots có ROI % tốt nhất trong 7 ngày

**Expected:** List bots sorted by averageRoi descending

---

### 4. Get Bots - Most Copied (Popular)

**Request:**

```
GET /metrics/bots?timeframe=current&sortBy=copied&page=0&size=10
```

**Use Case:** Xem bots được copy nhiều nhất (số subscribers cao nhất)

**Expected:** List bots sorted by activeSubscribers descending

---

### 5. Search Bots by Name

**Request:**

```
GET /metrics/bots?search=BTC&page=0&size=10
```

**Use Case:** Tìm tất cả bots có "BTC" trong tên

**Expected:** Filtered list, case-insensitive search

**Try with:**

- `search=BTC`
- `search=eth`
- `search=scalper`

---

### 6. Search + Sort + Timeframe Combined

**Request:**

```
GET /metrics/bots?timeframe=1d&sortBy=roi&search=BTC&page=0&size=10
```

**Use Case:** Tìm BTC bots, xem ROI 24h, sort by ROI

**Expected:** Filtered + sorted results

---

### 7. Test Pagination - Page 2

**Request:**

```
GET /metrics/bots?page=1&size=10
```

**Note:** Page is 0-indexed, so page=1 là page thứ 2

**Expected:**

- meta.page = 2
- Results start from item 11

---

### 8. Test Large Page Size

**Request:**

```
GET /metrics/bots?page=0&size=50
```

**Expected:** Up to 50 items per page

---

### 9. Get Single Bot Metrics - Current (All-time)

**Request:**

```
GET /metrics/bots/{botId}?timeframe=current
```

**Replace {botId}** with actual UUID from previous response

**Use Case:** Xem overall performance của 1 bot cụ thể

**Expected:** Single bot object with all metrics

---

### 10. Get Single Bot Metrics - 24h

**Request:**

```
GET /metrics/bots/{botId}?timeframe=1d
```

**Use Case:** Xem bot đã perform như thế nào trong 24h qua

**Expected:** totalPnl và averageRoi là delta trong 24h

---

### 11. Get Single Bot Metrics - 7 Days

**Request:**

```
GET /metrics/bots/{botId}?timeframe=7d
```

**Use Case:** Weekly performance review

---

### 12. Get Subscription Metrics - Current

**Request:**

```
GET /metrics/subscriptions/{subscriptionId}?timeframe=current
```

**Replace {subscriptionId}** with actual UUID

**Use Case:** Xem tổng profit/loss của user subscription từ đầu đến giờ

**Expected:**

```json
{
  "subscriptionId": "...",
  "userId": "...",
  "botId": "...",
  "netInvestment": 1000.0,
  "totalEquity": 1150.0,
  "pnl": 150.0,
  "roi": 15.0,
  "maxDrawdown": -50.0,
  "maxDrawdownPercent": -5.0
}
```

---

### 13. Get Subscription Metrics - 24h

**Request:**

```
GET /metrics/subscriptions/{subscriptionId}?timeframe=1d
```

**Use Case:** Xem subscription đã profit/loss bao nhiêu trong ngày hôm nay

**Expected:** pnl là change trong 24h (có thể âm hoặc dương)

---

### 14. Test Invalid Timeframe

**Request:**

```
GET /metrics/bots?timeframe=invalid
```

**Expected:**

- 400 Bad Request hoặc
- 500 Internal Server Error với message "Invalid timeframe: invalid"

---

### 15. Test Invalid Sort By

**Request:**

```
GET /metrics/bots?sortBy=invalid
```

**Expected:** No sorting applied (default order from database)

---

### 16. Test Empty Search Result

**Request:**

```
GET /metrics/bots?search=NONEXISTENTBOT12345
```

**Expected:**

```json
{
  "statusCode": 200,
  "data": {
    "meta": {
      "page": 1,
      "pageSize": 10,
      "pages": 0,
      "total": 0
    },
    "result": []
  },
  "message": "Bots metrics fetched successfully"
}
```

---

### 17. Test Page Out of Range

**Request:**

```
GET /metrics/bots?page=999&size=10
```

**Expected:** Empty result array (not error)

---

## 🧪 Postman Collection JSON

Import this into Postman:

```json
{
  "info": {
    "name": "Modular Bot Metrics API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080"
    },
    {
      "key": "bot_id",
      "value": ""
    },
    {
      "key": "subscription_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "1. Get Bots - Default",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"]
        }
      }
    },
    {
      "name": "2. Get Bots - 24h PnL",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?timeframe=1d&sortBy=pnl&page=0&size=10",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [
            { "key": "timeframe", "value": "1d" },
            { "key": "sortBy", "value": "pnl" },
            { "key": "page", "value": "0" },
            { "key": "size", "value": "10" }
          ]
        }
      }
    },
    {
      "name": "3. Get Bots - 7d ROI",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?timeframe=7d&sortBy=roi&page=0&size=20",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [
            { "key": "timeframe", "value": "7d" },
            { "key": "sortBy", "value": "roi" },
            { "key": "page", "value": "0" },
            { "key": "size", "value": "20" }
          ]
        }
      }
    },
    {
      "name": "4. Get Bots - Most Copied",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?sortBy=copied",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [{ "key": "sortBy", "value": "copied" }]
        }
      }
    },
    {
      "name": "5. Search Bots - BTC",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?search=BTC",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [{ "key": "search", "value": "BTC" }]
        }
      }
    },
    {
      "name": "6. Search + Sort + Timeframe",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?timeframe=1d&sortBy=roi&search=BTC",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [
            { "key": "timeframe", "value": "1d" },
            { "key": "sortBy", "value": "roi" },
            { "key": "search", "value": "BTC" }
          ]
        }
      }
    },
    {
      "name": "7. Pagination - Page 2",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots?page=1&size=10",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots"],
          "query": [
            { "key": "page", "value": "1" },
            { "key": "size", "value": "10" }
          ]
        }
      }
    },
    {
      "name": "8. Get Single Bot - Current",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots/{{bot_id}}?timeframe=current",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots", "{{bot_id}}"],
          "query": [{ "key": "timeframe", "value": "current" }]
        }
      }
    },
    {
      "name": "9. Get Single Bot - 24h",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/bots/{{bot_id}}?timeframe=1d",
          "host": ["{{base_url}}"],
          "path": ["metrics", "bots", "{{bot_id}}"],
          "query": [{ "key": "timeframe", "value": "1d" }]
        }
      }
    },
    {
      "name": "10. Get Subscription - Current",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/subscriptions/{{subscription_id}}?timeframe=current",
          "host": ["{{base_url}}"],
          "path": ["metrics", "subscriptions", "{{subscription_id}}"],
          "query": [{ "key": "timeframe", "value": "current" }]
        }
      }
    },
    {
      "name": "11. Get Subscription - 24h",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/metrics/subscriptions/{{subscription_id}}?timeframe=1d",
          "host": ["{{base_url}}"],
          "path": ["metrics", "subscriptions", "{{subscription_id}}"],
          "query": [{ "key": "timeframe", "value": "1d" }]
        }
      }
    }
  ]
}
```

---

## ✅ Testing Workflow

### Step 1: Setup Environment

1. Start Spring Boot server on port 8080
2. Ensure database has bot and subscription data
3. Set environment variables in Postman:
   - `base_url = http://localhost:8080`
   - `bot_id = <copy from response>`
   - `subscription_id = <copy from response>`

### Step 2: Test Basic Endpoints

1. ✅ Request #1: Get Bots - Default
2. ✅ Copy a `botId` from response
3. ✅ Set `bot_id` environment variable
4. ✅ Request #8: Get Single Bot - Current
5. ✅ Verify response has botId, name, metrics

### Step 3: Test Pagination

1. ✅ Request #1: Note total count
2. ✅ Request #7: Get page 2
3. ✅ Verify `meta.page = 2`
4. ✅ Verify different bots than page 1

### Step 4: Test Sorting

1. ✅ Request #2: Sort by PnL
2. ✅ Verify `result[0].totalPnl > result[1].totalPnl`
3. ✅ Request #3: Sort by ROI
4. ✅ Verify `result[0].averageRoi > result[1].averageRoi`
5. ✅ Request #4: Sort by Copied
6. ✅ Verify `result[0].activeSubscribers > result[1].activeSubscribers`

### Step 5: Test Search

1. ✅ Request #5: Search "BTC"
2. ✅ Verify all results contain "BTC" in name
3. ✅ Request #16: Search non-existent
4. ✅ Verify empty result array

### Step 6: Test Timeframes

1. ✅ Request #8: Get bot (current)
2. ✅ Note `totalPnl` value (all-time)
3. ✅ Request #9: Get bot (1d)
4. ✅ Note `totalPnl` value (24h)
5. ✅ Verify: current PnL >= 1d PnL (usually)

### Step 7: Test Subscription

1. ✅ Get subscriptionId from database or API
2. ✅ Set `subscription_id` env variable
3. ✅ Request #10: Get subscription (current)
4. ✅ Verify: pnl = totalEquity - netInvestment (approx)
5. ✅ Verify: roi = (pnl / netInvestment) \* 100 (approx)

### Step 8: Test Edge Cases

1. ✅ Request #14: Invalid timeframe → Error
2. ✅ Request #15: Invalid sortBy → No sorting
3. ✅ Request #16: Empty search → Empty array
4. ✅ Request #17: Page out of range → Empty array

---

## 📊 Expected Results Summary

| Test              | Expected Status | Expected Behavior                      |
| ----------------- | --------------- | -------------------------------------- |
| Default request   | 200 OK          | Returns page 1, size 10, sorted by PnL |
| Timeframe filter  | 200 OK          | Metrics calculated for that period     |
| Sort by PnL       | 200 OK          | Highest PnL first                      |
| Sort by ROI       | 200 OK          | Highest ROI first                      |
| Sort by Copied    | 200 OK          | Most subscribers first                 |
| Search by name    | 200 OK          | Filtered results (case-insensitive)    |
| Pagination        | 200 OK          | Different items per page               |
| Single bot        | 200 OK          | One bot object                         |
| Subscription      | 200 OK          | Subscription metrics                   |
| Invalid timeframe | 400/500         | Error message                          |
| Invalid sort      | 200 OK          | No sorting applied                     |
| Empty search      | 200 OK          | Empty array                            |
| Out of range page | 200 OK          | Empty array                            |

---

## 🔧 Troubleshooting

### Problem: No bots returned

**Solution:**

```sql
-- Check if bots exist
SELECT * FROM bots LIMIT 5;

-- Check if subscriptions exist
SELECT * FROM bot_subscriptions WHERE is_active = true LIMIT 5;

-- Check if snapshots exist
SELECT * FROM subscription_snapshot LIMIT 5;
```

### Problem: All metrics are 0

**Solution:**

- Wait for snapshot service to run (10 minutes)
- Or manually insert test snapshots
- Check if subscription has netInvestment > 0

### Problem: Search returns nothing

**Solution:**

- Search is case-insensitive
- Check actual bot names in database: `SELECT name FROM bots;`
- Try partial search: `search=BT` instead of `search=BTC`

### Problem: Sorting doesn't work

**Solution:**

- Verify bots have different metric values
- Check logs for service layer errors
- Ensure sortBy parameter is one of: pnl, roi, copied

---

## 🚀 Quick cURL Commands

```bash
# Default
curl -X GET "http://localhost:8080/metrics/bots"

# With all params
curl -X GET "http://localhost:8080/metrics/bots?timeframe=1d&sortBy=roi&search=BTC&page=0&size=10"

# Single bot
curl -X GET "http://localhost:8080/metrics/bots/{botId}?timeframe=current"

# Subscription
curl -X GET "http://localhost:8080/metrics/subscriptions/{subId}?timeframe=1d"
```
